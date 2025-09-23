// frontend/src/components/ChatInput.jsx
import React from 'react';

function ChatInput({ input, setInput, onSendMessage, isThinking, onStopGeneration }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          rows={1}
        />

        {!isThinking && (
          <button
            className="send-button"
            onClick={onSendMessage}
            disabled={!input.trim()}
          >
            ➤
          </button>
        )}

        {isThinking && (
          <button
            className="stop-button"
            onClick={onStopGeneration}
          >
            ✖
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatInput;
