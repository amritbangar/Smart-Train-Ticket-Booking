import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="App-header">
      <h1>AI-Powered Train Ticket Booking</h1>
      <nav className="App-nav">
        <Link to="/">Home</Link>
        <Link to="/search">Search Trains</Link>
      </nav>
    </header>
  );
};

export default Header; 