import { CURRENCY_CONSTANTS, DATE_CONSTANTS } from './constants'
import type { Car, SearchFilters } from '../types'

// Currency Helpers
export const formatCurrency = (amount: number, currency = CURRENCY_CONSTANTS.default): string => {
  return new Intl.NumberFormat(CURRENCY_CONSTANTS.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatPrice = (price: number): string => {
  return formatCurrency(price)
}

// Date Helpers
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(DATE_CONSTANTS.locale, DATE_CONSTANTS.formatOptions)
}

export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString(DATE_CONSTANTS.locale, DATE_CONSTANTS.timeFormatOptions)
}

export const formatDateTime = (date: Date | string): string => {
  return `${formatDate(date)} ${formatTime(date)}`
}

export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return formatDate(dateObj)
}

// Number Helpers
export const formatNumber = (num: number, locale = 'bg-BG'): string => {
  return new Intl.NumberFormat(locale).format(num)
}

export const formatMileage = (mileage: number): string => {
  return `${formatNumber(mileage)} km`
}

export const formatEngineSize = (size: number): string => {
  return `${size}L`
}

export const formatPower = (power: number): string => {
  return `${power} HP`
}

// String Helpers
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const titleCase = (str: string): string => {
  return str.split(' ').map(capitalize).join(' ')
}

export const truncate = (str: string, length: number, suffix = '...'): string => {
  if (str.length <= length) return str
  return str.substring(0, length - suffix.length) + suffix
}

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Array Helpers
export const unique = <T>(arr: T[]): T[] => {
  return [...new Set(arr)]
}

export const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export const shuffle = <T>(arr: T[]): T[] => {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Object Helpers
export const isEmpty = (obj: Record<string, unknown>): boolean => {
  return Object.keys(obj).length === 0
}

export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result
}

// Car Helpers
export const getCarTitle = (car: Car): string => {
  return `${car.year} ${car.make} ${car.model}`
}

export const getCarAge = (year: number): number => {
  return new Date().getFullYear() - year
}

export const getCarConditionColor = (condition: string): string => {
  switch (condition) {
    case 'new':
      return '#27ae60'
    case 'used':
      return '#3498db'
    case 'damaged':
      return '#e74c3c'
    default:
      return '#95a5a6'
  }
}

export const getFuelTypeIcon = (fuelType: string): string => {
  switch (fuelType) {
    case 'petrol':
      return 'fas fa-gas-pump'
    case 'diesel':
      return 'fas fa-tint'
    case 'electric':
      return 'fas fa-bolt'
    case 'hybrid':
      return 'fas fa-battery-half'
    case 'lpg':
      return 'fas fa-fire'
    default:
      return 'fas fa-gas-pump'
  }
}

export const getTransmissionIcon = (transmission: string): string => {
  switch (transmission) {
    case 'manual':
      return 'fas fa-cogs'
    case 'automatic':
      return 'fas fa-robot'
    case 'semi-automatic':
      return 'fas fa-cog'
    default:
      return 'fas fa-cogs'
  }
}

// Search Helpers
export const buildSearchQuery = (filters: SearchFilters): string => {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v))
      } else {
        params.append(key, value.toString())
      }
    }
  })

  return params.toString()
}

export const parseSearchQuery = (query: string): SearchFilters => {
  const params = new URLSearchParams(query)
  const filters: Record<string, unknown> = {}

  params.forEach((value, key) => {
    if (key.includes('[]')) {
      const arrayKey = key.replace('[]', '')
      if (!filters[arrayKey]) {
        filters[arrayKey] = []
      }
      (filters[arrayKey] as string[]).push(value)
    } else {
      filters[key] = value
    }
  })

  return filters as SearchFilters
}

// File Helpers
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export const getFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const isImageFile = (filename: string): boolean => {
  const ext = getFileExtension(filename)
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
}

// Validation Helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/
  return phoneRegex.test(phone)
}

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

// URL Helpers
export const buildUrl = (base: string, params: Record<string, string | number | boolean>): string => {
  const url = new URL(base, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString())
  })
  return url.toString()
}

export const getUrlParams = (): Record<string, string> => {
  const params: Record<string, string> = {}
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

// Local Storage Helpers
export const setLocalStorage = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const getLocalStorage = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue || null
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue || null
  }
}

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

// Debounce Helper
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle Helper
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Async Helpers
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const retry = async <T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    if (attempts <= 1) {
      throw error
    }
    await sleep(delay)
    return retry(fn, attempts - 1, delay * 2)
  }
}
