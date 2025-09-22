// frontend/src/components/ChatHeader.jsx
import React from 'react';

function ChatHeader({ apiKey, setApiKey, onClearChat }) {
  const isApiKeyConnected = !!apiKey;

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (Array.isArray(imported)) {
            localStorage.setItem('conversationHistory', JSON.stringify(imported));
            window.location.reload(); // reload to apply
          } else {
            alert('❌ Invalid chat file format');
          }
        } catch (err) {
          alert('❌ Error importing chat: ' + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExport = () => {
    const history = localStorage.getItem('conversationHistory') || '[]';
    const blob = new Blob([history], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="chat-header">
      <div className="chat-title">
        <div className="ai-icon">T</div>
        TextGen-AI Chat
      </div>
      <div className="header-controls">
        <button className="control-button tooltip" data-tooltip="Import Chat" onClick={handleImport}>
          📤 Import
        </button>
        <button className="control-button tooltip" data-tooltip="Export Chat" onClick={handleExport}>
          📥 Export
        </button>
        <button className="control-button tooltip" data-tooltip="Clear Chat" onClick={onClearChat}>
          🗑️ Clear
        </button>
      </div>
      <div className="api-key-container">
        <input
          type="password"
          id="apiKeyInput"
          placeholder="Enter Your Google AI API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <div className={`api-status ${isApiKeyConnected ? 'connected' : ''}`} id="apiStatus" title="API Key Status"></div>
      </div>
    </header>
  );
}

export default ChatHeader;
