import React from 'react';

function AboutSection() {
  return (
    <div className="py-12 max-w-4xl mx-auto text-left">
      <h2 className="text-3xl font-bold mb-4 text-white text-center">About Us</h2>
      <p className="text-gray-300 text-lg bg-black/40 p-6 rounded-lg backdrop-blur-md">
        TextGen AI is a cutting-edge platform that leverages the power of GPT-based models to help users generate high-quality text for a wide variety of applications. Whether you're a content creator, student, business professional, developer, or casual user, our tools are designed to be intuitive and powerful, meeting the needs of anyone who wants to communicate more effectively with the help of artificial intelligence.<br /><br />
        Built on top of state-of-the-art transformer models, TextGen AI allows you to compose blog posts, write essays, brainstorm creative content, automate writing tasks, and much more — all with just a few clicks. Our mission is to democratize AI-powered writing by providing an accessible, responsive, and efficient platform that adapts to your unique style and voice.
      </p>
    </div>
  );
}

export default AboutSection;