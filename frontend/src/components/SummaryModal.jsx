import React from 'react';

export default function SummaryModal({ open, onClose, summary, tags }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full">
        <h2 className="text-lg font-semibold mb-3">Conversation Summary</h2>
        <div className="text-sm leading-relaxed whitespace-pre-wrap border p-3 rounded-md bg-gray-50">
          {summary || 'No summary available.'}
        </div>
        <div className="mt-4 text-sm">
          <strong>Tags:</strong>{' '}
          {tags && tags.length > 0 ? tags.join(', ') : '—'}
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
