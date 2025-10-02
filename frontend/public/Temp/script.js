class EnhancedGeminiChat {
  constructor() {
    this.history = [];
    this.isGenerating = false;
    this.abortController = null;
    this.isStopped = false;
    this.apiKey = null;
    this.maxMessages = 5;
    this.messageCount = 0;

    this.initializeElements();
    this.attachEventListeners();
    this.setupInitialGreeting();
    this.createBackgroundParticles();
    this.getApiKey();
  }

async getApiKey() {
  // First, check localStorage
  let storedApiKey = localStorage.getItem('geminiApiKey');
  if (storedApiKey) {
    this.apiKey = storedApiKey;
    this.chatInput.disabled = false;
    this.updateSendButtonState();
    return;
  }

  // Otherwise fetch from backend (.env)
  try {
    const response = await fetch('http://localhost:5000/api/get-api-key');
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    if (data.apiKey) {
      this.apiKey = data.apiKey;
      localStorage.setItem('geminiApiKey', this.apiKey); // Cache for next time
      this.chatInput.disabled = false;
      this.updateSendButtonState();
      console.log("API key loaded successfully from server.");
    } else {
      throw new Error('API key missing in server response');
    }
  } catch (err) {
    console.error('Failed to fetch API key:', err);
    this.showError("⚠️ Could not fetch API configuration from the server.");
  }
}

  initializeElements() {
    this.chatMessages = document.getElementById("chatMessages");
    this.chatInput = document.getElementById("chatInput");
    this.sendButton = document.getElementById("sendButton");
    this.stopButton = document.getElementById("stopButton");
    this.errorMessage = document.getElementById("errorMessage");
    this.trialCounter = document.getElementById("trialCounter");
    this.welcomeContainer = document.querySelector(".welcome-message-container");
  }

  attachEventListeners() {
    this.sendButton.addEventListener("click", () => this.sendMessage());
    this.stopButton.addEventListener("click", () => this.stopGeneration());

    this.chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.chatInput.addEventListener("input", () => {
      this.autoResizeTextarea();
      this.updateSendButtonState();
    });
  }

  createBackgroundParticles() {
    const container = document.getElementById("backgroundParticles");
    if (!container) return;
    for (let i = 0; i < 50; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDelay = Math.random() * 20 + "s";
      p.style.animationDuration = 15 + Math.random() * 10 + "s";
      container.appendChild(p);
    }
  }

  setupInitialGreeting() {
    const hour = new Date().getHours();
    const greeting =
      hour < 12 ? "Good morning! ☀️" : hour < 18 ? "Good afternoon! 🌤️" : "Good evening! 🌙";
    const welcomeTitle = document.querySelector(".welcome-title");
    if (welcomeTitle) {
      welcomeTitle.textContent = `${greeting} You have 5 free messages.`;
    }
  }

  async sendMessage() {
    if (this.messageCount >= this.maxMessages) {
      this.showError("⚠️ Trial limit reached! Please log in for unlimited chat.");
      return;
    }

    const prompt = this.chatInput.value.trim();
    if (!prompt || this.isGenerating || !this.apiKey) return;

    this.addMessage("user", prompt);
    this.chatInput.value = "";
    this.autoResizeTextarea();
    this.setGeneratingState(true);

    const aiMessageContainer = this.createMessageElement("ai", "");
    const thinking = this.createThinkingAnimation();
    aiMessageContainer.querySelector(".message-content").appendChild(thinking);
    this.chatMessages.appendChild(aiMessageContainer);
    this.scrollToBottom();

    const contentDiv = aiMessageContainer.querySelector(".message-content");

    try {
      this.abortController = new AbortController();
      const signal = this.abortController.signal;
      const model = "gemini-2.5-flash";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${this.apiKey}&alt=sse`;

      this.history.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: this.history };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      thinking.remove();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      let buffer = "";

      while (true) {
        if (this.isStopped) break;
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const json = JSON.parse(line.substring(6));
              const textChunk = json.candidates[0]?.content?.parts[0]?.text || "";
              if (textChunk) {
                fullResponse += textChunk;
                contentDiv.innerHTML = this.formatMessageContent(fullResponse);
                this.scrollToBottom();
              }
            } catch {}
          }
        }
      }

      this.history.push({ role: "model", parts: [{ text: fullResponse }] });
      this.messageCount++; // ✅ count messages
      this.updateTrialCounter();
    } catch (err) {
      thinking.remove();
      contentDiv.innerHTML = this.formatMessageContent("❌ Error generating response.");
    } finally {
      this.setGeneratingState(false);
    }
  }

  stopGeneration() {
    if (this.abortController) {
      this.isStopped = true;
      this.abortController.abort();
    }
  }

  addMessage(sender, content) {
    const msg = this.createMessageElement(sender, content);
    this.chatMessages.appendChild(msg);
    this.scrollToBottom();
  }

  createMessageElement(sender, content) {
    const div = document.createElement("div");
    div.className = `message ${sender} message-enter`;
    const avatar = document.createElement("div");
    avatar.className = `message-avatar ${sender}-avatar`;
    avatar.textContent = sender === "user" ? "U" : "T";
    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.innerHTML = this.formatMessageContent(content);
    div.appendChild(avatar);
    div.appendChild(contentDiv);
    return div;
  }

  createThinkingAnimation() {
    const div = document.createElement("div");
    div.className = "thinking-animation";
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div");
      dot.className = "thinking-dot";
      div.appendChild(dot);
    }
    return div;
  }

  formatMessageContent(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br>");
  }

  setGeneratingState(isGenerating) {
    this.isGenerating = isGenerating;
    this.chatInput.disabled = isGenerating;
    this.sendButton.style.display = isGenerating ? "none" : "flex";
    this.stopButton.style.display = isGenerating ? "flex" : "none";
    this.updateSendButtonState();
  }

  updateSendButtonState() {
    const hasMessage = this.chatInput.value.trim().length > 0;
    this.sendButton.disabled = !hasMessage || this.isGenerating;
  }

  autoResizeTextarea() {
    this.chatInput.style.height = "auto";
    this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + "px";
  }

  showError(msg) {
    this.errorMessage.innerHTML = msg;
    this.errorMessage.style.display = "block";
  }

  hideError() {
    this.errorMessage.style.display = "none";
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    });
  }

  updateTrialCounter() {
    if (this.trialCounter) {
      this.trialCounter.textContent = `Messages used: ${this.messageCount} / ${this.maxMessages}`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.geminiChat = new EnhancedGeminiChat();
});
