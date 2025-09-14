import React from 'react';

function FeaturesSection() {
  return (
    <div className="container">
      <h2 className="section__title">What Can TextGen AI Do?</h2>
      <div className="glass-effect">
        <ul className="features__list">
          <li><i className="fas fa-check"></i>Generate articles, blog posts, and marketing content.</li>
          <li><i className="fas fa-check"></i>Create product descriptions and e-commerce listings.</li>
          <li><i className="fas fa-check"></i>Answer user queries with natural language understanding.</li>
          <li><i className="fas fa-check"></i>Summarize long reports or documents into key insights.</li>
        </ul>
      </div>
    </div>
  );
}

export default FeaturesSection;