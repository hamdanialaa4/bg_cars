# AI Services for BG Cars Platform

This directory contains AI-powered microservices that enhance the car marketplace platform.

## Services Overview

### 1. Price Predictor Service (Port 8001)
AI-powered price evaluation for car listings based on Bulgarian market data.

**Features:**
- Real-time price prediction using machine learning
- Market trend analysis
- Confidence scoring
- Location-based pricing adjustments

**Technologies:**
- FastAPI
- Python ML models
- Bulgarian market data integration

### 2. Image Analyzer Service (Port 8002)
Smart image analysis for car listing photos.

**Features:**
- Image quality assessment
- Blur and brightness detection
- Automatic categorization (interior/exterior/engine)
- Improvement suggestions
- Quality scoring

**Technologies:**
- FastAPI
- OpenCV for image processing
- Computer vision algorithms

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Running Services

### Price Predictor
```bash
cd ai_services/price_predictor
python main.py
```

### Image Analyzer
```bash
cd ai_services/image_analyzer
python main.py
```

## API Endpoints

### Price Predictor
- `POST /predict-price` - Get price prediction
- `GET /health` - Health check

### Image Analyzer
- `POST /analyze-image` - Analyze uploaded image
- `GET /health` - Health check

## Integration

These services are integrated into the Vue.js frontend through:
- `PriceEvaluator.vue` component
- `ImageAnalyzer.vue` component
- Axios HTTP client for API communication

## Configuration

Services run on localhost with the following ports:
- Price Predictor: http://localhost:8001
- Image Analyzer: http://localhost:8002

Update these URLs in the frontend components if deploying to different environments.
