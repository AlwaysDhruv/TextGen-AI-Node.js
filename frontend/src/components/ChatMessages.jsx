// frontend/src/components/ChatMessages.jsx
import React, { useEffect, useState } from 'react';

function ChatMessages({ messages, onOpenCodeViewer, messagesEndRef, isThinking }) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning! ☀️ Ready to chat?');
    else if (hour < 18) setGreeting('Good afternoon! 🌤️ Ready to chat?');
    else setGreeting('Good evening! 🌙 Ready to chat?');
  }, []);

  const parseMarkdown = (text) => {
    if (!text) return null;
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^**]+\*|```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const m = part.match(/```(.*?)\n([\s\S]*?)```/);
        const lang = m ? m[1] : '';
        const code = m ? m[2] : part;
        return (
          <pre
            key={index}
            className={`language-${lang}`}
            onClick={() => onOpenCodeViewer(code)}
          >
            <code>{code}</code>
          </pre>
        );
      } else if (part.startsWith('**')) {
        return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
      } else if (part.startsWith('*')) {
        return <em key={index}>{part.substring(1, part.length - 1)}</em>;
      } else if (part.startsWith('`')) {
        return <code key={index}>{part.substring(1, part.length - 1)}</code>;
      }
      return (
        <span key={index}>
          {part.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </span>
      );
    });
  };

  const formatTime = (timestamp) => {
    const d = timestamp ? new Date(timestamp) : new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-messages">
      {messages.length === 0 && (
        <div className="welcome-message-container">
          <div className="welcome-title">{greeting}</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Get your free API key from{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              className="api-link"
              rel="noreferrer"
            >
              Google AI Studio
            </a>
          </p>
          <div className="welcome-features">
            <div className="feature-card">
              <div className="feature-title">💡 Smart Conversations</div>
              <div className="feature-description">
                Powered by Gemini 1.5 Flash for fast, intelligent responses
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-title">🎨 Beautiful Interface</div>
              <div className="feature-description">
                Modern design with smooth animations and glassmorphism effects
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-title">⚡ Real-time Streaming</div>
              <div className="feature-description">
                Watch responses appear in real-time as they're generated
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-title">🔒 Secure & Private</div>
              <div className="feature-description">
                Your API key is stored locally and never shared
              </div>
            </div>
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <div key={index} className={`message ${message.role}`}>
          <div
            className={`message-avatar ${
              message.role === 'user' ? 'user-avatar' : 'ai-avatar'
            }`}
          >
            {message.role === 'user' ? 'You' : 'T'}
          </div>

          <div className="message-content-wrapper">
            <div className="message-content">
              {message.role === 'ai' && index === messages.length - 1 ? (
                <>
                  {isThinking && message.text === '' ? (
                    <div className="thinking-animation">
                      <div className="thinking-dot"></div>
                      <div className="thinking-dot"></div>
                      <div className="thinking-dot"></div>
                    </div>
                  ) : (
                    parseMarkdown(message.text)
                  )}
                </>
              ) : (
                parseMarkdown(message.text)
              )}
            </div>

            {/* Timestamp */}
            <div className="message-time">{formatTime(message.timestamp)}</div>

            {/* Copy buttons */}
            {message.role === 'ai' && (
              <button
                className="copy-button ai-copy"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(message.text).then(() => {
                    e.target.textContent = '✅';
                    setTimeout(() => (e.target.textContent = '📋'), 1500);
                  });
                }}
              >
                📋
              </button>
            )}

            {message.role === 'user' && (
              <button
                className="copy-button user-copy"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(message.text).then(() => {
                    e.target.textContent = '✅';
                    setTimeout(() => (e.target.textContent = '📋'), 1500);
                  });
                }}
              >
                📋
              </button>
            )}
          </div>
        </div>
      ))}

      {/* bottom target inside scrollable container */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;
