import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  priceRange: [number, number];
  gradeFilter: string;
}

interface HeatmapPoint {
  id: string;
  lat: number;
  lng: number;
  price: number;
  grade: number;
  bedrooms: number;
  bathrooms: number;
}

const HeatmapView = ({ priceRange, gradeFilter }: Props) => {
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/House_Price_India.csv');
        const text = await response.text();
        const lines = text.split('\n');
        
        const data: HeatmapPoint[] = [];
        for (let i = 1; i < Math.min(lines.length, 5000); i++) {
          const cols = lines[i].split(',');
          if (cols.length >= 23) {
            const price = parseFloat(cols[22]);
            const grade = parseFloat(cols[10]);
            const lat = parseFloat(cols[16]);
            const lng = parseFloat(cols[17]);
            
            if (isNaN(lat) || isNaN(lng) || isNaN(price)) continue;
            
            if (price >= priceRange[0] && price <= priceRange[1]) {
              let include = true;
              if (gradeFilter === 'luxury' && grade < 10) include = false;
              if (gradeFilter === 'premium' && (grade < 8 || grade > 9)) include = false;
              if (gradeFilter === 'standard' && (grade < 5 || grade > 7)) include = false;
              if (gradeFilter === 'budget' && grade > 4) include = false;
              
              if (include) {
                data.push({
                  id: cols[0],
                  lat,
                  lng,
                  price,
                  grade,
                  bedrooms: parseFloat(cols[2]),
                  bathrooms: parseFloat(cols[3]),
                });
              }
            }
          }
        }
        
        setPoints(data);
      } catch (error) {
        console.error('Error loading heatmap data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [priceRange, gradeFilter]);

  const getColor = (price: number) => {
    if (price < 500000) return '#22c55e'; // green - affordable
    if (price < 1000000) return '#f59e0b'; // yellow - mid-range
    return '#ef4444'; // red - premium
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center">Loading heatmap...</div>;
  }

  const center: [number, number] = points.length > 0
    ? [points[0].lat, points[0].lng]
    : [47.6, -122.3];

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point) => (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng]}
            radius={6}
            pathOptions={{
              fillColor: getColor(point.price),
              color: "#fff",
              weight: 1,
              opacity: 0.8,
              fillOpacity: 0.6,
            }}
          >
            <Popup>
              <div className="p-2">
                <div className="font-semibold text-lg mb-2">₹{(point.price / 100000).toFixed(2)}L</div>
                <div className="text-sm space-y-1">
                  <div>{point.bedrooms} beds • {point.bathrooms} baths</div>
                  <div>Grade: {point.grade}</div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </>
    </MapContainer>
  );
};

export default HeatmapView;
