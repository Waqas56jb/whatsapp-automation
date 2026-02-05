import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://whatsapp-automation-xqw7.vercel.app/api';

const Dashboard = () => {
  const [status, setStatus] = useState({ isReady: false });
  const [apiUrl] = useState(API_BASE_URL);
  const [allMessages, setAllMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [streamingMessages, setStreamingMessages] = useState(new Map());
  const eventSourceRefs = useRef(new Map());

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
      const response = await axios.get(`${apiUrl}/messages`, { params: { limit: 500 } });
      
      if (response.data && response.data.messages) {
        const newMessages = response.data.messages;
        setAllMessages(newMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [apiUrl]);

  // Connect to streaming endpoint for messages that are being generated
  useEffect(() => {
    // Capture ref value for cleanup
    const eventSourceRefsMap = eventSourceRefs.current;
    
    // Find all streaming messages (outgoing AI responses)
    const streamingMsgIds = allMessages
      .filter(msg => {
        if (msg.type !== 'outgoing') return false;
        // Check if streaming or has empty message (means it's being generated)
        return msg.isStreaming || msg.status === 'streaming' || msg.originalStreamId || !msg.message || msg.message === '';
      })
      .map(msg => {
        // Use originalStreamId if available, otherwise use id
        // Also try to extract stream ID from id if it has stream_ prefix
        const streamId = msg.originalStreamId || msg.id;
        // If id starts with stream_, use it directly, otherwise try to construct it
        if (msg.id && msg.id.startsWith('stream_')) {
          return msg.id;
        }
        if (msg.originalStreamId) {
          return msg.originalStreamId;
        }
        // Try to find related incoming message to get the stream ID
        const relatedIncoming = allMessages.find(m => 
          m.type === 'incoming' && 
          (m.fromNumber === msg.toNumber || m.from === msg.to)
        );
        if (relatedIncoming && relatedIncoming.id) {
          return `stream_${relatedIncoming.id}`;
        }
        return streamId;
      })
      .filter((id, index, self) => self.indexOf(id) === index && id);

    streamingMsgIds.forEach(messageId => {
      if (!eventSourceRefsMap.has(messageId)) {
        // Remove /api suffix if present for base URL
        const baseUrl = apiUrl.endsWith('/api') ? apiUrl.replace('/api', '') : apiUrl.replace(/\/api\/?$/, '');
        console.log(`[SSE] Connecting to stream for messageId: ${messageId}`);
        const eventSource = new EventSource(`${baseUrl}/api/stream/${messageId}`);
        
        eventSource.onopen = () => {
          console.log(`[SSE] Connected to stream: ${messageId}`);
        };
        
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'connected') {
              console.log(`[SSE] Stream connected: ${data.messageId}`);
            }
            
            if (data.type === 'update') {
              console.log(`[SSE] Update received for ${data.messageId}: ${data.text.substring(0, 50)}...`);
              
              setStreamingMessages(prev => {
                const newMap = new Map(prev);
                newMap.set(data.messageId || messageId, {
                  text: data.text,
                  isTyping: !data.isComplete
                });
                return newMap;
              });
              
              setAllMessages(prev => prev.map(msg => {
                // Match by multiple possible IDs
                const matchesId = msg.id === (data.messageId || messageId) || 
                                 msg.originalStreamId === (data.messageId || messageId) ||
                                 msg.id === messageId ||
                                 msg.originalStreamId === messageId ||
                                 (msg.id && msg.id.includes(messageId)) ||
                                 (messageId && messageId.includes(msg.id));
                if (matchesId && msg.type === 'outgoing') {
                  return { 
                    ...msg, 
                    message: data.text, 
                    isStreaming: !data.isComplete,
                    status: data.isComplete ? 'sent' : 'streaming'
                  };
                }
                return msg;
              }));

              // Removed auto-scroll - let user control scrolling
            }
            
            if (data.type === 'complete') {
              console.log(`[SSE] Stream complete: ${data.messageId}`);
              eventSource.close();
              eventSourceRefsMap.delete(messageId);
              setStreamingMessages(prev => {
                const newMap = new Map(prev);
                newMap.delete(data.messageId || messageId);
                return newMap;
              });
            }
          } catch (error) {
            console.error('Error parsing SSE data:', error);
          }
        };
        
        eventSource.onerror = (error) => {
          console.error(`[SSE] Error for ${messageId}:`, error);
          eventSource.close();
          eventSourceRefsMap.delete(messageId);
        };
        
        eventSourceRefsMap.set(messageId, eventSource);
      }
    });

    return () => {
      eventSourceRefsMap.forEach((es, id) => {
        if (!streamingMsgIds.includes(id)) {
          es.close();
          eventSourceRefsMap.delete(id);
        }
      });
    };
  }, [allMessages, apiUrl]);

  useEffect(() => {
    // Capture ref value for cleanup
    const eventSourceRefsMap = eventSourceRefs.current;
    
    checkStatus();
    fetchMessages();
    const statusInterval = setInterval(checkStatus, 30000);
    // Poll more frequently for real-time updates - catch new streaming messages quickly
    const messagesInterval = setInterval(fetchMessages, 300); // Check every 300ms for near real-time
    return () => {
      clearInterval(statusInterval);
      clearInterval(messagesInterval);
      eventSourceRefsMap.forEach(es => es.close());
      eventSourceRefsMap.clear();
    };
  }, [checkStatus, fetchMessages]);

  // Sort all messages chronologically for dialogue flow
  // Show all messages regardless of contact - full conversation view
  const activeMessages = allMessages
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeA - timeB; // Oldest first for natural conversation flow
    })
    .map(msg => ({
      ...msg,
      contact: msg.type === 'incoming' 
        ? (msg.profileName || msg.fromNumber || msg.from)
        : (msg.toNumber || msg.to)
    }));

  // Get unique contacts for stats
  const contacts = [...new Set(activeMessages.map(m => m.contact))];
  
  // Stats
  const stats = {
    incoming: allMessages.filter(m => m.type === 'incoming').length,
    outgoing: allMessages.filter(m => m.type === 'outgoing').length,
    conversations: contacts.length
  };

  return (
    <div className="chat-app">
      <div className="chat-container">
        {/* Top Bar */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className={`status-dot ${status.isReady ? 'online' : 'offline'}`}></div>
            <div className="chat-header-info">
              <h2>WhatsApp Bot</h2>
              <span className="chat-status">
                {status.isReady ? 'Online' : 'Offline'} • {stats.conversations} conversation{stats.conversations !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="chat-header-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.incoming}</span>
              <span className="stat-label">Incoming</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.outgoing}</span>
              <span className="stat-label">Responses</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="chat-messages" ref={messagesContainerRef}>
          {activeMessages.length > 0 ? (
            <div className="messages-list">
              {activeMessages.map((msg, index) => {
                // Get stream ID - try multiple formats for better matching
                const streamId = msg.originalStreamId || 
                                 (msg.id && msg.id.startsWith('stream_') ? msg.id : null) ||
                                 msg.id;
                
                // Check streaming state - prioritize streamData from SSE
                const streamData = streamingMessages.get(streamId) || 
                                  streamingMessages.get(msg.originalStreamId) ||
                                  streamingMessages.get(msg.id);
                
                const isStreaming = msg.isStreaming || 
                                   msg.status === 'streaming' || 
                                   (streamData && streamData.isTyping !== false) ||
                                   (msg.type === 'outgoing' && (!msg.message || msg.message === ''));
                
                // For display, use streamData if available (real-time), otherwise use message
                // streamData.text takes priority for real-time token-by-token updates
                const displayText = streamData?.text || msg.message || '';
                const showTyping = isStreaming && (!displayText || displayText === '') && msg.type === 'outgoing';
                const isIncoming = msg.type === 'incoming';
                
                // Check if next message is an AI response that's about to start (typing indicator)
                const nextMsg = activeMessages[index + 1];
                const showAITyping = isIncoming && nextMsg && nextMsg.type === 'outgoing' && 
                                     (!nextMsg.message || nextMsg.isStreaming || nextMsg.status === 'streaming');
                
                return (
                  <React.Fragment key={msg.id}>
                    <div className={`message-wrapper ${isIncoming ? 'incoming' : 'outgoing'}`}>
                      <div className={`message-bubble ${isStreaming ? 'streaming' : ''}`}>
                        {showTyping ? (
                          <div className="typing-indicator-container">
                            <div className="typing-dots">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="message-text">
                              {/* For incoming messages, always show the message text */}
                              {/* For outgoing messages, show streamed text or message */}
                              {isIncoming 
                                ? (msg.message || '') 
                                : (displayText || msg.message || (isStreaming ? 'Generating...' : ''))
                              }
                              {/* Show cursor when streaming and has text - indicates active generation */}
                              {isStreaming && displayText && displayText.length > 0 && msg.type === 'outgoing' && (
                                <span className="cursor-blink">|</span>
                              )}
                            </div>
                            <div className="message-time">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Show typing indicator after user message if AI is about to respond */}
                    {showAITyping && (
                      <div className="message-wrapper outgoing">
                        <div className="message-bubble streaming">
                          <div className="typing-indicator-container">
                            <div className="typing-dots">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef}></div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>No messages yet</h3>
              <p>Messages will appear here when users send messages to your WhatsApp number</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
