import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'upi' | 'card' | 'netbanking' | 'wallet';
  icon: string;
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const paymentMethods: PaymentMethod[] = [
    { id: 'upi', name: 'UPI', type: 'upi', icon: '📱' },
    { id: 'card', name: 'Credit/Debit Card', type: 'card', icon: '💳' },
    { id: 'netbanking', name: 'Net Banking', type: 'netbanking', icon: '🏦' },
    { id: 'wallet', name: 'Digital Wallet', type: 'wallet', icon: '👛' }
  ];

  useEffect(() => {
    if (location.state) {
      setBookingData(location.state);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const calculateTotalFare = (): number => {
    if (!bookingData) return 0;
    return bookingData.selectedClass.fare * bookingData.passengers.length;
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces every 4 digits
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardDetails({
        ...cardDetails,
        [name]: formattedValue
      });
    } else if (name === 'expiryDate') {
      // Format expiry date as MM/YY
      const formatted = value.replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substring(0, 5);
      
      setCardDetails({
        ...cardDetails,
        [name]: formatted
      });
    } else {
      setCardDetails({
        ...cardDetails,
        [name]: value
      });
    }
  };

  const handleUpiInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value);
  };

  const handlePaymentSubmit = () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    
    // Simulate payment processing - in a real app, this would call a payment gateway API
    setTimeout(() => {
      // Simulate successful payment (95% success rate)
      const isSuccess = Math.random() < 0.95;
      
      if (isSuccess) {
        setPaymentStatus('success');
        
        // Generate PNR and ticket details
        const pnr = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        const ticketDetails = {
          ...bookingData,
          pnr,
          paymentMethod: selectedPaymentMethod,
          paymentTimestamp: new Date().toISOString(),
          totalFare: calculateTotalFare(),
          status: 'confirmed'
        };
        
        // Redirect to confirmation page after a delay
        setTimeout(() => {
          navigate('/confirmation', { state: ticketDetails });
        }, 2000);
      } else {
        setPaymentStatus('failed');
        setIsProcessing(false);
      }
    }, 3000);
  };

  if (!bookingData) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading payment options...</p>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="card">
        <h2>Payment</h2>
        
        {paymentStatus === 'pending' || paymentStatus === 'failed' ? (
          <>
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <p>
                <span>Train:</span> 
                <span>{bookingData.train.name} ({bookingData.train.number})</span>
              </p>
              <p>
                <span>From:</span>
                <span>{bookingData.source}</span>
              </p>
              <p>
                <span>To:</span>
                <span>{bookingData.destination}</span>
              </p>
              <p>
                <span>Date:</span>
                <span>{formatDate(bookingData.date)}</span>
              </p>
              <p>
                <span>Class:</span>
                <span>{bookingData.selectedClass.name} ({bookingData.selectedClass.type})</span>
              </p>
              <p>
                <span>Passengers:</span>
                <span>{bookingData.passengers.length}</span>
              </p>
              <p>
                <span>Total Fare:</span>
                <span>₹{calculateTotalFare()}</span>
              </p>
            </div>
            
            <div className="payment-methods">
              <h3>Select Payment Method</h3>
              <div className="payment-options">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className={`payment-option ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                  >
                    <div className="payment-icon">{method.icon}</div>
                    <div className="payment-name">{method.name}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedPaymentMethod === 'card' && (
              <div className="payment-form card-payment">
                <h3>Enter Card Details</h3>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="cardName">Name on Card</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={cardDetails.cardName}
                    onChange={handleCardInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleCardInputChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="password"
                      id="cvv"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            {selectedPaymentMethod === 'upi' && (
              <div className="payment-form upi-payment">
                <h3>UPI Payment</h3>
                <div className="form-group">
                  <label htmlFor="upiId">UPI ID</label>
                  <input
                    type="text"
                    id="upiId"
                    value={upiId}
                    onChange={handleUpiInputChange}
                    placeholder="yourname@upi"
                    required
                  />
                </div>
              </div>
            )}
            
            {selectedPaymentMethod === 'netbanking' && (
              <div className="payment-form netbanking-payment">
                <h3>Net Banking</h3>
                <p>Select your bank from the list below:</p>
                <select>
                  <option value="">Select a bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                  <option value="pnb">Punjab National Bank</option>
                </select>
              </div>
            )}
            
            {selectedPaymentMethod === 'wallet' && (
              <div className="payment-form wallet-payment">
                <h3>Digital Wallet</h3>
                <p>Select your wallet provider:</p>
                <div className="wallet-options">
                  <div className="wallet-option">
                    <div className="wallet-icon">📱</div>
                    <div className="wallet-name">Paytm</div>
                  </div>
                  <div className="wallet-option">
                    <div className="wallet-icon">📱</div>
                    <div className="wallet-name">PhonePe</div>
                  </div>
                  <div className="wallet-option">
                    <div className="wallet-icon">📱</div>
                    <div className="wallet-name">Google Pay</div>
                  </div>
                  <div className="wallet-option">
                    <div className="wallet-icon">📱</div>
                    <div className="wallet-name">Amazon Pay</div>
                  </div>
                </div>
              </div>
            )}
            
            {paymentStatus === 'failed' && (
              <div className="payment-error">
                <p>Payment failed. Please try again or use a different payment method.</p>
              </div>
            )}
            
            <button 
              className="pay-button"
              disabled={!selectedPaymentMethod || (selectedPaymentMethod === 'card' && (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv)) || (selectedPaymentMethod === 'upi' && !upiId) || isProcessing}
              onClick={handlePaymentSubmit}
            >
              {isProcessing ? (
                <div className="loading-spinner"></div>
              ) : (
                `Pay ₹${calculateTotalFare()}`
              )}
            </button>
          </>
        ) : paymentStatus === 'processing' ? (
          <div className="payment-processing">
            <div className="loading-spinner"></div>
            <h3>Processing Payment</h3>
            <p>Please do not close or refresh this page...</p>
          </div>
        ) : (
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h3>Payment Successful!</h3>
            <p>Your booking is confirmed. Redirecting to ticket details...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage; 