// frontend/src/components/ChatInput.jsx
import React from 'react';

function ChatInput({ input, setInput, onSendMessage, isThinking, onStopGeneration }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isThinking) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          className="chat-input"
          id="chatInput"
          placeholder="Ask me anything..."
          rows="1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isThinking}
        ></textarea>
        {isThinking ? (
            <button
              className="stop-button tooltip"
              id="stopButton"
              data-tooltip="Stop Generation (Esc)"
              onClick={onStopGeneration}
              style={{ display: 'flex' }} // ensure visible
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 6h12v12H6z"/>
                </svg>
            </button>
        ) : (
            <button
              className="send-button tooltip"
              id="sendButton"
              data-tooltip="Send Message (Ctrl+Enter)"
              onClick={onSendMessage}
              disabled={!input.trim()}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
                </svg>
            </button>
        )}
      </div>
    </div>
  );
}

export default ChatInput;
