import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet/hooks';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

interface Props {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

const LocationMapSelector = ({ latitude, longitude, onLocationChange }: Props) => {
  const [position, setPosition] = useState<[number, number]>([latitude, longitude]);
  const [mapKey, setMapKey] = useState(0);

  // Canada center coordinates - focusing on major populated areas
  const canadaCenter: [number, number] = [56.1304, -106.3468]; // Geographic center of Canada
  const defaultZoom = 4;

  useEffect(() => {
    setPosition([latitude, longitude]);
  }, [latitude, longitude]);

  const handleLocationSelect = (lat: number, lng: number) => {
    const newPosition: [number, number] = [lat, lng];
    setPosition(newPosition);
    onLocationChange(lat, lng);
  };

  const resetToCanada = () => {
    setMapKey(prev => prev + 1); // Force remount to reset view
    const calgaryCoords: [number, number] = [51.0447, -114.0719]; // Calgary coordinates as default
    setPosition(calgaryCoords);
    onLocationChange(calgaryCoords[0], calgaryCoords[1]);
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            Select Location on Map
          </h4>
          <button
            type="button"
            onClick={resetToCanada}
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reset to Canada
          </button>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Click anywhere on the map to set the property location. The coordinates will automatically update below.
        </p>
      </div>
      
      <div className="h-64 rounded-lg overflow-hidden border border-slate-200 mb-3">
        <MapContainer
          key={mapKey}
          center={canadaCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          
          {/* Show marker if coordinates are set */}
          {position && (
            <Marker position={position}>
              <Popup>
                <div className="p-2 text-center">
                  <div className="font-semibold mb-1">Selected Location</div>
                  <div className="text-sm text-gray-600">
                    Lat: {position[0].toFixed(4)}<br />
                    Lng: {position[1].toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-white rounded border">
          <span className="text-gray-500">Latitude:</span>
          <div className="font-mono font-semibold text-blue-700">{position[0].toFixed(4)}</div>
        </div>
        <div className="p-2 bg-white rounded border">
          <span className="text-gray-500">Longitude:</span>
          <div className="font-mono font-semibold text-blue-700">{position[1].toFixed(4)}</div>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        💡 Tip: Use the search or zoom controls to navigate to specific Canadian cities
      </div>
    </Card>
  );
};

export default LocationMapSelector;