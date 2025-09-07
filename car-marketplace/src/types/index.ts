// User Types
export interface User {
  id: string
  email: string
  displayName: string
  avatar?: string
  phone?: string
  location?: string
  isSeller: boolean
  createdAt: Date
  updatedAt: Date
}

// Car Types
export interface Car {
  id: string
  title: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'lpg'
  transmission: 'manual' | 'automatic' | 'semi-automatic'
  bodyType: 'sedan' | 'hatchback' | 'coupe' | 'convertible' | 'suv' | 'pickup' | 'van' | 'wagon'
  engineSize: number
  power: number
  color: string
  condition: 'new' | 'used' | 'damaged'
  location: string
  description: string
  images: string[]
  features: string[]
  sellerId: string
  seller: User
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  views: number
  favorites: number
}

// Search and Filter Types
export interface SearchFilters {
  make?: string
  model?: string
  minYear?: number
  maxYear?: number
  minPrice?: number
  maxPrice?: number
  maxMileage?: number
  fuelType?: string[]
  transmission?: string[]
  bodyType?: string[]
  condition?: string[]
  location?: string
  features?: string[]
}

export interface SearchResult {
  cars: Car[]
  total: number
  hasMore: boolean
  filters: SearchFilters
}

// Message Types
export interface Message {
  id: string
  senderId: string
  receiverId: string
  text: string
  timestamp: Date
  isRead: boolean
  attachments?: string[]
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage: Message
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}

// AI Types
export interface AIChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  suggestions?: string[]
}

export interface ImageAnalysisResult {
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  confidence: number
  issues: string[]
  recommendations: string[]
  estimatedValue?: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  success: false
  error: string
  code?: string
  details?: unknown
  timestamp?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Form Types
export interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  displayName: string
  phone?: string
  isSeller: boolean
  agreeToTerms: boolean
}

export interface CarForm {
  title: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: string
  transmission: string
  bodyType: string
  engineSize: number
  power: number
  color: string
  condition: string
  location: string
  description: string
  features: string[]
  images: File[]
}

// UI Types
export interface NotificationItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
}

export interface LoadingState {
  isLoading: boolean
  message?: string
}

// Route Types
export interface RouteMeta {
  requiresAuth?: boolean
  requiresSeller?: boolean
  title?: string
  description?: string
}

// PWA Types
export interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: Record<string, unknown>
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
