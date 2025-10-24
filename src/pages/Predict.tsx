import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PredictionForm from '@/components/PredictionForm';
import PredictionResults from '@/components/PredictionResults';
import RelatedHouses from '@/components/RelatedHouses';
import PropertyMap from '@/components/PropertyMap';
import { PredictionResponse, PropertyFeatures } from '@/types/property';
import { usePrediction } from '@/contexts/PredictionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Loader2, TrendingUp, MapPin, Home, DollarSign, BarChart3, Calculator } from 'lucide-react';

const Predict = () => {
  const { t } = useLanguage();
  const { 
    prediction, 
    formData, 
    setPrediction, 
    setFormData, 
    clearPredictionData 
  } = usePrediction();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrediction = (pred: PredictionResponse, data: PropertyFeatures) => {
    setPrediction(pred);
    setFormData(data);
    setError(null);
  };

  const handleError = (err: string) => {
    setError(err);
    clearPredictionData();
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-transparent py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              {t('predict.title')}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600/80 max-w-3xl mx-auto">
              {t('predict.subtitle')}
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Left Column - Form */}
            <div className="w-full">
              <PredictionForm
                onPrediction={handlePrediction}
                onLoading={setLoading}
                onError={handleError}
              />
            </div>

            {/* Right Column - Results */}
            <div className="w-full space-y-6">
              {/* Loading State */}
              {loading && (
                <Card className="p-8 sm:p-12 flex flex-col items-center justify-center min-h-[400px] bg-white/60 backdrop-blur-sm shadow-lg">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                  <p className="text-lg text-slate-600 text-center">Analyzing property features...</p>
                  <p className="text-sm text-slate-400 mt-2">This may take a few seconds</p>
                </Card>
              )}

              {/* Error State */}
              {error && (
                <Card className="p-6 sm:p-8 border-red-200 bg-red-50/80 backdrop-blur-sm shadow-lg">
                  <h3 className="text-xl font-semibold text-red-700 mb-2 flex items-center gap-2">
                    ⚠️ Prediction Error
                  </h3>
                  <p className="text-red-600 text-sm leading-relaxed">{error}</p>
                </Card>
              )}

              {/* Prediction Results */}
              {prediction && !loading && (
                <PredictionResults prediction={prediction} formData={formData} />
              )}

              {/* Placeholder/Empty State - Matches Form Height */}
              {!prediction && !loading && !error && (
                <div className="space-y-6">
                  {/* Main Price Card - To Be Predicted */}
                  <Card className="p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-600 rounded-lg">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">Estimated Value</h3>
                        <p className="text-sm text-slate-600">AI-Powered Prediction</p>
                      </div>
                    </div>
                    <div className="text-center py-8 relative">
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <DollarSign className="h-32 w-32 text-blue-600" />
                      </div>
                      <div className="relative">
                        <div className="text-5xl font-bold text-slate-300 mb-2">$---,---</div>
                        <p className="text-slate-500">To be predicted</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-3 bg-white/60 rounded-lg">
                        <p className="text-xs text-slate-600 mb-1">Confidence Score</p>
                        <p className="text-lg font-semibold text-slate-300">--%</p>
                      </div>
                      <div className="p-3 bg-white/60 rounded-lg">
                        <p className="text-xs text-slate-600 mb-1">Model Accuracy</p>
                        <p className="text-lg font-semibold text-slate-300">95.97%</p>
                      </div>
                    </div>
                  </Card>

                  {/* Market Analysis - To Be Predicted */}
                  <Card className="p-6 bg-white/60 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Market Analysis</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-green-50/80 to-emerald-50/80 rounded-lg relative overflow-hidden">
                        <div className="absolute top-2 right-2 opacity-20">
                          <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="text-sm text-slate-600 mb-2">Price Range</p>
                        <p className="text-lg font-semibold text-slate-300">$--- - $---</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-lg relative overflow-hidden">
                        <div className="absolute top-2 right-2 opacity-20">
                          <MapPin className="h-8 w-8 text-purple-600" />
                        </div>
                        <p className="text-sm text-slate-600 mb-2">Location Rating</p>
                        <p className="text-lg font-semibold text-slate-300">-/10</p>
                      </div>
                    </div>
                  </Card>

                  {/* Feature Insights - To Be Predicted */}
                  <Card className="p-6 bg-white/60 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Feature Insights</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-50/80 rounded-lg">
                        <span className="text-sm text-slate-700">Size Factor</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-300 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                          <span className="font-semibold text-slate-300">--%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50/80 rounded-lg">
                        <span className="text-sm text-slate-700">Location Premium</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-300 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                          <span className="font-semibold text-slate-300">--%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50/80 rounded-lg">
                        <span className="text-sm text-slate-700">Prediction Accuracy</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-300 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                          <span className="font-semibold text-slate-300">--%</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Price Trend Chart Placeholder */}
                  <Card className="p-6 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-sm shadow-lg border-indigo-200">
                    <div className="flex items-center gap-3 mb-4">
                      <BarChart3 className="h-5 w-5 text-indigo-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Price Trend Analysis</h3>
                    </div>
                    <div className="h-40 bg-white/60 rounded-lg flex items-end justify-around p-4 gap-2">
                      {[40, 55, 45, 70, 60, 80, 0].map((height, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            className="w-full bg-gradient-to-t from-indigo-300 to-indigo-200 rounded-t transition-all duration-300"
                            style={{ height: height > 0 ? `${height}%` : '10%', opacity: height > 0 ? 0.7 : 0.3 }}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-sm text-slate-500 mt-3">Historical price trends will appear here</p>
                  </Card>

                  {/* Investment Calculator - To Be Predicted */}
                  <Card className="p-6 bg-gradient-to-br from-orange-50/80 to-amber-50/80 backdrop-blur-sm shadow-lg border-orange-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Calculator className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Investment Calculator</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/60 rounded-lg relative overflow-hidden">
                        <div className="absolute top-2 right-2 opacity-10">
                          <DollarSign className="h-12 w-12 text-orange-600" />
                        </div>
                        <p className="text-sm text-slate-600 mb-1">Estimated Down Payment (20%)</p>
                        <p className="text-2xl font-bold text-slate-300">$---,---</p>
                      </div>
                      <div className="p-4 bg-white/60 rounded-lg relative overflow-hidden">
                        <div className="absolute top-2 right-2 opacity-10">
                          <Calculator className="h-12 w-12 text-orange-600" />
                        </div>
                        <p className="text-sm text-slate-600 mb-1">Monthly Mortgage (5% APR, 30yr)</p>
                        <p className="text-2xl font-bold text-slate-300">$---/mo</p>
                      </div>
                    </div>
                  </Card>

                  {/* Property Location Placeholder */}
                  <Card className="p-6 bg-white/60 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Property Location</h3>
                    </div>
                    <div className="h-48 bg-gradient-to-br from-slate-100/80 to-slate-200/80 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-1/4 left-1/4 w-1 h-full bg-slate-400"></div>
                        <div className="absolute top-1/4 left-2/4 w-1 h-full bg-slate-400"></div>
                        <div className="absolute top-1/4 left-3/4 w-1 h-full bg-slate-400"></div>
                        <div className="absolute left-0 top-1/4 w-full h-1 bg-slate-400"></div>
                        <div className="absolute left-0 top-2/4 w-full h-1 bg-slate-400"></div>
                        <div className="absolute left-0 top-3/4 w-full h-1 bg-slate-400"></div>
                      </div>
                      <div className="text-center relative z-10">
                        <Home className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-500">Location map will appear here</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-slate-50/80 rounded-lg">
                      <p className="text-sm text-slate-600">Coordinates: <span className="font-mono text-slate-300">--.----, --.----</span></p>
                      <p className="text-sm text-slate-600 mt-1">Postal Code: <span className="font-mono text-slate-300">------</span></p>
                    </div>
                  </Card>

                  {/* AI Insights Preview */}
                  <Card className="p-6 bg-gradient-to-br from-violet-50/80 to-purple-50/80 backdrop-blur-sm shadow-lg border-violet-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-violet-600 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">AI Insights</h3>
                        <p className="text-xs text-slate-600">Powered by Machine Learning</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-white/60 rounded-lg flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5"></div>
                        <p className="text-sm text-slate-600 flex-1">Neighborhood analysis and price comparison</p>
                      </div>
                      <div className="p-3 bg-white/60 rounded-lg flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5"></div>
                        <p className="text-sm text-slate-600 flex-1">Property value drivers and key factors</p>
                      </div>
                      <div className="p-3 bg-white/60 rounded-lg flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5"></div>
                        <p className="text-sm text-slate-600 flex-1">Investment recommendations</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Full Width Sections Below */}
          {prediction && formData && !loading && (
            <div className="mt-6 lg:mt-8 space-y-6 lg:space-y-8">
              {/* Related Houses Section */}
              <RelatedHouses 
                targetPrice={prediction.predicted_price}
                targetFeatures={{
                  bedrooms: formData.number_of_bedrooms,
                  bathrooms: formData.number_of_bathrooms,
                  living_area: formData.living_area,
                  grade: formData.grade_of_house,
                  condition: formData.condition_of_house,
                  latitude: formData.lattitude,
                  longitude: formData.longitude,
                }}
              />

              {/* Property Map with Related Houses */}
              <PropertyMap 
                targetPrice={prediction.predicted_price}
                mapCenter={{ lat: formData.lattitude, lng: formData.longitude }}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Predict;
