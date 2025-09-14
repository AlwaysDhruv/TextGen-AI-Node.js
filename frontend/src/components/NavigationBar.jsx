import React from 'react';

function NavigationBar() {
  return (
    <nav className="flex justify-between items-center p-6 bg-black/60 backdrop-blur-md z-10 border-b border-gray-800">
      <div>
        <a href="/" className="text-white hover:text-blue-400 font-bold text-xl tracking-wide flex items-center gap-2 transition">
          <i className="fas fa-code text-blue-500"></i> Developers
        </a>
      </div>
      <div className="space-x-4">
        <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">Sign Up</a>
        <a href="/login" className="text-white hover:text-blue-400 underline px-3 py-2 transition">Sign In</a>
      </div>
    </nav>
  );
}

export default NavigationBar;