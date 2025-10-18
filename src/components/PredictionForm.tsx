import { useState } from 'react';
import { PropertyFeatures, PredictionResponse } from '@/types/property';
import { predictPrice } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, MapPin, Ruler, Calendar, Star, Waves, School, Plane, Eye, Wrench } from 'lucide-react';
import LocationMapSelector from '@/components/LocationMapSelector';

interface Props {
  onPrediction: (prediction: PredictionResponse, formData: PropertyFeatures) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string) => void;
}

const PredictionForm = ({ onPrediction, onLoading, onError }: Props) => {
  const { t } = useLanguage();
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

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      lattitude: lat,
      longitude: lng,
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
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('predict.form.aiValuation')}</h2>
            <p className="text-blue-100">{t('predict.form.poweredBy')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 bg-white/10 rounded-lg">
            <div className="text-2xl font-bold">95.97%</div>
            <div className="text-sm text-blue-100">{t('predict.form.accuracy')}</div>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-lg">
            <div className="text-2xl font-bold">25+</div>
            <div className="text-sm text-blue-100">{t('predict.form.featuresCount')}</div>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-lg">
            <div className="text-2xl font-bold">14K+</div>
            <div className="text-sm text-blue-100">{t('predict.form.properties')}</div>
          </div>
        </div>
      </Card>

      {/* Quick Presets */}
      <Card className="p-6 bg-white shadow-lg border-0">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('predict.form.quickStart')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setPreset('budget')} 
            className="h-20 flex flex-col gap-1 border-2 hover:border-green-400 hover:bg-green-50 transition-all text-center"
          >
            <div className="text-2xl">💰</div>
            <div className="font-semibold text-sm">{t('predict.form.budgetHome')}</div>
            <div className="text-xs text-gray-500">~$600K</div>
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setPreset('average')} 
            className="h-20 flex flex-col gap-1 border-2 hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
          >
            <div className="text-2xl">🏡</div>
            <div className="font-semibold text-sm">{t('predict.form.averageHome')}</div>
            <div className="text-xs text-gray-500">~$800K</div>
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setPreset('luxury')} 
            className="h-20 flex flex-col gap-1 border-2 hover:border-purple-400 hover:bg-purple-50 transition-all text-center"
          >
            <div className="text-2xl">✨</div>
            <div className="font-semibold text-sm">{t('predict.form.luxuryEstate')}</div>
            <div className="text-xs text-gray-500">$4M+</div>
          </Button>
        </div>
      </Card>

      {/* Main Form */}
      <Card className="p-6 bg-white shadow-lg border-0">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Size Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Ruler className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">{t('predict.form.dimensions')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="living_area" className="text-sm font-medium text-gray-700">
                  {t('predict.form.livingArea')}
                </Label>
                <Input
                  id="living_area"
                  type="number"
                  value={formData.living_area}
                  onChange={(e) => handleChange('living_area', e.target.value)}
                  min="250"
                  max="15000"
                  step="25"
                  className="border-2 focus:border-blue-400"
                  required
                />
                <p className="text-xs text-gray-500">Interior living space</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lot_area" className="text-sm font-medium text-gray-700">
                  Lot Area (sq ft)
                </Label>
                <Input
                  id="lot_area"
                  type="number"
                  value={formData.lot_area}
                  onChange={(e) => handleChange('lot_area', e.target.value)}
                  min="500"
                  max="100000"
                  step="50"
                  className="border-2 focus:border-blue-400"
                  required
                />
                <p className="text-xs text-gray-500">Total property size</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area_excluding_basement" className="text-sm font-medium text-gray-700">
                  Above Ground Area (sq ft)
                </Label>
                <Input
                  id="area_excluding_basement"
                  type="number"
                  value={formData.area_excluding_basement}
                  onChange={(e) => handleChange('area_excluding_basement', e.target.value)}
                  min="200"
                  max="12000"
                  step="25"
                  className="border-2 focus:border-blue-400"
                  required
                />
                <p className="text-xs text-gray-500">Main floor area</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area_of_basement" className="text-sm font-medium text-gray-700">
                  Basement Area (sq ft)
                </Label>
                <Input
                  id="area_of_basement"
                  type="number"
                  value={formData.area_of_basement}
                  onChange={(e) => handleChange('area_of_basement', e.target.value)}
                  min="0"
                  max="3000"
                  step="50"
                  className="border-2 focus:border-blue-400"
                  required
                />
                <p className="text-xs text-gray-500">Finished basement space</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Room Configuration */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">{t('predict.form.rooms')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number_of_bedrooms" className="text-sm font-medium text-gray-700">
                  Bedrooms
                </Label>
                <Select
                  value={formData.number_of_bedrooms.toString()}
                  onValueChange={(val) => handleChange('number_of_bedrooms', val)}
                >
                  <SelectTrigger className="border-2 focus:border-green-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="number_of_bathrooms" className="text-sm font-medium text-gray-700">
                  Bathrooms
                </Label>
                <Select
                  value={formData.number_of_bathrooms.toString()}
                  onValueChange={(val) => handleChange('number_of_bathrooms', val)}
                >
                  <SelectTrigger className="border-2 focus:border-green-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quality & Condition */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">{t('predict.form.quality')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade_of_house" className="text-sm font-medium text-gray-700">
                  Property Grade (1-13)
                </Label>
                <Select
                  value={formData.grade_of_house.toString()}
                  onValueChange={(val) => handleChange('grade_of_house', val)}
                >
                  <SelectTrigger className="border-2 focus:border-yellow-400">
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
                <p className="text-xs text-gray-500">Overall construction quality</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition_of_house" className="text-sm font-medium text-gray-700">
                  Property Condition (1-5)
                </Label>
                <Select
                  value={formData.condition_of_house.toString()}
                  onValueChange={(val) => handleChange('condition_of_house', val)}
                >
                  <SelectTrigger className="border-2 focus:border-yellow-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Poor (Needs major work)</SelectItem>
                    <SelectItem value="2">2 - Fair (Needs some work)</SelectItem>
                    <SelectItem value="3">3 - Average (Normal wear)</SelectItem>
                    <SelectItem value="4">4 - Good (Well maintained)</SelectItem>
                    <SelectItem value="5">5 - Excellent (Like new)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Current maintenance state</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Property History */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">{t('predict.form.history')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="built_year" className="text-sm font-medium text-gray-700">
                  Year Built
                </Label>
                <Input
                  id="built_year"
                  type="number"
                  value={formData.built_year}
                  onChange={(e) => handleChange('built_year', e.target.value)}
                  min="1900"
                  max="2025"
                  className="border-2 focus:border-purple-400"
                  required
                />
                <p className="text-xs text-gray-500">Original construction year</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="renovation_year" className="text-sm font-medium text-gray-700">
                  Last Renovation Year
                </Label>
                <Select
                  value={formData.renovation_year.toString()}
                  onValueChange={(val) => handleChange('renovation_year', val)}
                >
                  <SelectTrigger className="border-2 focus:border-purple-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Never Renovated</SelectItem>
                    <SelectItem value="2020">2020-2025 (Recent)</SelectItem>
                    <SelectItem value="2015">2015-2019</SelectItem>
                    <SelectItem value="2010">2010-2014</SelectItem>
                    <SelectItem value="2005">2005-2009</SelectItem>
                    <SelectItem value="2000">2000-2004</SelectItem>
                    <SelectItem value="1995">1995-1999</SelectItem>
                    <SelectItem value="1990">1990-1994</SelectItem>
                    <SelectItem value="1985">1985-1989</SelectItem>
                    <SelectItem value="1980">1980-1984</SelectItem>
                    <SelectItem value="1975">1975-1979</SelectItem>
                    <SelectItem value="1970">1970-1974</SelectItem>
                    <SelectItem value="1965">1965-1969</SelectItem>
                    <SelectItem value="1960">1960-1964</SelectItem>
                    <SelectItem value="1955">1955-1959</SelectItem>
                    <SelectItem value="1950">Before 1955</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Most properties are never renovated (94%)</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Location & Geographic */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">{t('predict.form.locationDetails')}</h3>
            </div>
            
            {/* Interactive Map Section */}
            <div className="mb-6">
              <LocationMapSelector
                latitude={formData.lattitude}
                longitude={formData.longitude}
                onLocationChange={handleLocationChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postal_code" className="text-sm font-medium text-gray-700">
                  Postal Code
                </Label>
                <Input
                  id="postal_code"
                  type="number"
                  value={formData.postal_code}
                  onChange={(e) => handleChange('postal_code', e.target.value)}
                  min="100000"
                  max="999999"
                  className="border-2 focus:border-red-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lattitude" className="text-sm font-medium text-gray-700">
                  Latitude
                </Label>
                <Input
                  id="lattitude"
                  type="number"
                  value={formData.lattitude}
                  onChange={(e) => handleChange('lattitude', e.target.value)}
                  step="0.1"
                  className="border-2 focus:border-red-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-sm font-medium text-gray-700">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  step="0.1"
                  className="border-2 focus:border-red-400"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Special Features */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Waves className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">{t('predict.form.features')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="waterfront_present" className="text-sm font-medium text-gray-700">
                  Waterfront Property
                </Label>
                <Select
                  value={formData.waterfront_present.toString()}
                  onValueChange={(val) => handleChange('waterfront_present', val)}
                >
                  <SelectTrigger className="border-2 focus:border-blue-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Waterfront</SelectItem>
                    <SelectItem value="1">Yes - Waterfront Property</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="number_of_views" className="text-sm font-medium text-gray-700">
                  Quality of Views (0-4)
                </Label>
                <Select
                  value={formData.number_of_views.toString()}
                  onValueChange={(val) => handleChange('number_of_views', val)}
                >
                  <SelectTrigger className="border-2 focus:border-blue-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 - No Views</SelectItem>
                    <SelectItem value="1">1 - Fair Views</SelectItem>
                    <SelectItem value="2">2 - Average Views</SelectItem>
                    <SelectItem value="3">3 - Good Views</SelectItem>
                    <SelectItem value="4">4 - Excellent Views</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Neighborhood & Accessibility */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <School className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">{t('predict.form.neighborhood')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number_of_schools_nearby" className="text-sm font-medium text-gray-700">
                  Schools Nearby
                </Label>
                <Input
                  id="number_of_schools_nearby"
                  type="number"
                  value={formData.number_of_schools_nearby}
                  onChange={(e) => handleChange('number_of_schools_nearby', e.target.value)}
                  min="0"
                  max="10"
                  className="border-2 focus:border-green-400"
                  required
                />
                <p className="text-xs text-gray-500">Number of schools within reasonable distance</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance_from_airport" className="text-sm font-medium text-gray-700">
                  Distance from Airport (km)
                </Label>
                <Input
                  id="distance_from_airport"
                  type="number"
                  value={formData.distance_from_airport}
                  onChange={(e) => handleChange('distance_from_airport', e.target.value)}
                  min="1"
                  max="200"
                  step="0.1"
                  className="border-2 focus:border-green-400"
                  required
                />
                <p className="text-xs text-gray-500">Distance to nearest major airport</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Wrench className="h-4 w-4" />
                </div>
                <span>{t('predict.form.generateValuation')}</span>
              </div>
            </Button>
            <p className="text-center text-sm text-gray-500 mt-3">
              {t('predict.form.submitPoweredBy')}
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PredictionForm;
