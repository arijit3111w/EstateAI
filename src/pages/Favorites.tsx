import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FavoriteButton from '@/components/FavoriteButton';
import FirestoreNotice from '@/components/FirestoreNotice';
import { getHousesByIds } from '@/lib/houseService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Heart, Home, TrendingUp, MapPin, Trash2, Bath, Bed, Calendar, Award, Eye, Navigation, Star, Building } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom house icon
const createHouseIcon = (price: number) => {
  const color = price > 1000000 ? '#dc2626' : price > 600000 ? '#ea580c' : '#16a34a';
  return L.divIcon({
    className: 'custom-house-marker',
    html: `
      <div style="
        background: ${color}; 
        color: white; 
        border-radius: 50%; 
        width: 30px; 
        height: 30px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 12px; 
        font-weight: bold;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        🏠
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const PropertyCard: React.FC<{ house: HouseData; onRemove: (id: string) => void }> = ({ house, onRemove }) => {
  const navigate = useNavigate();
  
  // Generate a house/bungalow property image based on house characteristics
  const getPropertyImageUrl = (house: HouseData) => {
    const seed = parseInt(house.id) || 1;
    
    // Use a combination of reliable services with house-specific styling
    const propertyCategories = [
      // Luxury Estate
      {
        url: `https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=250&fit=crop&q=80`,
        fallback: `https://via.placeholder.com/400x250/1E293B/F8FAFC?text=�️+LUXURY+ESTATE+-+$${Math.round(house.price/1000)}K`
      },
      // Family Home
      {
        url: `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop&q=80`,
        fallback: `https://via.placeholder.com/400x250/166534/F0FDF4?text=�+FAMILY+HOME+-+${house.bedrooms}+BR`
      },
      // Waterfront Property
      {
        url: `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop&q=80`,
        fallback: `https://via.placeholder.com/400x250/1E40AF/EFF6FF?text=�+WATERFRONT+-+VIEWS`
      },
      // Modern Home
      {
        url: `https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=250&fit=crop&q=80`,
        fallback: `https://via.placeholder.com/400x250/92400E/FEF3C7?text=🏡+MODERN+HOME+-+${house.living_area}+SQFT`
      },
      // Classic Home
      {
        url: `https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=250&fit=crop&q=80`,
        fallback: `https://via.placeholder.com/400x250/7C2D12/FED7AA?text=🏘️+CLASSIC+-+EST.+${house.built_year}`
      }
    ];
    
    // Select category based on house characteristics
    let categoryIndex;
    if (house.price > 1000000) {
      categoryIndex = 0; // Luxury estates
    } else if (house.bedrooms >= 4) {
      categoryIndex = 1; // Family homes
    } else if (house.waterfront === 1) {
      categoryIndex = 2; // Waterfront properties
    } else if (house.built_year > 1990) {
      categoryIndex = 3; // Modern homes
    } else {
      categoryIndex = 4; // Classic homes
    }
    
    // Use simple, reliable data URLs instead of external services
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad${house.id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${house.price > 1000000 ? '#1E293B' : house.bedrooms >= 4 ? '#166534' : house.waterfront === 1 ? '#1E40AF' : house.built_year > 1990 ? '#92400E' : '#7C2D12'};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${house.price > 1000000 ? '#334155' : house.bedrooms >= 4 ? '#15803D' : house.waterfront === 1 ? '#3B82F6' : house.built_year > 1990 ? '#D97706' : '#C2410C'};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="250" fill="url(#grad${house.id})"/>
        <text x="200" y="100" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">
          ${house.price > 1000000 ? 'LUXURY ESTATE' : house.bedrooms >= 4 ? 'FAMILY HOME' : house.waterfront === 1 ? 'WATERFRONT PROPERTY' : house.built_year > 1990 ? 'MODERN HOME' : 'CLASSIC HOME'}
        </text>
        <text x="200" y="130" font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.9)" text-anchor="middle">
          $${Math.round(house.price/1000)}K • ${house.bedrooms} Bed • ${house.bathrooms} Bath
        </text>
        <text x="200" y="150" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.8)" text-anchor="middle">
          ${house.living_area} sqft • Built ${house.built_year}
        </text>
        <text x="200" y="170" font-family="Arial, sans-serif" font-size="10" fill="rgba(255,255,255,0.7)" text-anchor="middle">
          Property ID: ${house.id}
        </text>
      </svg>
    `)}`;
  };

  const getGradeText = (grade: number) => {
    if (grade >= 11) return 'Luxury';
    if (grade >= 9) return 'Excellent';
    if (grade >= 7) return 'Very Good';
    if (grade >= 5) return 'Good';
    return 'Average';
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 11) return 'bg-purple-100 text-purple-800';
    if (grade >= 9) return 'bg-green-100 text-green-800';
    if (grade >= 7) return 'bg-blue-100 text-blue-800';
    if (grade >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (area: number) => {
    return new Intl.NumberFormat().format(area);
  };

  const getConditionText = (condition: number) => {
    if (condition >= 4) return 'Excellent';
    if (condition >= 3) return 'Good';
    if (condition >= 2) return 'Fair';
    return 'Poor';
  };

  const getConditionColor = (condition: number) => {
    if (condition >= 4) return 'bg-green-100 text-green-800';
    if (condition >= 3) return 'bg-blue-100 text-blue-800';
    if (condition >= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPriceRange = (price: number): string => {
    if (price < 300000) return 'Budget Friendly';
    if (price < 600000) return 'Mid Range';
    if (price < 1000000) return 'Premium';
    return 'Luxury';
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-0 bg-white">
      {/* Property Image Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={getPropertyImageUrl(house)} 
          alt={`Property ${house.id}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            // Fallback to a simple colored div-style placeholder if SVG fails
            const target = e.target as HTMLImageElement;
            target.src = `data:image/svg+xml,${encodeURIComponent(`
              <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="#6366f1"/>
                <text x="200" y="125" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">
                  Property ${house.id.slice(-4)}
                </text>
              </svg>
            `)}`;
          }}
        />
        {/* Overlay with favorite button */}
        <div className="absolute top-3 right-3">
          <FavoriteButton 
            houseId={house.id} 
            houseData={house}
            variant="ghost" 
            size="icon"
            className="bg-white/90 backdrop-blur-sm text-red-500 hover:text-red-600 hover:bg-white shadow-lg"
          />
        </div>
        {/* Price badge */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-white/95 text-gray-900 hover:bg-white text-lg font-bold px-3 py-1 shadow-lg">
            {formatPrice(house.price)}
          </Badge>
        </div>
        {/* Property grade badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${getGradeColor(house.grade)} font-medium shadow-lg`}>
            <Star className="h-3 w-3 mr-1" />
            {getGradeText(house.grade)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-0">
        {/* Property Details Section */}
        <div className="p-5 space-y-4">
          {/* Header */}
          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-1">
              Property #{house.id}
            </h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">Calgary, AB • {house.latitude.toFixed(3)}, {house.longitude.toFixed(3)}</span>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Bed className="h-4 w-4 text-blue-600" />
              </div>
              <div className="font-bold text-blue-900">{house.bedrooms}</div>
              <div className="text-xs text-blue-700">Bedrooms</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Bath className="h-4 w-4 text-green-600" />
              </div>
              <div className="font-bold text-green-900">{house.bathrooms}</div>
              <div className="text-xs text-green-700">Bathrooms</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Building className="h-4 w-4 text-purple-600" />
              </div>
              <div className="font-bold text-purple-900">{formatArea(house.living_area)}</div>
              <div className="text-xs text-purple-700">Sq Ft</div>
            </div>
          </div>

          {/* Additional details */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Built Year
              </span>
              <Badge variant="outline">{house.built_year}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Award className="h-3 w-3" />
                Grade
              </span>
              <Badge className="bg-purple-600 text-white">{house.grade}/13</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Condition</span>
              <Badge className={getConditionColor(house.condition)}>
                {getConditionText(house.condition)}
              </Badge>
            </div>
          </div>

          {/* Special features */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-800">
              {getPriceRange(house.price)}
            </Badge>
            {house.waterfront === 1 && (
              <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                🏖️ Waterfront
              </Badge>
            )}
            {house.views > 0 && (
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {house.views} View{house.views > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="h-32 relative">
          <MapContainer
            center={[house.latitude, house.longitude]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="rounded-b-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker 
              position={[house.latitude, house.longitude]}
              icon={createHouseIcon(house.price)}
            >
              <Popup>
                <div className="text-center">
                  <strong>Property #{house.id}</strong><br />
                  {formatPrice(house.price)}<br />
                  {house.bedrooms} bed • {house.bathrooms} bath<br />
                  {formatArea(house.living_area)} sqft
                </div>
              </Popup>
            </Marker>
          </MapContainer>
          {/* Map overlay with location info */}
          <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-700 shadow-sm">
            <Navigation className="h-3 w-3 inline mr-1" />
            Calgary, AB
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-5 pt-4 bg-gray-50">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onRemove(house.id)}
              className="flex-1 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Remove
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => navigate('/predict')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Predict Similar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Favorites: React.FC = () => {
  const { user, userProfile, removeFromFavorites, getFavoriteHousesData } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [houses, setHouses] = useState<HouseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const loadFavoriteHouses = async () => {
      try {
        setLoading(true);
        
        // Get favorite houses data directly from context
        const favoriteHousesData = getFavoriteHousesData();
        setHouses(favoriteHousesData);
        
        setError(null);
      } catch (err) {
        setError('Failed to load favorite houses');
        console.error('Error loading favorite houses:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteHouses();
  }, [user, userProfile, navigate, getFavoriteHousesData]);

  const handleRemoveFromFavorites = async (houseId: string) => {
    try {
      await removeFromFavorites(houseId);
      setHouses(prevHouses => prevHouses.filter(house => house.id !== houseId));
      toast({
        title: "Success",
        description: "House removed from favorites",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove house from favorites",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-700">Loading your favorite properties...</h3>
            <p className="mt-2 text-gray-500">Fetching property details and locations</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-full shadow-lg">
                <Heart className="h-8 w-8 text-white fill-current" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                My Favorite Properties
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover your curated collection of dream properties • {houses.length} carefully selected homes
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <MapPin className="h-4 w-4" />
              All properties located in Calgary, AB
            </div>
          </div>

          {/* Firestore Notice */}
          <FirestoreNotice className="mb-8" />

          {houses.length === 0 ? (
            <div className="text-center py-20">
              <Card className="max-w-lg mx-auto border-0 shadow-xl bg-white">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Heart className="h-12 w-12 text-gray-400" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900 mb-2">No Favorite Properties Yet</CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Start exploring Calgary's finest properties and save your favorites to see them here
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <Alert className="text-left">
                    <Home className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Pro Tip:</strong> Use the heart icon ❤️ on recommended houses after price predictions to add them to your favorites list
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => navigate('/predict')} 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 shadow-lg"
                      size="lg"
                    >
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Start Predicting Property Prices
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/heatmap')} 
                      className="w-full border-2 hover:bg-gray-50"
                      size="lg"
                    >
                      <MapPin className="h-5 w-5 mr-2" />
                      Explore Property Heatmap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* Properties grid with enhanced cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {houses.map((house) => (
                  <PropertyCard
                    key={house.id}
                    house={house}
                    onRemove={handleRemoveFromFavorites}
                  />
                ))}
              </div>

              {/* Enhanced summary stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <Card className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                  <div className="text-3xl font-bold mb-2">{houses.length}</div>
                  <div className="text-blue-100">Favorite Properties</div>
                </Card>
                <Card className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                  <div className="text-3xl font-bold mb-2">
                    ${Math.round(houses.reduce((sum, house) => sum + house.price, 0) / houses.length / 1000)}K
                  </div>
                  <div className="text-green-100">Average Price</div>
                </Card>
                <Card className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                  <div className="text-3xl font-bold mb-2">
                    {Math.round(houses.reduce((sum, house) => sum + house.living_area, 0) / houses.length).toLocaleString()}
                  </div>
                  <div className="text-purple-100">Avg. Living Area (sqft)</div>
                </Card>
                <Card className="text-center p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                  <div className="text-3xl font-bold mb-2">
                    {houses.filter(h => h.waterfront === 1).length}
                  </div>
                  <div className="text-orange-100">Waterfront Properties</div>
                </Card>
              </div>
            </>
          )}

          {/* Enhanced Quick Actions */}
          {houses.length > 0 && (
            <div className="text-center">
              <Card className="max-w-4xl mx-auto border-0 shadow-xl bg-white">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">Discover More Amazing Properties</CardTitle>
                  <CardDescription className="text-lg">
                    Continue your property journey with AI-powered insights and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => navigate('/predict')} 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 shadow-lg"
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Predict New Property
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/heatmap')} 
                    size="lg"
                    className="border-2 hover:bg-gray-50 font-semibold py-4"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    View Property Heatmap
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/chatbot')} 
                    size="lg"
                    className="border-2 hover:bg-gray-50 font-semibold py-4"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Get AI Property Advice
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;