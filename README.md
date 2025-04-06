# AI-Powered Train Ticket Booking System

A full-stack application that simulates an AI-powered train ticket booking system with natural language processing capabilities.

## Features

- **Natural Language Booking**: Simply tell the system where you want to go, and it will understand and process your request.
- **Real-time Train Search**: Search for trains between stations with real-time availability (simulated).
- **Passenger Management**: Add multiple passengers with a simple interface or using natural language.
- **Seat Selection**: Interactive coach and seat selection interface.
- **Payment Integration**: Multiple payment method options (simulated).
- **E-Ticket Generation**: Complete e-ticket with all booking details.

## Project Structure

- **Frontend**: React application with TypeScript
  - Components, pages, and services for the user interface
  - Natural language processing for booking intent
  
- **Backend**: Node.js application with Express and TypeScript
  - API routes for train search, booking, and payment processing
  - Integration with external services (simulated)

## How It Works

1. **User Input**: The user provides natural language input like "I want to travel from Delhi to Jalandhar on 2025-04-09"
2. **NLP Processing**: The system extracts source, destination, and date information
3. **Passenger Details**: The user can add passengers using natural language or forms
4. **Train & Class Selection**: The system shows available trains and seat classes
5. **Seat Selection**: Interactive seat selection interface
6. **Payment**: Multiple payment options with secure processing
7. **Confirmation**: E-ticket generation with PNR and all booking details

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/train-ticket-booking.git
cd train-ticket-booking
```

2. Install frontend dependencies
```
cd frontend
npm install
```

3. Install backend dependencies
```
cd ../backend
npm install
```

4. Start the frontend development server
```
cd ../frontend
npm start
```

5. Start the backend server
```
cd ../backend
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Technology Stack

- **Frontend**: React, TypeScript, React Router
- **Backend**: Node.js, Express, TypeScript
- **State Management**: React Hooks
- **Styling**: CSS3
- **API Communication**: Axios

## Future Enhancements

- Integration with real train data APIs
- Advanced AI for understanding complex travel requests
- Multi-language support
- User accounts and booking history
- Mobile application with offline ticket access

## License

This project is licensed under the MIT License - see the LICENSE file for details. 