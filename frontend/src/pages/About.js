import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">Transforming customer communication with AI</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              We're on a mission to revolutionize customer communication by making AI-powered 
              WhatsApp automation accessible to businesses of all sizes. Our platform combines 
              cutting-edge artificial intelligence with user-friendly design to help you engage 
              customers 24/7, respond instantly, and scale your support operations effortlessly.
            </p>
          </div>

          <div className="about-section">
            <h2>What We Do</h2>
            <p>
              Our WhatsApp Bot platform leverages advanced OpenAI technology to provide intelligent, 
              context-aware automated responses. Whether you're a small business looking to provide 
              better customer service or a large enterprise managing thousands of conversations daily, 
              our solution scales with your needs.
            </p>
          </div>

          <div className="about-section">
            <h2>Why Choose Us</h2>
            <div className="why-grid">
              <div className="why-item">
                <h3>🚀 Innovation</h3>
                <p>Cutting-edge AI technology powered by OpenAI</p>
              </div>
              <div className="why-item">
                <h3>💪 Reliability</h3>
                <p>99.9% uptime with enterprise-grade infrastructure</p>
              </div>
              <div className="why-item">
                <h3>🔒 Security</h3>
                <p>Bank-level encryption and data protection</p>
              </div>
              <div className="why-item">
                <h3>🎯 Easy to Use</h3>
                <p>Intuitive interface, no technical expertise required</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
