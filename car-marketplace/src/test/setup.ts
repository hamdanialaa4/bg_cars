import { beforeAll, afterEach, afterAll, vi } from 'vitest'

// Mock Firebase
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Mock environment variables
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
;(globalThis as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
}

// Mock ResizeObserver
;(globalThis as any).ResizeObserver = class ResizeObserver {
  constructor(cb: unknown) {
    this.cb = cb
  }
  cb: unknown
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
}

// Mock Firebase config
const firebaseConfig = {
  apiKey: 'test-api-key',
  authDomain: 'test.firebaseapp.com',
  projectId: 'test-project',
  storageBucket: 'test.appspot.com',
  messagingSenderId: '123456789',
  appId: 'test-app-id'
}

// Initialize Firebase mocks
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Mock Firebase methods
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => app)
}))

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => auth),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  FacebookAuthProvider: vi.fn()
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => db),
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn()
}))

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => storage),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
  deleteObject: vi.fn()
}))

// Mock OpenAI
vi.mock('openai', () => ({
  OpenAI: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn()
      }
    }
  }))
}))

// Mock Vue Router
vi.mock('vue-router', () => ({
  createRouter: vi.fn(),
  createWebHistory: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  })),
  useRoute: vi.fn(() => ({
    params: {},
    query: {},
    name: 'Home',
    path: '/',
    fullPath: '/',
    hash: '',
    matched: []
  }))
}))

// Mock Pinia
vi.mock('pinia', () => ({
  createPinia: vi.fn(() => ({})),
  defineStore: vi.fn(),
  storeToRefs: vi.fn()
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}
;(globalThis as typeof globalThis & { localStorage: typeof localStorageMock }).localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}
;(globalThis as typeof globalThis & { sessionStorage: typeof sessionStorageMock }).sessionStorage = sessionStorageMock

// Mock Notification API
;(globalThis as any).Notification = vi.fn(() => ({
  close: vi.fn()
}))

// Mock Service Worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn(() => Promise.resolve()),
    ready: Promise.resolve({
      active: {},
      waiting: null,
      controlling: null
    }),
    getRegistrations: vi.fn(() => Promise.resolve([])),
    getRegistration: vi.fn(() => Promise.resolve(null))
  },
  writable: true
})

// Mock Geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn((success) => success({
      coords: {
        latitude: 42.6977,
        longitude: 23.3219,
        accuracy: 100
      }
    })),
    watchPosition: vi.fn(),
    clearWatch: vi.fn()
  },
  writable: true
})

// Mock WebSocket
;(globalThis as any).WebSocket = vi.fn(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  send: vi.fn(),
  close: vi.fn(),
  readyState: 1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
}))

// Setup and teardown
beforeAll(() => {
  // Setup global test environment
})

afterEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  // Cleanup global test environment
})
