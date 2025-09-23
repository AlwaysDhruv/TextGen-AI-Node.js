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
  let typingIntervalRef = useRef(null);

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

  // Auto-scroll to bottom whenever messages change (robust)
  useEffect(() => {
    const el = messagesEndRef.current;
    if (!el) return;

    // allow DOM to update first
    requestAnimationFrame(() => {
      const container = el.closest('.chat-messages');
      if (container) {
        // scroll the messages container (preferred)
        try {
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        } catch (err) {
          // fallback
          el.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      } else {
        // fallback if ref isn't inside .chat-messages
        el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    if (!apiKey) {
      setErrorMessage('Please enter a valid API key.');
      return;
    }

    const userMessage = { role: 'user', text: input };
    // create user message + placeholder AI message immediately
    setMessages((prev) => [...prev, userMessage, { role: 'ai', text: '' }]);
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
}, 5);
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
    }
  };

  const handleStopGeneration = () => {
    if (currentController.current) currentController.current.abort();
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
        <ChatMessages
          messages={messages}
          onOpenCodeViewer={handleOpenCodeViewer}
          messagesEndRef={messagesEndRef}
          isThinking={isThinking}
        />

        {/* NOTE: removed duplicate <div ref={messagesEndRef} /> from parent.
            The bottom ref is rendered inside ChatMessages (so scrolling targets the .chat-messages container). */}

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
