<template>
  <div class="car-details">
    <div class="car-header">
      <h1>{{ car.make }} {{ car.model }} {{ car.year }}</h1>
      <p class="price">${{ car.price }}</p>
    </div>
    
    <div class="car-gallery">
      <img :src="car.image" :alt="car.make + ' ' + car.model" class="main-image" />
    </div>
    
    <div class="car-info">
      <div class="info-section">
        <h2>Specifications</h2>
        <div class="specs-grid">
          <div class="spec">
            <span class="label">Make:</span>
            <span class="value">{{ car.make }}</span>
          </div>
          <div class="spec">
            <span class="label">Model:</span>
            <span class="value">{{ car.model }}</span>
          </div>
          <div class="spec">
            <span class="label">Year:</span>
            <span class="value">{{ car.year }}</span>
          </div>
          <div class="spec">
            <span class="label">Mileage:</span>
            <span class="value">{{ car.mileage }} miles</span>
          </div>
          <div class="spec">
            <span class="label">Fuel Type:</span>
            <span class="value">{{ car.fuelType }}</span>
          </div>
          <div class="spec">
            <span class="label">Transmission:</span>
            <span class="value">{{ car.transmission }}</span>
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <h2>Description</h2>
        <p>{{ car.description }}</p>
      </div>
      
      <div class="contact-section">
        <h2>Contact Seller</h2>
        <button class="contact-btn">Message Seller</button>
        <button class="call-btn">Call Now</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Mock car data - in real app, fetch from API
const car = ref({
  id: route.params.id,
  make: 'BMW',
  model: 'X5',
  year: 2020,
  price: 45000,
  mileage: 25000,
  fuelType: 'Diesel',
  transmission: 'Automatic',
  image: '/pexels-mikebirdy-190574.jpg',
  description: 'This is a well-maintained BMW X5 with low mileage. Features include leather seats, navigation system, and premium sound system. Perfect for family trips and daily commuting.'
})
</script>

<style scoped>
.car-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.car-header {
  text-align: center;
  margin-bottom: 2rem;
}

.car-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 2rem;
  color: #e74c3c;
  font-weight: bold;
}

.car-gallery {
  margin-bottom: 2rem;
}

.main-image {
  width: 100%;
  max-width: 800px;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.car-info {
  display: grid;
  gap: 2rem;
}

.info-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 10px;
}

.info-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.spec {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}

.label {
  font-weight: bold;
  color: #7f8c8d;
}

.value {
  color: #2c3e50;
}

.contact-section {
  text-align: center;
}

.contact-btn, .call-btn {
  padding: 1rem 2rem;
  margin: 0 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.contact-btn {
  background: #3498db;
  color: white;
}

.contact-btn:hover {
  background: #2980b9;
}

.call-btn {
  background: #2ecc71;
  color: white;
}

.call-btn:hover {
  background: #27ae60;
}
</style>