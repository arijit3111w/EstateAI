import axios from 'axios';
import { PropertyFeatures, PredictionResponse, DetailedPropertyData } from '@/types/property';

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

// Function to fetch and parse CSV data
export const fetchPropertyDetails = async (propertyId: string): Promise<DetailedPropertyData | null> => {
  try {
    const response = await fetch('/data/House_Price_India.csv');
    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = line.split(',');
      if (columns.length < 23) continue;
      
      const currentId = columns[0];
      if (currentId === propertyId) {
        return {
          id: columns[0],
          date: columns[1],
          number_of_bedrooms: parseInt(columns[2]) || 0,
          number_of_bathrooms: parseFloat(columns[3]) || 0,
          living_area: parseInt(columns[4]) || 0,
          lot_area: parseInt(columns[5]) || 0,
          number_of_floors: parseFloat(columns[6]) || 0,
          waterfront_present: parseInt(columns[7]) || 0,
          number_of_views: parseInt(columns[8]) || 0,
          condition_of_house: parseInt(columns[9]) || 0,
          grade_of_house: parseInt(columns[10]) || 0,
          area_excluding_basement: parseInt(columns[11]) || 0,
          area_of_basement: parseInt(columns[12]) || 0,
          built_year: parseInt(columns[13]) || 0,
          renovation_year: parseInt(columns[14]) || 0,
          postal_code: parseInt(columns[15]) || 0,
          latitude: parseFloat(columns[16]) || 0,
          longitude: parseFloat(columns[17]) || 0,
          living_area_renov: parseInt(columns[18]) || 0,
          lot_area_renov: parseInt(columns[19]) || 0,
          number_of_schools_nearby: parseInt(columns[20]) || 0,
          distance_from_airport: parseFloat(columns[21]) || 0,
          price: parseInt(columns[22]) || 0,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching property details:', error);
    return null;
  }
};

// Function to fetch property details by coordinates (for map markers)
export const fetchPropertyDetailsByCoords = async (latitude: number, longitude: number): Promise<DetailedPropertyData | null> => {
  try {
    const response = await fetch('/data/House_Price_India.csv');
    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = line.split(',');
      if (columns.length < 23) continue;
      
      const lat = parseFloat(columns[16]);
      const lng = parseFloat(columns[17]);
      
      // Check if coordinates match (with small tolerance for floating point comparison)
      if (Math.abs(lat - latitude) < 0.0001 && Math.abs(lng - longitude) < 0.0001) {
        return {
          id: columns[0],
          date: columns[1],
          number_of_bedrooms: parseInt(columns[2]) || 0,
          number_of_bathrooms: parseFloat(columns[3]) || 0,
          living_area: parseInt(columns[4]) || 0,
          lot_area: parseInt(columns[5]) || 0,
          number_of_floors: parseFloat(columns[6]) || 0,
          waterfront_present: parseInt(columns[7]) || 0,
          number_of_views: parseInt(columns[8]) || 0,
          condition_of_house: parseInt(columns[9]) || 0,
          grade_of_house: parseInt(columns[10]) || 0,
          area_excluding_basement: parseInt(columns[11]) || 0,
          area_of_basement: parseInt(columns[12]) || 0,
          built_year: parseInt(columns[13]) || 0,
          renovation_year: parseInt(columns[14]) || 0,
          postal_code: parseInt(columns[15]) || 0,
          latitude: lat,
          longitude: lng,
          living_area_renov: parseInt(columns[18]) || 0,
          lot_area_renov: parseInt(columns[19]) || 0,
          number_of_schools_nearby: parseInt(columns[20]) || 0,
          distance_from_airport: parseFloat(columns[21]) || 0,
          price: parseInt(columns[22]) || 0,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching property details by coordinates:', error);
    return null;
  }
};
