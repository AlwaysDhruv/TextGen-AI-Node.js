// frontend/src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ChatPage.css';
import ChatHeader from '../components/ChatHeader';
import ChatMessages from '../components/ChatMessages';
import ChatInput from '../components/ChatInput';
import CodeViewerModal from '../components/CodeViewerModal';

function ChatPage() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('geminiApiKey') || '');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [codeViewerContent, setCodeViewerContent] = useState('');

  const messagesEndRef = useRef(null);
  let currentController = useRef(null);
  let typingIntervalRef = useRef(null); // track printing interval

  useEffect(() => {
    const storedConversation = localStorage.getItem('conversationHistory');
    if (storedConversation) {
      setMessages(JSON.parse(storedConversation));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('conversationHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    if (!apiKey) {
      setErrorMessage('Please enter a valid API key.');
      return;
    }

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setErrorMessage('');

    setIsThinking(true);
    const controller = new AbortController();
    currentController.current = controller;

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ message: input }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'API request failed.');
      }

      const data = await res.json();
      const fullReply = data.reply;

      // Add placeholder AI message
      setMessages((prev) => [...prev, { role: 'ai', text: '' }]);

      // Animate char by char
      let i = 0;
      typingIntervalRef.current = setInterval(() => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullReply.slice(0, i + 1);
          return updated;
        });
        i++;
        if (i >= fullReply.length) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          setIsThinking(false);
        }
      }, 10); // faster speed
    } catch (error) {
      if (error.name === 'AbortError') {
        setMessages((prev) => [...prev, { role: 'system', text: 'Generation stopped.' }]);
      } else {
        setErrorMessage(`Error: ${error.message}`);
        setMessages((prev) => [...prev, { role: 'system', text: `Error: ${error.message}` }]);
      }
      setIsThinking(false);
    } finally {
      currentController.current = null;
      scrollToBottom();
    }
  };

  const handleStopGeneration = () => {
    // Stop API call
    if (currentController.current) currentController.current.abort();

    // Stop printing
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    setIsThinking(false);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the entire chat?')) {
      setMessages([]);
      localStorage.removeItem('conversationHistory');
    }
  };

  const handleOpenCodeViewer = (code) => setCodeViewerContent(code);
  const handleCloseCodeViewer = () => setCodeViewerContent('');

  return (
    <div className="chat-page-body">
      <ChatHeader apiKey={apiKey} setApiKey={setApiKey} onClearChat={handleClearChat} />

      <div className="chat-container">
        {/* Chat messages (also handles greeting when empty) */}
        <ChatMessages
          messages={messages}
          onOpenCodeViewer={handleOpenCodeViewer}
          messagesEndRef={messagesEndRef}
        />

        {/* Thinking indicator */}
        {isThinking && (
          <div className="message ai">
            <div className="message-avatar ai-avatar">T</div>
            <div className="message-content">
              <div className="thinking-animation">
                <div className="thinking-dot"></div>
                <div className="thinking-dot"></div>
                <div className="thinking-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />

        {/* Input fixed at bottom */}
        <div className="chat-input-wrapper-fixed">
          <ChatInput
            input={input}
            setInput={setInput}
            onSendMessage={handleSendMessage}
            isThinking={isThinking}
            onStopGeneration={handleStopGeneration}
          />
        </div>
      </div>

      {codeViewerContent && (
        <CodeViewerModal code={codeViewerContent} onClose={handleCloseCodeViewer} />
      )}
    </div>
  );
}

export default ChatPage;
