import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Passenger {
  name: string;
  age: string;
  gender: string;
}

interface BookingData {
  source: string;
  destination: string;
  date: string;
  train: any;
  selectedClass: any;
  passengers: Passenger[];
}

const PassengerDetailsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData>({
    source: '',
    destination: '',
    date: '',
    train: null,
    selectedClass: null,
    passengers: [{ name: '', age: '', gender: 'male' }]
  });
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [processingMessage, setProcessingMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    if (location.state) {
      setBookingData({
        ...location.state as any,
        passengers: [{ name: '', age: '', gender: 'male' }]
      });
    } else {
      // Redirect back to home if accessed directly
      navigate('/');
    }
  }, [location.state, navigate]);

  // Format date to be more readable
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleInputChange = (index: number, field: keyof Passenger, value: string) => {
    const updatedPassengers = [...bookingData.passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    
    setBookingData({
      ...bookingData,
      passengers: updatedPassengers
    });
  };

  const addPassenger = () => {
    setBookingData({
      ...bookingData,
      passengers: [...bookingData.passengers, { name: '', age: '', gender: 'male' }]
    });
  };

  const removePassenger = (index: number) => {
    const updatedPassengers = bookingData.passengers.filter((_, i) => i !== index);
    setBookingData({
      ...bookingData,
      passengers: updatedPassengers
    });
  };

  const handleNaturalLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNaturalLanguageInput(e.target.value);
  };

  const processNaturalLanguage = () => {
    // Example: "Passenger: Amritpal, 24, male"
    setProcessingMessage('Processing your request...');
    setMessageType('info');
    
    // Simplified NLP processing - in a real app, this would use an AI service
    const input = naturalLanguageInput.toLowerCase();
    
    try {
      // Extract passenger details
      // Format: "Passenger: [name], [age], [gender]"
      const regex = /passenger:?\s+([a-z\s]+),\s*(\d+),\s*(male|female)/i;
      const match = input.match(regex);
      
      if (match) {
        const name = match[1].trim();
        const age = match[2];
        const gender = match[3].toLowerCase();
        
        const newPassenger: Passenger = {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          age,
          gender
        };
        
        // Replace the first passenger or add if multiple
        if (bookingData.passengers[0].name === '' && 
            bookingData.passengers[0].age === '') {
          setBookingData({
            ...bookingData,
            passengers: [newPassenger]
          });
        } else {
          setBookingData({
            ...bookingData,
            passengers: [...bookingData.passengers, newPassenger]
          });
        }
        
        setProcessingMessage(`Added passenger: ${newPassenger.name}`);
        setMessageType('success');
        setNaturalLanguageInput('');
      } else {
        setProcessingMessage('Could not understand passenger details. Please use format: "Passenger: Name, Age, Gender"');
        setMessageType('error');
      }
    } catch (error) {
      setProcessingMessage('Error processing your request. Please use the form below.');
      setMessageType('error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passenger details
    const isValid = bookingData.passengers.every(p => 
      p.name.trim() !== '' && 
      p.age.trim() !== '' && 
      Number(p.age) > 0 && 
      Number(p.age) < 120
    );
    
    if (isValid) {
      navigate('/seat-selection', { state: bookingData });
    } else {
      setProcessingMessage('Please fill all passenger details correctly');
      setMessageType('error');
    }
  };

  if (!bookingData.train || !bookingData.selectedClass) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="passenger-details-page">
      <div className="card">
        <h2>Passenger Details</h2>
        
        <div className="booking-summary-card">
          <div className="summary-header">
            <h3>Journey Summary</h3>
            <div className="train-badge">{bookingData.selectedClass.type}</div>
          </div>
          
          <div className="summary-train-info">
            <div className="train-name-container">
              <h4>{bookingData.train.name}</h4>
              <span className="train-number">{bookingData.train.number}</span>
            </div>
            
            <div className="journey-details">
              <div className="journey-route">
                <div className="journey-points">
                  <div className="station-info">
                    <div className="station-time">{bookingData.train.departureTime}</div>
                    <div className="station-name">{bookingData.source}</div>
                  </div>
                  <div className="journey-line">
                    <div className="journey-start-point"></div>
                    <div className="journey-path"></div>
                    <div className="journey-end-point"></div>
                  </div>
                  <div className="station-info">
                    <div className="station-time">{bookingData.train.arrivalTime}</div>
                    <div className="station-name">{bookingData.destination}</div>
                  </div>
                </div>
              </div>
              
              <div className="journey-meta">
                <div className="journey-date">
                  <span className="label">Date:</span>
                  <span className="value">{formatDate(bookingData.date)}</span>
                </div>
                <div className="journey-class">
                  <span className="label">Class:</span>
                  <span className="value">{bookingData.selectedClass.name}</span>
                </div>
                <div className="journey-fare">
                  <span className="label">Fare:</span>
                  <span className="value">₹{bookingData.selectedClass.fare} per passenger</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="quick-add-passenger">
          <h3>Quick Add Passenger</h3>
          <div className="ai-input-container">
            <div className="ai-input-wrapper">
              <div className="ai-icon">🧠</div>
              <input 
                type="text"
                className="ai-input"
                placeholder="Example: Passenger: Amritpal, 24, male"
                value={naturalLanguageInput}
                onChange={handleNaturalLanguageChange}
                onKeyPress={(e) => e.key === 'Enter' && processNaturalLanguage()}
              />
            </div>
            <button 
              className="ai-button"
              onClick={processNaturalLanguage}
              disabled={!naturalLanguageInput}
            >
              Add Passenger
            </button>
          </div>
          {processingMessage && (
            <div className={`message ${messageType}`}>
              {messageType === 'success' && <span className="message-icon">✓</span>}
              {messageType === 'error' && <span className="message-icon">✗</span>}
              {messageType === 'info' && <span className="message-icon">ℹ</span>}
              {processingMessage}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="passenger-form-container">
          <h3>Passenger Information</h3>
          
          <div className="passengers-list">
            {bookingData.passengers.map((passenger, index) => (
              <div key={index} className="passenger-form-card">
                <div className="passenger-header">
                  <h4>Passenger {index + 1}</h4>
                  {bookingData.passengers.length > 1 && (
                    <button 
                      type="button" 
                      className="remove-btn"
                      onClick={() => removePassenger(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="passenger-fields">
                  <div className="form-group">
                    <label htmlFor={`name-${index}`}>Full Name</label>
                    <input
                      type="text"
                      id={`name-${index}`}
                      value={passenger.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                      required
                      placeholder="Enter passenger's full name"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`age-${index}`}>Age</label>
                      <input
                        type="number"
                        id={`age-${index}`}
                        value={passenger.age}
                        onChange={(e) => handleInputChange(index, 'age', e.target.value)}
                        min="1"
                        max="120"
                        required
                        placeholder="Age"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`gender-${index}`}>Gender</label>
                      <select
                        id={`gender-${index}`}
                        value={passenger.gender}
                        onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                        required
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            type="button"
            className="add-passenger-btn"
            onClick={addPassenger}
          >
            <span className="plus-icon">+</span> Add Another Passenger
          </button>
          
          <div className="checkout-section">
            <div className="total-fare">
              <div className="total-label">Total Fare:</div>
              <div className="total-amount">₹{bookingData.selectedClass.fare * bookingData.passengers.length}</div>
            </div>
            
            <button type="submit" className="proceed-btn">Proceed to Seat Selection</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassengerDetailsPage; 