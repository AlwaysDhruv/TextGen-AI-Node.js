import React from 'react';

function NavigationBar() {
  return (
    <nav className="nav">
      <a href="/" className="nav__brand">
        <i className="fas fa-code"></i> Developers
      </a>
      <div className="nav__links">
        <a href="/signup" className="nav__link--primary">Sign Up</a>
        <a href="/login" className="nav__link--secondary">Sign In</a>
      </div>
    </nav>
  );
}

export default NavigationBar;