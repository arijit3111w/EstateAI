# EstateAI - Real Estate AI Platform

Professional real estate valuation platform powered by advanced AI/ML models with 95.97% accuracy.

## Features

### 1. **Landing Page**
- Professional hero carousel with luxury property images
- Feature showcase
- Statistics display
- Call-to-action sections

### 2. **Price Prediction**
- AI-powered property valuation using XGBoost model
- 95.97% accuracy with 25 engineered features
- Interactive form with quick presets (Budget/Average/Luxury)
- Detailed prediction results with market analysis
- Interactive map showing similar properties

### 3. **Interactive Heatmap**
- Visual price distribution across regions
- Color-coded zones (Green=Affordable, Yellow=Mid-Range, Red=Premium)
- Filters for price range and property grade
- Clickable markers with property details

### 4. **AI Chatbot Assistant**
- 24/7 intelligent conversation interface
- Quick action buttons
- Property recommendations
- Market insights

### 5. **Investment Analytics Dashboard**
- ROI Calculator
- Rental Income Analyzer (with yield calculations)
- EMI Calculator
- Property Comparison Tool

## Technology Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS + shadcn/ui components
- **Maps**: React Leaflet
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Backend**: FastAPI (Python)
- **ML Model**: XGBoost

## Project Structure

```
real-estate-website/
├── src/
│   ├── assets/          # Images and static files
│   ├── components/      # Reusable React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── PredictionForm.tsx
│   │   ├── PredictionResults.tsx
│   │   ├── PropertyMap.tsx
│   │   └── HeatmapView.tsx
│   ├── pages/           # Page components
│   │   ├── Landing.tsx
│   │   ├── Predict.tsx
│   │   ├── Heatmap.tsx
│   │   ├── Chatbot.tsx
│   │   └── Analytics.tsx
│   ├── types/           # TypeScript type definitions
│   ├── lib/             # Utility functions and API calls
│   └── App.tsx          # Main app component
├── public/
│   └── data/            # CSV data files
└── backend/             # Python backend (your existing model)
    ├── main.py          # FastAPI server
    └── model/           # ML model artifacts
```

## How to Run the Application

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- pip

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install fastapi uvicorn joblib pandas numpy pydantic
```

3. Run the FastAPI server:
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start at `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:8080`

## Available Routes

- `/` - Landing page
- `/predict` - Price prediction with map
- `/heatmap` - Interactive price heatmap
- `/chatbot` - AI assistant
- `/analytics` - Investment analytics dashboard

## API Endpoint

The backend provides a single prediction endpoint:

```
POST http://localhost:8000/predict
```

**Request Body:**
```json
{
  "living_area": 1800,
  "lot_area": 4000,
  "number_of_bedrooms": 3,
  "number_of_bathrooms": 2,
  "grade_of_house": 7,
  "area_excluding_basement": 1600,
  "area_of_basement": 200,
  "postal_code": 122005,
  "lattitude": 47.6,
  "longitude": -122.3,
  "number_of_views": 1,
  "waterfront_present": 0,
  "condition_of_house": 3,
  "built_year": 2000,
  "renovation_year": 0,
  "number_of_schools_nearby": 5,
  "distance_from_airport": 20.0
}
```

## Design Theme

- **Primary Color**: Deep Professional Blue (#1e40af)
- **Secondary Color**: Luxury Gold (#f59e0b)
- **Success Color**: Green (#22c55e)
- **Typography**: Clean sans-serif
- **Style**: Professional, modern, trustworthy

## Features Highlight

✓ 95.97% prediction accuracy
✓ 25 engineered features
✓ 99.7% predictions within 10%
✓ Interactive maps with real data
✓ ROI and rental yield calculators
✓ AI-powered chatbot
✓ Responsive design
✓ Professional color scheme

## Notes

- No authentication required
- All features are publicly accessible
- Maps use OpenStreetMap tiles
- CSV data is loaded client-side for heatmap and property matching
- Backend model must be running for predictions to work
