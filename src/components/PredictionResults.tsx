import { PredictionResponse } from '@/types/property';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, MapPin } from 'lucide-react';

interface Props {
  prediction: PredictionResponse;
}

const PredictionResults = ({ prediction }: Props) => {
  return (
    <div className="space-y-6">
      {/* Main Price Card */}
      <Card className="p-8 bg-gradient-primary text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Estimated Property Value</h3>
          <Award className="h-8 w-8 opacity-75" />
        </div>
        <div className="text-5xl font-bold mb-4">
          ₹{(prediction.predicted_price / 100000).toFixed(2)}L
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <div className="opacity-75">Confidence</div>
            <div className="font-semibold">{prediction.confidence_score.toFixed(1)}%</div>
          </div>
          <div>
            <div className="opacity-75">Model Accuracy</div>
            <div className="font-semibold">{prediction.model_accuracy.toFixed(2)}%</div>
          </div>
        </div>
      </Card>

      {/* Market Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Market Analysis
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Price Range</div>
            <Badge variant="secondary">{prediction.market_analysis.price_range}</Badge>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Location Rating</div>
            <Badge variant="outline">{prediction.market_analysis.location_rating}</Badge>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Property Grade</div>
            <Badge>{prediction.market_analysis.property_grade}</Badge>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Luxury Score</div>
            <div className="font-semibold">{prediction.market_analysis.luxury_score.toFixed(1)}</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="text-sm font-medium mb-1">Investment Advice</div>
          <p className="text-sm text-muted-foreground">{prediction.market_analysis.investment_advice}</p>
        </div>
      </Card>

      {/* Feature Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Key Insights
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Size Factor</span>
            <Badge variant="outline">{prediction.feature_insights.size_factor}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Location Premium</span>
            <span className="font-semibold">{prediction.feature_insights.location_premium ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Prediction Accuracy</span>
            <span className="font-semibold">{prediction.feature_insights.prediction_accuracy}</span>
          </div>
        </div>
        {prediction.feature_insights.key_value_drivers.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Key Value Drivers</div>
            <ul className="space-y-1">
              {prediction.feature_insights.key_value_drivers.map((driver, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PredictionResults;
