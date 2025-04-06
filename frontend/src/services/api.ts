import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Train API calls
export const TrainAPI = {
  // Get all trains
  getAllTrains: async () => {
    try {
      const response = await api.get('/trains');
      return response.data;
    } catch (error) {
      console.error('Error fetching trains:', error);
      throw error;
    }
  },
  
  // Search trains by source, destination, and date
  searchTrains: async (source: string, destination: string, date: string) => {
    try {
      const response = await api.get('/trains/search', {
        params: { source, destination, date }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching trains:', error);
      throw error;
    }
  },
  
  // Get train by ID
  getTrainById: async (id: string) => {
    try {
      const response = await api.get(`/trains/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching train with ID ${id}:`, error);
      throw error;
    }
  }
};

// Booking API calls
export const BookingAPI = {
  // Create a booking
  createBooking: async (bookingData: any) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  
  // Get booking by ID
  getBookingById: async (id: string) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking with ID ${id}:`, error);
      throw error;
    }
  }
};

// Payment API calls
export const PaymentAPI = {
  // Process payment
  processPayment: async (paymentData: any) => {
    try {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }
};

export default api; 