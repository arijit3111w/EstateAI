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
  onPrediction: (prediction: PredictionResponse) => void;
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
      onPrediction(result);
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
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Property Details</h2>

      <div className="flex gap-2 mb-6">
        <Button type="button" variant="outline" size="sm" onClick={() => setPreset('budget')}>
          Budget Home
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setPreset('average')}>
          Average Home
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setPreset('luxury')}>
          Luxury Home
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
                {Array.from({ length: 13 }, (_, i) => i + 1).map((grade) => (
                  <SelectItem key={grade} value={grade.toString()}>
                    {grade}
                  </SelectItem>
                ))}
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
                {[1, 2, 3, 4, 5].map((cond) => (
                  <SelectItem key={cond} value={cond.toString()}>
                    {cond}
                  </SelectItem>
                ))}
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
              required
            />
          </div>
          <div>
            <Label htmlFor="waterfront_present">Waterfront</Label>
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
        </div>

        <Button type="submit" className="w-full gradient-primary">
          Get AI Prediction
        </Button>
      </form>
    </Card>
  );
};

export default PredictionForm;
