import express from 'express';
import { getAllTrains, searchTrains, getTrainById } from '../controllers/trainController';

const router = express.Router();

// Get all trains
router.get('/', getAllTrains);

// Search trains
router.get('/search', searchTrains);

// Get train by ID
router.get('/:id', getTrainById);

export default router; 