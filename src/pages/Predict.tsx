import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PredictionForm from '@/components/PredictionForm';
import PredictionResults from '@/components/PredictionResults';
import PropertyMap from '@/components/PropertyMap';
import { PredictionResponse } from '@/types/property';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const Predict = () => {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">AI Property Valuation</h1>
            <p className="text-xl text-muted-foreground">
              Get accurate price predictions using our 95.97% accurate AI model
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <PredictionForm
                onPrediction={(pred) => {
                  setPrediction(pred);
                  setError(null);
                }}
                onLoading={setLoading}
                onError={(err) => {
                  setError(err);
                  setPrediction(null);
                }}
              />
            </div>

            {/* Results Section */}
            <div>
              {loading && (
                <Card className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-lg text-muted-foreground">Analyzing property features...</p>
                </Card>
              )}

              {error && (
                <Card className="p-8 border-destructive">
                  <h3 className="text-xl font-semibold text-destructive mb-2">Prediction Error</h3>
                  <p className="text-muted-foreground">{error}</p>
                </Card>
              )}

              {prediction && !loading && (
                <div className="space-y-6">
                  <PredictionResults prediction={prediction} />
                  
                  {/* Map showing similar properties */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Properties in Similar Price Range</h3>
                    <div className="h-[400px] rounded-lg overflow-hidden">
                      <PropertyMap targetPrice={prediction.predicted_price} />
                    </div>
                  </Card>
                </div>
              )}

              {!prediction && !loading && !error && (
                <Card className="p-12">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-4">Prediction Results</h3>
                    <p className="text-muted-foreground mb-6">
                      Fill out the form to get your property valuation
                    </p>
                    <div className="space-y-3 text-left max-w-md mx-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span>95.97% Prediction Accuracy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span>25 Engineered Features</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span>99.7% within 10% Accuracy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span>Advanced Market Analysis</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Predict;
