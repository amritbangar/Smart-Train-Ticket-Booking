import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface TravelQuery {
  source: string;
  destination: string;
  date: string;
}

interface Train {
  id: string;
  name: string;
  number: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  availableClasses: TrainClass[];
}

interface TrainClass {
  type: string;
  name: string;
  fare: number;
  availability: number;
}

const SearchTrainsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [travelQuery, setTravelQuery] = useState<TravelQuery>({
    source: '',
    destination: '',
    date: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [trains, setTrains] = useState<Train[]>([]);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');

  useEffect(() => {
    if (location.state as TravelQuery) {
      setTravelQuery(location.state as TravelQuery);
      // In a real app, this would be an API call
      fetchTrains(location.state as TravelQuery);
    }
  }, [location.state]);

  const fetchTrains = (query: TravelQuery) => {
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Mock data for trains - in a real app, this would come from an API
      const mockTrains: Train[] = [
        {
          id: '1',
          name: 'Shatabdi Express',
          number: '12046',
          departureTime: '06:00',
          arrivalTime: '12:30',
          duration: '6h 30m',
          availableClasses: [
            { type: '1A', name: 'First Class AC', fare: 2200, availability: 12 },
            { type: '2A', name: 'Second Class AC', fare: 1500, availability: 45 },
            { type: '3A', name: 'Third Class AC', fare: 1100, availability: 110 }
          ]
        },
        {
          id: '2',
          name: 'Rajdhani Express',
          number: '12430',
          departureTime: '16:35',
          arrivalTime: '22:15',
          duration: '5h 40m',
          availableClasses: [
            { type: '2A', name: 'Second Class AC', fare: 1350, availability: 22 },
            { type: '3A', name: 'Third Class AC', fare: 980, availability: 58 },
            { type: 'SL', name: 'Sleeper', fare: 480, availability: 210 }
          ]
        },
        {
          id: '3',
          name: 'Punjab Mail',
          number: '12138',
          departureTime: '19:20',
          arrivalTime: '02:45',
          duration: '7h 25m',
          availableClasses: [
            { type: '1A', name: 'First Class AC', fare: 1900, availability: 8 },
            { type: '2A', name: 'Second Class AC', fare: 1250, availability: 35 },
            { type: '3A', name: 'Third Class AC', fare: 950, availability: 89 },
            { type: 'SL', name: 'Sleeper', fare: 420, availability: 156 }
          ]
        }
      ];
      
      setTrains(mockTrains);
      setIsLoading(false);
    }, 1500);
  };

  const handleTrainSelect = (train: Train) => {
    setSelectedTrain(train);
    setSelectedClass(''); // Reset selected class when changing trains
  };

  const handleClassSelect = (classType: string) => {
    setSelectedClass(classType);
  };

  const handleProceed = () => {
    if (selectedTrain && selectedClass) {
      const selectedClassDetails = selectedTrain.availableClasses.find(c => c.type === selectedClass);
      
      navigate('/passenger-details', { 
        state: { 
          ...travelQuery,
          train: selectedTrain,
          selectedClass: selectedClassDetails
        } 
      });
    }
  };

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

  return (
    <div className="search-trains-page">
      <div className="card">
        <h2>Available Trains</h2>
        <div className="search-details">
          <div className="journey-info">
            <div className="journey-stations">
              <h3>{travelQuery.source} → {travelQuery.destination}</h3>
            </div>
            <div className="journey-date">
              {formatDate(travelQuery.date)}
            </div>
          </div>
          <button className="modify-search-btn" onClick={() => navigate('/')}>
            Modify Search
          </button>
        </div>
        
        {isLoading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Searching for trains...</p>
          </div>
        ) : (
          <div className="train-list">
            {trains.length > 0 ? (
              trains.map(train => (
                <div 
                  key={train.id} 
                  className={`train-card ${selectedTrain?.id === train.id ? 'selected' : ''}`}
                  onClick={() => handleTrainSelect(train)}
                >
                  <div className="train-header">
                    <div className="train-name">
                      <h3>{train.name}</h3>
                      <span className="train-number">{train.number}</span>
                    </div>
                    <div className="train-badges">
                      <span className="badge available">Available</span>
                      <span className="badge on-time">On Time</span>
                    </div>
                  </div>
                  
                  <div className="train-journey">
                    <div className="journey-point departure">
                      <div className="time">{train.departureTime}</div>
                      <div className="station">{travelQuery.source}</div>
                    </div>
                    
                    <div className="journey-duration">
                      <div className="duration-line">
                        <div className="dot start"></div>
                        <div className="line"></div>
                        <div className="dot end"></div>
                      </div>
                      <div className="duration-text">{train.duration}</div>
                    </div>
                    
                    <div className="journey-point arrival">
                      <div className="time">{train.arrivalTime}</div>
                      <div className="station">{travelQuery.destination}</div>
                    </div>
                  </div>
                  
                  {selectedTrain?.id === train.id && (
                    <div className="class-selection">
                      <h4>Select Class:</h4>
                      <div className="class-options">
                        {train.availableClasses.map(cls => (
                          <div 
                            key={cls.type}
                            className={`class-option ${selectedClass === cls.type ? 'selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClassSelect(cls.type);
                            }}
                          >
                            <div className="class-details">
                              <div className="class-type-badge">{cls.type}</div>
                              <div className="class-name">{cls.name}</div>
                              <div className="class-availability">
                                <span className={cls.availability > 20 ? 'high' : cls.availability > 5 ? 'medium' : 'low'}>
                                  {cls.availability} seats available
                                </span>
                              </div>
                            </div>
                            <div className="class-fare">
                              <div className="fare-amount">₹{cls.fare}</div>
                              <div className="fare-label">per person</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedTrain?.id === train.id && selectedClass && (
                    <div className="booking-actions">
                      <button 
                        className="proceed-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProceed();
                        }}
                      >
                        Proceed to Passenger Details
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-trains">
                <p>No trains found for this route and date. Please try different options.</p>
                <button onClick={() => navigate('/')}>Modify Search</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTrainsPage; 