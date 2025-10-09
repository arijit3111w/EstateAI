import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PredictionResponse, PropertyFeatures } from '@/types/property';

interface RelatedHouse {
  id: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  living_area: number;
  grade: number;
  condition: number;
  latitude: number;
  longitude: number;
  location: string;
  area: number;
  built_year?: number;
  postal_code?: string;
}

interface PredictionContextType {
  prediction: PredictionResponse | null;
  formData: PropertyFeatures | null;
  relatedHouses: RelatedHouse[];
  isLoadingRelatedHouses: boolean;
  predictionKey: string;
  setPrediction: (prediction: PredictionResponse | null) => void;
  setFormData: (formData: PropertyFeatures | null) => void;
  setRelatedHouses: (houses: RelatedHouse[]) => void;
  setIsLoadingRelatedHouses: (loading: boolean) => void;
  clearPredictionData: () => void;
  hasPredictionData: boolean;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (context === undefined) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};

interface PredictionProviderProps {
  children: ReactNode;
}

export const PredictionProvider: React.FC<PredictionProviderProps> = ({ children }) => {
  const [prediction, setPredictionState] = useState<PredictionResponse | null>(null);
  const [formData, setFormDataState] = useState<PropertyFeatures | null>(null);
  const [relatedHouses, setRelatedHousesState] = useState<RelatedHouse[]>([]);
  const [isLoadingRelatedHouses, setIsLoadingRelatedHousesState] = useState(false);
  const [predictionKey, setPredictionKey] = useState<string>('');

  const setPrediction = (newPrediction: PredictionResponse | null) => {
    setPredictionState(newPrediction);
    if (newPrediction) {
      // Generate a new key when prediction is set
      setPredictionKey(Date.now().toString());
      // Clear related houses for new prediction
      setRelatedHousesState([]);
    }
  };

  const setFormData = (newFormData: PropertyFeatures | null) => {
    setFormDataState(newFormData);
  };

  const setRelatedHouses = (houses: RelatedHouse[]) => {
    setRelatedHousesState(houses);
    setIsLoadingRelatedHousesState(false);
  };

  const setIsLoadingRelatedHouses = (loading: boolean) => {
    setIsLoadingRelatedHousesState(loading);
  };

  const clearPredictionData = () => {
    setPredictionState(null);
    setFormDataState(null);
    setRelatedHousesState([]);
    setIsLoadingRelatedHousesState(false);
    setPredictionKey('');
  };

  const hasPredictionData = prediction !== null && formData !== null;

  const value: PredictionContextType = {
    prediction,
    formData,
    relatedHouses,
    isLoadingRelatedHouses,
    predictionKey,
    setPrediction,
    setFormData,
    setRelatedHouses,
    setIsLoadingRelatedHouses,
    clearPredictionData,
    hasPredictionData,
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};