export interface TrainClass {
  type: string;
  name: string;
  fare: number;
  availability: number;
}

export interface Train {
  id: string;
  name: string;
  number: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  source: string;
  destination: string;
  date: string;
  availableClasses: TrainClass[];
}

// Mock train data
export const mockTrains: Train[] = [
  {
    id: '1',
    name: 'Shatabdi Express',
    number: '12046',
    departureTime: '06:00',
    arrivalTime: '12:30',
    duration: '6h 30m',
    source: 'Delhi',
    destination: 'Jalandhar',
    date: '2025-04-09',
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
    source: 'Delhi',
    destination: 'Jalandhar',
    date: '2025-04-09',
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
    source: 'Delhi',
    destination: 'Jalandhar',
    date: '2025-04-09',
    availableClasses: [
      { type: '1A', name: 'First Class AC', fare: 1900, availability: 8 },
      { type: '2A', name: 'Second Class AC', fare: 1250, availability: 35 },
      { type: '3A', name: 'Third Class AC', fare: 950, availability: 89 },
      { type: 'SL', name: 'Sleeper', fare: 420, availability: 156 }
    ]
  }
]; 