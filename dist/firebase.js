// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4pKyjitoNQrFotgMLofEvfolxQetiH5g",
  authDomain: "sample-firebase-ai-app-df903.firebaseapp.com",
  projectId: "sample-firebase-ai-app-df903",
  storageBucket: "sample-firebase-ai-app-df903.appspot.com",
  messagingSenderId: "990127825935",
  appId: "1:990127825935:web:df49a6b1f3b49b58eb6f7a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
