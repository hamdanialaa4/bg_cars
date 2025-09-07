import { API_CONSTANTS } from './constants'
import type { ApiResponse, ApiError } from '../types'

// API Response Helpers
export const createSuccessResponse = <T>(
  data: T,
  message?: string
): ApiResponse<T> => ({
  success: true,
  data,
  message
})

export const createErrorResponse = (
  error: string,
  code?: string,
  details?: unknown
): ApiError => ({
  success: false,
  error,
  code,
  details,
  timestamp: new Date().toISOString()
})

// HTTP Request Helpers
export const buildHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

export const buildUrl = (
  endpoint: string,
  params?: Record<string, string | number | boolean>
): string => {
  const url = new URL(endpoint, API_CONSTANTS.baseURL)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })
  }

  return url.toString()
}

// Error Handling Helpers
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return createErrorResponse(error.message, 'UNKNOWN_ERROR')
  }

  if (typeof error === 'string') {
    return createErrorResponse(error, 'STRING_ERROR')
  }

  if (typeof error === 'object' && error !== null) {
    const apiError = error as { message?: string; code?: string; details?: unknown }
    return createErrorResponse(
      apiError.message || 'Unknown error occurred',
      apiError.code || 'API_ERROR',
      apiError.details
    )
  }

  return createErrorResponse('An unexpected error occurred', 'UNEXPECTED_ERROR')
}

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof Error && (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('Failed to fetch')
  )
}

export const isAuthError = (error: unknown): boolean => {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as { code?: string; status?: number }
    return apiError.code === 'UNAUTHORIZED' ||
           apiError.code === 'FORBIDDEN' ||
           apiError.status === 401 ||
           apiError.status === 403
  }
  return false
}

// Retry Logic Helpers
export const createRetryFunction = <T>(
  fn: () => Promise<T>,
  maxRetries: number = API_CONSTANTS.retryAttempts,
  delay: number = API_CONSTANTS.retryDelay
): Promise<T> => {
  return new Promise((resolve, reject) => {
    let attempts = 0

    const attempt = async () => {
      try {
        const result = await fn()
        resolve(result)
      } catch (error) {
        attempts++

        if (attempts >= maxRetries || !isNetworkError(error)) {
          reject(error)
          return
        }

        setTimeout(attempt, delay * Math.pow(2, attempts - 1))
      }
    }

    attempt()
  })
}

// Cache Helpers
export const createCacheKey = (
  endpoint: string,
  params?: Record<string, unknown>
): string => {
  const baseKey = endpoint.replace(API_CONSTANTS.baseURL, '')
  if (!params || Object.keys(params).length === 0) {
    return baseKey
  }

  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key]
      return result
    }, {} as Record<string, unknown>)

  return `${baseKey}?${JSON.stringify(sortedParams)}`
}

export const isCacheValid = (
  timestamp: number,
  ttl: number = API_CONSTANTS.cacheTTL
): boolean => {
  return Date.now() - timestamp < ttl
}

// Request Interceptors
export const addRequestInterceptor = (
  request: Record<string, unknown>,
  token?: string
): Record<string, unknown> => {
  const headers = buildHeaders(token)

  return {
    ...request,
    headers: {
      ...headers,
      ...(request.headers as Record<string, unknown> || {})
    }
  }
}

export const addResponseInterceptor = async <T>(
  response: Response
): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw createErrorResponse(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      `HTTP_${response.status}`,
      errorData
    )
  }

  return response.json()
}

// Pagination Helpers
export const buildPaginationParams = (
  page: number,
  limit: number = API_CONSTANTS.defaultPageSize
): Record<string, number> => ({
  page,
  limit,
  offset: (page - 1) * limit
})

export const calculateTotalPages = (
  totalItems: number,
  itemsPerPage: number
): number => {
  return Math.ceil(totalItems / itemsPerPage)
}

// Rate Limiting Helpers
export const createRateLimiter = (
  maxRequests: number = API_CONSTANTS.rateLimitMaxRequests,
  windowMs: number = API_CONSTANTS.rateLimitWindowMs
) => {
  const requests: number[] = []

  return {
    isAllowed: (): boolean => {
      const now = Date.now()
      const windowStart = now - windowMs

      // Remove old requests outside the window
      while (requests.length > 0 && requests[0] < windowStart) {
        requests.shift()
      }

      return requests.length < maxRequests
    },

    recordRequest: (): void => {
      requests.push(Date.now())
    },

    getRemainingRequests: (): number => {
      const now = Date.now()
      const windowStart = now - windowMs

      while (requests.length > 0 && requests[0] < windowStart) {
        requests.shift()
      }

      return Math.max(0, maxRequests - requests.length)
    },

    getResetTime: (): number => {
      if (requests.length === 0) return 0

      const oldestRequest = requests[0]
      return oldestRequest + windowMs - Date.now()
    }
  }
}

// WebSocket Helpers
export const createWebSocketUrl = (
  endpoint: string,
  token?: string
): string => {
  const wsUrl = API_CONSTANTS.wsURL || API_CONSTANTS.baseURL.replace(/^http/, 'ws')
  const url = new URL(endpoint, wsUrl)

  if (token) {
    url.searchParams.append('token', token)
  }

  return url.toString()
}

export const createWebSocketMessage = <T>(
  type: string,
  payload: T
): string => {
  return JSON.stringify({
    type,
    payload,
    timestamp: new Date().toISOString()
  })
}

// File Upload Helpers
export const createFormData = (
  files: FileList | File[],
  additionalData?: Record<string, string | number | boolean>
): FormData => {
  const formData = new FormData()

  // Add files
  const fileArray = Array.from(files)
  fileArray.forEach((file, index) => {
    formData.append(`file${index}`, file)
  })

  // Add additional data
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })
  }

  return formData
}

export const validateFileSize = (
  file: File,
  maxSize: number = API_CONSTANTS.maxFileSize
): boolean => {
  return file.size <= maxSize
}

export const validateFileType = (
  file: File,
  allowedTypes: readonly string[] = API_CONSTANTS.allowedFileTypes
): boolean => {
  return allowedTypes.includes(file.type)
}

// API Client Base Class
export class ApiClient {
  private token?: string
  private rateLimiter = createRateLimiter()

  constructor(_baseURL: string = API_CONSTANTS.baseURL) {
    // baseURL is not stored as it's not used in the current implementation
  }

  setToken(token: string): void {
    this.token = token
  }

  clearToken(): void {
    this.token = undefined
  }

  private async request<T>(
    endpoint: string,
    options: Record<string, unknown> = {}
  ): Promise<T> {
    if (!this.rateLimiter.isAllowed()) {
      throw createErrorResponse('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED')
    }

    this.rateLimiter.recordRequest()

    const url = buildUrl(endpoint, undefined)
    const requestOptions = addRequestInterceptor(options, this.token)

    try {
      const response = await fetch(url, requestOptions)
      return await addResponseInterceptor<T>(response)
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    const url = params ? buildUrl(endpoint, params) : endpoint
    return this.request<T>(url)
  }

  async post<T>(
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async patch<T>(
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE'
    })
  }

  async upload<T>(
    endpoint: string,
    files: FileList | File[],
    additionalData?: Record<string, string | number | boolean>
  ): Promise<T> {
    const formData = createFormData(files, additionalData)

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : undefined,
        Accept: 'application/json'
      }
    })
  }
}

// Default API client instance
export const apiClient = new ApiClient()
