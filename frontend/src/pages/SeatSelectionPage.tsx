import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  position: 'lower' | 'middle' | 'upper' | 'side-lower' | 'side-upper';
}

interface Coach {
  id: string;
  name: string;
  seats: Seat[];
}

const SeatSelectionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state) {
      setBookingData(location.state);
      generateCoaches(location.state);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  // Generate mock coaches with seats based on the selected class
  const generateCoaches = (data: any) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const classType = data.selectedClass.type;
      let numberOfCoaches = 0;
      let seatsPerCoach = 0;
      
      // Determine coach parameters based on class type
      switch (classType) {
        case '1A': // First AC
          numberOfCoaches = 2;
          seatsPerCoach = 24; // 4 cabins, 2-4 berths each
          break;
        case '2A': // Second AC
          numberOfCoaches = 3;
          seatsPerCoach = 48; // 12 cabins, 4 berths each
          break;
        case '3A': // Third AC
          numberOfCoaches = 4;
          seatsPerCoach = 64; // 16 cabins, 6 berths each 
          break;
        case 'SL': // Sleeper
          numberOfCoaches = 6;
          seatsPerCoach = 72; // 18 cabins, 8 berths each
          break;
        default:
          numberOfCoaches = 3;
          seatsPerCoach = 48;
      }
      
      // Generate coaches
      const generatedCoaches: Coach[] = [];
      
      for (let c = 0; c < numberOfCoaches; c++) {
        const coachId = `${classType}-${c + 1}`;
        const seats: Seat[] = [];
        
        // Generate seats for each coach
        for (let s = 0; s < seatsPerCoach; s++) {
          const seatNumber = `${s + 1}`;
          
          // Determine berth position based on seat number
          let position: Seat['position'] = 'lower';
          
          if (classType === '1A') {
            // 1AC has Lower and Upper berths with cabins
            position = s % 4 < 2 ? 'lower' : 'upper';
          } else if (classType === '2A' || classType === '3A') {
            // 2AC and 3AC have Side berths too
            const mod = s % 8;
            if (mod === 0 || mod === 3) position = 'lower';
            else if (mod === 1 || mod === 4) position = 'middle';
            else if (mod === 2 || mod === 5) position = 'upper';
            else if (mod === 6) position = 'side-lower';
            else position = 'side-upper';
          } else {
            // Sleeper class
            const mod = s % 8;
            if (mod === 0 || mod === 3) position = 'lower';
            else if (mod === 1 || mod === 4) position = 'middle';
            else if (mod === 2 || mod === 5) position = 'upper';
            else if (mod === 6) position = 'side-lower';
            else position = 'side-upper';
          }
          
          // Random availability (70-80% seats available)
          const isAvailable = Math.random() > 0.25;
          
          seats.push({
            id: `${coachId}-${seatNumber}`,
            number: seatNumber,
            isAvailable,
            position
          });
        }
        
        generatedCoaches.push({
          id: coachId,
          name: `Coach ${c + 1}`,
          seats
        });
      }
      
      setCoaches(generatedCoaches);
      if (generatedCoaches.length > 0) {
        setSelectedCoach(generatedCoaches[0]);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleCoachSelect = (coach: Coach) => {
    setSelectedCoach(coach);
  };

  const handleSeatSelect = (seatId: string, isAvailable: boolean) => {
    if (!isAvailable) return; // Don't allow selecting unavailable seats
    
    // Check if we already have enough seats selected
    if (selectedSeats.includes(seatId)) {
      // Deselect the seat
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else if (selectedSeats.length < (bookingData?.passengers.length || 1)) {
      // Select the seat
      setSelectedSeats([...selectedSeats, seatId]);
    } else {
      // Replace the first selected seat
      setSelectedSeats([...selectedSeats.slice(1), seatId]);
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length === (bookingData?.passengers.length || 0)) {
      const selectedSeatsDetails = selectedSeats.map(seatId => {
        const [coachId, seatNumber] = seatId.split('-').slice(-2);
        const coach = coaches.find(c => c.id === coachId) || coaches[0];
        const seat = coach.seats.find(s => s.id === seatId);
        
        return {
          id: seatId,
          coachName: coach.name,
          seatNumber,
          position: seat?.position
        };
      });
      
      navigate('/payment', { 
        state: { 
          ...bookingData,
          selectedSeats: selectedSeatsDetails
        } 
      });
    } else {
      alert(`Please select ${bookingData?.passengers.length} seats to proceed.`);
    }
  };

  if (isLoading || !bookingData) {
    return <div className="loading">Loading seat availability...</div>;
  }

  // Group seats into rows of 8 (standard Indian Railways coach layout)
  const groupedSeats = selectedCoach ? 
    Array.from({ length: Math.ceil(selectedCoach.seats.length / 8) }, (_, i) => 
      selectedCoach.seats.slice(i * 8, i * 8 + 8)
    ) : [];

  return (
    <div className="seat-selection-page">
      <div className="card">
        <h2>Select Seats</h2>
        
        <div className="booking-summary">
          <p><strong>Train:</strong> {bookingData.train.name} ({bookingData.train.number})</p>
          <p><strong>Class:</strong> {bookingData.selectedClass.name} ({bookingData.selectedClass.type})</p>
          <p><strong>Passengers:</strong> {bookingData.passengers.length}</p>
        </div>
        
        <div className="coach-selector">
          <h3>Select Coach</h3>
          <div className="coach-list">
            {coaches.map(coach => (
              <button
                key={coach.id}
                className={`coach-btn ${selectedCoach?.id === coach.id ? 'selected' : ''}`}
                onClick={() => handleCoachSelect(coach)}
              >
                {coach.name}
              </button>
            ))}
          </div>
        </div>
        
        {selectedCoach && (
          <div className="seat-map">
            <h3>Seat Map - {selectedCoach.name}</h3>
            <div className="seat-map-legend">
              <div className="legend-item">
                <div className="seat-icon available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="seat-icon unavailable"></div>
                <span>Booked</span>
              </div>
              <div className="legend-item">
                <div className="seat-icon selected"></div>
                <span>Selected</span>
              </div>
            </div>
            
            <div className="coach-layout">
              {groupedSeats.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="seat-row">
                  {/* First set of seats (Lower, Middle, Upper) */}
                  <div className="seat-group">
                    {row.slice(0, 3).map(seat => (
                      <div
                        key={seat.id}
                        className={`seat ${seat.position} ${
                          !seat.isAvailable 
                            ? 'unavailable' 
                            : selectedSeats.includes(seat.id)
                              ? 'selected'
                              : 'available'
                        }`}
                        onClick={() => handleSeatSelect(seat.id, seat.isAvailable)}
                      >
                        <span className="seat-number">{seat.number}</span>
                        <span className="seat-position">
                          {seat.position === 'lower' && 'L'}
                          {seat.position === 'middle' && 'M'}
                          {seat.position === 'upper' && 'U'}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Aisle */}
                  <div className="aisle"></div>
                  
                  {/* Second set of seats (Lower, Middle, Upper) */}
                  <div className="seat-group">
                    {row.slice(3, 6).map(seat => (
                      <div
                        key={seat.id}
                        className={`seat ${seat.position} ${
                          !seat.isAvailable 
                            ? 'unavailable' 
                            : selectedSeats.includes(seat.id)
                              ? 'selected'
                              : 'available'
                        }`}
                        onClick={() => handleSeatSelect(seat.id, seat.isAvailable)}
                      >
                        <span className="seat-number">{seat.number}</span>
                        <span className="seat-position">
                          {seat.position === 'lower' && 'L'}
                          {seat.position === 'middle' && 'M'}
                          {seat.position === 'upper' && 'U'}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Side berths */}
                  <div className="seat-group side">
                    {row.slice(6, 8).map(seat => seat && (
                      <div
                        key={seat.id}
                        className={`seat ${seat.position} ${
                          !seat.isAvailable 
                            ? 'unavailable' 
                            : selectedSeats.includes(seat.id)
                              ? 'selected'
                              : 'available'
                        }`}
                        onClick={() => handleSeatSelect(seat.id, seat.isAvailable)}
                      >
                        <span className="seat-number">{seat.number}</span>
                        <span className="seat-position">
                          {seat.position === 'side-lower' && 'SL'}
                          {seat.position === 'side-upper' && 'SU'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="selected-seats-info">
          <h3>Selected Seats ({selectedSeats.length}/{bookingData.passengers.length})</h3>
          {selectedSeats.length > 0 ? (
            <ul className="selected-seats-list">
              {selectedSeats.map((seatId, index) => {
                const [coachId, seatNumber] = seatId.split('-').slice(-2);
                const coach = coaches.find(c => c.id === coachId) || coaches[0];
                const seat = coach.seats.find(s => s.id === seatId);
                const passenger = bookingData.passengers[index];
                
                return (
                  <li key={seatId} className="selected-seat-item">
                    <div className="seat-info">
                      <span className="coach">{coach.name}</span>
                      <span className="seat-number">Seat {seatNumber}</span>
                      <span className="position">
                        ({seat?.position === 'lower' && 'Lower'}
                        {seat?.position === 'middle' && 'Middle'}
                        {seat?.position === 'upper' && 'Upper'}
                        {seat?.position === 'side-lower' && 'Side Lower'}
                        {seat?.position === 'side-upper' && 'Side Upper'})
                      </span>
                    </div>
                    {passenger && (
                      <div className="passenger-info">
                        for {passenger.name}, {passenger.age}, {passenger.gender}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="no-seats-message">Please select {bookingData.passengers.length} seats to proceed</p>
          )}
        </div>
        
        <button 
          className="proceed-btn"
          disabled={selectedSeats.length !== bookingData.passengers.length}
          onClick={handleProceed}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default SeatSelectionPage; 