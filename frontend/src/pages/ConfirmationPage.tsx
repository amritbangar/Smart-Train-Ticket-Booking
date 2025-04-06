import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState<any>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state) {
      setTicketData(location.state);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatShortDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string): string => {
    return timeString; // In a real app, we might need to format this further
  };

  const handleDownloadTicket = () => {
    // In a real app, we would generate a proper PDF
    // For this demo, we'll just use print functionality
    window.print();
  };

  const handleBookAnother = () => {
    navigate('/');
  };

  if (!ticketData) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading ticket details...</p>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-header">
        <h1>Your Booking is Confirmed!</h1>
        <p>Thank you for booking with ExpressBook. Your e-ticket is ready.</p>
      </div>

      <div className="ticket-container" ref={ticketRef}>
        <div className="e-ticket">
          <div className="ticket-header">
            <div className="ticket-logo">
              <span className="logo-icon">🚆</span>
              <span className="logo-text">ExpressBook</span>
            </div>
            <div className="ticket-title">
              <h2>E-Ticket / Reservation Voucher</h2>
              <div className="ticket-status confirmed">CONFIRMED</div>
            </div>
            <div className="ticket-actions">
              <button onClick={handleDownloadTicket} className="download-button">
                <span className="download-icon">⬇️</span>
                <span>Download Ticket</span>
              </button>
            </div>
          </div>

          <div className="ticket-body">
            <div className="ticket-pnr-section">
              <div className="pnr-label">PNR</div>
              <div className="pnr-number">{ticketData.pnr}</div>
            </div>

            <div className="ticket-journey-section">
              <div className="train-info">
                <div className="train-name">{ticketData.train.name}</div>
                <div className="train-number">({ticketData.train.number})</div>
              </div>

              <div className="journey-visual">
                <div className="journey-station departure">
                  <div className="station-name">{ticketData.source}</div>
                  <div className="station-time">{formatTime(ticketData.train.departureTime)}</div>
                  <div className="station-date">{formatShortDate(ticketData.date)}</div>
                </div>

                <div className="journey-line-container">
                  <div className="journey-line">
                    <div className="journey-dot departure"></div>
                    <div className="journey-path"></div>
                    <div className="journey-dot arrival"></div>
                  </div>
                </div>

                <div className="journey-station arrival">
                  <div className="station-name">{ticketData.destination}</div>
                  <div className="station-time">{formatTime(ticketData.train.arrivalTime)}</div>
                  <div className="station-date">{formatShortDate(ticketData.date)}</div>
                </div>
              </div>

              <div className="journey-class">
                <span className="class-label">Class:</span>
                <span className="class-value">{ticketData.selectedClass.name} ({ticketData.selectedClass.type})</span>
              </div>
            </div>

            <div className="ticket-details-section">
              <div className="passenger-details">
                <h3>Passenger Information</h3>
                <table className="passenger-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Seat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticketData.passengers.map((passenger: any, index: number) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{passenger.name}</td>
                        <td>{passenger.age}</td>
                        <td>{passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1)}</td>
                        <td>
                          {ticketData.selectedSeats && ticketData.selectedSeats[index] ? (
                            `Coach ${ticketData.selectedSeats[index].coachName} / ${ticketData.selectedSeats[index].seatNumber}`
                          ) : 'Coach 1 / 1'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="payment-details">
                <h3>Payment Information</h3>
                <div className="payment-grid">
                  <div className="payment-item">
                    <div className="payment-label">Payment Method</div>
                    <div className="payment-value">{ticketData.paymentMethod}</div>
                  </div>
                  <div className="payment-item">
                    <div className="payment-label">Total Fare</div>
                    <div className="payment-value fare">₹{ticketData.totalFare}</div>
                  </div>
                  <div className="payment-item">
                    <div className="payment-label">Payment Date</div>
                    <div className="payment-value">{new Date(ticketData.paymentTimestamp).toLocaleString('en-US')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ticket-footer">
              <div className="barcode-section">
                <div className="barcode-graphic"></div>
                <div className="barcode-number">{ticketData.pnr}</div>
              </div>
              <div className="ticket-notes">
                <p>Please carry a printed copy or digital version of this ticket along with a valid ID proof during your journey.</p>
                <p className="disclaimer">This is a simulated ticket for demonstration purposes only.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="post-booking-actions">
        <button onClick={handleBookAnother} className="book-another-button">
          <span className="button-icon">🎟️</span>
          <span>Book Another Ticket</span>
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage; 