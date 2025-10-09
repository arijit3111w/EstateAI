import { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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
  area: number;
  location: string;
}

interface HeatZone {
  id: string;
  bounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
  avgPrice: number;
  propertyCount: number;
  minPrice: number;
  maxPrice: number;
  color: string;
  opacity: number;
}

const HeatmapView = ({ priceRange, gradeFilter }: Props) => {
  const [allData, setAllData] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heatZones, setHeatZones] = useState<HeatZone[]>([]);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const zoneLayersRef = useRef<L.Rectangle[]>([]);

  // Map instance handler
  const handleMapCreated = (map: L.Map) => {
    setMapInstance(map);
  };

  // Calgary area bounds
  const CALGARY_BOUNDS = {
    north: 52.95,
    south: 52.75,
    west: -114.6,
    east: -114.2
  };

  // Grid configuration
  const GRID_SIZE = 0.02; // Degrees (roughly 2km x 2km)

  // Function to calculate heat zones from property data
  const calculateHeatZones = (properties: HeatmapPoint[]): HeatZone[] => {
    if (properties.length === 0) return [];
    
    const zones: { [key: string]: HeatmapPoint[] } = {};

    // Group properties into grid cells
    properties.forEach(property => {
      const gridLat = Math.floor(property.lat / GRID_SIZE) * GRID_SIZE;
      const gridLng = Math.floor(property.lng / GRID_SIZE) * GRID_SIZE;
      const zoneId = `${gridLat.toFixed(3)},${gridLng.toFixed(3)}`;
      
      if (!zones[zoneId]) {
        zones[zoneId] = [];
      }
      zones[zoneId].push(property);
    });

    // Convert to heat zones with statistics
    return Object.entries(zones)
      .filter(([_, props]) => props.length >= 1) // Show zones with at least 1 property
      .map(([zoneId, props]) => {
        const [gridLat, gridLng] = zoneId.split(',').map(Number);
        const prices = props.map(p => p.price);
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Determine color and opacity based on average price and property count
        let color = '#22c55e'; // Green for affordable
        let opacity = Math.min(0.3 + (props.length * 0.05), 0.7); // More properties = more opacity

        if (avgPrice >= 1200000) {
          color = '#ef4444'; // Red for luxury
          opacity = Math.min(0.4 + (props.length * 0.05), 0.8);
        } else if (avgPrice >= 800000) {
          color = '#f97316'; // Orange for expensive
          opacity = Math.min(0.35 + (props.length * 0.05), 0.75);
        } else if (avgPrice >= 600000) {
          color = '#f59e0b'; // Yellow for mid-range
          opacity = Math.min(0.3 + (props.length * 0.05), 0.7);
        }

        return {
          id: zoneId,
          bounds: [
            [gridLat, gridLng],
            [gridLat + GRID_SIZE, gridLng + GRID_SIZE]
          ] as [[number, number], [number, number]],
          avgPrice,
          propertyCount: props.length,
          minPrice,
          maxPrice,
          color,
          opacity
        };
      })
      .sort((a, b) => b.propertyCount - a.propertyCount); // Sort by property count for better rendering
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/data/House_Price_India.csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('CSV file appears to be empty or invalid');
        }

        // Parse the header to understand the structure
        const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const data: HeatmapPoint[] = [];
        
        // Expected columns based on the CSV structure:
        // 0: id, 1: Date, 2: bedrooms, 3: bathrooms, 4: living area, 5: lot area, 
        // 6: floors, 7: waterfront, 8: views, 9: condition, 10: grade, 11: house area,
        // 12: basement area, 13: built year, 14: renovation year, 15: postal code,
        // 16: Lattitude, 17: Longitude, 18-21: other fields, 22: Price

        for (let i = 1; i < Math.min(lines.length, 5000); i++) { // Increased limit to 5000 for better heat zones
          const cols = lines[i].split(',').map(col => col.trim().replace(/"/g, ''));
          
          if (cols.length >= 23) {
            const lat = parseFloat(cols[16]); // Lattitude column
            const lng = parseFloat(cols[17]); // Longitude column
            const price = parseFloat(cols[22]); // Price column
            const bedrooms = parseInt(cols[2]) || 2; // number of bedrooms
            const bathrooms = parseFloat(cols[3]) || 1; // number of bathrooms
            const grade = parseInt(cols[10]) || 5; // grade of the house
            const livingArea = parseFloat(cols[4]) || 1000; // living area
            const builtYear = parseInt(cols[13]) || 1990; // Built Year
            const postalCode = cols[15] || 'Unknown'; // Postal Code
            
            // Validate the data
            if (isNaN(lat) || isNaN(lng) || isNaN(price) || price <= 0) {
              continue;
            }
            
            // Create location name based on postal code or coordinates
            const location = `Area ${postalCode}`;
            
            data.push({
              id: cols[0] || `house_${i}`,
              lat,
              lng,
              price,
              grade,
              bedrooms,
              bathrooms,
              area: livingArea,
              location,
            });
          }
        }
        
        console.log(`Loaded ${data.length} property records from CSV`);
        setAllData(data);
        
        // Calculate initial heat zones
        const zones = calculateHeatZones(data);
        setHeatZones(zones);
      } catch (error) {
        console.error('Error loading heatmap data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Effect to render heat zones on the map
  useEffect(() => {
    if (!mapInstance || heatZones.length === 0) return;

    // Clear existing rectangles
    zoneLayersRef.current.forEach(rect => {
      if (mapInstance.hasLayer(rect)) {
        mapInstance.removeLayer(rect);
      }
    });
    zoneLayersRef.current = [];
    
    // Add new rectangles for heat zones
    heatZones.forEach((zone) => {
      const rectangle = L.rectangle(zone.bounds, {
        color: zone.color,
        weight: 2,
        opacity: 0.8,
        fillColor: zone.color,
        fillOpacity: zone.opacity,
        interactive: true
      });

      // Add popup with zone information
      rectangle.bindPopup(`
        <div style="padding: 12px; min-width: 200px;">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: ${zone.color};">
            Price Zone
          </div>
          <div style="font-size: 14px; line-height: 1.4;">
            <div><strong>Average Price:</strong> $${(zone.avgPrice / 1000).toFixed(0)}K CAD</div>
            <div><strong>Price Range:</strong> $${(zone.minPrice / 1000).toFixed(0)}K - $${(zone.maxPrice / 1000).toFixed(0)}K</div>
            <div><strong>Properties:</strong> ${zone.propertyCount}</div>
            <div style="margin-top: 8px; font-size: 12px; color: #666;">
              ${zone.avgPrice >= 1200000 ? '🔴 Luxury Zone' : 
                zone.avgPrice >= 800000 ? '🟠 Expensive Zone' :
                zone.avgPrice >= 600000 ? '🟡 Mid-range Zone' : '🟢 Affordable Zone'}
            </div>
          </div>
        </div>
      `);

      rectangle.addTo(mapInstance);
      zoneLayersRef.current.push(rectangle);
    });
  }, [mapInstance, heatZones]);

  const filteredPoints = useMemo(() => {
    const filtered = allData.filter(point => {
      // Price filter
      if (point.price < priceRange[0] || point.price > priceRange[1]) return false;
      
      // Grade filter
      if (gradeFilter !== 'all') {
        switch (gradeFilter) {
          case 'luxury':
            if (point.grade < 9) return false;
            break;
          case 'premium':
            if (point.grade < 7 || point.grade > 8) return false;
            break;
          case 'standard':
            if (point.grade < 5 || point.grade > 6) return false;
            break;
          case 'budget':
            if (point.grade > 4) return false;
            break;
        }
      }
      
      return true;
    });

    // Recalculate heat zones when filters change
    const newZones = calculateHeatZones(filtered);
    setHeatZones(newZones);

    return filtered;
  }, [allData, priceRange, gradeFilter]);

  const getColor = (price: number) => {
    if (price < 600000) return '#22c55e'; // green - affordable (under $600k)
    if (price < 800000) return '#f59e0b'; // yellow - mid-range ($600k-$800k)
    if (price < 1200000) return '#f97316'; // orange - expensive ($800k-$1.2M)
    return '#ef4444'; // red - premium (over $1.2M)
  };

  const getRadius = (price: number) => {
    if (price < 600000) return 4;
    if (price < 800000) return 6;
    if (price < 1200000) return 8;
    return 10;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="mb-2">Error loading data:</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Center map based on actual data coordinates (appears to be Calgary, Alberta area)
  const center: LatLngExpression = [52.8, -114.4]; // Calgary, Alberta coordinates
  const zoom = 10;

  return (
    <div className="h-[400px] md:h-[480px] lg:h-[520px] w-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        scrollWheelZoom={true}
        key={`map-${filteredPoints.length}`} // Force re-render when data changes
        whenCreated={handleMapCreated}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Individual property markers on top of heat zones */}
        {filteredPoints.map((point) => (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng] as LatLngExpression}
            radius={4} // Smaller markers to not overwhelm the heat zones
            pathOptions={{
              fillColor: getColor(point.price),
              color: "#ffffff",
              weight: 1,
              opacity: 0.9,
              fillOpacity: 0.8,
            }}
          >
            <Popup>
              <div className="p-3 min-w-[200px]">
                <div className="font-bold text-lg mb-2 text-blue-600">
                  ${(point.price / 1000).toFixed(0)}K CAD
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{point.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bedrooms:</span>
                    <span>{point.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bathrooms:</span>
                    <span>{point.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Living Area:</span>
                    <span>{point.area.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grade:</span>
                    <span className="font-medium">{point.grade}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price/sq ft:</span>
                    <span>${Math.round(point.price / point.area)}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      
      {filteredPoints.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg">
          <div className="text-center p-4">
            <p className="text-lg font-semibold mb-2">No properties found</p>
            <p className="text-sm">Try adjusting your filters to see more results</p>
          </div>
        </div>
      )}
      
      <div className="absolute top-20 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200 max-w-xs z-40 mt-2 hidden md:block">
        <div className="font-semibold text-sm mb-2 text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Heat Map Legend
        </div>
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-3 bg-green-500/40 border border-green-600 rounded"></div>
            <span className="text-green-700 font-medium">Affordable Zones</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-3 bg-yellow-500/50 border border-yellow-600 rounded"></div>
            <span className="text-yellow-700 font-medium">Mid-range Zones</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-3 bg-orange-500/60 border border-orange-600 rounded"></div>
            <span className="text-orange-700 font-medium">Expensive Zones</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-3 bg-red-500/70 border border-red-600 rounded"></div>
            <span className="text-red-700 font-medium">Luxury Zones</span>
          </div>
        </div>
        <div className="border-t pt-2 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Zones:</span>
            <span className="font-semibold text-blue-600">{heatZones.length}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Properties:</span>
            <span className="font-semibold text-green-600">{filteredPoints.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapView;
