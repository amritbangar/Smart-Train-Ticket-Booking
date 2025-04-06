import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NLPResponse {
  source: string;
  destination: string;
  date: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [processingMessage, setProcessingMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'nlp' | 'form'>('nlp');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const handleNaturalLanguageSearch = async () => {
    if (!naturalLanguageInput.trim()) {
      setProcessingMessage('Please enter your travel details');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setProcessingMessage('Processing your request...');
    setMessageType('info');

    try {
      // In a real app, this would call a backend API
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple regex-based NLP logic
      const regex = /from\s+(\w+)\s+to\s+(\w+)\s+on\s+(\d{4}-\d{2}-\d{2})/i;
      const match = naturalLanguageInput.match(regex);
      
      if (match) {
        const nlpResponse: NLPResponse = {
          source: match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase(),
          destination: match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase(),
          date: match[3]
        };
        
        navigate('/search', { state: nlpResponse });
      } else {
        setProcessingMessage('Could not understand your request. Please use the format: "I want to travel from [city] to [city] on [YYYY-MM-DD]"');
        setMessageType('error');
        setIsLoading(false);
      }
    } catch (error) {
      setProcessingMessage('An error occurred while processing your request. Please try again.');
      setMessageType('error');
      setIsLoading(false);
    }
  };

  const handleFormSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!source || !destination || !date) {
      setProcessingMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }
    
    navigate('/search', { 
      state: { 
        source, 
        destination, 
        date 
      } 
    });
  };

  const handleExampleClick = () => {
    setNaturalLanguageInput('I want to travel from Delhi to Jalandhar on 2025-04-09');
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="logo-container">
            <div className="logo">
              <span className="logo-icon">🚆</span>
              <span className="logo-text">ExpressBook</span>
            </div>
            <div className="logo-tagline">AI-Powered Travel Booking</div>
          </div>
          
          <h1>Smart Train Ticket Booking</h1>
          <p className="hero-subtitle">Just tell us where you want to go, and we'll handle the rest!</p>
          
          <div className="search-card">
            <div className="tab-navigation">
              <button 
                className={`tab-button ${activeTab === 'nlp' ? 'active' : ''}`}
                onClick={() => setActiveTab('nlp')}
              >
                <span className="tab-icon">🧠</span>
                Natural Language
              </button>
              <button 
                className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
                onClick={() => setActiveTab('form')}
              >
                <span className="tab-icon">📝</span>
                Manual Entry
              </button>
            </div>
            
            {activeTab === 'nlp' ? (
              <div className="nlp-search">
                <div className="ai-input-container">
                  <div className="ai-input-wrapper">
                    <div className="ai-icon">🔍</div>
                    <input
                      type="text"
                      placeholder="I want to travel from Delhi to Jalandhar on 2025-04-09"
                      value={naturalLanguageInput}
                      onChange={(e) => setNaturalLanguageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNaturalLanguageSearch()}
                      className="ai-input"
                    />
                  </div>
                  <button 
                    onClick={handleNaturalLanguageSearch} 
                    className="search-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="button-spinner"></span>
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
                
                <div className="examples">
                  <span>Example:</span>
                  <button onClick={handleExampleClick} className="example-button">
                    I want to travel from Delhi to Jalandhar on 2025-04-09
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSearch} className="manual-search-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="source">From</label>
                    <input
                      type="text"
                      id="source"
                      placeholder="E.g., Delhi"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="destination">To</label>
                    <input
                      type="text"
                      id="destination"
                      placeholder="E.g., Jalandhar"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="date">Date of Journey</label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <button type="submit" className="search-button full-width">
                  Search Trains
                </button>
              </form>
            )}
            
            {processingMessage && (
              <div className={`message ${messageType}`}>
                {messageType === 'success' && <span className="message-icon">✓</span>}
                {messageType === 'error' && <span className="message-icon">✗</span>}
                {messageType === 'info' && <span className="message-icon">ℹ</span>}
                {processingMessage}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature">
          <div className="feature-icon">🧠</div>
          <h3>AI-Powered Search</h3>
          <p>Simply tell us where you want to go in natural language, and we'll find the best trains for you.</p>
        </div>
        
        <div className="feature">
          <div className="feature-icon">⚡</div>
          <h3>Lightning Fast</h3>
          <p>Book your tickets in minutes with our streamlined booking process.</p>
        </div>
        
        <div className="feature">
          <div className="feature-icon">🎯</div>
          <h3>Best Seats</h3>
          <p>Choose your preferred seats with our interactive seat selection interface.</p>
        </div>
        
        <div className="feature">
          <div className="feature-icon">🔒</div>
          <h3>Secure Booking</h3>
          <p>Your payment and personal information are always protected.</p>
        </div>
      </div>
      
      <div className="popular-routes-section">
        <h2>Popular Routes</h2>
        <div className="routes-container">
          <div className="route-card">
            <div className="route-cities">
              <span>Delhi</span>
              <span className="route-arrow">→</span>
              <span>Mumbai</span>
            </div>
            <div className="route-trains">Rajdhani, Duronto, Tejas</div>
            <button className="book-now-btn">Book Now</button>
          </div>
          
          <div className="route-card">
            <div className="route-cities">
              <span>Bangalore</span>
              <span className="route-arrow">→</span>
              <span>Chennai</span>
            </div>
            <div className="route-trains">Shatabdi, Double Decker</div>
            <button className="book-now-btn">Book Now</button>
          </div>
          
          <div className="route-card">
            <div className="route-cities">
              <span>Kolkata</span>
              <span className="route-arrow">→</span>
              <span>Delhi</span>
            </div>
            <div className="route-trains">Howrah Mail, Poorva Express</div>
            <button className="book-now-btn">Book Now</button>
          </div>
          
          <div className="route-card">
            <div className="route-cities">
              <span>Hyderabad</span>
              <span className="route-arrow">→</span>
              <span>Bangalore</span>
            </div>
            <div className="route-trains">Kacheguda Express, Vande Bharat</div>
            <button className="book-now-btn">Book Now</button>
          </div>
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-logo">
          <span className="logo-icon">🚆</span>
          <span>ExpressBook</span>
        </div>
        <div className="footer-links">
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Refund Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2023 ExpressBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 