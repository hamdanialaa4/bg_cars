// App Constants
export const APP_CONFIG = {
  name: 'CarMarketBG',
  version: '1.0.0',
  description: 'Bulgarian Car Marketplace with AI Features',
  author: 'CarMarketBG Team',
  year: new Date().getFullYear()
} as const

// API Constants
export const API_CONSTANTS = {
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || 'https://api.carmarket.bg',
  wsURL: (import.meta as any).env?.VITE_WS_URL || 'wss://api.carmarket.bg',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  defaultPageSize: 12,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  rateLimitMaxRequests: 100,
  rateLimitWindowMs: 15 * 60 * 1000 // 15 minutes
} as const

// Firebase Collections
export const COLLECTIONS = {
  users: 'users',
  cars: 'cars',
  messages: 'messages',
  conversations: 'conversations',
  favorites: 'favorites',
  views: 'views'
} as const

// Car Constants
export const CAR_CONSTANTS = {
  makes: [
    'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Opel', 'Ford', 'Toyota',
    'Honda', 'Nissan', 'Hyundai', 'Kia', 'Renault', 'Peugeot', 'Citroën',
    'Škoda', 'Seat', 'Dacia', 'Suzuki', 'Mazda', 'Mitsubishi', 'Volvo',
    'Lexus', 'Infiniti', 'Jaguar', 'Land Rover', 'Porsche', 'Ferrari',
    'Lamborghini', 'Maserati', 'Bentley', 'Rolls-Royce', 'Aston Martin',
    'Tesla', 'Polestar', 'NIO', 'BYD', 'Geely', 'Chery', 'Great Wall',
    'Haval', 'Changan', 'JAC', 'BAIC', 'Zotye', 'Lifan'
  ],
  fuelTypes: [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'lpg', label: 'LPG' }
  ],
  transmissions: [
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automatic' },
    { value: 'semi-automatic', label: 'Semi-automatic' }
  ],
  bodyTypes: [
    { value: 'sedan', label: 'Sedan' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'coupe', label: 'Coupe' },
    { value: 'convertible', label: 'Convertible' },
    { value: 'suv', label: 'SUV' },
    { value: 'pickup', label: 'Pickup' },
    { value: 'van', label: 'Van' },
    { value: 'wagon', label: 'Wagon' }
  ],
  conditions: [
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
    { value: 'damaged', label: 'Damaged' }
  ],
  colors: [
    'White', 'Black', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Brown',
    'Beige', 'Orange', 'Yellow', 'Purple', 'Pink', 'Gold', 'Bronze'
  ],
  features: [
    'ABS', 'Air Conditioning', 'Alloy Wheels', 'Bluetooth', 'Cruise Control',
    'Electric Mirrors', 'Electric Windows', 'GPS Navigation', 'Heated Seats',
    'Keyless Entry', 'Leather Seats', 'Multifunction Steering Wheel',
    'Parking Sensors', 'Rear Camera', 'Sunroof', 'Traction Control',
    'Xenon Lights', 'Adaptive Cruise Control', 'Lane Assist', 'Blind Spot Monitoring',
    'Apple CarPlay', 'Android Auto', 'Wireless Charging', '360° Camera'
  ]
} as const

// Search Constants
export const SEARCH_CONSTANTS = {
  itemsPerPage: 12,
  maxPrice: 500000,
  maxMileage: 1000000,
  debounceDelay: 300
} as const

// Message Constants
export const MESSAGE_CONSTANTS = {
  maxLength: 1000,
  maxAttachments: 5,
  attachmentMaxSize: 10 * 1024 * 1024, // 10MB
  typingTimeout: 3000
} as const

// File Upload Constants
export const UPLOAD_CONSTANTS = {
  maxFiles: 20,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  compressionQuality: 0.8
} as const

// AI Constants
export const AI_CONSTANTS = {
  maxTokens: 1000,
  temperature: 0.7,
  model: 'gpt-3.5-turbo',
  imageAnalysisTimeout: 30000
} as const

// PWA Constants
export const PWA_CONSTANTS = {
  cacheName: 'carmarket-v1.0.0',
  maxCacheSize: 50,
  cacheExpiration: 24 * 60 * 60 * 1000, // 24 hours
  syncTag: 'background-sync'
} as const

// Validation Constants
export const VALIDATION_CONSTANTS = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    pattern: /^[+]?[0-9\s\-()]{10,}$/
  }
} as const

// UI Constants
export const UI_CONSTANTS = {
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  },
  animations: {
    duration: 300,
    easing: 'ease-in-out'
  },
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db'
  }
} as const

// Currency Constants
export const CURRENCY_CONSTANTS = {
  default: 'BGN',
  symbol: 'лв',
  locale: 'bg-BG',
  formatOptions: {
    style: 'currency',
    currency: 'BGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }
} as const

// Date Constants
export const DATE_CONSTANTS = {
  locale: 'bg-BG',
  formatOptions: {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  },
  timeFormatOptions: {
    hour: '2-digit',
    minute: '2-digit'
  }
} as const

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  server: 'Server error. Please try again later.',
  validation: 'Please check your input and try again.',
  authentication: 'Authentication failed. Please log in again.',
  authorization: 'You do not have permission to perform this action.',
  notFound: 'The requested resource was not found.',
  rateLimit: 'Too many requests. Please try again later.',
  fileTooLarge: 'File size exceeds the maximum allowed limit.',
  invalidFileType: 'File type is not supported.',
  uploadFailed: 'File upload failed. Please try again.'
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  login: 'Successfully logged in!',
  register: 'Account created successfully!',
  logout: 'Successfully logged out!',
  carAdded: 'Car listing added successfully!',
  carUpdated: 'Car listing updated successfully!',
  carDeleted: 'Car listing deleted successfully!',
  messageSent: 'Message sent successfully!',
  favoriteAdded: 'Added to favorites!',
  favoriteRemoved: 'Removed from favorites!',
  profileUpdated: 'Profile updated successfully!',
  passwordChanged: 'Password changed successfully!'
} as const
