// File: src/types/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_GOOGLE_TRANSLATE_API_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_GA_TRACKING_ID: string
  readonly VITE_ELASTICSEARCH_ENDPOINT: string
  readonly NODE_ENV: 'development' | 'production' | 'staging'
  readonly PROD: boolean
  readonly DEV: boolean
  readonly MODE: string
  readonly BASE_URL: string
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global type declarations for the project
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
    google?: any
    firebase?: any
  }
}

export {}
