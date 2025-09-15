import React from 'react';
import { Link } from 'react-router-dom';

function NavigationBar() {
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="flex justify-between items-center p-6 bg-black/60 backdrop-blur-md z-10 border-b border-gray-800">
      <div>
        <Link to="/" className="text-white hover:text-blue-400 font-bold text-xl tracking-wide flex items-center gap-2 transition">
          <i className="fas fa-code text-blue-500"></i> Developers
        </Link>
      </div>
      <div className="space-x-4">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
            Sign Out
          </button>
        ) : (
          <>
            {/* Pass state to show the SignUpForm */}
            <Link to="/auth" state={{ isLoginView: false }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">Sign Up</Link>
            {/* Pass state to show the LoginForm */}
            <Link to="/auth" state={{ isLoginView: true }} className="text-white hover:text-blue-400 underline px-3 py-2 transition">Sign In</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavigationBar;