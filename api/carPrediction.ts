import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface PredictionRequest {
  brand: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
}

export interface PredictionResponse {
  predicted_price: number;
  car_name: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
}

export const predictCarPrice = async (data: PredictionRequest): Promise<PredictionResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/predict`, data);
    return response.data;
  } catch (error) {
    console.error('Error predicting car price:', error);
    throw error;
  }
};