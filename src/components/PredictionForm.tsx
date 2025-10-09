import { useState } from 'react';
import { PropertyFeatures, PredictionResponse } from '@/types/property';
import { predictPrice } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Props {
  onPrediction: (prediction: PredictionResponse, formData: PropertyFeatures) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string) => void;
}

const PredictionForm = ({ onPrediction, onLoading, onError }: Props) => {
  const [formData, setFormData] = useState<PropertyFeatures>({
    living_area: 1800,
    lot_area: 4000,
    number_of_bedrooms: 3,
    number_of_bathrooms: 2,
    grade_of_house: 7,
    area_excluding_basement: 1600,
    area_of_basement: 200,
    postal_code: 122005,
    lattitude: 47.6,
    longitude: -122.3,
    number_of_views: 1,
    waterfront_present: 0,
    condition_of_house: 3,
    built_year: 2000,
    renovation_year: 0,
    number_of_schools_nearby: 5,
    distance_from_airport: 20.0,
  });

  const handleChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }));
  };

  const setPreset = (type: 'budget' | 'average' | 'luxury') => {
    const presets = {
      budget: {
        living_area: 600,
        lot_area: 1500,
        number_of_bedrooms: 1,
        number_of_bathrooms: 1,
        grade_of_house: 3,
        area_excluding_basement: 550,
        area_of_basement: 50,
        postal_code: 122015,
        lattitude: 47.3,
        longitude: -122.5,
        number_of_views: 0,
        waterfront_present: 0,
        condition_of_house: 2,
        built_year: 1980,
        renovation_year: 0,
        number_of_schools_nearby: 2,
        distance_from_airport: 35.0,
      },
      average: {
        living_area: 1800,
        lot_area: 4000,
        number_of_bedrooms: 3,
        number_of_bathrooms: 2,
        grade_of_house: 7,
        area_excluding_basement: 1600,
        area_of_basement: 200,
        postal_code: 122005,
        lattitude: 47.6,
        longitude: -122.3,
        number_of_views: 1,
        waterfront_present: 0,
        condition_of_house: 3,
        built_year: 2000,
        renovation_year: 0,
        number_of_schools_nearby: 5,
        distance_from_airport: 20.0,
      },
      luxury: {
        living_area: 4500,
        lot_area: 12000,
        number_of_bedrooms: 5,
        number_of_bathrooms: 4,
        grade_of_house: 11,
        area_excluding_basement: 4000,
        area_of_basement: 500,
        postal_code: 122003,
        lattitude: 47.7,
        longitude: -122.1,
        number_of_views: 4,
        waterfront_present: 1,
        condition_of_house: 5,
        built_year: 2018,
        renovation_year: 2020,
        number_of_schools_nearby: 8,
        distance_from_airport: 15.0,
      },
    };
    setFormData(presets[type]);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} home preset loaded`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLoading(true);
    onError('');

    try {
      const result = await predictPrice(formData);
      onPrediction(result, formData);
      toast.success('Prediction completed successfully!');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        'Failed to get prediction. Please check if the backend server is running.';
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      onLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg border-0">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        🏠 <span className="bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">Canadian Property Analysis</span>
      </h2>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Enter comprehensive property details for our 25-feature AI model with 95.97% accuracy (trained on Canadian real estate data)
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-6 overflow-hidden">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setPreset('budget')} 
          className="flex-1 min-w-0 text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap overflow-hidden"
        >
          💰 Budget (~$600K)
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setPreset('average')} 
          className="flex-1 min-w-0 text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap overflow-hidden"
        >
          🏡 Average (~$800K)
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setPreset('luxury')} 
          className="flex-1 min-w-0 text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap overflow-hidden"
        >
          ✨ Luxury (~$4M+)
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="living_area">Living Area (sq ft)</Label>
            <Input
              id="living_area"
              type="number"
              value={formData.living_area}
              onChange={(e) => handleChange('living_area', e.target.value)}
              min="250"
              max="15000"
              step="25"
              required
            />
          </div>
          <div>
            <Label htmlFor="lot_area">Lot Area (sq ft)</Label>
            <Input
              id="lot_area"
              type="number"
              value={formData.lot_area}
              onChange={(e) => handleChange('lot_area', e.target.value)}
              min="500"
              max="100000"
              step="50"
              required
            />
          </div>
          <div>
            <Label htmlFor="area_excluding_basement">Above Ground Area (sq ft)</Label>
            <Input
              id="area_excluding_basement"
              type="number"
              value={formData.area_excluding_basement}
              onChange={(e) => handleChange('area_excluding_basement', e.target.value)}
              min="200"
              max="12000"
              step="25"
              required
            />
          </div>
          <div>
            <Label htmlFor="area_of_basement">Basement Area (sq ft)</Label>
            <Input
              id="area_of_basement"
              type="number"
              value={formData.area_of_basement}
              onChange={(e) => handleChange('area_of_basement', e.target.value)}
              min="0"
              max="3000"
              step="50"
              required
            />
          </div>
          <div>
            <Label htmlFor="number_of_bedrooms">Bedrooms</Label>
            <Select
              value={formData.number_of_bedrooms.toString()}
              onValueChange={(val) => handleChange('number_of_bedrooms', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="number_of_bathrooms">Bathrooms</Label>
            <Select
              value={formData.number_of_bathrooms.toString()}
              onValueChange={(val) => handleChange('number_of_bathrooms', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="grade_of_house">Grade (1-13)</Label>
            <Select
              value={formData.grade_of_house.toString()}
              onValueChange={(val) => handleChange('grade_of_house', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Very Poor</SelectItem>
                <SelectItem value="2">2 - Poor</SelectItem>
                <SelectItem value="3">3 - Below Poor</SelectItem>
                <SelectItem value="4">4 - Low</SelectItem>
                <SelectItem value="5">5 - Fair</SelectItem>
                <SelectItem value="6">6 - Below Average</SelectItem>
                <SelectItem value="7">7 - Average</SelectItem>
                <SelectItem value="8">8 - Good</SelectItem>
                <SelectItem value="9">9 - Better</SelectItem>
                <SelectItem value="10">10 - Very Good</SelectItem>
                <SelectItem value="11">11 - Excellent</SelectItem>
                <SelectItem value="12">12 - Luxury</SelectItem>
                <SelectItem value="13">13 - Mansion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="condition_of_house">Condition (1-5)</Label>
            <Select
              value={formData.condition_of_house.toString()}
              onValueChange={(val) => handleChange('condition_of_house', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Poor</SelectItem>
                <SelectItem value="2">2 - Fair</SelectItem>
                <SelectItem value="3">3 - Average</SelectItem>
                <SelectItem value="4">4 - Good</SelectItem>
                <SelectItem value="5">5 - Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="built_year">Built Year</Label>
            <Input
              id="built_year"
              type="number"
              value={formData.built_year}
              onChange={(e) => handleChange('built_year', e.target.value)}
              min="1900"
              max="2025"
              required
            />
          </div>
          <div>
            <Label htmlFor="renovation_year">Renovation Year (0 = Never)</Label>
            <Input
              id="renovation_year"
              type="number"
              value={formData.renovation_year}
              onChange={(e) => handleChange('renovation_year', e.target.value)}
              min="0"
              max="2025"
              required
            />
          </div>
          <div>
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              type="number"
              value={formData.postal_code}
              onChange={(e) => handleChange('postal_code', e.target.value)}
              min="100000"
              max="999999"
              required
            />
          </div>
          <div>
            <Label htmlFor="lattitude">Latitude</Label>
            <Input
              id="lattitude"
              type="number"
              value={formData.lattitude}
              onChange={(e) => handleChange('lattitude', e.target.value)}
              step="0.1"
              required
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              value={formData.longitude}
              onChange={(e) => handleChange('longitude', e.target.value)}
              step="0.1"
              required
            />
          </div>
          <div>
            <Label htmlFor="number_of_views">Number of Views (0-4)</Label>
            <Select
              value={formData.number_of_views.toString()}
              onValueChange={(val) => handleChange('number_of_views', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - None</SelectItem>
                <SelectItem value="1">1 - Fair</SelectItem>
                <SelectItem value="2">2 - Average</SelectItem>
                <SelectItem value="3">3 - Good</SelectItem>
                <SelectItem value="4">4 - Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="waterfront_present">Waterfront Property</Label>
            <Select
              value={formData.waterfront_present.toString()}
              onValueChange={(val) => handleChange('waterfront_present', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No</SelectItem>
                <SelectItem value="1">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="number_of_schools_nearby">Schools Nearby</Label>
            <Input
              id="number_of_schools_nearby"
              type="number"
              value={formData.number_of_schools_nearby}
              onChange={(e) => handleChange('number_of_schools_nearby', e.target.value)}
              min="0"
              max="10"
              required
            />
          </div>
          <div>
            <Label htmlFor="distance_from_airport">Distance from Airport (km)</Label>
            <Input
              id="distance_from_airport"
              type="number"
              value={formData.distance_from_airport}
              onChange={(e) => handleChange('distance_from_airport', e.target.value)}
              min="1"
              max="200"
              step="0.1"
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
        >
          <span className="hidden sm:inline">🔮 Get Advanced AI Price Prediction</span>
          <span className="sm:hidden">🔮 Get AI Prediction</span>
        </Button>
      </form>
    </Card>
  );
};

export default PredictionForm;
