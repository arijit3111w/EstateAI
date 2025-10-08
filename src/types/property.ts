export interface PropertyFeatures {
  living_area: number;
  lot_area: number;
  number_of_bedrooms: number;
  number_of_bathrooms: number;
  grade_of_house: number;
  area_excluding_basement: number;
  area_of_basement: number;
  postal_code: number;
  lattitude: number;
  longitude: number;
  number_of_views: number;
  waterfront_present: number;
  condition_of_house: number;
  built_year: number;
  renovation_year: number;
  number_of_schools_nearby: number;
  distance_from_airport: number;
}

export interface PredictionResponse {
  predicted_price: number;
  formatted_price: string;
  confidence_score: number;
  model_accuracy: number;
  market_analysis: {
    price_range: string;
    location_rating: string;
    property_grade: string;
    investment_advice: string;
    luxury_score: number;
    location_desirability: number;
  };
  feature_insights: {
    luxury_score: number;
    size_factor: string;
    location_premium: number;
    key_value_drivers: string[];
    engineered_features_count: number;
    prediction_accuracy: string;
  };
}

export interface PropertyData {
  id: string;
  price: number;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  living_area: number;
  grade: number;
}
