import React from 'react';

function FeaturesSection() {
  return (
    <div className="py-12 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-white text-center">What Can TextGen AI Do?</h2>
      <ul className="text-left text-gray-200 space-y-4 max-w-xl mx-auto bg-black/40 p-6 rounded-lg backdrop-blur-md">
        <li><i className="fas fa-check text-blue-500 mr-2"></i>Generate articles, blog posts, and marketing content.</li>
        <li><i className="fas fa-check text-blue-500 mr-2"></i>Create product descriptions and e-commerce listings.</li>
        <li><i className="fas fa-check text-blue-500 mr-2"></i>Answer user queries with natural language understanding.</li>
        <li><i className="fas fa-check text-blue-500 mr-2"></i>Summarize long reports or documents into key insights.</li>
        <li><i className="fas fa-check text-blue-500 mr-2"></i>Compose professional emails, messages, and responses.</li>
        <li><i className="fas fa-check text-blue-500 mr-2"></i>Translate text and support multilingual conversations.</li>
        <li><i className="fas fa-check text-blue-500 mr-2"></i>Generate stories, poems, dialogues, and creative scripts.</li>
        <li><i className="fas fa-check text-blue-500 mr-2"></i>Assist developers by generating code snippets or explanations.</li>
        <li><i className="fas fa-check text-blue-500 mr-2"></i>Provide grammar correction and text rewriting suggestions.</li>
        <li><i className="fas fa-check text-blue-500 mr-2"></i>Help students brainstorm ideas, outlines, and complete assignments.</li>
      </ul>
    </div>
  );
}

export default FeaturesSection;