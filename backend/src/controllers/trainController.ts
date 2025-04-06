import { Request, Response } from 'express';
import { mockTrains, Train } from '../models/Train';

// Get all trains
export const getAllTrains = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json(mockTrains);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving trains', error });
  }
};

// Search trains by source, destination, and date
export const searchTrains = async (req: Request, res: Response): Promise<void> => {
  try {
    const { source, destination, date } = req.query;
    
    if (!source || !destination || !date) {
      res.status(400).json({ message: 'Source, destination, and date are required' });
      return;
    }
    
    // Filter trains that match the search criteria
    const filteredTrains = mockTrains.filter(train => 
      train.source.toLowerCase() === (source as string).toLowerCase() &&
      train.destination.toLowerCase() === (destination as string).toLowerCase() &&
      train.date === date
    );
    
    // Simulate a delay for the API call
    setTimeout(() => {
      res.status(200).json(filteredTrains);
    }, 1000);
  } catch (error) {
    res.status(500).json({ message: 'Error searching trains', error });
  }
};

// Get train by ID
export const getTrainById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const train = mockTrains.find(train => train.id === id);
    
    if (!train) {
      res.status(404).json({ message: 'Train not found' });
      return;
    }
    
    res.status(200).json(train);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving train', error });
  }
}; 