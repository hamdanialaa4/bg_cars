// File: src/services/database/DatabaseManager.ts
/**
 * مدير قاعدة البيانات المتقدم لمنصة BG Cars Platform
 * يوفر عمليات CRUD محسنة مع الكاش والتحسين
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  writeBatch,
  increment,
  serverTimestamp,
  enableNetwork,
  disableNetwork,
  Query,
  DocumentSnapshot,
  Unsubscribe,
  WhereFilterOp,
  OrderByDirection
} from 'firebase/firestore'
import { db } from '../../services/firebase/config'
import type {
  BaseDocument,
  PartialUpdate,
  CreateInput
} from './schemas'

// Cache configuration
interface CacheConfig {
  enabled: boolean
  ttl: number // Time to live in milliseconds
  maxSize: number
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiry: number
}

// Query builder types
export interface QueryOptions {
  where?: Array<{
    field: string
    operator: WhereFilterOp
    value: unknown
  }>
  orderBy?: Array<{
    field: string
    direction?: OrderByDirection
  }>
  limit?: number
  startAfter?: DocumentSnapshot
}

export interface PaginationOptions {
  page: number
  pageSize: number
  orderBy?: string
  direction?: OrderByDirection
}

export interface SearchResult<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrevious: boolean
  }
  metadata: {
    queryTime: number
    fromCache: boolean
  }
}

// Database Manager Class
export class DatabaseManager {
  private cache: Map<string, CacheEntry<unknown>> = new Map()
  private cacheConfig: CacheConfig = {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 1000
  }
  private activeListeners: Map<string, Unsubscribe> = new Map()

  constructor(cacheConfig?: Partial<CacheConfig>) {
    if (cacheConfig) {
      this.cacheConfig = { ...this.cacheConfig, ...cacheConfig }
    }
    this.startCacheCleanup()
  }

  // Generic CRUD Operations
  async create<T extends BaseDocument>(
    collectionName: string,
    data: CreateInput<T>
  ): Promise<string> {
    try {
      const timestamp = serverTimestamp()
      const docData = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
        isActive: true
      }

      const docRef = await addDoc(collection(db, collectionName), docData)
      
      // Log the operation
      await this.logOperation('create', collectionName, docRef.id)
      
      // Clear related cache entries
      this.clearCacheByPattern(collectionName)
      
      return docRef.id
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error)
      throw new Error(`Failed to create ${collectionName}`)
    }
  }

  async read<T extends BaseDocument>(
    collectionName: string,
    docId: string,
    useCache: boolean = true
  ): Promise<T | null> {
    const cacheKey = `${collectionName}:${docId}`
    
    // Check cache first
    if (useCache && this.cacheConfig.enabled) {
      const cached = this.getFromCache<T>(cacheKey)
      if (cached) {
        return cached
      }
    }

    try {
      const docRef = doc(db, collectionName, docId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as T
        
        // Cache the result
        if (useCache) {
          this.setCache(cacheKey, data)
        }
        
        return data
      }
      
      return null
    } catch (error) {
      console.error(`Error reading document ${docId} from ${collectionName}:`, error)
      throw new Error(`Failed to read ${collectionName}`)
    }
  }

  async update<T extends BaseDocument>(
    collectionName: string,
    docId: string,
    updates: PartialUpdate<T>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId)
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      }
      
      await updateDoc(docRef, updateData)
      
      // Log the operation
      await this.logOperation('update', collectionName, docId)
      
      // Update cache
      const cacheKey = `${collectionName}:${docId}`
      this.clearCache(cacheKey)
      
    } catch (error) {
      console.error(`Error updating document ${docId} in ${collectionName}:`, error)
      throw new Error(`Failed to update ${collectionName}`)
    }
  }

  async delete(collectionName: string, docId: string, softDelete: boolean = true): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId)
      
      if (softDelete) {
        await updateDoc(docRef, {
          isActive: false,
          deletedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      } else {
        await deleteDoc(docRef)
      }
      
      // Log the operation
      await this.logOperation('delete', collectionName, docId)
      
      // Clear cache
      const cacheKey = `${collectionName}:${docId}`
      this.clearCache(cacheKey)
      
    } catch (error) {
      console.error(`Error deleting document ${docId} from ${collectionName}:`, error)
      throw new Error(`Failed to delete ${collectionName}`)
    }
  }

  // Advanced Query Operations
  async query<T extends BaseDocument>(
    collectionName: string,
    options: QueryOptions = {},
    useCache: boolean = false
  ): Promise<T[]> {
    const cacheKey = this.generateQueryCacheKey(collectionName, options)
    
    // Check cache
    if (useCache && this.cacheConfig.enabled) {
      const cached = this.getFromCache<T[]>(cacheKey)
      if (cached) {
        return cached
      }
    }

    try {
      let q = collection(db, collectionName) as Query
      
      // Apply where conditions
      if (options.where) {
        for (const condition of options.where) {
          q = query(q, where(condition.field, condition.operator, condition.value))
        }
      }
      
      // Apply orderBy
      if (options.orderBy) {
        for (const order of options.orderBy) {
          q = query(q, orderBy(order.field, order.direction))
        }
      }
      
      // Apply limit
      if (options.limit) {
        q = query(q, limit(options.limit))
      }
      
      // Apply startAfter for pagination
      if (options.startAfter) {
        q = query(q, startAfter(options.startAfter))
      }
      
      const querySnapshot = await getDocs(q)
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[]
      
      // Cache results
      if (useCache) {
        this.setCache(cacheKey, results)
      }
      
      return results
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error)
      throw new Error(`Failed to query ${collectionName}`)
    }
  }

  async paginate<T extends BaseDocument>(
    collectionName: string,
    options: PaginationOptions,
    additionalFilters?: QueryOptions
  ): Promise<SearchResult<T>> {
    const startTime = Date.now()
    
    try {
      let q = collection(db, collectionName) as Query
      
      // Apply additional filters
      if (additionalFilters?.where) {
        for (const condition of additionalFilters.where) {
          q = query(q, where(condition.field, condition.operator, condition.value))
        }
      }
      
      // Apply ordering
      const orderField = options.orderBy || 'createdAt'
      const orderDirection = options.direction || 'desc'
      q = query(q, orderBy(orderField, orderDirection))
      
      // Calculate offset for pagination
      const offset = (options.page - 1) * options.pageSize
      
      // Get total count (for pagination info)
      const totalSnapshot = await getDocs(q)
      const totalItems = totalSnapshot.size
      const totalPages = Math.ceil(totalItems / options.pageSize)
      
      // Apply pagination
      q = query(q, limit(options.pageSize))
      if (offset > 0) {
        const offsetSnapshot = await getDocs(query(q, limit(offset)))
        const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1]
        if (lastDoc) {
          q = query(q, startAfter(lastDoc))
        }
      }
      
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[]
      
      const queryTime = Date.now() - startTime
      
      return {
        data,
        pagination: {
          currentPage: options.page,
          totalPages,
          totalItems,
          hasNext: options.page < totalPages,
          hasPrevious: options.page > 1
        },
        metadata: {
          queryTime,
          fromCache: false
        }
      }
    } catch (error) {
      console.error(`Error paginating ${collectionName}:`, error)
      throw new Error(`Failed to paginate ${collectionName}`)
    }
  }

  // Real-time listeners
  listen<T extends BaseDocument>(
    collectionName: string,
    docId: string,
    callback: (data: T | null) => void
  ): string {
    const listenerId = `${collectionName}:${docId}:${Date.now()}`
    
    try {
      const docRef = doc(db, collectionName, docId)
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as T
          callback(data)
        } else {
          callback(null)
        }
      })
      
      this.activeListeners.set(listenerId, unsubscribe)
      return listenerId
    } catch (error) {
      console.error(`Error setting up listener for ${collectionName}:${docId}:`, error)
      throw new Error(`Failed to create listener`)
    }
  }

  listenToQuery<T extends BaseDocument>(
    collectionName: string,
    options: QueryOptions,
    callback: (data: T[]) => void
  ): string {
    const listenerId = `${collectionName}:query:${Date.now()}`
    
    try {
      let q = collection(db, collectionName) as Query
      
      // Apply filters
      if (options.where) {
        for (const condition of options.where) {
          q = query(q, where(condition.field, condition.operator, condition.value))
        }
      }
      
      if (options.orderBy) {
        for (const order of options.orderBy) {
          q = query(q, orderBy(order.field, order.direction))
        }
      }
      
      if (options.limit) {
        q = query(q, limit(options.limit))
      }
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[]
        callback(data)
      })
      
      this.activeListeners.set(listenerId, unsubscribe)
      return listenerId
    } catch (error) {
      console.error(`Error setting up query listener for ${collectionName}:`, error)
      throw new Error(`Failed to create query listener`)
    }
  }

  stopListening(listenerId: string): void {
    const unsubscribe = this.activeListeners.get(listenerId)
    if (unsubscribe) {
      unsubscribe()
      this.activeListeners.delete(listenerId)
    }
  }

  // Batch operations
  async batchWrite(operations: Array<{
    type: 'create' | 'update' | 'delete'
    collection: string
    docId?: string
    data?: unknown
  }>): Promise<void> {
    try {
      const batch = writeBatch(db)
      
      for (const operation of operations) {
        const { type, collection: collectionName, docId, data } = operation
        
        switch (type) {
          case 'create': {
            const docRef = doc(collection(db, collectionName))
            const createData = {
              ...(data as Record<string, unknown>),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              isActive: true
            }
            batch.set(docRef, createData)
            break
          }
          case 'update': {
            if (!docId) throw new Error('Document ID required for update')
            const docRef = doc(db, collectionName, docId)
            const updateData = {
              ...(data as Record<string, unknown>),
              updatedAt: serverTimestamp()
            }
            batch.update(docRef, updateData)
            break
          }
          case 'delete': {
            if (!docId) throw new Error('Document ID required for delete')
            const docRef = doc(db, collectionName, docId)
            batch.update(docRef, {
              isActive: false,
              deletedAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            })
            break
          }
        }
      }
      
      await batch.commit()
      
      // Clear cache for affected collections
      const affectedCollections = [...new Set(operations.map(op => op.collection))]
      affectedCollections.forEach(collectionName => {
        this.clearCacheByPattern(collectionName)
      })
      
    } catch (error) {
      console.error('Error executing batch write:', error)
      throw new Error('Failed to execute batch operations')
    }
  }

  // Statistics and analytics
  async incrementField(
    collectionName: string,
    docId: string,
    field: string,
    value: number = 1
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, {
        [field]: increment(value),
        updatedAt: serverTimestamp()
      })
      
      // Clear cache
      const cacheKey = `${collectionName}:${docId}`
      this.clearCache(cacheKey)
      
    } catch (error) {
      console.error(`Error incrementing field ${field} in ${collectionName}:${docId}:`, error)
      throw new Error('Failed to increment field')
    }
  }

  // Cache management
  private setCache<T>(key: string, data: T): void {
    if (!this.cacheConfig.enabled) return
    
    // Check cache size limit
    if (this.cache.size >= this.cacheConfig.maxSize) {
      this.clearOldestCacheEntries()
    }
    
    const now = Date.now()
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiry: now + this.cacheConfig.ttl
    }
    
    this.cache.set(key, entry)
  }

  private getFromCache<T>(key: string): T | null {
    if (!this.cacheConfig.enabled) return null
    
    const entry = this.cache.get(key) as CacheEntry<T> | undefined
    if (!entry) return null
    
    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  private clearCache(key: string): void {
    this.cache.delete(key)
  }

  private clearCacheByPattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  private clearOldestCacheEntries(): void {
    const entries = Array.from(this.cache.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    
    // Remove oldest 25% of entries
    const removeCount = Math.floor(entries.length * 0.25)
    for (let i = 0; i < removeCount; i++) {
      this.cache.delete(entries[i][0])
    }
  }

  private startCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.expiry) {
          this.cache.delete(key)
        }
      }
    }, this.cacheConfig.ttl)
  }

  private generateQueryCacheKey(collectionName: string, options: QueryOptions): string {
    const parts = [collectionName]
    
    if (options.where) {
      parts.push('where', JSON.stringify(options.where))
    }
    if (options.orderBy) {
      parts.push('orderBy', JSON.stringify(options.orderBy))
    }
    if (options.limit) {
      parts.push('limit', options.limit.toString())
    }
    
    return parts.join(':')
  }

  private async logOperation(operation: string, collectionName: string, docId: string): Promise<void> {
    try {
      const logData = {
        level: 'info' as const,
        category: 'system' as const,
        message: `${operation} operation on ${collectionName}:${docId}`,
        metadata: {
          operation,
          collection: collectionName,
          docId,
          timestamp: Date.now()
        },
        resolved: true
      }
      
      await addDoc(collection(db, 'system_logs'), {
        ...logData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      })
    } catch (error) {
      // Silently fail logging to prevent cascading errors
      console.warn('Failed to log operation:', error)
    }
  }

  // Network management
  async goOffline(): Promise<void> {
    await disableNetwork(db)
  }

  async goOnline(): Promise<void> {
    await enableNetwork(db)
  }

  // Cleanup
  destroy(): void {
    // Stop all active listeners
    for (const [, unsubscribe] of this.activeListeners) {
      unsubscribe()
    }
    this.activeListeners.clear()
    
    // Clear cache
    this.cache.clear()
  }
}

// Singleton instance
export const databaseManager = new DatabaseManager()

export default databaseManager
