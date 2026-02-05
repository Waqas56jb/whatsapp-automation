import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1 className="page-title">Get In Touch</h1>
          <p className="page-subtitle">We'd love to hear from you</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <h3>Email</h3>
                  <p>support@whatsappbot.com</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📱</span>
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <h3>Address</h3>
                  <p>123 Tech Street<br />San Francisco, CA 94105</p>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows="6"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
