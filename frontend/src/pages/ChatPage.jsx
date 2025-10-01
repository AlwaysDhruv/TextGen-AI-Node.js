// frontend/src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const currentController = useRef(null);
  const currentStreamId = useRef(null);

  const navigate = useNavigate();

  // ✅ Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // ✅ Load previous conversation
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

  // ✅ Auto-scroll
  useEffect(() => {
    const el = messagesEndRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      const container = el.closest('.chat-messages');
      if (container) {
        try {
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        } catch {
          el.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }
    });
  }, [messages]);

  // --- Send message with streaming ---
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    if (!apiKey) {
      setErrorMessage('Please enter a valid API key.');
      return;
    }

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage, { role: 'ai', text: '' }]);
    setInput('');
    setErrorMessage('');
    setIsThinking(true);

    const controller = new AbortController();
    currentController.current = controller;
    const streamId = Date.now().toString();
    currentStreamId.current = streamId;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ secured with JWT
        },
        body: JSON.stringify({ message: userMessage.text, streamId }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'API request failed.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const json = JSON.parse(line.substring(6));
              const textChunk = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (textChunk) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].text += textChunk;
                  return updated;
                });
              }
            } catch (e) {
              console.warn('Malformed SSE JSON', e);
            }
          }
          if (line.startsWith('event: end')) {
            setIsThinking(false);
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setMessages((prev) => [...prev, { role: 'system', text: '🛑 Generation stopped.' }]);
      } else {
        setErrorMessage(`Error: ${error.message}`);
        setMessages((prev) => [...prev, { role: 'system', text: `❌ ${error.message}` }]);
      }
      setIsThinking(false);
    } finally {
      currentController.current = null;
      currentStreamId.current = null;
    }
  };

  // --- Stop generation ---
  const handleStopGeneration = async () => {
    if (currentController.current) currentController.current.abort();
    if (currentStreamId.current) {
      try {
        await fetch(`http://localhost:5000/api/stop/${currentStreamId.current}`, {
          method: 'POST',
        });
      } catch (err) {
        console.error('Failed to stop stream:', err);
      }
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
