import React, { useState, useEffect, useRef } from 'react';
import { SendOutlined, CloseOutlined } from '@ant-design/icons';

// Generate unique session ID
const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const ChatbotWidget = () => {
  const [sessionId] = useState(() => {
    // Try to get existing session from localStorage or create new one
    const stored = localStorage.getItem('chatbot_session_id');
    if (stored) return stored;
    const newId = generateSessionId();
    localStorage.setItem('chatbot_session_id', newId);
    return newId;
  });

  const [messages, setMessages] = useState(() => {
    // Load chat history from localStorage
    const stored = localStorage.getItem(`chatbot_messages_${sessionId}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored messages:', e);
      }
    }
    return [
      {
        id: 1,
        text: '👋 Xin chào! Tôi là polyshoes Bot. Tôi có thể tư vấn size, tìm kiếm sản phẩm, hoặc trả lời câu hỏi về chính sách. Bạn cần gì?',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(`chatbot_messages_${sessionId}`, JSON.stringify(messages));
  }, [messages, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to format height to 1mXX format
  const formatHeightToServer = (text) => {
    // Try to find height pattern and skip weight (kg)
    // Height patterns: 170, 170cm, 1m70, 1m7, 1.70
    // Don't format: 70kg, 70k (these are weights)
    
    let result = text;
    
    // Pattern 1: Already in 1mXX format (e.g., 1m70, 1m7)
    const pattern1 = /1m(\d{1,2})/i;
    if (pattern1.test(result)) {
      console.log(`[Height Format] Already in 1mXX format: "${result}"`);
      return result;
    }

    // Pattern 2: Number with 'cm' unit (e.g., 170cm, 175cm)
    const pattern2 = /(\d{3})\s*cm/i;
    const cmMatch = result.match(pattern2);
    if (cmMatch) {
      const cm = parseInt(cmMatch[1]);
      if (cm >= 140 && cm <= 230) { // Valid height range
        const centimeters = cm % 100;
        const formatted = `1m${centimeters.toString().padStart(2, '0')}`;
        console.log(`[Height Format] "${cmMatch[0]}" → ${cm}cm → ${formatted}`);
        result = result.replace(pattern2, formatted);
      }
    }

    // Pattern 3: Plain 3-digit number (e.g., 170, 175)
    // Only convert if it looks like height (140-230), not weight
    const pattern3 = /\b(\d{3})\b(?!\s*k(?:g)?)\b/i;
    const numMatch = result.match(pattern3);
    if (numMatch && !result.toLowerCase().includes('kg')) {
      const num = parseInt(numMatch[1]);
      if (num >= 140 && num <= 230) { // Valid height range
        const centimeters = num % 100;
        const formatted = `1m${centimeters.toString().padStart(2, '0')}`;
        console.log(`[Height Format] "${numMatch[0]}" → ${num}cm → ${formatted}`);
        result = result.replace(pattern3, formatted);
      }
    }

    console.log(`[Height Format] Input: "${text}" | Output: "${result}"`);
    return result;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Format height if applicable
    const formattedInput = formatHeightToServer(input);
    const displayText = input; // Show original in UI

    console.log(`[Chat] Original input: "${input}" | Formatted for server: "${formattedInput}"`);

    // Thêm tin nhắn của user
    const userMessage = {
      id: messages.length + 1,
      text: displayText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Gọi API Rasa với sessionId
      const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: sessionId, // Use sessionId instead of static string
          message: formattedInput,
        }),
      });

      const data = await response.json();

      // Thêm response từ Rasa
      if (data && data.length > 0) {
        data.forEach((msg, idx) => {
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              {
                id: prev.length + idx + 1,
                text: msg.text || msg.custom?.text || 'Xin lỗi, tôi không hiểu.',
                sender: 'bot',
                timestamp: new Date().toISOString(),
              },
            ]);
          }, idx * 500);
        });
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            text: '❌ Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi tôi về tư vấn size, tìm kiếm sản phẩm hoặc chính sách shop.',
            sender: 'bot',
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Lỗi kết nối Rasa:', error);
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: '❌ Xin lỗi, tôi gặp sự cố. Vui lòng thử lại sau.',
          sender: 'bot',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    const newSessionId = generateSessionId();
    localStorage.setItem('chatbot_session_id', newSessionId);
    localStorage.removeItem(`chatbot_messages_${sessionId}`);
    
    setMessages([
      {
        id: 1,
        text: '👋 Xin chào! Tôi là polyshoes Bot. Tôi có thể tư vấn size, tìm kiếm sản phẩm, hoặc trả lời câu hỏi về chính sách. Bạn cần gì?',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const styles = {
    container: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    chatBox: {
      width: '380px',
      maxHeight: '600px',
      backgroundColor: '#fff',
      borderRadius: '14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid #eaeaea',
      animation: 'slideUp 0.3s ease-out',
    },
    header: {
      backgroundColor: '#ff6b35',
      color: '#fff',
      padding: '16px',
      fontSize: '16px',
      fontWeight: 700,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      backgroundColor: '#f9f9f9',
    },
    message: {
      maxWidth: '95%',
      padding: '10px 14px',
      borderRadius: '10px',
      fontSize: '14px',
      lineHeight: '1.5',
      wordWrap: 'break-word',
      animation: 'fadeIn 0.3s ease-in',
    },
    userMessage: {
      backgroundColor: '#ff6b35',
      color: '#222',
      alignSelf: 'flex-end',
      borderBottomRightRadius: '4px',
    },
    botMessage: {
      backgroundColor: '#fff',
      color: '#222',
      alignSelf: 'flex-start',
      border: '1px solid #eaeaea',
      borderBottomLeftRadius: '4px',
    },
    inputContainer: {
      display: 'flex',
      gap: '8px',
      padding: '12px',
      borderTop: '1px solid #eaeaea',
      backgroundColor: '#fff',
    },
    input: {
      flex: 1,
      border: '1px solid #ddd',
      borderRadius: '999px',
      padding: '10px 14px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s',
      fontFamily: 'inherit',
    },
    button: {
      backgroundColor: '#ff6b35',
      color: '#fff',
      border: 'none',
      borderRadius: '999px',
      width: '40px',
      height: '40px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s',
      fontSize: '16px',
      flexShrink: 0,
    },
    toggleButton: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: '#ff6b35',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize: '24px',
      boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s',
      animation: 'pulse 2s infinite',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#fff',
      fontSize: '20px',
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s',
    },
    loadingDot: {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#ff6b35',
      animation: 'bounce 1.4s infinite',
      marginRight: '4px',
    },
  };

  // CSS animations
  const styleSheet = document.createElement('style');

  if (!document.head.querySelector('style[data-chatbot="true"]')) {
    styleSheet.setAttribute('data-chatbot', 'true');
    document.head.appendChild(styleSheet);
  }

  return (
    <div style={styles.container}>
      {!isOpen ? (
        <button
          style={styles.toggleButton}
          onClick={() => setIsOpen(true)}
          title="Mở chatbot polyshoes"
          onMouseEnter={e => (e.target.style.backgroundColor = '#ff4d4f')}
          onMouseLeave={e => (e.target.style.backgroundColor = '#ff6b35')}
        >
          💬
        </button>
      ) : (
        <div style={styles.chatBox}>
          {/* Header */}
          <div style={styles.header}>
            <span>🤖 polyshoes Bot</span>
            <button
              onClick={() => setIsOpen(false)}
              style={styles.closeButton}
              onMouseEnter={e => (e.target.style.opacity = '0.8')}
              onMouseLeave={e => (e.target.style.opacity = '1')}
            >
              <CloseOutlined />
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messagesContainer}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  ...styles.message,
                  ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage),
                  padding: msg.text.includes('<') ? '0px' : '10px 14px',
                  border: msg.text.includes('<') ? 'none' : '1px solid #eaeaea',
                  backgroundColor: msg.text.includes('<') && msg.sender === 'bot' ? 'transparent' : undefined,
                }}
              >
                {msg.text.includes('<') && msg.sender === 'bot' ? (
                  <div 
                    className="chatbot-html-message"
                    dangerouslySetInnerHTML={{ __html: msg.text }} 
                  />
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ ...styles.message, ...styles.botMessage }}>
                <span style={styles.loadingDot} />
                <span style={styles.loadingDot} />
                <span style={styles.loadingDot} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !isLoading && sendMessage()}
              style={styles.input}
              className="chatbot-input"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              style={styles.button}
              disabled={isLoading}
              onMouseEnter={e => !isLoading && (e.target.style.backgroundColor = '#ff4d4f')}
              onMouseLeave={e => !isLoading && (e.target.style.backgroundColor = '#ff6b35')}
            >
              <SendOutlined />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
