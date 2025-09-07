// File: src/stores/userStore.ts
/**
 * متجر المستخدم المتقدم - User Store
 * يدير حالة المستخدم والمصادقة والبيانات الشخصية
 */

import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type User as FirebaseUser
} from 'firebase/auth'
import { auth } from '@/services/firebase/config'
import type { User, UserPreferences, UserStatistics, UserSubscription } from '@/services/database/schemas'

interface UserState {
  // Authentication
  currentUser: FirebaseUser | null
  userProfile: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // User data
  preferences: UserPreferences | null
  statistics: UserStatistics | null
  subscription: UserSubscription | null
  
  // UI state
  showLoginModal: boolean
  showRegistrationModal: boolean
  showProfileModal: boolean
  
  // Errors
  authError: string | null
  profileError: string | null
}

interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

interface RegisterData {
  email: string
  password: string
  displayName: string
  phoneNumber?: string
  acceptTerms: boolean
  marketingEmails?: boolean
}

interface ProfileUpdateData {
  displayName?: string
  phoneNumber?: string
  bio?: string
  businessName?: string
  website?: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const state = reactive<UserState>({
    currentUser: null,
    userProfile: null,
    isAuthenticated: false,
    isLoading: false,
    preferences: null,
    statistics: null,
    subscription: null,
    showLoginModal: false,
    showRegistrationModal: false,
    showProfileModal: false,
    authError: null,
    profileError: null
  })

  // Getters
  const user = computed(() => state.currentUser)
  const profile = computed(() => state.userProfile)
  const isLoggedIn = computed(() => state.isAuthenticated && state.currentUser !== null)
  const isSeller = computed(() => state.userProfile?.role === 'seller' || state.userProfile?.role === 'admin')
  const isAdmin = computed(() => state.userProfile?.role === 'admin')
  const isModerator = computed(() => state.userProfile?.role === 'moderator' || state.userProfile?.role === 'admin')
  const isPremiumUser = computed(() => {
    if (!state.subscription) return false
    const now = new Date()
    return state.subscription.endDate.toDate() > now && state.subscription.type !== 'basic'
  })
  
  const userInitials = computed(() => {
    if (!state.currentUser?.displayName) return 'U'
    return state.currentUser.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  // Actions
  
  // Authentication Actions
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      state.isLoading = true
      state.authError = null
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )
      
      state.currentUser = userCredential.user
      state.isAuthenticated = true
      
      // Load user profile
      await loadUserProfile(userCredential.user.uid)
      
      // Track login event
      await trackUserEvent('login', {
        method: 'email',
        rememberMe: credentials.rememberMe || false
      })
      
    } catch (error: any) {
      console.error('Login error:', error)
      state.authError = getAuthErrorMessage(error.code)
      throw error
    } finally {
      state.isLoading = false
    }
  }

  const register = async (data: RegisterData): Promise<void> => {
    try {
      state.isLoading = true
      state.authError = null
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )
      
      // Update profile
      await updateProfile(userCredential.user, {
        displayName: data.displayName
      })
      
      // Create user profile in database
      await createUserProfile(userCredential.user, data)
      
      state.currentUser = userCredential.user
      state.isAuthenticated = true
      
      // Track registration event
      await trackUserEvent('register', {
        method: 'email',
        marketingEmails: data.marketingEmails || false
      })
      
    } catch (error: any) {
      console.error('Registration error:', error)
      state.authError = getAuthErrorMessage(error.code)
      throw error
    } finally {
      state.isLoading = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      state.isLoading = true
      
      // Track logout event
      await trackUserEvent('logout')
      
      await signOut(auth)
      
      // Clear state
      state.currentUser = null
      state.userProfile = null
      state.isAuthenticated = false
      state.preferences = null
      state.statistics = null
      state.subscription = null
      state.authError = null
      state.profileError = null
      
    } catch (error: any) {
      console.error('Logout error:', error)
      throw error
    } finally {
      state.isLoading = false
    }
  }

  const resetPassword = async (email: string): Promise<void> => {
    try {
      state.isLoading = true
      state.authError = null
      
      await sendPasswordResetEmail(auth, email)
      
      // Track password reset event
      await trackUserEvent('password_reset_requested', { email })
      
    } catch (error: any) {
      console.error('Password reset error:', error)
      state.authError = getAuthErrorMessage(error.code)
      throw error
    } finally {
      state.isLoading = false
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      if (!state.currentUser?.email) throw new Error('No authenticated user')
      
      state.isLoading = true
      state.authError = null
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        state.currentUser.email,
        currentPassword
      )
      
      await reauthenticateWithCredential(state.currentUser, credential)
      await updatePassword(state.currentUser, newPassword)
      
      // Track password change event
      await trackUserEvent('password_changed')
      
    } catch (error: any) {
      console.error('Password change error:', error)
      state.authError = getAuthErrorMessage(error.code)
      throw error
    } finally {
      state.isLoading = false
    }
  }

  // Profile Actions
  const updateUserProfile = async (updates: ProfileUpdateData): Promise<void> => {
    try {
      if (!state.currentUser) throw new Error('No authenticated user')
      
      state.isLoading = true
      state.profileError = null
      
      // Update Firebase Auth profile
      if (updates.displayName) {
        await updateProfile(state.currentUser, {
          displayName: updates.displayName
        })
      }
      
      // Update profile in database
      await updateProfileInDatabase(state.currentUser.uid, updates)
      
      // Reload profile
      await loadUserProfile(state.currentUser.uid)
      
      // Track profile update event
      await trackUserEvent('profile_updated', {
        fields: Object.keys(updates)
      })
      
    } catch (error: any) {
      console.error('Profile update error:', error)
      state.profileError = error.message
      throw error
    } finally {
      state.isLoading = false
    }
  }

  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<void> => {
    try {
      if (!state.currentUser) throw new Error('No authenticated user')
      
      state.isLoading = true
      
      // Update preferences in database
      await updatePreferencesInDatabase(state.currentUser.uid, preferences)
      
      // Update local state
      if (state.preferences) {
        Object.assign(state.preferences, preferences)
      }
      
      // Track preferences update
      await trackUserEvent('preferences_updated', {
        fields: Object.keys(preferences)
      })
      
    } catch (error: any) {
      console.error('Preferences update error:', error)
      throw error
    } finally {
      state.isLoading = false
    }
  }

  // Data Loading
  const loadUserProfile = async (userId: string): Promise<void> => {
    try {
      // Load user profile from database
      const userProfile = await loadProfileFromDatabase(userId)
      state.userProfile = userProfile
      
      // Load preferences
      const preferences = await loadPreferencesFromDatabase(userId)
      state.preferences = preferences
      
      // Load statistics
      const statistics = await loadStatisticsFromDatabase(userId)
      state.statistics = statistics
      
      // Load subscription
      const subscription = await loadSubscriptionFromDatabase(userId)
      state.subscription = subscription
      
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  // UI Actions
  const showLogin = () => {
    state.showLoginModal = true
    state.showRegistrationModal = false
  }

  const showRegistration = () => {
    state.showRegistrationModal = true
    state.showLoginModal = false
  }

  const hideModals = () => {
    state.showLoginModal = false
    state.showRegistrationModal = false
    state.showProfileModal = false
    state.authError = null
    state.profileError = null
  }

  const showProfile = () => {
    state.showProfileModal = true
  }

  // Utility Actions
  const clearErrors = () => {
    state.authError = null
    state.profileError = null
  }

  const refreshUserData = async (): Promise<void> => {
    if (state.currentUser) {
      await loadUserProfile(state.currentUser.uid)
    }
  }

  // Helper functions
  const getAuthErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'Потребителят не е намерен',
      'auth/wrong-password': 'Грешна парола',
      'auth/email-already-in-use': 'Имейлът вече се използва',
      'auth/weak-password': 'Паролата е твърде слаба',
      'auth/invalid-email': 'Невалиден имейл адрес',
      'auth/user-disabled': 'Акаунтът е деактивиран',
      'auth/too-many-requests': 'Твърде много опити. Опитайте по-късно',
      'auth/network-request-failed': 'Мрежова грешка. Проверете интернет връзката'
    }
    
    return errorMessages[errorCode] || 'Възникна неочаквана грешка'
  }

  const createUserProfile = async (user: FirebaseUser, registerData: RegisterData): Promise<void> => {
    // TODO: Implement database user profile creation
    console.log('Creating user profile:', user.uid, registerData)
  }

  const updateProfileInDatabase = async (userId: string, updates: ProfileUpdateData): Promise<void> => {
    // TODO: Implement database profile update
    console.log('Updating profile:', userId, updates)
  }

  const updatePreferencesInDatabase = async (userId: string, preferences: Partial<UserPreferences>): Promise<void> => {
    // TODO: Implement database preferences update
    console.log('Updating preferences:', userId, preferences)
  }

  const loadProfileFromDatabase = async (userId: string): Promise<User | null> => {
    // TODO: Implement database profile loading
    console.log('Loading profile:', userId)
    return null
  }

  const loadPreferencesFromDatabase = async (userId: string): Promise<UserPreferences | null> => {
    // TODO: Implement database preferences loading
    console.log('Loading preferences:', userId)
    return null
  }

  const loadStatisticsFromDatabase = async (userId: string): Promise<UserStatistics | null> => {
    // TODO: Implement database statistics loading
    console.log('Loading statistics:', userId)
    return null
  }

  const loadSubscriptionFromDatabase = async (userId: string): Promise<UserSubscription | null> => {
    // TODO: Implement database subscription loading
    console.log('Loading subscription:', userId)
    return null
  }

  const trackUserEvent = async (event: string, data?: Record<string, unknown>): Promise<void> => {
    // TODO: Implement analytics tracking
    console.log('Tracking user event:', event, data)
  }

  // Initialize auth state listener
  const initializeAuthListener = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        state.currentUser = user
        state.isAuthenticated = true
        await loadUserProfile(user.uid)
      } else {
        state.currentUser = null
        state.isAuthenticated = false
        state.userProfile = null
        state.preferences = null
        state.statistics = null
        state.subscription = null
      }
    })
  }

  // Initialize on store creation
  initializeAuthListener()

  return {
    // State
    state,
    
    // Getters
    user,
    profile,
    isLoggedIn,
    isSeller,
    isAdmin,
    isModerator,
    isPremiumUser,
    userInitials,
    
    // Actions
    login,
    register,
    logout,
    resetPassword,
    changePassword,
    updateUserProfile,
    updatePreferences,
    loadUserProfile,
    showLogin,
    showRegistration,
    hideModals,
    showProfile,
    clearErrors,
    refreshUserData,
    initializeAuthListener
  }
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['state.preferences']
  }
})
