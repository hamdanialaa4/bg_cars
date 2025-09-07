import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, db } from '../services/firebase/config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isSeller = computed(() => user.value?.isSeller || false)

  // Initialize auth state listener
  const initAuth = () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await loadUserProfile(firebaseUser)
      } else {
        user.value = null
      }
    })
  }

  // Load user profile from Firestore
  const loadUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (userDoc.exists()) {
        user.value = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          avatar: firebaseUser.photoURL || undefined,
          ...userDoc.data()
        } as User
      } else {
        // Create new user profile
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          avatar: firebaseUser.photoURL || undefined,
          phone: '',
          location: '',
          isSeller: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
        user.value = newUser
      }
    } catch (err) {
      console.error('Error loading user profile:', err)
      error.value = 'Failed to load user profile'
    }
  }

  // Register new user
  const register = async (email: string, password: string, displayName: string) => {
    loading.value = true
    error.value = null
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })

      // User profile will be created by the auth state listener
      return result.user
    } catch (err) {
      const caughtError = err as Error
      error.value = caughtError.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Login user
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (err) {
      const caughtError = err as Error
      error.value = caughtError.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout user
  const logout = async () => {
    loading.value = true
    error.value = null
    try {
      await signOut(auth)
    } catch (err) {
      const caughtError = err as Error
      error.value = caughtError.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update user profile
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user.value) return

    loading.value = true
    error.value = null
    try {
      const updatedUser = { ...user.value, ...updates, updatedAt: new Date() }
      await setDoc(doc(db, 'users', user.value.id), updatedUser, { merge: true })
      user.value = updatedUser
    } catch (err) {
      const caughtError = err as Error
      error.value = caughtError.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isSeller,
    initAuth,
    register,
    login,
    logout,
    updateUserProfile
  }
})
