// frontend/src/components/CodeViewerModal.jsx
import React from 'react';

function CodeViewerModal({ code, onClose }) {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      alert('Code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="code-viewer-modal show">
      <div className="code-viewer-window">
        <div className="code-viewer-header">
          <div className="code-viewer-title">Code Viewer</div>
          <div className="code-viewer-actions">
            <button className="code-action-button" onClick={handleCopyCode}>📋 Copy</button>
            <button className="code-action-button" onClick={handleDownloadCode}>💾 Download</button>
            <button className="code-action-button" onClick={onClose}>✕ Close</button>
          </div>
        </div>
        <div className="code-viewer-content">
          <pre><code>{code}</code></pre>
        </div>
      </div>
    </div>
  );
}

export default CodeViewerModal;