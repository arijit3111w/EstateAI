import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PredictionForm from '@/components/PredictionForm';
import PredictionResults from '@/components/PredictionResults';
import RelatedHouses from '@/components/RelatedHouses';
import PropertyMap from '@/components/PropertyMap';
import { PredictionResponse, PropertyFeatures } from '@/types/property';
import { usePrediction } from '@/contexts/PredictionContext';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const Predict = () => {
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
      
      <main className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              AI Property Valuation - Canada
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Get accurate Canadian property price predictions using our 95.97% accurate AI model
            </p>
          </div>

          <div className="space-y-8">
            {/* Top Section: Form and Results */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              {/* Form Section */}
              <div className="order-2 xl:order-1">
                <PredictionForm
                  onPrediction={handlePrediction}
                  onLoading={setLoading}
                  onError={handleError}
                />
              </div>

              {/* Results Section */}
              <div className="order-1 xl:order-2">
                {loading && (
                  <Card className="p-8 sm:p-12 flex flex-col items-center justify-center min-h-[400px] bg-white shadow-lg">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                    <p className="text-lg text-slate-600 text-center">Analyzing property features...</p>
                    <p className="text-sm text-slate-400 mt-2">This may take a few seconds</p>
                  </Card>
                )}

                {error && (
                  <Card className="p-6 sm:p-8 border-red-200 bg-red-50 shadow-lg">
                    <h3 className="text-xl font-semibold text-red-700 mb-2 flex items-center gap-2">
                      ⚠️ Prediction Error
                    </h3>
                    <p className="text-red-600 text-sm leading-relaxed">{error}</p>
                  </Card>
                )}

                {prediction && !loading && (
                  <PredictionResults prediction={prediction} />
                )}

                {!prediction && !loading && !error && (
                  <Card className="p-8 sm:p-12 bg-white shadow-lg border-0">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🏠</span>
                      </div>
                      <h3 className="text-2xl font-semibold mb-4 text-slate-800">Prediction Results</h3>
                      <p className="text-slate-600 mb-8 max-w-md mx-auto">
                        Fill out the form to get your professional property valuation
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <span className="text-green-600 text-lg">✓</span>
                          <span className="text-sm text-slate-700">95.97% Prediction Accuracy</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-600 text-lg">✓</span>
                          <span className="text-sm text-slate-700">25 Engineered Features</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                          <span className="text-purple-600 text-lg">✓</span>
                          <span className="text-sm text-slate-700">99.7% within 10% Accuracy</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                          <span className="text-orange-600 text-lg">✓</span>
                          <span className="text-sm text-slate-700">Advanced Market Analysis</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Bottom Section: Related Houses - Full Width */}
            {prediction && formData && !loading && (
              <div className="w-full">
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
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Predict;
