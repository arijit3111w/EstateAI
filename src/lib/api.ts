import axios from 'axios';
import { PropertyFeatures, PredictionResponse } from '@/types/property';

const API_BASE_URL = 'http://localhost:8000';

export const predictPrice = async (features: PropertyFeatures): Promise<PredictionResponse> => {
  const response = await axios.post<PredictionResponse>(
    `${API_BASE_URL}/predict`,
    features,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};
