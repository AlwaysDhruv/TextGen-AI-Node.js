import React from 'react';

function HeroSection() {
  return (
    <div className="hero">
      <h1 className="hero__title">Welcome to TextGen AI</h1>
      <p className="hero__subtitle">Generate intelligent and creative text using the power of GPT models.</p>
      <div className="hero__buttons">
        <a href="/signup" className="btn btn--primary">Get Started</a>
        <a href="/try-it" className="btn btn--secondary">Try It</a>
      </div>
    </div>
  );
}

export default HeroSection;