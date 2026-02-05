import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Intelligence',
      description: 'Advanced OpenAI integration provides context-aware, intelligent responses that understand customer intent and deliver accurate information.',
      details: [
        'Natural language processing',
        'Context understanding',
        'Multi-language support',
        'Customizable AI personality'
      ]
    },
    {
      icon: '⚡',
      title: 'Lightning Fast Response',
      description: 'Process and respond to messages in milliseconds. Our optimized infrastructure ensures your customers never wait.',
      details: [
        'Sub-second response times',
        'Real-time message processing',
        'High availability infrastructure',
        'Auto-scaling capabilities'
      ]
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboard with real-time metrics, conversation analytics, and performance insights.',
      details: [
        'Message volume tracking',
        'Response time analytics',
        'Customer satisfaction metrics',
        'Custom report generation'
      ]
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Bank-level encryption, GDPR compliance, and industry-standard security protocols protect your data.',
      details: [
        'End-to-end encryption',
        'SOC 2 compliant',
        'Regular security audits',
        'Data privacy controls'
      ]
    },
    {
      icon: '🔌',
      title: 'Easy Integration',
      description: 'Simple REST API, webhooks, and SDKs for seamless integration with your existing systems.',
      details: [
        'RESTful API',
        'Webhook support',
        'Multiple SDK languages',
        'Comprehensive documentation'
      ]
    },
    {
      icon: '🌐',
      title: 'Global Scale',
      description: '24/7 availability with global infrastructure ensuring reliable service worldwide.',
      details: [
        '99.9% uptime SLA',
        'Global data centers',
        'Automatic failover',
        'Disaster recovery'
      ]
    }
  ];

  return (
    <div className="features-page">
      <section className="features-hero">
        <div className="container">
          <h1 className="page-title">Powerful Features</h1>
          <p className="page-subtitle">
            Everything you need to automate and enhance your WhatsApp communication
          </p>
        </div>
      </section>

      <section className="features-content">
        <div className="container">
          {features.map((feature, index) => (
            <div key={index} className="feature-detail">
              <div className="feature-detail-content">
                <div className="feature-detail-icon">{feature.icon}</div>
                <h2 className="feature-detail-title">{feature.title}</h2>
                <p className="feature-detail-description">{feature.description}</p>
                <ul className="feature-detail-list">
                  {feature.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Features;
