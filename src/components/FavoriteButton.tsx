import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface FavoriteButtonProps {
  houseId: string;
  houseData?: HouseData;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  houseId, 
  houseData,
  className = '',
  variant = 'ghost',
  size = 'icon'
}) => {
  const { user, isHouseFavorited, addToFavorites, addHouseToFavorites, removeFromFavorites } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isFavorited = isHouseFavorited(houseId);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorite houses",
        action: (
          <Button variant="outline" size="sm" onClick={() => navigate('/signin')}>
            Sign In
          </Button>
        ),
      });
      return;
    }

    try {
      if (isFavorited) {
        await removeFromFavorites(houseId);
        toast({
          title: "Removed from favorites",
          description: "House removed from your favorites list",
        });
      } else {
        // Use the new method if house data is available
        if (houseData) {
          await addHouseToFavorites({
            ...houseData,
            addedAt: new Date()
          });
        } else {
          // Fallback to old method for backward compatibility
          await addToFavorites(houseId);
        }
        toast({
          title: "Added to favorites",
          description: "House added to your favorites list",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      className={`${className} ${isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'}`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} 
      />
      {size !== 'icon' && (
        <span className="ml-2">
          {isFavorited ? 'Favorited' : 'Add to Favorites'}
        </span>
      )}
    </Button>
  );
};

export default FavoriteButton;