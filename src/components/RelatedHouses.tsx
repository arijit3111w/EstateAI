import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Bath, Bed, Calendar, DollarSign, Eye } from 'lucide-react';
import PropertyMap from './PropertyMap';
import PropertyDetails from './PropertyDetails';
import FavoriteButton from './FavoriteButton';
import { fetchPropertyDetails, fetchPropertyDetailsByCoords } from '@/lib/api';
import { DetailedPropertyData } from '@/types/property';
import { usePrediction } from '@/contexts/PredictionContext';
import { useLanguage } from '@/contexts/LanguageContext';

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
  similarity?: number;
}

interface RelatedHousesProps {
  targetPrice: number;
  targetFeatures: {
    bedrooms: number;
    bathrooms: number;
    living_area: number;
    grade: number;
    condition: number;
    latitude: number;
    longitude: number;
  };
}

const RelatedHouses = ({ targetPrice, targetFeatures }: RelatedHousesProps) => {
  const { t } = useLanguage();
  const { 
    setRelatedHouses: setContextRelatedHouses, 
    relatedHouses: contextRelatedHouses,
    isLoadingRelatedHouses,
    setIsLoadingRelatedHouses
  } = usePrediction();
  const [relatedHouses, setRelatedHouses] = useState<HouseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [openPopupId, setOpenPopupId] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<DetailedPropertyData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    // If we already have related houses in context, use them instead of fetching
    if (contextRelatedHouses.length > 0) {
      const convertedHouses = contextRelatedHouses.map(house => ({
        id: house.id,
        price: house.price,
        bedrooms: house.bedrooms,
        bathrooms: house.bathrooms,
        living_area: house.living_area,
        lot_area: house.area || house.living_area,
        built_year: house.built_year || 2000,
        grade: house.grade,
        condition: house.condition,
        latitude: house.latitude,
        longitude: house.longitude,
        waterfront: 0,
        views: 0,
        schools_nearby: 0,
        distance_from_airport: 0,
        similarity: 0.9
      }));
      setRelatedHouses(convertedHouses);
      setLoading(false);
      return;
    }

    // If already loading, don't start another fetch
    if (isLoadingRelatedHouses) {
      return;
    }

    // Only fetch if we don't have related houses in context
    const fetchRelatedHouses = async () => {
      try {
        setIsLoadingRelatedHouses(true);
        setLoading(true);
        const response = await fetch('/data/House_Price_India.csv');
        const csvText = await response.text();
        
        // Parse CSV data
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        const houses: HouseData[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= headers.length) {
            const house: HouseData = {
              id: values[0],
              price: parseFloat(values[22]) || 0, // Price is last column
              bedrooms: parseFloat(values[2]) || 0,
              bathrooms: parseFloat(values[3]) || 0,
              living_area: parseFloat(values[4]) || 0,
              lot_area: parseFloat(values[5]) || 0,
              built_year: parseFloat(values[13]) || 0,
              grade: parseFloat(values[10]) || 0,
              condition: parseFloat(values[9]) || 0,
              latitude: parseFloat(values[16]) || 0, // Correct latitude column
              longitude: parseFloat(values[17]) || 0, // Correct longitude column
              waterfront: parseFloat(values[7]) || 0,
              views: parseFloat(values[8]) || 0,
              schools_nearby: parseFloat(values[20]) || 0,
              distance_from_airport: parseFloat(values[21]) || 0,
            };
            
            // Filter out invalid entries and ensure Calgary area coordinates
            if (house.price > 0 && 
                house.latitude > 50 && house.latitude < 55 && 
                house.longitude > -120 && house.longitude < -110) {
              houses.push(house);
            }
          }
        }
        
        // Find similar houses using a scoring algorithm
        const scoredHouses = houses.map(house => {
          let score = 0;
          
          // Price similarity (40% weight)
          const priceDiff = Math.abs(house.price - targetPrice) / targetPrice;
          score += (1 - Math.min(priceDiff, 1)) * 0.4;
          
          // Bedroom similarity (15% weight)
          const bedroomDiff = Math.abs(house.bedrooms - targetFeatures.bedrooms);
          score += (1 - Math.min(bedroomDiff / 3, 1)) * 0.15;
          
          // Bathroom similarity (10% weight)
          const bathroomDiff = Math.abs(house.bathrooms - targetFeatures.bathrooms);
          score += (1 - Math.min(bathroomDiff / 2, 1)) * 0.1;
          
          // Living area similarity (15% weight)
          const areaDiff = Math.abs(house.living_area - targetFeatures.living_area) / targetFeatures.living_area;
          score += (1 - Math.min(areaDiff, 1)) * 0.15;
          
          // Grade similarity (10% weight)
          const gradeDiff = Math.abs(house.grade - targetFeatures.grade);
          score += (1 - Math.min(gradeDiff / 5, 1)) * 0.1;
          
          // Location proximity (10% weight)
          const latDiff = Math.abs(house.latitude - targetFeatures.latitude);
          const lonDiff = Math.abs(house.longitude - targetFeatures.longitude);
          const locationDiff = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
          score += (1 - Math.min(locationDiff / 2, 1)) * 0.1;
          
          return { ...house, similarity: score };
        });
        
        // Sort by similarity and get top 10
        const topSimilar = scoredHouses
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 10);
        
        setRelatedHouses(topSimilar);
        
        // Store in context for use in Analytics page
        const contextHouses = topSimilar.map(house => ({
          id: house.id,
          price: house.price,
          bedrooms: house.bedrooms,
          bathrooms: house.bathrooms,
          living_area: house.living_area,
          grade: house.grade,
          condition: house.condition,
          latitude: house.latitude,
          longitude: house.longitude,
          location: `Area ${house.latitude.toFixed(3)}, ${house.longitude.toFixed(3)}`,
          area: house.living_area,
          built_year: house.built_year,
          postal_code: `${house.latitude.toFixed(3)}, ${house.longitude.toFixed(3)}`
        }));
        
        setContextRelatedHouses(contextHouses);
      } catch (error) {
        console.error('Error fetching related houses:', error);
        setIsLoadingRelatedHouses(false);
      } finally {
        setLoading(false);
        setIsLoadingRelatedHouses(false);
      }
    };

    fetchRelatedHouses();
  }, [targetPrice, targetFeatures, contextRelatedHouses.length, isLoadingRelatedHouses]); // Add isLoadingRelatedHouses

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M CAD`;
    } else {
      return `$${(price / 1000).toFixed(0)}K CAD`;
    }
  };

  const handleHouseClick = (house: HouseData) => {
    setSelectedHouse(house.id);
    setMapCenter({ lat: house.latitude, lng: house.longitude });
    setOpenPopupId(house.id);
  };

  const handleMapMarkerClick = (houseId: string) => {
    setSelectedHouse(houseId);
    // Scroll to the selected house card
    const element = document.getElementById(`house-card-${houseId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleViewDetails = async (house: HouseData, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the card click
    try {
      const propertyDetails = await fetchPropertyDetails(house.id);
      if (propertyDetails) {
        setSelectedProperty(propertyDetails);
        setIsDetailsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  };

  const handleMapDetailsClick = async (latitude: number, longitude: number) => {
    try {
      const propertyDetails = await fetchPropertyDetailsByCoords(latitude, longitude);
      if (propertyDetails) {
        setSelectedProperty(propertyDetails);
        setIsDetailsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white shadow-lg border-0">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Home className="h-5 w-5 text-blue-600" />
          {t('predict.related.title')}
        </h3>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Related Houses Section */}
      <Card className="p-6 bg-white shadow-lg border-0">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Home className="h-5 w-5 text-blue-600" />
          {t('predict.related.title')} & {t('predict.related.mapLocation')}
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Related Houses Cards - Takes 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <h4 className="text-md font-medium mb-4 text-slate-700">
              {relatedHouses.length} {t('predict.related.similarProperties')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {relatedHouses.map((house, index) => (
                <Card 
                  key={house.id} 
                  id={`house-card-${house.id}`}
                  className={`p-4 border border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer ${
                    selectedHouse === house.id 
                      ? 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-400 shadow-lg ring-2 ring-blue-300' 
                      : 'bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-blue-100'
                  }`}
                  onClick={() => handleHouseClick(house)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs border-blue-300 ${
                        selectedHouse === house.id ? 'text-blue-800 bg-blue-50' : 'text-blue-700'
                      }`}>
                        #{index + 1} • {(house.similarity! * 100).toFixed(0)}% {t('predict.related.match')}
                      </Badge>
                      <FavoriteButton 
                        houseId={house.id} 
                        houseData={{
                          id: house.id,
                          price: house.price,
                          bedrooms: house.bedrooms,
                          bathrooms: house.bathrooms,
                          living_area: house.living_area,
                          lot_area: house.lot_area,
                          built_year: house.built_year,
                          grade: house.grade,
                          condition: house.condition,
                          latitude: house.latitude,
                          longitude: house.longitude,
                          waterfront: house.waterfront,
                          views: house.views,
                          schools_nearby: house.schools_nearby,
                          distance_from_airport: house.distance_from_airport
                        }}
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6 text-gray-500 hover:text-red-500"
                      />
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        selectedHouse === house.id ? 'text-blue-800' : 'text-blue-700'
                      }`}>
                        {formatPrice(house.price)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Bed className="h-3 w-3" />
                      <span>{house.bedrooms} {t('predict.related.beds')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Bath className="h-3 w-3" />
                      <span>{house.bathrooms} {t('predict.related.baths')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Home className="h-3 w-3" />
                      <span>{house.living_area.toLocaleString()} {t('predict.related.sqft')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Calendar className="h-3 w-3" />
                      <span>{house.built_year}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" />
                      <span>{house.latitude.toFixed(3)}, {house.longitude.toFixed(3)}</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        {t('predict.related.grade')} {house.grade}
                      </Badge>
                      {house.waterfront === 1 && (
                        <Badge variant="outline" className="text-xs px-2 py-1 text-blue-600 border-blue-300">
                          {t('predict.related.waterfront')}
                        </Badge>
                      )}
                      {selectedHouse === house.id && (
                        <div className="text-blue-600 ml-1">
                          📍
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    {selectedHouse === house.id && (
                      <div className="text-xs text-blue-700 font-medium">
                        🗺️ {t('predict.related.viewOnMap')}
                      </div>
                    )}
                    <button
                      onClick={(e) => handleViewDetails(house, e)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200 ml-auto"
                    >
                      <Eye className="h-3 w-3" />
                      {t('predict.related.viewDetails')}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right: Map View - Takes 1/3 width on large screens */}
          <div className="lg:col-span-1">
            <h4 className="text-md font-medium mb-4 text-slate-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              {t('predict.related.mapLocation')}
            </h4>
            <div className="h-[500px] rounded-lg overflow-hidden border border-slate-200">
              <PropertyMap 
                targetPrice={targetPrice} 
                relatedHouses={relatedHouses.map(house => ({
                  id: house.id,
                  lat: house.latitude,
                  lng: house.longitude,
                  price: house.price,
                  bedrooms: house.bedrooms,
                  bathrooms: house.bathrooms,
                  living_area: house.living_area,
                  isRelated: true
                }))}
                selectedHouse={selectedHouse}
                mapCenter={mapCenter}
                openPopupId={openPopupId}
                onMarkerClick={handleMapMarkerClick}
                onDetailsClick={handleMapDetailsClick}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Property Details Modal */}
      <PropertyDetails
        property={selectedProperty}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedProperty(null);
        }}
      />
    </div>
  );
};

export default RelatedHouses;