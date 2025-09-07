# CarMarketBG - Bulgarian Car Marketplace Platform

![CarMarketBG Logo](https://img.shields.io/badge/CarMarketBG-Bulgarian%20Car%20Marketplace-blue?style=for-the-badge&logo=car)
![Vue 3](https://img.shields.io/badge/Vue-3.3.4-green?style=flat-square&logo=vue.js)
![Firebase](https://img.shields.io/badge/Firebase-9.22.0-orange?style=flat-square&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4.4.0-purple?style=flat-square&logo=vite)
![PWA](https://img.shields.io/badge/PWA-Ready-green?style=flat-square&logo=pwa)

A comprehensive car marketplace platform built for the Bulgarian market with AI-powered features, modern UI/UX, and PWA capabilities.

## 🌟 Features

### 🚗 Core Features
- **Advanced Car Listings** - Comprehensive car listings with detailed specifications
- **AI-Powered Search** - Intelligent search with natural language processing
- **Image Analysis** - AI-powered car condition analysis from photos
- **Car Comparison** - Side-by-side comparison of up to 4 vehicles
- **Real-time Messaging** - Built-in messaging system between buyers and sellers
- **News & Updates** - Latest automotive news and market insights

### 🎨 User Experience
- **Modern Glassmorphism UI** - Beautiful, modern interface design
- **Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- **Dark/Light Mode** - Theme switching capability
- **Multilingual Support** - Bulgarian and English language support
- **PWA Ready** - Installable as a mobile app

### 🔧 Technical Features
- **Progressive Web App (PWA)** - Offline functionality and app-like experience
- **Service Worker** - Background sync and caching
- **Firebase Integration** - Authentication, Firestore, Storage
- **Real-time Updates** - Live data synchronization
- **Advanced Routing** - Vue Router with guards and lazy loading

## 🛠️ Technology Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management for Vue.js

### Backend & Services
- **Firebase** - Backend-as-a-Service
  - Authentication (Email/Password, Google, Facebook)
  - Firestore (NoSQL database)
  - Storage (File uploads)
  - Hosting (Production deployment)

### UI & Styling
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Glassmorphism** - Modern glass-like UI effects
- **Font Awesome** - Icon library
- **Responsive Design** - Mobile-first approach

### AI & Analytics
- **OpenAI Integration** - AI-powered chatbot and analysis
- **Image Recognition** - Car condition analysis
- **Natural Language Processing** - Smart search capabilities

## 📱 Progressive Web App (PWA)

CarMarketBG is a fully functional PWA with the following capabilities:

- **Installable** - Can be installed on mobile devices and desktops
- **Offline Mode** - Core functionality works without internet
- **Background Sync** - Actions are synced when connection is restored
- **Push Notifications** - Real-time notifications for messages and updates
- **App-like Experience** - Native app feel with web technologies

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Firebase project with Authentication, Firestore, and Storage enabled
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/carmarket-bg.git
   cd carmarket-bg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Configure your environment variables:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_OPENAI_API_KEY=your_openai_key
   ```

4. **Firebase Configuration**
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Configure security rules for Firestore and Storage
   - Add your domain to authorized domains

5. **Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

7. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
carmarket-bg/
├── public/
│   ├── icons/           # PWA icons
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service worker
│   ├── robots.txt      # SEO robots file
│   └── sitemap.xml     # SEO sitemap
├── src/
│   ├── components/      # Vue components
│   │   ├── layout/      # Layout components
│   │   ├── ui/          # Reusable UI components
│   │   └── views/       # Page components
│   ├── composables/     # Vue composables
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia stores
│   ├── utils/           # Utility functions
│   ├── assets/          # Static assets
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── types/               # TypeScript type definitions
├── tests/               # Test files
├── docs/                # Documentation
├── .env.example         # Environment variables template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── README.md           # Project documentation
```

## 🔧 Configuration

### Firebase Security Rules

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Cars collection
    match /cars/{carId} {
      allow read: if true; // Public read access
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.sellerId == request.auth.uid;
    }

    // Messages collection
    match /messages/{messageId} {
      allow read, write: if request.auth != null &&
        (request.auth.uid == resource.data.senderId ||
         request.auth.uid == resource.data.receiverId);
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Car images
    match /cars/{userId}/{allPaths=**} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // User avatars
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init

# Deploy to production
npm run build
firebase deploy
```

### Environment Variables for Production
Ensure all environment variables are set in your production environment:
- Firebase configuration
- OpenAI API key
- Any other service credentials

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety
- Follow conventional commit messages
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Firebase team for the excellent BaaS platform
- OpenAI for AI capabilities
- Font Awesome for icons
- All contributors and supporters

## 📞 Support

For support, email support@carmarketbg.com or join our Discord community.

## 🔄 Changelog

### Version 1.0.0 (Current)
- Initial release with core marketplace features
- AI-powered search and image analysis
- PWA implementation
- Real-time messaging system
- Car comparison tool
- News and updates section

---

**Made with ❤️ in Bulgaria**
