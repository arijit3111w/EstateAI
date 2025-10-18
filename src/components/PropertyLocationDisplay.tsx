import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';
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
  latitude: number;
  longitude: number;
  price?: number;
}

const PropertyLocationDisplay = ({ latitude, longitude, price }: Props) => {
  const [position] = useState<[number, number]>([latitude, longitude]);

  return (
    <div className="space-y-4">
      <div className="h-64 rounded-lg overflow-hidden border border-slate-200">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
          zoomControl={true}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={position}>
            <Popup>
              <div className="p-2 text-center">
                <div className="font-semibold mb-2 text-blue-700">Property Location</div>
                {price && (
                  <div className="text-lg font-bold text-green-700 mb-2">
                    ${(price / 1000).toFixed(0)}K CAD
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  Lat: {position[0].toFixed(4)}<br />
                  Lng: {position[1].toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-red-600" />
          <span>Property Location</span>
        </div>
        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4 text-blue-600" />
          <span>Interactive Map</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyLocationDisplay;