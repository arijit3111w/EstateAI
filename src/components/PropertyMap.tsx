import { useEffect, useState } from 'react';
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

interface Props {
  targetPrice: number;
}

const PropertyMap = ({ targetPrice }: Props) => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
            const price = parseFloat(cols[22]);
            const lat = parseFloat(cols[16]);
            const lng = parseFloat(cols[17]);
            
            if (price >= priceMin && price <= priceMax && !isNaN(lat) && !isNaN(lng)) {
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
  }, [targetPrice]);

  if (loading) {
    return <div className="h-full flex items-center justify-center">Loading map...</div>;
  }

  const center: [number, number] = properties.length > 0
    ? [properties[0].latitude, properties[0].longitude]
    : [47.6, -122.3];

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {properties.map((property) => (
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
              <div className="font-semibold text-lg mb-2">₹{(property.price / 100000).toFixed(2)}L</div>
              <div className="text-sm space-y-1">
                <div>{property.bedrooms} beds • {property.bathrooms} baths</div>
                <div>{property.living_area.toFixed(0)} sq ft</div>
                <div>Grade: {property.grade}</div>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default PropertyMap;
