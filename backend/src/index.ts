import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import trainRoutes from './routes/trainRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/trains', trainRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Train Ticket Booking API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 