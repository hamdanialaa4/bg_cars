// File: src/config/environment.ts
/**
 * مكتبة إدارة المتغيرات البيئية
 * تدير جميع المتغيرات البيئية بطريقة آمنة ومحددة
 */

// Vite Environment Variables Interface
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_GOOGLE_TRANSLATE_API_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_GA_TRACKING_ID: string
  readonly VITE_ELASTICSEARCH_ENDPOINT: string
  readonly NODE_ENV: 'development' | 'production' | 'staging'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Environment configuration with defaults
export const ENV = {
  // Application Environment
  NODE_ENV: (import.meta.env?.NODE_ENV as 'development' | 'production' | 'staging') || 'development',
  
  // Firebase Configuration
  FIREBASE: {
    API_KEY: import.meta.env?.VITE_FIREBASE_API_KEY || 'AIzaSyAUqK5WGZSIYehZUmu1E0qFNllUOqsF8dE',
    AUTH_DOMAIN: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || 'bg-cars-platform.firebaseapp.com',
    PROJECT_ID: import.meta.env?.VITE_FIREBASE_PROJECT_ID || 'bg-cars-platform',
    STORAGE_BUCKET: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || 'bg-cars-platform.appspot.com',
    MESSAGING_SENDER_ID: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '407228642196',
    APP_ID: import.meta.env?.VITE_FIREBASE_APP_ID || '1:407228642196:web:example'
  },

  // External APIs
  APIS: {
    GOOGLE_MAPS: import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || '',
    OPENAI: import.meta.env?.VITE_OPENAI_API_KEY || '',
    GOOGLE_TRANSLATE: import.meta.env?.VITE_GOOGLE_TRANSLATE_API_KEY || '',
    STRIPE_PUBLISHABLE: import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || '',
    ELASTICSEARCH_ENDPOINT: import.meta.env?.VITE_ELASTICSEARCH_ENDPOINT || 'https://search-bgcars.eu-west-1.es.amazonaws.com'
  },

  // Analytics
  ANALYTICS: {
    GOOGLE_GA_ID: import.meta.env?.VITE_GA_TRACKING_ID || ''
  }
} as const

// Environment validation
export const validateEnvironment = (): { isValid: boolean; missingVars: string[] } => {
  const missingVars: string[] = []
  
  // Critical environment variables that must be present
  const criticalVars = [
    { key: 'VITE_FIREBASE_API_KEY', value: ENV.FIREBASE.API_KEY },
    { key: 'VITE_FIREBASE_PROJECT_ID', value: ENV.FIREBASE.PROJECT_ID },
    { key: 'VITE_GOOGLE_MAPS_API_KEY', value: ENV.APIS.GOOGLE_MAPS }
  ]
  
  criticalVars.forEach(({ key, value }) => {
    if (!value || value === '') {
      missingVars.push(key)
    }
  })
  
  return {
    isValid: missingVars.length === 0,
    missingVars
  }
}

// Environment helpers
export const isProduction = (): boolean => ENV.NODE_ENV === 'production'
export const isDevelopment = (): boolean => ENV.NODE_ENV === 'development'
export const isStaging = (): boolean => ENV.NODE_ENV === 'staging'

// Configuration getters with environment-specific logic
export const getFirebaseConfig = () => ({
  apiKey: ENV.FIREBASE.API_KEY,
  authDomain: ENV.FIREBASE.AUTH_DOMAIN,
  projectId: ENV.FIREBASE.PROJECT_ID,
  storageBucket: ENV.FIREBASE.STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE.MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE.APP_ID
})

export const getGoogleMapsConfig = () => ({
  apiKey: ENV.APIS.GOOGLE_MAPS,
  libraries: ['places', 'geometry', 'directions'] as const,
  language: 'bg',
  region: 'BG'
})

export const getOpenAIConfig = () => ({
  apiKey: ENV.APIS.OPENAI,
  model: 'gpt-4-turbo',
  maxTokens: 2000,
  temperature: 0.7
})

export const getStripeConfig = () => ({
  publishableKey: ENV.APIS.STRIPE_PUBLISHABLE,
  currency: 'EUR' as const,
  minimumAmount: 100 // €1.00 in cents
})

// Environment-specific feature flags
export const FEATURE_FLAGS = {
  AI_FEATURES: {
    CARMIND_ASSISTANT: true,
    PRICE_PREDICTION: true,
    CONTENT_GENERATION: isDevelopment() || isStaging(),
    FRAUD_DETECTION: isProduction(),
    AUTOMATIC_TRANSLATION: true
  },
  
  DATA_COLLECTION: {
    GOOGLE_PLACES: true,
    BULGARIAN_REGISTRY: isProduction(),
    NEWS_FEEDS: true,
    MARKET_ANALYSIS: true
  },
  
  PAYMENTS: {
    STRIPE_ENABLED: isProduction() || isStaging(),
    PREMIUM_FEATURES: true,
    SUBSCRIPTION_BILLING: isProduction()
  },
  
  MONITORING: {
    ERROR_TRACKING: true,
    PERFORMANCE_MONITORING: true,
    USER_ANALYTICS: isProduction() || isStaging(),
    DEBUG_LOGGING: isDevelopment()
  }
} as const

// Debug utilities (development only)
export const debugEnvironment = (): void => {
  if (isDevelopment()) {
    console.group('🔧 Environment Configuration')
    console.log('Environment:', ENV.NODE_ENV)
    console.log('Firebase Project:', ENV.FIREBASE.PROJECT_ID)
    console.log('Google Maps API:', ENV.APIS.GOOGLE_MAPS ? '✅ Configured' : '❌ Missing')
    console.log('OpenAI API:', ENV.APIS.OPENAI ? '✅ Configured' : '❌ Missing')
    console.log('Stripe API:', ENV.APIS.STRIPE_PUBLISHABLE ? '✅ Configured' : '❌ Missing')
    
    const validation = validateEnvironment()
    if (!validation.isValid) {
      console.warn('Missing environment variables:', validation.missingVars)
    }
    
    console.groupEnd()
  }
}

// Error handling for missing critical environment variables
export class EnvironmentError extends Error {
  constructor(missingVars: string[]) {
    super(`Missing critical environment variables: ${missingVars.join(', ')}`)
    this.name = 'EnvironmentError'
  }
}

// Initialize environment validation
export const initializeEnvironment = (): void => {
  const validation = validateEnvironment()
  
  if (!validation.isValid && isProduction()) {
    throw new EnvironmentError(validation.missingVars)
  }
  
  if (isDevelopment()) {
    debugEnvironment()
  }
}

export default ENV
