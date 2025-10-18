import { PredictionResponse, PropertyFeatures } from '@/types/property';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Award, MapPin, MessageCircle, Calculator, HomeIcon, Star, Target, BarChart3, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import PropertyLocationDisplay from '@/components/PropertyLocationDisplay';

interface Props {
  prediction: PredictionResponse;
  formData?: PropertyFeatures;
}

const PredictionResults = ({ prediction, formData }: Props) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChatbotNavigation = () => {
    navigate('/chatbot');
  };

  return (
    <div className="space-y-6">
      {/* Main Price Card */}
      <Card className="p-8 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl border-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-blue-50">{t('predict.results.estimatedValue')}</h3>
          <Award className="h-8 w-8 text-blue-200" />
        </div>
        <div className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-md">
          ${(prediction.predicted_price / 1000).toFixed(0)}K <span className="text-blue-200 text-2xl md:text-3xl">CAD</span>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <div className="text-blue-200 mb-1">{t('predict.results.confidence')}</div>
            <div className="font-bold text-lg text-white">{prediction.confidence_score.toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-blue-200 mb-1">{t('predict.results.modelAccuracy')}</div>
            <div className="font-bold text-lg text-white">{prediction.model_accuracy.toFixed(2)}%</div>
          </div>
        </div>
      </Card>

      {/* Market Analysis */}
      <Card className="p-6 bg-white shadow-lg border-0">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          {t('predict.results.marketAnalysis')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="text-sm text-slate-600 mb-2">{t('predict.results.priceRange')}</div>
            <Badge variant="secondary" className="bg-blue-600 text-white px-3 py-1">{prediction.market_analysis.price_range}</Badge>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="text-sm text-slate-600 mb-2">{t('predict.results.locationRating')}</div>
            <Badge variant="outline" className="border-green-500 text-green-700 px-3 py-1">{prediction.market_analysis.location_rating}</Badge>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <div className="text-sm text-slate-600 mb-2">{t('predict.results.propertyGrade')}</div>
            <Badge className="bg-purple-600 text-white px-3 py-1">{prediction.market_analysis.property_grade}</Badge>
          </div>
        </div>
        <div className="p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border-l-4 border-l-blue-500">
          <div className="text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
            💡 {t('predict.results.investmentAdvice')}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{prediction.market_analysis.investment_advice}</p>
        </div>
      </Card>

      {/* Feature Insights */}
      <Card className="p-6 bg-white shadow-lg border-0">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          {t('predict.results.keyInsights')}
        </h3>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <span className="text-sm font-medium text-slate-700">{t('predict.results.sizeFactor')}</span>
            <Badge variant="outline" className="border-blue-500 text-blue-700 px-3 py-1">{prediction.feature_insights.size_factor}</Badge>
          </div>
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <span className="text-sm font-medium text-slate-700">{t('predict.results.locationPremium')}</span>
            <span className="font-bold text-green-700">{prediction.feature_insights.location_premium ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <span className="text-sm font-medium text-slate-700">{t('predict.results.predictionAccuracy')}</span>
            <span className="font-bold text-purple-700">{prediction.feature_insights.prediction_accuracy}</span>
          </div>
        </div>
        {prediction.feature_insights.key_value_drivers.length > 0 && (
          <div className="p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-l-green-500">
            <div className="text-sm font-semibold mb-3 text-green-800 flex items-center gap-2">
              🔑 {t('predict.results.keyValueDrivers')}
            </div>
            <ul className="space-y-2">
              {prediction.feature_insights.key_value_drivers.map((driver, index) => (
                <li key={index} className="text-sm text-slate-700 flex items-start gap-3">
                  <span className="text-green-600 font-bold text-base">✓</span>
                  <span className="leading-relaxed">{driver}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Investment Calculator */}
      <Card className="p-6 bg-white shadow-lg border-0">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-orange-600" />
          {t('predict.results.investmentCalculator')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
            <div className="text-sm text-slate-600 mb-2">{t('predict.results.downPayment')} (20%)</div>
            <div className="text-xl font-bold text-orange-700">
              ${((prediction.predicted_price * 0.2) / 1000).toFixed(0)}K CAD
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="text-sm text-slate-600 mb-2">{t('predict.results.monthlyMortgage')}</div>
            <div className="text-xl font-bold text-blue-700">
              ${(prediction.predicted_price * 0.005).toFixed(0)} CAD
            </div>
          </div>
        </div>
      </Card>

      {/* Property Location Map */}
      {formData && (
        <Card className="p-6 bg-white shadow-lg border-0">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-600" />
            {t('predict.results.propertyLocation')}
          </h3>
          <div className="mb-4">
            <PropertyLocationDisplay
              latitude={formData.lattitude}
              longitude={formData.longitude}
              price={prediction.predicted_price}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
              <div className="text-slate-600 mb-1">{t('predict.results.coordinates')}</div>
              <div className="font-semibold text-slate-800">
                {formData.lattitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </div>
            </div>
            <div className="p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
              <div className="text-slate-600 mb-1">Postal Code</div>
              <div className="font-semibold text-slate-800">{formData.postal_code}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Chatbot Navigation */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
            <MessageCircle className="h-5 w-5 text-purple-600" />
            {t('predict.results.aiInsights')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('predict.results.aiInsightsDesc')}
          </p>
          <Button 
            onClick={handleChatbotNavigation}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {t('predict.results.chatAboutProperty')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PredictionResults;
