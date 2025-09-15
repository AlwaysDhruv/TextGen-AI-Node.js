import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div className="py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to TextGen AI</h1>
      <p className="text-lg text-gray-300 mb-6">Generate intelligent and creative text using the power of GPT models.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {/* Pass state to show the SignUpForm */}
        <Link to="/auth" state={{ isLoginView: false }} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Get Started</Link>
        <a href="/try-it" className="border border-blue-500 text-blue-400 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition">Try It</a>
      </div>
    </div>
  );
}

export default HeroSection;