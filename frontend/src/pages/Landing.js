import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.fade-in, .slide-in');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text fade-in">
            <h1 className="hero-title">
              <span className="gradient-text">Intelligent WhatsApp</span>
              <br />
              Automation Platform
            </h1>
            <p className="hero-subtitle">
              Transform your customer communication with AI-powered WhatsApp automation. 
              Engage customers 24/7 with intelligent, context-aware responses that feel human.
            </p>
            <div className="hero-buttons">
              <Link to="/dashboard" className="btn btn-primary">
                Get Started Free
                <span className="btn-arrow">→</span>
              </Link>
              <Link to="/features" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1M+</div>
                <div className="stat-label">Messages Sent</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
          <div className="hero-visual fade-in">
            <div className="floating-card card-1">
              <div className="card-icon">💬</div>
              <div className="card-text">AI Responses</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">⚡</div>
              <div className="card-text">Instant Delivery</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">🔒</div>
              <div className="card-text">Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={featuresRef}>
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">
              Everything you need to automate and enhance your WhatsApp communication
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card slide-in">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI-Powered Responses</h3>
              <p className="feature-description">
                Leverage advanced OpenAI technology to generate intelligent, context-aware responses 
                that understand customer intent and provide helpful, accurate information.
              </p>
            </div>
            <div className="feature-card slide-in">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Real-Time Processing</h3>
              <p className="feature-description">
                Receive and respond to messages instantly. Our system processes incoming messages 
                in milliseconds, ensuring your customers never wait.
              </p>
            </div>
            <div className="feature-card slide-in">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Analytics Dashboard</h3>
              <p className="feature-description">
                Track all your conversations, message volumes, response times, and customer 
                satisfaction metrics in one comprehensive dashboard.
              </p>
            </div>
            <div className="feature-card slide-in">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Enterprise Security</h3>
              <p className="feature-description">
                Bank-level encryption and security protocols ensure your data and customer 
                information remain completely secure and compliant.
              </p>
            </div>
            <div className="feature-card slide-in">
              <div className="feature-icon">🔌</div>
              <h3 className="feature-title">Easy Integration</h3>
              <p className="feature-description">
                Simple REST API integration. Connect your existing systems, CRM, or custom 
                applications with just a few lines of code.
              </p>
            </div>
            <div className="feature-card slide-in">
              <div className="feature-icon">🌐</div>
              <h3 className="feature-title">24/7 Availability</h3>
              <p className="feature-description">
                Never miss a customer message. Our platform runs continuously, ensuring 
                your business is always available to engage with customers worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in minutes, not days</p>
          </div>
          <div className="steps">
            <div className="step-item fade-in">
              <div className="step-number">01</div>
              <h3 className="step-title">Connect Your WhatsApp</h3>
              <p className="step-description">
                Link your Twilio WhatsApp Business number to our platform. 
                Simple setup process takes less than 5 minutes.
              </p>
            </div>
            <div className="step-item fade-in">
              <div className="step-number">02</div>
              <h3 className="step-title">Configure AI Settings</h3>
              <p className="step-description">
                Customize your AI assistant's personality, response style, and knowledge base. 
                Train it to match your brand voice.
              </p>
            </div>
            <div className="step-item fade-in">
              <div className="step-number">03</div>
              <h3 className="step-title">Start Automating</h3>
              <p className="step-description">
                Your bot is live! It automatically responds to customer messages, 
                handles inquiries, and provides support around the clock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content fade-in">
            <h2 className="cta-title">Ready to Transform Your Customer Communication?</h2>
            <p className="cta-subtitle">
              Join thousands of businesses using AI-powered WhatsApp automation
            </p>
            <Link to="/dashboard" className="btn btn-primary btn-large">
              Start Free Trial
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
