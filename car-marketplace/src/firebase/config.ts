import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAUqK5WGZSIYehZUmu1E0qFNllUOqsF8dE",
  authDomain: "bg-cars-platform.firebaseapp.com",
  projectId: "bg-cars-platform",
  storageBucket: "bg-cars-platform.appspot.com",
  messagingSenderId: "407228642196",
  appId: "1:407228642196:web:8bd39924cac891979f9581",
  measurementId: "G-FNL2W79P0R"
}

// Initialize Firebase only if it hasn't been initialized already
let app
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
