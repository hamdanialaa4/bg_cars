// File: src/services/database/schemas.ts
/**
 * مخططات قاعدة البيانات الشاملة لمنصة BG Cars Platform
 * يحتوي على جميع النماذج والأنواع المطلوبة
 */

import { Timestamp } from 'firebase/firestore'

// Base interfaces
export interface BaseDocument {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
  isActive: boolean
}

// User related schemas
export interface User extends BaseDocument {
  email: string
  displayName: string
  photoURL?: string
  phoneNumber?: string
  emailVerified: boolean
  role: UserRole
  preferences: UserPreferences
  location?: UserLocation
  statistics: UserStatistics
  subscription?: UserSubscription
  lastLoginAt: Timestamp
  profile: UserProfile
}

export type UserRole = 'buyer' | 'seller' | 'admin' | 'moderator'

export interface UserPreferences {
  language: 'bg' | 'en'
  currency: 'EUR'
  notifications: NotificationPreferences
  searchFilters: SearchPreferences
  privacy: PrivacySettings
}

export interface NotificationPreferences {
  email: boolean
  inApp: boolean
  newMessages: boolean
  listingUpdates: boolean
  priceAlerts: boolean
  marketingEmails: boolean
}

export interface SearchPreferences {
  defaultLocation?: string
  maxPrice?: number
  preferredMakes: string[]
  fuelType?: string
  transmission?: string
}

export interface PrivacySettings {
  showEmail: boolean
  showPhone: boolean
  showLocation: boolean
  allowAnalytics: boolean
}

export interface UserLocation {
  city: string
  region: string
  country: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface UserStatistics {
  totalListings: number
  activeListings: number
  soldListings: number
  viewsReceived: number
  contactsReceived: number
  averageRating: number
  totalReviews: number
  joinedDate: Timestamp
}

export interface UserSubscription {
  type: 'basic' | 'premium' | 'professional'
  startDate: Timestamp
  endDate: Timestamp
  autoRenew: boolean
  features: string[]
  paymentMethod?: string
}

export interface UserProfile {
  bio?: string
  businessName?: string
  businessLicense?: string
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    linkedin?: string
  }
  verificationStatus: 'unverified' | 'pending' | 'verified'
}

// Listing related schemas
export interface CarListing extends BaseDocument {
  sellerId: string
  title: string
  description: string
  price: number
  currency: 'EUR'
  negotiable: boolean
  
  // Car details
  car: CarDetails
  
  // Media
  images: ListingImage[]
  videos?: ListingVideo[]
  
  // Location
  location: ListingLocation
  
  // Status and metadata
  status: ListingStatus
  views: number
  favorites: number
  contactClicks: number
  phoneClicks: number
  
  // SEO and search
  seoTitle?: string
  seoDescription?: string
  tags: string[]
  searchKeywords: string[]
  
  // Premium features
  isPremium: boolean
  isFeatured: boolean
  isUrgent: boolean
  expiresAt?: Timestamp
  
  // AI generated content
  aiGenerated?: {
    description?: string
    keywords?: string[]
    priceEstimate?: number
    marketAnalysis?: string
  }
}

export interface CarDetails {
  make: string
  model: string
  year: number
  mileage: number
  fuelType: FuelType
  transmission: Transmission
  bodyType: BodyType
  engineSize?: number
  power?: number
  color: string
  doors?: number
  seats?: number
  
  // Technical details
  vin?: string
  registrationNumber?: string
  firstRegistration?: Timestamp
  lastServiceDate?: Timestamp
  nextServiceDue?: number
  
  // Condition
  condition: CarCondition
  accidentHistory: boolean
  serviceHistory: boolean
  
  // Features
  features: CarFeature[]
  safetyFeatures: SafetyFeature[]
  
  // Documentation
  hasWarranty: boolean
  warrantyDetails?: string
  documentation: DocumentationType[]
}

export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'lpg' | 'cng'
export type Transmission = 'manual' | 'automatic' | 'cvt' | 'semi-automatic'
export type BodyType = 'sedan' | 'hatchback' | 'suv' | 'coupe' | 'convertible' | 'wagon' | 'pickup' | 'van' | 'minivan'
export type CarCondition = 'excellent' | 'very-good' | 'good' | 'fair' | 'poor' | 'damaged'

export interface CarFeature {
  category: 'comfort' | 'technology' | 'exterior' | 'interior' | 'audio'
  name: string
  available: boolean
}

export interface SafetyFeature {
  name: string
  standard: boolean
  description?: string
}

export type DocumentationType = 'registration' | 'insurance' | 'service-book' | 'inspection' | 'warranty'

export interface ListingImage {
  id: string
  url: string
  thumbnailUrl: string
  order: number
  caption?: string
  isPrimary: boolean
  uploadedAt: Timestamp
}

export interface ListingVideo {
  id: string
  url: string
  thumbnailUrl: string
  duration: number
  uploadedAt: Timestamp
}

export interface ListingLocation {
  city: string
  region: string
  country: string
  exactAddress?: string
  coordinates: {
    latitude: number
    longitude: number
  }
  showExactLocation: boolean
}

export type ListingStatus = 'draft' | 'pending' | 'active' | 'sold' | 'expired' | 'suspended' | 'deleted'

// Reviews and ratings
export interface Review extends BaseDocument {
  reviewerId: string
  reviewedUserId: string
  listingId?: string
  rating: number // 1-5
  title: string
  content: string
  pros?: string[]
  cons?: string[]
  wouldRecommend: boolean
  helpful: number
  notHelpful: number
  response?: ReviewResponse
  verified: boolean
}

export interface ReviewResponse {
  content: string
  respondedAt: Timestamp
  responderId: string
}

// Messages and communication
export interface Conversation extends BaseDocument {
  participants: string[]
  listingId?: string
  lastMessage: Message
  unreadCount: { [userId: string]: number }
  archived: boolean
}

export interface Message extends BaseDocument {
  conversationId: string
  senderId: string
  content: string
  type: MessageType
  readBy: { [userId: string]: Timestamp }
  attachments?: MessageAttachment[]
  metadata?: MessageMetadata
}

export type MessageType = 'text' | 'image' | 'offer' | 'system' | 'location'

export interface MessageAttachment {
  type: 'image' | 'document'
  url: string
  name: string
  size: number
}

export interface MessageMetadata {
  offerAmount?: number
  offerCurrency?: string
  offerExpiry?: Timestamp
  systemMessageType?: 'listing-sold' | 'listing-expired' | 'user-verified'
}

// Saved searches and alerts
export interface SavedSearch extends BaseDocument {
  userId: string
  name: string
  filters: SearchFilters
  alertsEnabled: boolean
  lastAlertSent?: Timestamp
  matchCount: number
}

export interface SearchFilters {
  query?: string
  make?: string[]
  model?: string[]
  yearFrom?: number
  yearTo?: number
  priceFrom?: number
  priceTo?: number
  mileageFrom?: number
  mileageTo?: number
  fuelType?: FuelType[]
  transmission?: Transmission[]
  bodyType?: BodyType[]
  location?: {
    city?: string
    region?: string
    radius?: number // in km
  }
  features?: string[]
  condition?: CarCondition[]
  sortBy?: 'price' | 'year' | 'mileage' | 'date' | 'relevance'
  sortOrder?: 'asc' | 'desc'
}

// Bulgarian-specific data schemas
export interface BulgarianCompany extends BaseDocument {
  name: string
  nameEn?: string
  type: CompanyType
  bulstat: string // Bulgarian business registration number
  address: BulgarianAddress
  contact: CompanyContact
  services: string[]
  specializations: string[]
  verified: boolean
  rating?: number
  reviewCount: number
  operatingHours: OperatingHours
  website?: string
  description?: string
  photos: string[]
}

export type CompanyType = 'dealership' | 'service-station' | 'parts-dealer' | 'insurance' | 'financing' | 'inspection'

export interface BulgarianAddress {
  street: string
  city: string
  region: string
  postalCode: string
  country: 'Bulgaria'
  coordinates: {
    latitude: number
    longitude: number
  }
}

export interface CompanyContact {
  phone: string[]
  email?: string
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
  }
}

export interface OperatingHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

export interface DayHours {
  open: string // HH:MM format
  close: string // HH:MM format
  closed: boolean
}

// Market data and analytics
export interface MarketTrend extends BaseDocument {
  make?: string
  model?: string
  region?: string
  period: {
    start: Timestamp
    end: Timestamp
  }
  metrics: MarketMetrics
  analysis: MarketAnalysis
}

export interface MarketMetrics {
  averagePrice: number
  medianPrice: number
  totalListings: number
  soldListings: number
  averageDaysOnMarket: number
  priceChangePercentage: number
  demandScore: number // 1-100
}

export interface MarketAnalysis {
  trend: 'rising' | 'falling' | 'stable'
  confidence: number // 0-1
  factors: string[]
  forecast?: {
    nextMonth: number
    nextQuarter: number
  }
}

// System and admin schemas
export interface SystemLog extends BaseDocument {
  level: LogLevel
  category: LogCategory
  message: string
  userId?: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, unknown>
  resolved: boolean
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical'
export type LogCategory = 'auth' | 'payment' | 'search' | 'listing' | 'ai' | 'system' | 'security'

export interface AdminDashboardData {
  overview: {
    totalUsers: number
    totalListings: number
    totalTransactions: number
    revenue: number
    period: string
  }
  analytics: {
    dailyActiveUsers: number
    conversionRate: number
    averageSessionDuration: number
    bounceRate: number
  }
  health: {
    systemStatus: 'healthy' | 'warning' | 'critical'
    responseTime: number
    errorRate: number
    uptime: number
  }
}

// AI and machine learning schemas
export interface AIAnalysis extends BaseDocument {
  type: 'price-prediction' | 'content-generation' | 'fraud-detection' | 'recommendation'
  inputData: Record<string, unknown>
  outputData: Record<string, unknown>
  confidence: number
  model: string
  version: string
  processingTime: number
  userId?: string
  listingId?: string
}

export interface UserBehavior extends BaseDocument {
  userId: string
  sessionId: string
  events: BehaviorEvent[]
  deviceInfo: DeviceInfo
  location?: UserLocation
}

export interface BehaviorEvent {
  type: 'page-view' | 'search' | 'listing-view' | 'contact-click' | 'phone-click' | 'favorite'
  timestamp: Timestamp
  metadata: Record<string, unknown>
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop'
  os: string
  browser: string
  screen: {
    width: number
    height: number
  }
}

// Type guards and validation functions
export const isUser = (obj: unknown): obj is User => {
  return typeof obj === 'object' && obj !== null && 'email' in obj && 'role' in obj
}

export const isCarListing = (obj: unknown): obj is CarListing => {
  return typeof obj === 'object' && obj !== null && 'sellerId' in obj && 'car' in obj
}

export const isValidUserRole = (role: string): role is UserRole => {
  return ['buyer', 'seller', 'admin', 'moderator'].includes(role)
}

export const isValidListingStatus = (status: string): status is ListingStatus => {
  return ['draft', 'pending', 'active', 'sold', 'expired', 'suspended', 'deleted'].includes(status)
}

// Utility types
export type PartialUpdate<T> = Partial<Omit<T, 'id' | 'createdAt'>> & { updatedAt: Timestamp }
export type CreateInput<T extends BaseDocument> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

// Constants for validation
export const VALIDATION_LIMITS = {
  USER: {
    DISPLAY_NAME_MAX_LENGTH: 50,
    BIO_MAX_LENGTH: 500,
    PHONE_REGEX: /^\+359[0-9]{8,9}$/
  },
  LISTING: {
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 2000,
    MAX_IMAGES: 20,
    MAX_VIDEOS: 3,
    MIN_PRICE: 100, // €100
    MAX_PRICE: 1000000 // €1,000,000
  },
  MESSAGE: {
    CONTENT_MAX_LENGTH: 1000,
    MAX_ATTACHMENTS: 5
  }
} as const

export default {
  User,
  CarListing,
  Review,
  Conversation,
  Message,
  SavedSearch,
  BulgarianCompany,
  MarketTrend,
  SystemLog,
  AIAnalysis,
  UserBehavior
}
