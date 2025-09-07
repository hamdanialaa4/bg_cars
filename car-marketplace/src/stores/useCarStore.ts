import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../services/firebase/config'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import type { Car, SearchFilters } from '../types'

export const useCarStore = defineStore('car', () => {
  const cars = ref<Car[]>([])
  const currentCar = ref<Car | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastDoc = ref<QueryDocumentSnapshot | null>(null)
  const hasMore = ref(true)

  // Getters
  const getCarById = computed(() => {
    return (id: string) => cars.value.find(car => car.id === id)
  })

  const filteredCars = computed(() => {
    return (filters: SearchFilters) => {
      return cars.value.filter(car => {
        if (filters.make && car.make !== filters.make) return false
        if (filters.model && car.model !== filters.model) return false
        if (filters.minYear && car.year < filters.minYear) return false
        if (filters.maxYear && car.year > filters.maxYear) return false
        if (filters.minPrice && car.price < filters.minPrice) return false
        if (filters.maxPrice && car.price > filters.maxPrice) return false
        return true
      })
    }
  })

  // Actions
  const fetchCars = async (filters?: SearchFilters, loadMore = false) => {
    loading.value = true
    error.value = null

    try {
      let q = query(
        collection(db, 'cars'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(20)
      )

      if (loadMore && lastDoc.value) {
        q = query(q, startAfter(lastDoc.value))
      }

      // Apply filters
      if (filters) {
        if (filters.make) {
          q = query(q, where('make', '==', filters.make))
        }
        if (filters.model) {
          q = query(q, where('model', '==', filters.model))
        }
        // Note: Range filters for year and price would need composite indexes
      }

      const querySnapshot = await getDocs(q)
      const newCars: Car[] = []

      querySnapshot.forEach((doc) => {
        newCars.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        } as Car)
      })

      if (loadMore) {
        cars.value.push(...newCars)
      } else {
        cars.value = newCars
      }

      lastDoc.value = querySnapshot.docs[querySnapshot.docs.length - 1] || null
      hasMore.value = querySnapshot.size === 20

    } catch (err) {
      const caughtError = err as Error
      error.value = caughtError.message
    } finally {
      loading.value = false
    }
  }

  const fetchCarById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'cars', id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        currentCar.value = {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as Car
      } else {
        throw new Error('Car not found')
      }
    } catch (err) {
      const caughtError = err as Error
      error.value = caughtError.message
    } finally {
      loading.value = false
    }
  }

  const createCar = async (carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    error.value = null

    try {
      const docRef = await addDoc(collection(db, 'cars'), {
        ...carData,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const newCar: Car = {
        id: docRef.id,
        ...carData,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      cars.value.unshift(newCar)
      return newCar
    } catch (err) {
      const caughtError = err as Error
      error.value = caughtError.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCar = async (id: string, updates: Partial<Car>) => {
    loading.value = true
    error.value = null

    try {
      await updateDoc(doc(db, 'cars', id), {
        ...updates,
        updatedAt: new Date()
      })

      const index = cars.value.findIndex(car => car.id === id)
      if (index !== -1) {
        cars.value[index] = { ...cars.value[index], ...updates, updatedAt: new Date() }
      }

      if (currentCar.value?.id === id) {
        currentCar.value = { ...currentCar.value, ...updates, updatedAt: new Date() }
      }
    } catch (err) {
      const caughtError = err as Error
      error.value = caughtError.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCar = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await updateDoc(doc(db, 'cars', id), {
        isActive: false,
        updatedAt: new Date()
      })

      cars.value = cars.value.filter(car => car.id !== id)
    } catch (err) {
      const caughtError = err as Error
      error.value = caughtError.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const incrementViews = async (id: string) => {
    try {
      const car = cars.value.find(c => c.id === id)
      if (car) {
        await updateDoc(doc(db, 'cars', id), {
          views: (car.views || 0) + 1
        })
        car.views = (car.views || 0) + 1
      }
    } catch (err) {
      console.error('Error incrementing views:', err)
    }
  }

  return {
    cars,
    currentCar,
    loading,
    error,
    lastDoc,
    hasMore,
    getCarById,
    filteredCars,
    fetchCars,
    fetchCarById,
    createCar,
    updateCar,
    deleteCar,
    incrementViews
  }
})
