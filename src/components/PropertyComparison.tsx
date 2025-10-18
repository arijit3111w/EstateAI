import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePrediction } from '@/contexts/PredictionContext';
import FavoriteButton from './FavoriteButton';
import { TrendingUp, DollarSign, Home, Award, Calculator, Eye, Star } from 'lucide-react';

interface PropertyComparison {
  id: string;
  property: any;
  roi10Year: number;
  monthlyEMI: number;
  totalInterest: number;
  rentalYield: number;
  investmentScore: number;
  rankScore: number;
}

interface PropertyComparisonProps {
  onPropertySelect?: (property: any) => void;
  selectedPropertyId?: string;
}

const PropertyComparisonComponent: React.FC<PropertyComparisonProps> = ({ 
  onPropertySelect, 
  selectedPropertyId 
}) => {
  const { prediction, relatedHouses, hasPredictionData, isLoadingRelatedHouses } = usePrediction();
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [expectedAppreciation, setExpectedAppreciation] = useState(8);
  const [expectedRent, setExpectedRent] = useState(15000);

  // Calculate comprehensive comparison data
  const comparisonData = useMemo(() => {
    if (!hasPredictionData || relatedHouses.length === 0) return [];

    const calculations: PropertyComparison[] = relatedHouses.map(house => {
      const price = house.price;
      const downPayment = (price * downPaymentPercent) / 100;
      const loanAmount = price - downPayment;
      
      // EMI calculation
      const monthlyRate = interestRate / 12 / 100;
      const totalMonths = loanTenure * 12;
      const monthlyEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                        (Math.pow(1 + monthlyRate, totalMonths) - 1);
      
      // Total interest
      const totalInterest = (monthlyEMI * totalMonths) - loanAmount;
      
      // ROI calculation (10-year projection)
      const futureValue = price * Math.pow(1 + expectedAppreciation / 100, 10);
      const totalInvestment = downPayment;
      const roi10Year = ((futureValue - price) / totalInvestment) * 100;
      
      // Rental yield calculation
      const annualRent = expectedRent * 12;
      const rentalYield = (annualRent / price) * 100;
      
      // Investment score calculation (weighted combination of factors)
      let investmentScore = 0;
      investmentScore += Math.min(roi10Year / 10, 10) * 0.4; // ROI weight: 40%
      investmentScore += Math.min(rentalYield * 2, 10) * 0.3; // Rental yield weight: 30%
      investmentScore += Math.min(house.grade, 10) * 0.15; // Property grade weight: 15%
      investmentScore += Math.min((house.living_area / 1000), 10) * 0.15; // Size weight: 15%
      
      // Penalty for very high EMI relative to expected rent
      const emiToRentRatio = monthlyEMI / expectedRent;
      if (emiToRentRatio > 0.8) {
        investmentScore *= 0.8; // 20% penalty if EMI > 80% of rent
      }
      
      return {
        id: house.id,
        property: house,
        roi10Year,
        monthlyEMI: isNaN(monthlyEMI) ? 0 : monthlyEMI,
        totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
        rentalYield,
        investmentScore,
        rankScore: investmentScore
      };
    });

    // Sort by investment score (best first)
    return calculations.sort((a, b) => b.rankScore - a.rankScore);
  }, [relatedHouses, interestRate, loanTenure, downPaymentPercent, expectedAppreciation, expectedRent]);

  const bestProperty = comparisonData.length > 0 ? comparisonData[0] : null;

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toFixed(0)}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!hasPredictionData) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Home className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-700">No Properties to Compare</h3>
        <p className="text-gray-500 mb-4">
          Make a price prediction first to see property comparisons here.
        </p>
        <Button 
          onClick={() => window.location.href = '/predict'}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Go to Prediction
        </Button>
      </Card>
    );
  }

  if (isLoadingRelatedHouses) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
          <Home className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Loading Properties...</h3>
        <p className="text-gray-500 mb-4">
          Finding similar properties for comparison analysis.
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Investment Parameters
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
            <Select value={interestRate.toString()} onValueChange={(value) => setInterestRate(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6.5">6.5%</SelectItem>
                <SelectItem value="7.0">7.0%</SelectItem>
                <SelectItem value="7.5">7.5%</SelectItem>
                <SelectItem value="8.0">8.0%</SelectItem>
                <SelectItem value="8.5">8.5%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Loan Tenure (years)</label>
            <Select value={loanTenure.toString()} onValueChange={(value) => setLoanTenure(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 years</SelectItem>
                <SelectItem value="20">20 years</SelectItem>
                <SelectItem value="25">25 years</SelectItem>
                <SelectItem value="30">30 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Down Payment (%)</label>
            <Select value={downPaymentPercent.toString()} onValueChange={(value) => setDownPaymentPercent(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10%</SelectItem>
                <SelectItem value="15">15%</SelectItem>
                <SelectItem value="20">20%</SelectItem>
                <SelectItem value="25">25%</SelectItem>
                <SelectItem value="30">30%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Appreciation (%/year)</label>
            <Select value={expectedAppreciation.toString()} onValueChange={(value) => setExpectedAppreciation(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="6">6%</SelectItem>
                <SelectItem value="7">7%</SelectItem>
                <SelectItem value="8">8%</SelectItem>
                <SelectItem value="9">9%</SelectItem>
                <SelectItem value="10">10%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="expectedRent" className="block text-sm font-medium mb-1">Expected Rent (CAD/month)</Label>
            <Input
              id="expectedRent"
              type="number"
              value={expectedRent}
              onChange={(e) => setExpectedRent(Number(e.target.value) || 0)}
              placeholder="Enter monthly rent"
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Best Investment Highlight */}
      {bestProperty && (
        <Card className="p-6 bg-gradient-to-r from-green-600 to-green-700 text-white border-0 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Award className="h-6 w-6 text-yellow-300" />
                🏆 Best Investment Opportunity
              </h3>
              <p className="text-green-100">Highest investment score based on ROI, rental yield, and property quality</p>
            </div>
            <Badge className="bg-yellow-500 text-yellow-900 px-3 py-1 font-bold">
              Score: {bestProperty.investmentScore.toFixed(1)}/10
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-green-200 text-sm">Property Price</div>
              <div className="text-2xl font-bold">{formatPrice(bestProperty.property.price)} CAD</div>
            </div>
            <div>
              <div className="text-green-200 text-sm">10-Year ROI</div>
              <div className="text-2xl font-bold text-yellow-300">{bestProperty.roi10Year.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-green-200 text-sm">Monthly EMI</div>
              <div className="text-2xl font-bold">{formatCurrency(bestProperty.monthlyEMI)}</div>
            </div>
            <div>
              <div className="text-green-200 text-sm">Rental Yield</div>
              <div className="text-2xl font-bold text-yellow-300">{bestProperty.rentalYield.toFixed(2)}%</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => onPropertySelect?.(bestProperty.property)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Calculator className="h-4 w-4 mr-1" />
              Analyze in Detail
            </Button>
          </div>
        </Card>
      )}

      {/* Property Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {comparisonData.map((item, index) => (
          <Card 
            key={item.id} 
            className={`p-5 border-2 transition-all duration-200 hover:shadow-lg ${
              selectedPropertyId === item.id 
                ? 'border-blue-500 bg-blue-50' 
                : index === 0 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Badge variant={index === 0 ? "default" : "secondary"} className={`${
                  index === 0 ? 'bg-green-600' : ''
                }`}>
                  #{index + 1}
                </Badge>
                {index === 0 && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                <FavoriteButton 
                  houseId={item.property.id} 
                  houseData={{
                    id: item.property.id,
                    price: item.property.price,
                    bedrooms: item.property.bedrooms,
                    bathrooms: item.property.bathrooms,
                    living_area: item.property.living_area,
                    lot_area: item.property.lot_area,
                    built_year: item.property.built_year,
                    grade: item.property.grade,
                    condition: item.property.condition,
                    latitude: item.property.latitude,
                    longitude: item.property.longitude,
                    waterfront: item.property.waterfront,
                    views: item.property.views,
                    schools_nearby: item.property.schools_nearby,
                    distance_from_airport: item.property.distance_from_airport
                  }}
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6 text-gray-500 hover:text-red-500"
                />
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-700">
                  {formatPrice(item.property.price)} CAD
                </div>
                <div className="text-sm text-gray-500">
                  Investment Score: <span className="font-semibold">{item.investmentScore.toFixed(1)}/10</span>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <Home className="h-3 w-3 text-gray-500" />
                <span>{item.property.bedrooms}BR, {item.property.bathrooms}BA</span>
              </div>
              <div className="text-gray-600">
                {item.property.living_area.toLocaleString()} sqft
              </div>
              <div className="text-gray-600">
                Grade: {item.property.grade}
              </div>
              <div className="text-gray-600">
                Built: {item.property.built_year || 'N/A'}
              </div>
            </div>

            {/* Investment Metrics */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded">
                <span className="text-sm font-medium">10-Year ROI</span>
                <span className="font-bold text-blue-700">{item.roi10Year.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-green-100 rounded">
                <span className="text-sm font-medium">Monthly EMI</span>
                <span className="font-bold text-green-700">{formatCurrency(item.monthlyEMI)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded">
                <span className="text-sm font-medium">Rental Yield</span>
                <span className="font-bold text-purple-700">{item.rentalYield.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded">
                <span className="text-sm font-medium">Total Interest</span>
                <span className="font-bold text-orange-700">{formatCurrency(item.totalInterest)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onPropertySelect?.(item.property)}
              >
                <Calculator className="h-4 w-4 mr-1" />
                Select for Analysis
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-blue-50">
        <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{comparisonData.length}</div>
            <div className="text-sm text-gray-600">Properties Analyzed</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {comparisonData.length > 0 ? comparisonData[0].roi10Year.toFixed(1) : '0'}%
            </div>
            <div className="text-sm text-gray-600">Best ROI (10-year)</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {comparisonData.length > 0 ? formatCurrency(Math.min(...comparisonData.map(c => c.monthlyEMI))) : '$0'}
            </div>
            <div className="text-sm text-gray-600">Lowest EMI</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {comparisonData.length > 0 ? Math.max(...comparisonData.map(c => c.rentalYield)).toFixed(2) : '0'}%
            </div>
            <div className="text-sm text-gray-600">Highest Rental Yield</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PropertyComparisonComponent;