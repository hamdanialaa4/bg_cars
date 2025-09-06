<template>
  <div class="home-page">
    <header class="hero">
      <h1>Welcome to BG Car Platform</h1>
      <p>Your premier destination for car marketplace solutions.</p>
      <button class="cta-button">Browse Cars</button>
    </header>
    
    <section class="features">
      <h2>Why Choose Us?</h2>
      <div class="feature-grid">
        <div class="feature">
          <h3>Wide Selection</h3>
          <p>Thousands of cars from trusted sellers.</p>
        </div>
        <div class="feature">
          <h3>Secure Transactions</h3>
          <p>Safe and secure buying process.</p>
        </div>
        <div class="feature">
          <h3>Expert Support</h3>
          <p>Professional assistance throughout.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Home page component
</script>

<style scoped>
.home-page {
  text-align: center;
  padding: 2rem;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 10px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.cta-button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.cta-button:hover {
  background: #ff5252;
}

.features h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feature h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.feature p {
  color: #7f8c8d;
}
</style>
