import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface PredictionRequest {
  brand: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  userId?: number;
}

export interface PredictionResponse {
  predicted_price: number;
  car_name: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  req_id?: number; 
  val_id?: number;
}

export const predictCarPrice = async (data: PredictionRequest): Promise<PredictionResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/predict`, data);
    const predictionResult = response.data;

    if (data.userId) {
      try {
        console.log('Saving valuation to database:', {
          userId: data.userId,
          brand: data.brand,
          model: data.model,
          trim: data.trim,
          year: data.year,
          mileage: data.mileage,
          estimatedPrice: predictionResult.predicted_price
        });

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
            year: Number(data.year), 
            mileage: Number(data.mileage), 
            estimatedPrice: Number(predictionResult.predicted_price) 
          }),
        });

        if (saveResponse.ok) {
          const saveResult = await saveResponse.json();
          predictionResult.req_id = saveResult.data.req_id;
          predictionResult.val_id = saveResult.data.val_id;
          console.log('Valuation saved to database successfully:', saveResult);
        } else {
          const errorText = await saveResponse.text();
          console.error('Failed to save valuation to database:', errorText);
        }
      } catch (saveError) {
        console.error('Error saving valuation to database:', saveError);
      }
    }

    return predictionResult;
  } catch (error) {
    console.error('Error predicting car price:', error);
    throw error;
  }
};