import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface PredictionRequest {
  brand: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  userId?: number; // Add optional userId
}

export interface PredictionResponse {
  predicted_price: number;
  car_name: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  req_id?: number; // Add optional req_id for database tracking
  val_id?: number; // Add optional val_id for database tracking
}

export const predictCarPrice = async (data: PredictionRequest): Promise<PredictionResponse> => {
  try {
    // Call ML API for prediction
    const response = await axios.post(`${API_BASE_URL}/api/predict`, data);
    const predictionResult = response.data;

    // If userId is provided, save to database
    if (data.userId) {
      try {
        const saveResponse = await fetch('/api/valuation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: data.userId,
            brand: data.brand,
            model: data.model,
            trim: data.trim,
            year: data.year,
            mileage: data.mileage,
            estimatedPrice: predictionResult.predicted_price
          }),
        });

        if (saveResponse.ok) {
          const saveResult = await saveResponse.json();
          predictionResult.req_id = saveResult.data.req_id;
          predictionResult.val_id = saveResult.data.val_id;
          console.log('Valuation saved to database');
        }
      } catch (saveError) {
        console.error('Error saving valuation to database:', saveError);
        // Don't throw error here - prediction still worked
      }
    }

    return predictionResult;
  } catch (error) {
    console.error('Error predicting car price:', error);
    throw error;
  }
};