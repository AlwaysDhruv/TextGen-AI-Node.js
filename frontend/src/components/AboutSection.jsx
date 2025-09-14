import React from 'react';

function AboutSection() {
  return (
    <div className="container">
      <h2 className="section__title">About Us</h2>
      <div className="glass-effect">
        <p className="about__text">
          TextGen AI is a cutting-edge platform that leverages the power of GPT-based models to help users generate high-quality text...
          <br /><br />
          Built on top of state-of-the-art transformer models, TextGen AI allows you to compose blog posts, write essays, brainstorm creative content...
        </p>
      </div>
    </div>
  );
}

export default AboutSection;