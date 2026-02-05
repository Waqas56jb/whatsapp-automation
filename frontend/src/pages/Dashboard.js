import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const Dashboard = () => {
  const [status, setStatus] = useState({ isReady: false });
  const [loading, setLoading] = useState(false);
  const [toNumber, setToNumber] = useState('');
  const [message, setMessage] = useState('');
  const [apiUrl] = useState(API_BASE_URL);
  const [allMessages, setAllMessages] = useState([]);
  const [messageFilter, setMessageFilter] = useState('all');

  const checkStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/status`);
      setStatus(response.data);
    } catch (error) {
      console.error('Error checking status:', error);
      setStatus({ isReady: false, error: 'Cannot connect to backend' });
    }
  }, [apiUrl]);

  const fetchMessages = useCallback(async () => {
    try {
      const params = {};
      if (messageFilter !== 'all') {
        params.type = messageFilter;
      }
      params.limit = 100;
      
      const response = await axios.get(`${apiUrl}/messages`, { params });
      
      if (response.data && response.data.messages) {
        setAllMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [apiUrl, messageFilter]);

  useEffect(() => {
    checkStatus();
    fetchMessages();
    const statusInterval = setInterval(checkStatus, 10000);
    const messagesInterval = setInterval(fetchMessages, 3000);
    return () => {
      clearInterval(statusInterval);
      clearInterval(messagesInterval);
    };
  }, [checkStatus, fetchMessages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!toNumber.trim() || !message.trim()) {
      alert('Please enter a phone number and message');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/send-message`, {
        to: toNumber.trim(),
        message: message.trim()
      });
      
      setTimeout(fetchMessages, 500);
      alert('Message sent successfully!');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Manage your WhatsApp bot and monitor conversations</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card status-card">
            <div className="card-header">
              <h3>Connection Status</h3>
            </div>
            <div className="card-content">
              <div className={`status-indicator ${status.isReady ? 'online' : 'offline'}`}></div>
              <div className="status-info">
                <p className="status-text">{status.isReady ? 'Connected' : status.error || 'Disconnected'}</p>
                {status.twilioNumber && (
                  <p className="status-detail">Twilio: {status.twilioNumber}</p>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-card stats-card">
            <div className="card-header">
              <h3>Message Statistics</h3>
            </div>
            <div className="card-content">
              <div className="stat-grid">
                <div className="stat-box">
                  <div className="stat-value">{allMessages.filter(m => m.type === 'incoming').length}</div>
                  <div className="stat-label">Incoming</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{allMessages.filter(m => m.type === 'outgoing').length}</div>
                  <div className="stat-label">Outgoing</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{allMessages.length}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card send-card">
            <div className="card-header">
              <h3>Send Message</h3>
            </div>
            <div className="card-content">
              <form onSubmit={sendMessage} className="message-form">
                <div className="form-group">
                  <label>To (WhatsApp Number)</label>
                  <input
                    type="text"
                    value={toNumber}
                    onChange={(e) => setToNumber(e.target.value)}
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows="4"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          <div className="dashboard-card messages-card">
            <div className="card-header">
              <div className="card-header-content">
                <h3>All Messages</h3>
                <div className="message-filters">
                  <button 
                    className={messageFilter === 'all' ? 'active' : ''}
                    onClick={() => setMessageFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={messageFilter === 'incoming' ? 'active' : ''}
                    onClick={() => setMessageFilter('incoming')}
                  >
                    Incoming
                  </button>
                  <button 
                    className={messageFilter === 'outgoing' ? 'active' : ''}
                    onClick={() => setMessageFilter('outgoing')}
                  >
                    Outgoing
                  </button>
                </div>
              </div>
            </div>
            <div className="card-content">
              {allMessages.length > 0 ? (
                <div className="messages-list">
                  {allMessages.map((msg) => (
                    <div key={msg.id} className={`message-item ${msg.type}`}>
                      <div className="message-header">
                        <span className="message-type">{msg.type === 'incoming' ? '📥' : '📤'}</span>
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="message-contact">
                        {msg.type === 'incoming' 
                          ? `From: ${msg.profileName || msg.fromNumber}` 
                          : `To: ${msg.toNumber || msg.to}`}
                      </div>
                      <div className="message-body">{msg.message}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-messages">
                  <p>No messages yet. Messages will appear here when users send messages.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
