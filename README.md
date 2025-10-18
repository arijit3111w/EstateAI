# 🏠 Value Home Vision - AI-Powered Real Estate Platform

> Professional real estate valuation platform powered by advanced machine learning and AI technology

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.12-green.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-teal.svg)](https://fastapi.tiangolo.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [ML Model Details](#ml-model-details)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

**Value Home Vision** is a cutting-edge real estate platform that leverages artificial intelligence to provide accurate property valuations, market insights, and investment recommendations. Built with modern web technologies and powered by advanced machine learning algorithms, it delivers institutional-grade analysis for real estate professionals and investors.

### 🎯 Key Highlights

- **95.97% Prediction Accuracy** - Industry-leading ML model performance
- **99.7% Precision Rate** - Predictions within 10% of actual values
- **25 AI Features** - Comprehensive property analysis
- **14K+ Properties** - Extensive training dataset
- **Real-time Analysis** - Instant property valuations
- **24/7 AI Assistant** - Powered by Google Gemini AI

## ✨ Features

### 🤖 AI-Powered Property Prediction
- Advanced XGBoost machine learning model with 95.97% accuracy
- 25 engineered features for comprehensive property analysis
- Real-time price predictions with confidence scores
- Market trend analysis and investment insights

### 💬 Intelligent Chatbot Assistant
- Natural language property queries
- Gemini AI integration for conversational interactions
- Feature extraction from user messages
- Property recommendations and comparisons
- Investment advice and market analysis

### 🗺️ Interactive Heatmap Visualization
- Color-coded property price visualization
- Regional market analysis
- Interactive map with property clusters
- Zoom and filter capabilities

### 📊 Investment Analytics Dashboard
- ROI calculator and rental income analyzer
- Market timing advisor
- Property comparison tools
- Performance metrics and trends

### 🎨 Professional UI/UX
- Modern, responsive design
- Professional real estate theme
- Gradient animations and smooth transitions
- Mobile-optimized interface

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern JavaScript library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality UI components
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **React Leaflet** - Interactive maps

### Backend
- **Python 3.12** - Server-side programming
- **FastAPI** - Modern, fast web framework
- **Uvicorn** - ASGI server implementation
- **Pydantic** - Data validation and serialization

### Machine Learning & AI
- **XGBoost** - Gradient boosting framework
- **Scikit-learn** - Machine learning library
- **Pandas & NumPy** - Data manipulation
- **Joblib** - Model serialization
- **Google Generative AI (Gemini)** - Conversational AI

### Development Tools
- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Python Virtual Environment** - Dependency isolation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Services   │
│   (React/TS)    │◄──►│   (FastAPI)     │◄──►│   (Gemini AI)   │
│                 │    │                 │    │                 │
│ • Landing Page  │    │ • ML Prediction │    │ • Chatbot       │
│ • Property Form │    │ • API Endpoints │    │ • NLP Processing│
│ • Heatmap View  │    │ • Data Process  │    │ • Recommendations│
│ • Chatbot UI    │    │ • Model Serving │    │                 │
│ • Analytics     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   ML Models     │    │   External APIs │
│                 │    │                 │    │                 │
│ • Shadcn/ui     │    │ • XGBoost Model │    │ • Google AI     │
│ • Tailwind CSS  │    │ • Feature Eng.  │    │ • Map Services  │
│ • React Router  │    │ • Data Pipeline │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (3.10 or higher)
- **Git**
- **Google Gemini API Key**

### 1. Clone the Repository
```bash
git clone https://github.com/arijit3111w/value-home-vision.git
cd value-home-vision
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend will be available at `http://localhost:8081`

### 3. Backend Setup
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Create environment file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > backend/.env

# Start backend server
cd backend
python main.py
```
Backend API will be available at `http://localhost:8000`

### 4. Environment Configuration
Create a `backend/.env` file with your API keys:
```env
GEMINI_API_KEY=your_actual_gemini_api_key
```

## 📖 Usage

### Property Price Prediction
1. Navigate to the **Predict** page
2. Fill in property details (bedrooms, bathrooms, area, etc.)
3. Click "Get Price Prediction"
4. View detailed analysis and similar properties

### AI Chatbot Assistant
1. Go to the **Chatbot** page
2. Ask natural language questions like:
   - "Estimate price for 3 bedroom house around 2000 sqft"
   - "Show me waterfront properties with investment potential"
   - "Compare properties under $600k with good ROI"

### Heatmap Visualization
1. Access the **Heatmap** page
2. Explore color-coded property prices by region
3. Use filters to refine your search
4. Click on areas for detailed information

### Investment Analytics
1. Visit the **Analytics** page
2. Use ROI calculator for investment analysis
3. Compare different properties
4. View market trends and insights

## 🛠️ Troubleshooting Model Artifact Errors

If you encounter errors when running the backend (such as issues loading model artifacts with joblib), check the following:

1. **File Presence**: Ensure all files in `backend/model/artifacts_v2/` are present after cloning. If any are missing, re-clone or download them from the repository.
2. **Correct Path**: Verify the code is loading model files from the correct path. Paths may differ depending on your operating system or working directory.
3. **File Integrity**: Make sure the `.joblib` and `.json` files are not corrupted. Try re-downloading if you suspect corruption.
4. **Python & Library Versions**: Use the same Python version (3.12) and library versions (joblib, scikit-learn, xgboost, etc.) as specified in `requirements.txt`.
5. **Permissions**: Ensure you have read permissions for the artifact files.

If problems persist, please open an issue with the full error traceback and details about your environment.

## 📚 API Documentation

### Core Endpoints

#### Predict Property Price
```http
POST /predict
Content-Type: application/json

{
  "living_area": 2000,
  "lot_area": 8000,
  "number_of_bedrooms": 3,
  "number_of_bathrooms": 2.0,
  "grade_of_house": 7,
  "waterfront_present": 0,
  "condition_of_house": 3,
  "built_year": 2020
}
```

#### Chat with AI Assistant
```http
POST /chat
Content-Type: application/json

{
  "message": "Find me a 3 bedroom house under $500k",
  "context": {
    "predictions": []
  }
}
```

#### Health Check
```http
GET /health
```

#### Model Information
```http
GET /model-info
```

### Response Formats

#### Prediction Response
```json
{
  "predicted_price": 295308.63,
  "formatted_price": "$295,308.63 CAD",
  "confidence_score": 92.0,
  "model_accuracy": 95.97,
  "market_analysis": {
    "price_range": "Budget-Friendly",
    "location_rating": "Good",
    "investment_advice": "Great investment opportunity"
  },
  "feature_insights": {
    "luxury_score": 14.0,
    "key_value_drivers": ["High-quality construction", "Spacious living area"]
  }
}
```

## 🧠 ML Model Details

### Model Architecture
- **Algorithm**: XGBoost (Extreme Gradient Boosting)
- **Features**: 25 engineered features
- **Accuracy**: 95.97%
- **Precision**: 99.7% within 10% range
- **Training Data**: 14,000+ properties

### Feature Engineering
The model uses 25 carefully engineered features including:

1. **Basic Property Features**
   - Living area, lot area
   - Bedrooms, bathrooms
   - Grade and condition

2. **Location Features**
   - Postal code analysis
   - Latitude/longitude
   - School proximity
   - Airport distance

3. **Quality Indicators**
   - House grade (1-13 scale)
   - Condition assessment
   - Renovation status
   - Waterfront presence

4. **Derived Features**
   - Luxury score calculation
   - Age-condition interactions
   - Area efficiency ratios
   - Market premium indicators

### Model Performance
- **Mean Absolute Error**: Low variance predictions
- **R² Score**: High correlation with actual prices
- **Cross-validation**: Robust performance across different regions
- **Prediction Speed**: < 100ms response time

## 📱 Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing.png)
*Professional hero section with carousel and market insights*

### Property Prediction
![Prediction Form](docs/screenshots/prediction.png)
*Comprehensive property details form with instant AI analysis*

### AI Chatbot
![Chatbot Interface](docs/screenshots/chatbot.png)
*Intelligent conversational interface with property recommendations*

### Heatmap Visualization
![Property Heatmap](docs/screenshots/heatmap.png)
*Interactive map showing property price distributions*

### Investment Analytics
![Analytics Dashboard](docs/screenshots/analytics.png)
*Professional dashboard with ROI calculations and market insights*

## 🔧 Development

### Project Structure
```
value-home-vision/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # API server and ML model
│   ├── model/              # ML model artifacts
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── src/                    # React frontend source
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript definitions
├── public/                # Static assets
├── docs/                  # Documentation
└── README.md             # Project documentation
```

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend
```bash
python main.py       # Start FastAPI server
pytest              # Run tests (if configured)
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper documentation
4. **Add tests** for new functionality
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests
- Update documentation for new features
- Follow semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **XGBoost Team** - For the excellent gradient boosting framework
- **Google AI** - For Gemini AI integration
- **React Team** - For the powerful frontend framework
- **FastAPI** - For the modern Python web framework
- **Shadcn/ui** - For beautiful UI components
- **Tailwind CSS** - For utility-first styling

## 📞 Contact

**Project Maintainer**: Arijit
- **GitHub**: [@arijit3111w](https://github.com/arijit3111w)
- **Repository**: [value-home-vision](https://github.com/arijit3111w/value-home-vision)

## 🔮 Future Roadmap

- [ ] Real-time market data integration
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Property image analysis with CV
- [ ] Blockchain integration for property records
- [ ] Advanced recommendation engine
- [ ] Social features and community

---

**Built with ❤️ using React, TypeScript, Python, and AI**

*Transform your real estate decisions with the power of artificial intelligence.*
