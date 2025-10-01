import React from 'react';

export default function SummaryButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
    >
      Summarize
    </button>
  );
}
