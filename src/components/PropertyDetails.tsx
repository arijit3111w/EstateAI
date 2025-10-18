import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Home, Calendar, Ruler, Car, School, Eye, Waves, Wrench } from 'lucide-react';
import { DetailedPropertyData } from '@/types/property';
import { useLanguage } from '@/contexts/LanguageContext';

interface PropertyDetailsProps {
  property: DetailedPropertyData | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, isOpen, onClose }) => {
  const { t } = useLanguage();
  
  if (!property) return null;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (area: number): string => {
    return new Intl.NumberFormat('en-CA').format(area);
  };

  const getGradeDescription = (grade: number): string => {
    if (grade >= 13) return t('predict.related.gradeLuxury');
    if (grade >= 11) return t('predict.related.gradeExcellent');
    if (grade >= 9) return t('predict.related.gradeVeryGood');
    if (grade >= 7) return t('predict.related.gradeGood');
    if (grade >= 5) return t('predict.related.gradeAverage');
    return t('predict.related.gradeBelowAverage');
  };

  const getConditionDescription = (condition: number): string => {
    if (condition >= 5) return t('predict.related.conditionExcellent');
    if (condition >= 4) return t('predict.related.conditionVeryGood');
    if (condition >= 3) return t('predict.related.conditionGood');
    if (condition >= 2) return t('predict.related.conditionFair');
    return t('predict.related.conditionPoor');
  };

  const calculateAge = (): number => {
    const currentYear = new Date().getFullYear();
    return currentYear - property.built_year;
  };

  const getLocationDescription = (): string => {
    const postalStr = property.postal_code.toString();
    if (postalStr.startsWith('122004')) return 'Downtown Calgary';
    if (postalStr.startsWith('122005')) return 'Northeast Calgary';
    if (postalStr.startsWith('122006')) return 'Northwest Calgary';
    if (postalStr.startsWith('122007')) return 'Southwest Calgary';
    return 'Calgary, AB';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Home className="h-6 w-6 text-blue-600" />
            {t('predict.related.propertyDetails')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Property Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-3xl font-bold text-green-600">
                  {formatPrice(property.price)}
                </span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {t('predict.related.grade')} {property.grade_of_house} - {getGradeDescription(property.grade_of_house)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                <MapPin className="h-5 w-5" />
                <span>{getLocationDescription()}</span>
                <span className="text-sm">({property.latitude.toFixed(4)}, {property.longitude.toFixed(4)})</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{property.number_of_bedrooms}</div>
                  <div className="text-sm text-gray-500">{t('predict.related.bedrooms')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{property.number_of_bathrooms}</div>
                  <div className="text-sm text-gray-500">{t('predict.related.bathrooms')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatArea(property.living_area)}</div>
                  <div className="text-sm text-gray-500">{t('predict.related.livingArea')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatArea(property.lot_area)}</div>
                  <div className="text-sm text-gray-500">{t('predict.related.lotSize')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Building Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  {t('predict.related.buildingInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('predict.related.builtYear')}
                  </span>
                  <span className="font-semibold">{property.built_year} ({calculateAge()} {t('predict.related.yearsOld')})</span>
                </div>
                {property.renovation_year > 0 && (
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      {t('predict.related.renovated')}
                    </span>
                    <span className="font-semibold">{property.renovation_year}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t('predict.related.numberOfFloors')}</span>
                  <span className="font-semibold">{property.number_of_floors}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('predict.related.condition')}</span>
                  <Badge variant="outline">
                    {getConditionDescription(property.condition_of_house)} ({property.condition_of_house}/5)
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Area Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  {t('predict.related.areaBreakdown')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>{t('predict.related.excludingBasement')}</span>
                  <span className="font-semibold">{formatArea(property.area_excluding_basement)} {t('predict.related.sqft')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('predict.related.basementArea')}</span>
                  <span className="font-semibold">{formatArea(property.area_of_basement)} {t('predict.related.sqft')}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>{t('predict.related.totalLivingArea')}</span>
                  <span>{formatArea(property.living_area)} {t('predict.related.sqft')}</span>
                </div>
                {property.living_area_renov !== property.living_area && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t('predict.related.postRenovation')}</span>
                    <span>{formatArea(property.living_area_renov)} {t('predict.related.sqft')}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location & Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('predict.related.locationAmenities')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <School className="h-4 w-4" />
                    {t('predict.related.nearbySchools')}
                  </span>
                  <span className="font-semibold">{property.number_of_schools_nearby}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    {t('predict.related.airportDistance')}
                  </span>
                  <span className="font-semibold">{property.distance_from_airport} km</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('predict.related.postalCode')}</span>
                  <span className="font-semibold">{property.postal_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Waves className="h-4 w-4" />
                    {t('predict.related.waterfront')}
                  </span>
                  <Badge variant={property.waterfront_present ? "default" : "secondary"}>
                    {property.waterfront_present ? t('predict.related.yes') : t('predict.related.no')}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Views & Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {t('predict.related.viewsFeatures')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>{t('predict.related.numberOfViews')}</span>
                  <span className="font-semibold">{property.number_of_views}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('predict.related.propertyId')}</span>
                  <span className="font-mono text-sm">{property.id}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">{t('predict.related.qualityIndicators')}:</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{t('predict.related.grade')} {property.grade_of_house}</Badge>
                    <Badge variant="outline">{t('predict.related.condition')} {property.condition_of_house}/5</Badge>
                    {property.waterfront_present === 1 && (
                      <Badge variant="default">{t('predict.related.waterfront')}</Badge>
                    )}
                    {property.number_of_views > 3 && (
                      <Badge variant="default">{t('predict.related.greatViews')}</Badge>
                    )}
                    {calculateAge() < 10 && (
                      <Badge variant="default">{t('predict.related.newBuild')}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Insights */}
          <Card>
            <CardHeader>
              <CardTitle>{t('predict.related.propertyInsights')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((property.living_area / property.lot_area) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">{t('predict.related.lotCoverage')}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(property.living_area / property.number_of_bedrooms)}
                  </div>
                  <div className="text-sm text-gray-600">{t('predict.related.sqFtPerBedroom')}</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(property.price / property.living_area)}
                  </div>
                  <div className="text-sm text-gray-600">{t('predict.related.cadPerSqFt')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetails;