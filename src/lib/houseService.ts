// Service to fetch house data from CSV database
interface HouseData {
  id: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  living_area: number;
  lot_area: number;
  built_year: number;
  grade: number;
  condition: number;
  latitude: number;
  longitude: number;
  waterfront: number;
  views: number;
  schools_nearby: number;
  distance_from_airport: number;
}

let csvDataCache: HouseData[] | null = null;

// Function to load and parse CSV data
export const loadHouseData = async (): Promise<HouseData[]> => {
  if (csvDataCache) {
    return csvDataCache;
  }

  try {
    const response = await fetch('/data/House_Price_India.csv');
    const csvText = await response.text();
    
    // Parse CSV data
    const lines = csvText.split('\n');
    const houses: HouseData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= 23) { // Ensure we have all required columns
        const house: HouseData = {
          id: values[0],
          price: parseFloat(values[22]) || 0,
          bedrooms: parseFloat(values[2]) || 0,
          bathrooms: parseFloat(values[3]) || 0,
          living_area: parseFloat(values[4]) || 0,
          lot_area: parseFloat(values[5]) || 0,
          built_year: parseFloat(values[13]) || 0,
          grade: parseFloat(values[10]) || 0,
          condition: parseFloat(values[9]) || 0,
          latitude: parseFloat(values[16]) || 0,
          longitude: parseFloat(values[17]) || 0,
          waterfront: parseFloat(values[7]) || 0,
          views: parseFloat(values[8]) || 0,
          schools_nearby: parseFloat(values[20]) || 0,
          distance_from_airport: parseFloat(values[21]) || 0,
        };
        
        // Filter out invalid entries
        if (house.price > 0 && house.id) {
          houses.push(house);
        }
      }
    }
    
    csvDataCache = houses;
    return houses;
  } catch (error) {
    console.error('Error loading house data:', error);
    return [];
  }
};

// Function to get a house by ID
export const getHouseById = async (houseId: string): Promise<HouseData | null> => {
  const houses = await loadHouseData();
  return houses.find(house => house.id === houseId) || null;
};

// Function to get multiple houses by IDs
export const getHousesByIds = async (houseIds: string[]): Promise<HouseData[]> => {
  const houses = await loadHouseData();
  return houses.filter(house => houseIds.includes(house.id));
};

// Function to get recommended houses (random sample for demo)
export const getRecommendedHouses = async (limit: number = 10): Promise<HouseData[]> => {
  const houses = await loadHouseData();
  
  // Filter for Calgary area and reasonable prices
  const calgaryHouses = houses.filter(house => 
    house.latitude > 50 && house.latitude < 55 && 
    house.longitude > -120 && house.longitude < -110 &&
    house.price > 100000 && house.price < 2000000
  );
  
  // Return random sample
  const shuffled = calgaryHouses.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
};