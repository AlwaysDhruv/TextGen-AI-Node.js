import React, { useState } from 'react';

function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      const result = await response.json();
      alert(result.message);
      if (response.ok) {
        setFormState({ name: '', email: '', message: '' }); // Reset form
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-3xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-4 text-white text-center">Contact Us</h2>
      <p className="text-gray-300 text-lg mb-6 text-center">
        Have questions, feedback, or feature requests? We'd love to hear from you.
      </p>

      {isLoading && (
        <div className="text-center text-blue-400 font-semibold mb-4">
          <i className="fas fa-spinner fa-spin mr-2"></i> Sending message...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-black/50 backdrop-blur-md p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-300 mb-1 text-left">Your Name</label>
          <input type="text" id="name" name="name" value={formState.name} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-300 mb-1 text-left">Your Email</label>
          <input type="email" id="email" name="email" value={formState.email} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500" required />
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-300 mb-1 text-left">Your Message</label>
          <textarea id="message" name="message" rows="4" value={formState.message} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500" required></textarea>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition">
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;