// File: src/config/index.ts
/**
 * ملف التكوين الرئيسي لمنصة BG Cars Platform
 * يجمع جميع إعدادات المشروع في مكان واحد
 */

import { ENV } from './environment'

// إعدادات المشروع الأساسية
export const PROJECT_CONFIG = {
  // معلومات المشروع
  PROJECT: {
    NAME: 'BG Cars Platform',
    VERSION: '2.0.0',
    DOMAIN: 'mobilebg.eu',
    ENVIRONMENT: ENV.NODE_ENV,
    REGION: 'Bulgaria',
    DEFAULT_CURRENCY: 'EUR',
    DEFAULT_LANGUAGE: 'bg'
  },

  // إعدادات Firebase
  FIREBASE: {
    ...ENV.FIREBASE,
    COLLECTIONS: {
      USERS: 'users',
      SELLERS: 'sellers',
      LISTINGS: 'listings',
      REVIEWS: 'reviews',
      TRANSACTIONS: 'transactions',
      NOTIFICATIONS: 'notifications',
      BULGARIAN_COMPANIES: 'bulgarian_companies',
      SERVICE_STATIONS: 'service_stations',
      MARKET_TRENDS: 'market_trends',
      NEWS_ARTICLES: 'news_articles',
      SYSTEM_LOGS: 'system_logs'
    }
  },

  // إعدادات الذكاء الاصطناعي
  AI: {
    CARMIND: {
      NAME: 'CarMind AI',
      VERSION: '3.0',
      SUPPORTED_LANGUAGES: ['bg', 'en'],
      MAX_CONVERSATION_HISTORY: 10,
      CONFIDENCE_THRESHOLD: 0.7,
      RESPONSE_TIMEOUT: 30000
    },
    MODELS: {
      PRICE_PREDICTION: 'price-predictor-v2',
      TEXT_GENERATION: 'gpt-4-turbo',
      IMAGE_ANALYSIS: 'vision-pro',
      RECOMMENDATION: 'recommendation-engine-v3'
    },
    FEATURES: {
      PRICE_EVALUATION: true,
      CONTENT_GENERATION: true,
      MARKET_ANALYSIS: true,
      USER_BEHAVIOR_PREDICTION: true,
      FRAUD_DETECTION: true,
      AUTOMATIC_TRANSLATION: true
    }
  },

  // إعدادات البحث
  SEARCH: {
    ELASTICSEARCH: {
      ENDPOINT: ENV.APIS.ELASTICSEARCH_ENDPOINT,
      INDEX_NAME: 'bg-cars-listings',
      MAX_RESULTS_PER_PAGE: 20,
      SEARCH_TIMEOUT: 5000,
      FUZZY_MATCHING: true,
      AUTO_COMPLETE: true
    },
    FILTERS: {
      MAKES: ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Ford', 'Opel', 'Renault', 'Peugeot', 'Hyundai', 'Toyota'],
      FUEL_TYPES: ['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'LPG'],
      TRANSMISSIONS: ['Manual', 'Automatic', 'CVT'],
      BODY_TYPES: ['Sedan', 'Hatchback', 'SUV', 'Coupe', 'Convertible', 'Wagon'],
      PRICE_RANGES: [
        { min: 0, max: 5000, label: 'Under €5,000' },
        { min: 5000, max: 10000, label: '€5,000 - €10,000' },
        { min: 10000, max: 20000, label: '€10,000 - €20,000' },
        { min: 20000, max: 50000, label: '€20,000 - €50,000' },
        { min: 50000, max: 100000, label: '€50,000 - €100,000' },
        { min: 100000, max: 999999, label: 'Over €100,000' }
      ]
    }
  },

  // الإعدادات الجغرافية لبلغاريا
  GEOGRAPHY: {
    COUNTRY: 'Bulgaria',
    COUNTRY_CODE: 'BG',
    CURRENCY: 'EUR',
    MAJOR_CITIES: [
      { name: 'София', nameEn: 'Sofia', lat: 42.6977, lng: 23.3219, population: 1400000 },
      { name: 'Пловдив', nameEn: 'Plovdiv', lat: 42.1354, lng: 24.7453, population: 346893 },
      { name: 'Варна', nameEn: 'Varna', lat: 43.2141, lng: 27.9147, population: 335177 },
      { name: 'Бургас', nameEn: 'Burgas', lat: 42.5048, lng: 27.4626, population: 202694 },
      { name: 'Русе', nameEn: 'Ruse', lat: 43.8564, lng: 25.9656, population: 144936 }
    ],
    REGIONS: [
      'Blagoevgrad', 'Burgas', 'Dobrich', 'Gabrovo', 'Haskovo',
      'Kardzhali', 'Kyustendil', 'Lovech', 'Montana', 'Pazardzhik',
      'Pernik', 'Pleven', 'Plovdiv', 'Razgrad', 'Ruse',
      'Shumen', 'Silistra', 'Sliven', 'Smolyan', 'Sofia City',
      'Sofia Province', 'Stara Zagora', 'Targovishte', 'Varna',
      'Veliko Tarnovo', 'Vidin', 'Vratsa', 'Yambol'
    ]
  },

  // إعدادات نظام DataMagnet
  DATA_MAGNET: {
    COLLECTION_INTERVALS: {
      COMPANIES: 24 * 60 * 60 * 1000, // 24 hours
      SERVICE_STATIONS: 12 * 60 * 60 * 1000, // 12 hours
      MARKET_TRENDS: 6 * 60 * 60 * 1000, // 6 hours
      NEWS_ARTICLES: 2 * 60 * 60 * 1000, // 2 hours
      GOOGLE_PLACES: 48 * 60 * 60 * 1000 // 48 hours
    },
    DATA_SOURCES: {
      GOOGLE_PLACES: {
        ENABLED: true,
        API_KEY: ENV.APIS.GOOGLE_MAPS,
        DAILY_QUOTA: 10000,
        SEARCH_RADIUS: 50000 // 50km
      },
      BULGARIAN_BUSINESS_REGISTRY: {
        ENABLED: true,
        ENDPOINT: 'https://www.brra.bg/api',
        RATE_LIMIT: 100 // requests per hour
      },
      NEWS_FEEDS: {
        ENABLED: true,
        SOURCES: [
          'https://www.automedia.bg/feed',
          'https://www.auto-press.net/feed',
          'https://www.actualno.com/auto/feed'
        ]
      }
    }
  },

  // إعدادات النظام المالي
  PAYMENTS: {
    STRIPE: {
      PUBLISHABLE_KEY: ENV.APIS.STRIPE_PUBLISHABLE,
      WEBHOOK_ENDPOINT: '/api/stripe/webhook',
      CURRENCY: 'EUR',
      MINIMUM_AMOUNT: 100 // €1.00 in cents
    },
    PRICING: {
      BASIC_LISTING: 0, // Free
      PREMIUM_LISTING: 499, // €4.99
      FEATURED_LISTING: 999, // €9.99
      SELLER_SUBSCRIPTION_MONTHLY: 2999, // €29.99
      SELLER_SUBSCRIPTION_YEARLY: 29999 // €299.99 (2 months free)
    },
    TAX_RATE: 0.20 // 20% VAT in Bulgaria
  },

  // إعدادات الأمان والمراقبة
  SECURITY: {
    RATE_LIMITING: {
      SEARCH_API: 100, // requests per minute
      LOGIN_ATTEMPTS: 5, // attempts per 15 minutes
      PASSWORD_RESET: 3, // attempts per hour
      CONTACT_FORM: 10 // submissions per hour
    },
    SESSION: {
      TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
      REFRESH_THRESHOLD: 60 * 60 * 1000 // 1 hour
    },
    ENCRYPTION: {
      ALGORITHM: 'AES-256-GCM',
      KEY_LENGTH: 32
    }
  },

  // إعدادات الواجهة والتجربة
  UI: {
    THEME: {
      PRIMARY_COLOR: '#006747',
      SECONDARY_COLOR: '#00a86b',
      BACKGROUND_COLOR: '#FFFFFF',
      TEXT_COLOR: '#262626',
      BORDER_COLOR: '#d9d9d9'
    },
    LAYOUT: {
      MAX_CONTENT_WIDTH: '1200px',
      SIDEBAR_WIDTH: '280px',
      HEADER_HEIGHT: '70px',
      FOOTER_HEIGHT: '200px'
    },
    ANIMATIONS: {
      DURATION_FAST: '150ms',
      DURATION_NORMAL: '300ms',
      DURATION_SLOW: '500ms',
      EASING: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    BREAKPOINTS: {
      MOBILE: '768px',
      TABLET: '1024px',
      DESKTOP: '1200px',
      LARGE: '1440px'
    }
  },

  // إعدادات التحليلات
  ANALYTICS: {
    GOOGLE_ANALYTICS: {
      TRACKING_ID: ENV.ANALYTICS.GOOGLE_GA_ID,
      ENHANCED_ECOMMERCE: true,
      DEMOGRAPHIC_REPORTS: true
    },
    CUSTOM_EVENTS: {
      LISTING_VIEW: 'listing_view',
      SEARCH_PERFORMED: 'search_performed',
      CONTACT_SELLER: 'contact_seller',
      PHONE_CLICK: 'phone_click',
      LISTING_SAVED: 'listing_saved',
      PAYMENT_COMPLETED: 'payment_completed'
    }
  },

  // إعدادات الإشعارات
  NOTIFICATIONS: {
    TYPES: {
      NEW_MESSAGE: 'new_message',
      LISTING_APPROVED: 'listing_approved',
      LISTING_EXPIRED: 'listing_expired',
      PAYMENT_SUCCESS: 'payment_success',
      SYSTEM_MAINTENANCE: 'system_maintenance'
    },
    CHANNELS: {
      IN_APP: true,
      EMAIL: true,
      SMS: false,
      PUSH: false
    }
  },

  // إعدادات API والخدمات الخارجية
  EXTERNAL_APIS: {
    GOOGLE_MAPS: {
      API_KEY: ENV.APIS.GOOGLE_MAPS,
      LIBRARIES: ['places', 'geometry', 'directions'],
      LANGUAGE: 'bg',
      REGION: 'BG'
    },
    OPENAI: {
      API_KEY: ENV.APIS.OPENAI,
      MODEL: 'gpt-4-turbo',
      MAX_TOKENS: 2000,
      TEMPERATURE: 0.7
    },
    TRANSLATION: {
      PROVIDER: 'google-translate',
      API_KEY: ENV.APIS.GOOGLE_TRANSLATE,
      SOURCE_LANGUAGE: 'auto',
      TARGET_LANGUAGES: ['bg', 'en']
    }
  }
} as const

// مساعدات للوصول للإعدادات
export const getFirebaseConfig = () => PROJECT_CONFIG.FIREBASE
export const getAIConfig = () => PROJECT_CONFIG.AI
export const getSearchConfig = () => PROJECT_CONFIG.SEARCH
export const getGeographyConfig = () => PROJECT_CONFIG.GEOGRAPHY
export const getUIConfig = () => PROJECT_CONFIG.UI
export const getPaymentsConfig = () => PROJECT_CONFIG.PAYMENTS
export const getDataMagnetConfig = () => PROJECT_CONFIG.DATA_MAGNET

// وظائف مساعدة
export const isProduction = () => PROJECT_CONFIG.PROJECT.ENVIRONMENT === 'production'
export const isDevelopment = () => PROJECT_CONFIG.PROJECT.ENVIRONMENT === 'development'
export const isStaging = () => PROJECT_CONFIG.PROJECT.ENVIRONMENT === 'staging'

export const getCityByName = (cityName: string) => {
  return PROJECT_CONFIG.GEOGRAPHY.MAJOR_CITIES.find(
    city => city.name === cityName || city.nameEn === cityName
  )
}

export const getPriceRangeLabel = (price: number): string => {
  const range = PROJECT_CONFIG.SEARCH.FILTERS.PRICE_RANGES.find(
    range => price >= range.min && price <= range.max
  )
  return range?.label || 'Unknown range'
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: PROJECT_CONFIG.PROJECT.DEFAULT_CURRENCY
  }).format(amount)
}

export const getCollectionName = (collection: keyof typeof PROJECT_CONFIG.FIREBASE.COLLECTIONS): string => {
  return PROJECT_CONFIG.FIREBASE.COLLECTIONS[collection]
}

// عتبات الأداء والمراقبة
export const PERFORMANCE_THRESHOLDS = {
  API_RESPONSE_TIME: {
    GOOD: 200, // ms
    WARNING: 500, // ms
    CRITICAL: 1000 // ms
  },
  SEARCH_RESPONSE_TIME: {
    GOOD: 100, // ms
    WARNING: 300, // ms
    CRITICAL: 500 // ms
  },
  PAGE_LOAD_TIME: {
    GOOD: 2000, // ms
    WARNING: 4000, // ms
    CRITICAL: 6000 // ms
  }
} as const

// أنواع البيانات
export type ProjectEnvironment = 'development' | 'staging' | 'production'
export type SupportedLanguage = 'bg' | 'en'
export type PaymentCurrency = 'EUR'
export type NotificationType = keyof typeof PROJECT_CONFIG.NOTIFICATIONS.TYPES
export type CustomEvent = keyof typeof PROJECT_CONFIG.ANALYTICS.CUSTOM_EVENTS

export default PROJECT_CONFIG
