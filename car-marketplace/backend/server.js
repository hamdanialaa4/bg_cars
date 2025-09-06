const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./bg-cars-platform-firebase-adminsdk-fbsvc-6da87fa864.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://bg-cars-platform-default-rtdb.firebaseio.com' // Adjust if using Realtime Database
});

const db = admin.firestore();

// Example function to add a car
async function addCar(carData) {
  try {
    const docRef = await db.collection('cars').add(carData);
    console.log('Car added with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding car:', error);
  }
}

// Example usage
// addCar({ make: 'BMW', model: 'X5', year: 2020 });

module.exports = { admin, db, addCar };
