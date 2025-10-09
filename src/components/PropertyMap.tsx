import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { PropertyData } from '@/types/property';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker component for auto-opening popups
const AutoOpenMarker = ({ house, index, selectedHouse, openPopupId, onMarkerClick, onDetailsClick }: {
  house: RelatedHouse;
  index: number;
  selectedHouse?: string | null;
  openPopupId?: string | null;
  onMarkerClick?: (houseId: string) => void;
  onDetailsClick?: (latitude: number, longitude: number) => void;
}) => {
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (markerRef.current && openPopupId === house.id) {
      markerRef.current.openPopup();
    }
  }, [openPopupId, house.id]);

  return (
    <CircleMarker
      ref={markerRef}
      center={[house.lat, house.lng]}
      radius={selectedHouse === house.id ? 12 : 10}
      pathOptions={{
        fillColor: selectedHouse === house.id ? "#1d4ed8" : "#3b82f6",
        color: "#fff",
        weight: selectedHouse === house.id ? 3 : 2,
        opacity: 1,
        fillOpacity: selectedHouse === house.id ? 0.9 : 0.8,
      }}
      eventHandlers={{
        click: () => {
          if (house.id && onMarkerClick) {
            onMarkerClick(house.id);
          }
        },
      }}
    >
      <Popup closeButton={true} autoClose={false} closeOnClick={false}>
        <div className="p-2">
          <div className="font-semibold text-lg mb-2 text-blue-700">
            ${(house.price / 1000).toFixed(0)}K CAD
          </div>
          <div className="text-sm space-y-1">
            <div className="font-medium">{house.bedrooms} beds • {house.bathrooms} baths</div>
            <div>{house.living_area.toFixed(0)} sq ft</div>
            <div className="text-blue-600 font-medium">Related Property #{index + 1}</div>
            <div className="text-xs text-slate-500 mt-2">Click to select in list</div>
            {onDetailsClick && (
              <button
                onClick={() => onDetailsClick(house.lat, house.lng)}
                className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-200 w-full"
              >
                View Full Details
              </button>
            )}
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
};

interface RelatedHouse {
  id?: string;
  lat: number;
  lng: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  living_area: number;
  isRelated: boolean;
}

interface Props {
  targetPrice: number;
  relatedHouses?: RelatedHouse[];
  selectedHouse?: string | null;
  mapCenter?: { lat: number; lng: number } | null;
  openPopupId?: string | null;
  onMarkerClick?: (houseId: string) => void;
  onDetailsClick?: (latitude: number, longitude: number) => void;
}

const PropertyMap = ({ targetPrice, relatedHouses, selectedHouse, mapCenter, openPopupId, onMarkerClick, onDetailsClick }: Props) => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapRef, setMapRef] = useState<any>(null);

  useEffect(() => {
    // If we have related houses, skip loading from CSV
    if (relatedHouses && relatedHouses.length > 0) {
      setLoading(false);
      return;
    }

    const loadProperties = async () => {
      try {
        const response = await fetch('/data/House_Price_India.csv');
        const text = await response.text();
        const lines = text.split('\n');
        
        const priceMin = targetPrice * 0.9;
        const priceMax = targetPrice * 1.1;
        
        const filtered: PropertyData[] = [];
        for (let i = 1; i < Math.min(lines.length, 1000); i++) {
          const cols = lines[i].split(',');
          if (cols.length >= 23) {
            const price = parseFloat(cols[22]); // Price column
            const lat = parseFloat(cols[16]); // Correct latitude column
            const lng = parseFloat(cols[17]); // Correct longitude column
            
            if (price >= priceMin && price <= priceMax && 
                !isNaN(lat) && !isNaN(lng) &&
                lat > 50 && lat < 55 && lng > -120 && lng < -110) { // Ensure Calgary area coordinates
              filtered.push({
                id: cols[0],
                price: price,
                latitude: lat,
                longitude: lng,
                bedrooms: parseFloat(cols[2]),
                bathrooms: parseFloat(cols[3]),
                living_area: parseFloat(cols[4]),
                grade: parseFloat(cols[10]),
              });
            }
            
            if (filtered.length >= 50) break;
          }
        }
        
        setProperties(filtered);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [targetPrice, relatedHouses]);

  // Handle map centering when a house is selected
  useEffect(() => {
    if (mapRef && mapCenter) {
      mapRef.setView([mapCenter.lat, mapCenter.lng], 15);
    }
  }, [mapRef, mapCenter]);

  if (loading) {
    return <div className="h-full flex items-center justify-center">Loading map...</div>;
  }

  // Use related houses if provided, otherwise use the CSV properties
  const displayData = relatedHouses && relatedHouses.length > 0 ? relatedHouses : properties;
  
  const center: [number, number] = displayData.length > 0
    ? relatedHouses && relatedHouses.length > 0 
      ? [relatedHouses[0].lat, relatedHouses[0].lng]
      : [properties[0].latitude, properties[0].longitude]
    : [52.8878, -114.47]; // Default to Calgary coordinates from CSV data

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
      ref={setMapRef}
    >
      <>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Show related houses if provided */}
        {relatedHouses && relatedHouses.length > 0 && relatedHouses.map((house, index) => (
          <AutoOpenMarker
            key={house.id || index}
            house={house}
            index={index}
            selectedHouse={selectedHouse}
            openPopupId={openPopupId}
            onMarkerClick={onMarkerClick}
            onDetailsClick={onDetailsClick}
          />
        ))}
        
        {/* Show default properties if no related houses */}
        {(!relatedHouses || relatedHouses.length === 0) && properties.map((property) => (
          <CircleMarker
            key={property.id}
            center={[property.latitude, property.longitude]}
            radius={8}
            pathOptions={{
              fillColor: "#f59e0b",
              color: "#fff",
              weight: 2,
              opacity: 1,
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <div className="p-2">
                <div className="font-semibold text-lg mb-2">${(property.price / 1000).toFixed(0)}K CAD</div>
                <div className="text-sm space-y-1">
                  <div>{property.bedrooms} beds • {property.bathrooms} baths</div>
                  <div>{property.living_area.toFixed(0)} sq ft</div>
                  <div>Grade: {property.grade}</div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </>
    </MapContainer>
  );
};

export default PropertyMap;
