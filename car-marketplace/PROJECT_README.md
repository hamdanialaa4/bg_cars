# 🚗 BG Cars Platform - Advanced Bulgarian Car Marketplace

<div align="center">
  <img src="public/logo.png" alt="BG Cars Platform" width="200"/>
  
  [![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
</div>

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [🤖 AI Features](#-ai-features)
- [🗄️ Database Schema](#️-database-schema)
- [📱 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Features

### 🎯 Core Features
- **Modern Car Marketplace** - Buy and sell cars in Bulgaria with advanced search
- **AI-Powered Assistant (CarMind)** - Intelligent chatbot for price evaluation and recommendations
- **Smart Price Prediction** - ML-based car price estimation
- **Advanced Search & Filters** - Location-based search with multiple criteria
- **Real-time Messaging** - Secure communication between buyers and sellers
- **Multi-language Support** - Bulgarian and English interface
- **Progressive Web App (PWA)** - Works offline and can be installed

### 🤖 AI & Machine Learning
- **CarMind AI Assistant** - GPT-4 powered chatbot for car advice
- **Price Prediction Engine** - ML model for accurate car valuations
- **Content Generation** - Automatic listing descriptions
- **Fraud Detection** - AI-powered suspicious activity detection
- **Market Analysis** - Real-time Bulgarian car market trends
- **Automatic Translation** - Dynamic content translation

### 🇧🇬 Bulgarian Market Focus
- **Local Integration** - Bulgarian business registry integration
- **Currency Support** - EUR and BGN currency options
- **Regional Data** - All 28 Bulgarian regions coverage
- **Local Services** - Service stations and dealership directory
- **Legal Compliance** - Bulgarian automotive regulations compliance

### 📱 User Experience
- **Responsive Design** - Works on all devices
- **Dark/Light Mode** - User preference themes
- **Offline Support** - Core functionality works offline
- **Push Notifications** - Real-time updates and alerts
- **SEO Optimized** - Server-side rendering for better visibility

## 🏗️ Architecture

```
├── 🎨 Frontend (Vue.js 3 + TypeScript)
│   ├── Components Library
│   ├── State Management (Pinia)
│   ├── Routing (Vue Router)
│   └── PWA Features
│
├── 🔥 Backend (Firebase)
│   ├── Authentication
│   ├── Firestore Database
│   ├── Cloud Storage
│   ├── Cloud Functions
│   └── Hosting
│
├── 🤖 AI Services
│   ├── CarMind Assistant (OpenAI GPT-4)
│   ├── Price Prediction (TensorFlow.js)
│   ├── Content Generation
│   └── Market Analysis
│
├── 🗺️ External APIs
│   ├── Google Maps (Location services)
│   ├── Google Translate (Multi-language)
│   ├── Stripe (Payments)
│   └── Bulgarian Business Registry
│
└── 📊 Analytics & Monitoring
    ├── Google Analytics
    ├── Performance Monitoring
    ├── Error Tracking
    └── User Behavior Analysis
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+ or yarn
- Firebase account
- Google Maps API key

### 1. Clone Repository
```bash
git clone https://github.com/hamdanialaa4/bg_cars.git
cd bg_cars/car-marketplace
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
# Edit .env with your API keys
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## ⚙️ Installation

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/hamdanialaa4/bg_cars.git
   cd bg_cars/car-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following in `.env`:
   ```env
   # Firebase
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_PROJECT_ID=your_project_id
   
   # Google APIs
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
   
   # OpenAI (for AI features)
   VITE_OPENAI_API_KEY=your_openai_key
   
   # Stripe (for payments)
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

4. **Initialize Firebase**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Production Build

```bash
npm run build
npm run preview
```

## 🔧 Configuration

### Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Cloud Storage
   - Hosting
   - Cloud Functions

3. Update `src/services/firebase/config.ts` with your Firebase config

### Google APIs Setup

1. **Google Maps API**
   - Enable Maps JavaScript API
   - Enable Places API
   - Enable Geocoding API
   
2. **Google Translate API**
   - Enable Cloud Translation API

### AI Services Setup

1. **OpenAI API**
   - Create account at [OpenAI](https://openai.com/)
   - Generate API key
   - Configure GPT-4 access

2. **TensorFlow.js Models**
   - Pre-trained models included
   - Custom models in `src/services/ai/models/`

## 🤖 AI Features

### CarMind AI Assistant

The CarMind AI is the core intelligent assistant that helps users with:

```typescript
// Example usage
import { CarMindAI } from '@/services/ai/CarMindAI'

const carMind = new CarMindAI()

// Price evaluation
const priceAnalysis = await carMind.evaluatePrice({
  make: 'BMW',
  model: 'X5',
  year: 2020,
  mileage: 50000,
  condition: 'excellent'
})

// Market insights
const insights = await carMind.getMarketInsights('luxury-suv')

// Content generation
const description = await carMind.generateListingDescription(carData)
```

### Features:
- **Intelligent Price Evaluation** - ML-based price predictions
- **Market Analysis** - Real-time Bulgarian car market data
- **Content Generation** - Auto-generated listing descriptions
- **Fraud Detection** - Suspicious listing detection
- **User Behavior Analysis** - Personalized recommendations

## 🗄️ Database Schema

### Core Collections

```typescript
// Users Collection
interface User {
  id: string
  email: string
  displayName: string
  role: 'buyer' | 'seller' | 'admin'
  preferences: UserPreferences
  statistics: UserStatistics
  createdAt: Timestamp
}

// Car Listings Collection
interface CarListing {
  id: string
  sellerId: string
  title: string
  description: string
  price: number
  car: CarDetails
  images: ListingImage[]
  location: ListingLocation
  status: 'active' | 'sold' | 'expired'
  createdAt: Timestamp
}

// Bulgarian Companies Collection
interface BulgarianCompany {
  id: string
  name: string
  bulstat: string // Bulgarian business ID
  type: 'dealership' | 'service-station' | 'parts-dealer'
  address: BulgarianAddress
  contact: CompanyContact
  verified: boolean
}
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public listings are readable by all
    match /listings/{listingId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     (request.auth.uid == resource.data.sellerId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

## 📱 API Documentation

### RESTful API Endpoints

```typescript
// Authentication
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/reset-password

// Listings
GET  /api/listings
POST /api/listings
GET  /api/listings/:id
PUT  /api/listings/:id
DELETE /api/listings/:id

// Search
GET  /api/search?q={query}&location={location}&filters={filters}
POST /api/search/saved
GET  /api/search/suggestions

// AI Services
POST /api/ai/price-prediction
POST /api/ai/content-generation
POST /api/ai/market-analysis
POST /api/ai/chat

// Bulgarian Data
GET  /api/bg/companies
GET  /api/bg/regions
GET  /api/bg/market-trends
```

### GraphQL Schema

```graphql
type Car {
  id: ID!
  make: String!
  model: String!
  year: Int!
  price: Float!
  description: String
  images: [Image!]!
  location: Location!
  seller: User!
  createdAt: DateTime!
}

type Query {
  cars(filters: CarFilters): [Car!]!
  car(id: ID!): Car
  searchCars(query: String!, location: String): [Car!]!
}

type Mutation {
  createCar(input: CreateCarInput!): Car!
  updateCar(id: ID!, input: UpdateCarInput!): Car!
  deleteCar(id: ID!): Boolean!
}
```

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### E2E Tests

```bash
# Run end-to-end tests
npm run test:e2e

# Run E2E tests in headless mode
npm run test:e2e:headless
```

### Component Testing

```typescript
// Example component test
import { mount } from '@vue/test-utils'
import CarListingCard from '@/components/CarListingCard.vue'

describe('CarListingCard', () => {
  it('displays car information correctly', () => {
    const listing = {
      id: '1',
      title: 'BMW X5 2020',
      price: 45000,
      images: [{ url: 'image.jpg' }]
    }
    
    const wrapper = mount(CarListingCard, {
      props: { listing }
    })
    
    expect(wrapper.text()).toContain('BMW X5 2020')
    expect(wrapper.text()).toContain('€45,000')
  })
})
```

## 🚀 Deployment

### Firebase Hosting

```bash
# Build for production
npm run build

# Deploy to Firebase
npm run firebase:deploy
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build Docker image
docker build -t bg-cars-platform .

# Run container
docker run -p 3000:3000 bg-cars-platform
```

### Environment-specific Builds

```bash
# Development
npm run build:dev

# Staging
npm run build:staging

# Production
npm run build:prod
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the coding standards
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

### Coding Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format

### Code Review Process

1. All code must be reviewed by at least one maintainer
2. All tests must pass
3. Code coverage must be maintained above 80%
4. Documentation must be updated for new features

## 📊 Performance

### Lighthouse Scores

- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100
- **PWA**: 100

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## 🔐 Security

### Security Features

- **Authentication**: Firebase Auth with email/password
- **Authorization**: Role-based access control
- **Data Validation**: Client and server-side validation
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Token-based protection
- **Rate Limiting**: API request throttling

### Security Checklist

- [x] Input validation and sanitization
- [x] Authentication and authorization
- [x] HTTPS enforcement
- [x] Secure headers configuration
- [x] Regular dependency updates
- [x] Security testing in CI/CD

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer**: [Your Name](https://github.com/hamdanialaa4)
- **AI Specialist**: AI Integration Team
- **UI/UX Designer**: Design Team
- **Backend Developer**: Firebase Team

## 🙏 Acknowledgments

- **Vue.js Team** - For the amazing framework
- **Firebase Team** - For the backend infrastructure
- **OpenAI** - For AI capabilities
- **Bulgarian Developer Community** - For local insights
- **All Contributors** - For making this project possible

---

<div align="center">
  <p>Made with ❤️ for the Bulgarian automotive community</p>
  <p>
    <a href="https://mobilebg.eu">Website</a> •
    <a href="mailto:info@mobilebg.eu">Contact</a> •
    <a href="https://github.com/hamdanialaa4/bg_cars/issues">Report Bug</a> •
    <a href="https://github.com/hamdanialaa4/bg_cars/issues">Request Feature</a>
  </p>
</div>
