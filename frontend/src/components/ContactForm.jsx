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
    // Simulate API call
    setTimeout(() => {
      alert(`Message sent from ${formState.name}! (This is a demo)`);
      setIsLoading(false);
      setFormState({ name: '', email: '', message: '' }); // Reset form
    }, 1500);
  };

  return (
    <div className="container contact-form-container">
      <h2 className="section__title">Contact Us</h2>
      <p className="hero__subtitle">Have questions, feedback, or feature requests? We'd love to hear from you.</p>

      {isLoading && (
        <div style={{ marginBottom: '1rem', color: '#60a5fa' }}>
          <i className="fas fa-spinner fa-spin"></i> Sending message...
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form glass-effect">
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input type="text" id="name" name="name" value={formState.name} onChange={handleInputChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" name="email" value={formState.email} onChange={handleInputChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Your Message</label>
          <textarea id="message" name="message" rows="4" value={formState.message} onChange={handleInputChange} className="form-textarea" required></textarea>
        </div>
        <button type="submit" disabled={isLoading} className="btn btn--primary">
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;