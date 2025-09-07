<template>
  <div class="home-page">
    <!-- Language Switcher -->
    <div class="language-switcher">
      <button
        v-for="locale in availableLocales"
        :key="locale"
        @click="setLocale(locale)"
        :class="{ active: locale === $i18n.locale }"
        class="lang-btn"
      >
        {{ getLocaleName(locale) }}
      </button>
    </div>

    <header class="hero glass-effect">
      <h1>{{ t('welcome') }}</h1>
      <p>{{ t('searchDescription') }}</p>
      <div class="hero-actions">
        <router-link to="/search" class="cta-button primary">
          <i class="fas fa-search"></i>
          {{ t('advancedSearch') }}
        </router-link>
        <router-link to="/seller" class="cta-button secondary">
          <i class="fas fa-plus"></i>
          {{ t('sell') }}
        </router-link>
      </div>
    </header>

    <!-- AI-Powered Quick Search -->
    <section class="quick-search glass-effect">
      <h2>{{ t('home.quickSearch') }}</h2>
      <div class="search-inputs">
        <select v-model="quickFilters.make" @change="getAISuggestions">
          <option value="">{{ t('home.allMakes') }}</option>
          <option v-for="make in popularMakes" :key="make" :value="make">{{ make }}</option>
        </select>
        <input type="number" v-model="quickFilters.maxPrice" placeholder="€50000" @input="getAISuggestions">
        <button @click="quickSearch" class="btn-ai-search">
          <i class="fas fa-robot"></i>
          {{ t('home.quickSearch') }}
        </button>
      </div>
      <div v-if="aiSuggestions.length > 0" class="ai-tips">
        <div v-for="tip in aiSuggestions" :key="tip.id" class="ai-tip">
          <i class="fas fa-lightbulb"></i>
          {{ tip.text }}
        </div>
      </div>
    </section>

    <!-- Featured Cars with AI Recommendations -->
    <section class="featured-cars">
      <h2>{{ t('home.aiRecommendedCars') }}</h2>
      <div class="cars-grid">
        <div v-for="car in featuredCars" :key="car.id" class="car-card glass-effect">
          <div class="car-image">
            <img :src="car.image" :alt="car.make + ' ' + car.model">
            <div class="car-price">€{{ car.price.toLocaleString() }}</div>
            <div class="ai-badge">
              <i class="fas fa-star"></i>
              {{ t('home.smartRecommendation') }}
            </div>
          </div>
          <div class="car-info">
            <h3>{{ car.make }} {{ car.model }}</h3>
            <div class="car-details">
              <span>{{ car.year }}</span>
              <span>{{ car.mileage }} {{ t('common.km') }}</span>
              <span>{{ car.fuelType }}</span>
            </div>
            <router-link :to="`/cars/${car.id}`" class="btn-details">
              {{ t('home.viewDetails') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2>{{ t('home.whyChooseUs') }}</h2>
      <div class="feature-grid">
        <div class="feature glass-effect">
          <div class="feature-icon">
            <i class="fas fa-brain"></i>
          </div>
          <h3>{{ t('home.advancedAI') }}</h3>
          <p>{{ t('home.aiDescription') }}</p>
        </div>
        <div class="feature glass-effect">
          <div class="feature-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h3>{{ t('home.secureTransactions') }}</h3>
          <p>{{ t('home.secureDescription') }}</p>
        </div>
        <div class="feature glass-effect">
          <div class="feature-icon">
            <i class="fas fa-globe"></i>
          </div>
          <h3>{{ t('home.multiLanguageSupport') }}</h3>
          <p>{{ t('home.languageDescription') }}</p>
        </div>
        <div class="feature glass-effect">
          <div class="feature-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <h3>{{ t('home.advancedAnalytics') }}</h3>
          <p>{{ t('home.analyticsDescription') }}</p>
        </div>
      </div>
    </section>

    <!-- Market Insights -->
    <section class="market-insights glass-effect">
      <h2>{{ t('home.marketInsights') }}</h2>
      <div class="insights-grid">
        <div class="insight">
          <h3>{{ t('home.averagePrices') }}</h3>
          <p class="insight-value">€45,000</p>
        </div>
        <div class="insight">
          <h3>{{ t('home.mostWantedCars') }}</h3>
          <p class="insight-value">BMW, Mercedes, Audi</p>
        </div>
        <div class="insight">
          <h3>{{ t('home.conversionRate') }}</h3>
          <p class="insight-value">3.2%</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAI } from '../services/ai/aiService'

const router = useRouter()
const { t, locale } = useI18n()
const { getCarRecommendations } = useAI()

const availableLocales = ref(['bg', 'en'])
const quickFilters = ref({
  make: '',
  maxPrice: ''
})
const aiSuggestions = ref<{ id: number; text: string }[]>([])
const featuredCars = ref<any[]>([])

const popularMakes = ref(['BMW', 'Mercedes', 'Audi', 'VW', 'Opel'])

const getLocaleName = (localeCode: string) => {
  const names: { [key: string]: string } = {
    bg: 'БГ',
    en: 'EN'
  }
  return names[localeCode] || localeCode
}

const setLocale = (localeCode: string) => {
  locale.value = localeCode
}

const getAISuggestions = () => {
  aiSuggestions.value = []

  if (quickFilters.value.make) {
    aiSuggestions.value.push({
      id: 1,
      text: `Based on your choice of ${quickFilters.value.make}, we recommend modern models`
    })
  }

  if (quickFilters.value.maxPrice) {
    const price = parseInt(quickFilters.value.maxPrice)
    if (price < 20000) {
      aiSuggestions.value.push({
        id: 2,
        text: 'With this price range, focus on good used cars'
      })
    }
  }
}

const quickSearch = () => {
  router.push({
    path: '/search',
    query: {
      make: quickFilters.value.make,
      maxPrice: quickFilters.value.maxPrice
    }
  })
}

onMounted(async () => {
  // Load featured cars with AI recommendations
  const mockCars = [
    { id: 1, make: 'BMW', model: 'X5', year: 2022, price: 85000, mileage: 15000, fuelType: 'ديزل', image: '/images/bmw-x5.jpg' },
    { id: 2, make: 'Mercedes', model: 'C-Class', year: 2021, price: 45000, mileage: 25000, fuelType: 'بنزين', image: '/images/mercedes-c.jpg' },
    { id: 3, make: 'Audi', model: 'A4', year: 2020, price: 35000, mileage: 35000, fuelType: 'ديزل', image: '/images/audi-a4.jpg' }
  ]

  featuredCars.value = await getCarRecommendations({}, mockCars)
})
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.language-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-btn:hover,
.lang-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  margin-bottom: 3rem;
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  backdrop-filter: blur(10px);
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #666;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-button.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.cta-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.cta-button.secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.cta-button.secondary:hover {
  background: #667eea;
  color: white;
}

.quick-search {
  padding: 2rem;
  margin-bottom: 3rem;
  border-radius: 15px;
}

.quick-search h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.search-inputs {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-inputs select,
.search-inputs input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-width: 150px;
}

.btn-ai-search {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-ai-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.ai-tips {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.ai-tip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #e3f2fd;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.ai-tip i {
  color: #ffb300;
}

.featured-cars {
  margin-bottom: 3rem;
}

.featured-cars h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.car-card {
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.car-card:hover {
  transform: translateY(-5px);
}

.car-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-price {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
}

.ai-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.car-info {
  padding: 1.5rem;
}

.car-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.car-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.btn-details {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.btn-details:hover {
  background: #5a67d8;
}

.features {
  margin-bottom: 3rem;
}

.features h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature {
  padding: 2rem;
  text-align: center;
  border-radius: 15px;
}

.feature-icon {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.feature h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.feature p {
  color: #7f8c8d;
  line-height: 1.6;
}

.market-insights {
  padding: 2rem;
  text-align: center;
  border-radius: 15px;
}

.market-insights h2 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.insight {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
}

.insight h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1rem;
}

.insight-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .search-inputs {
    flex-direction: column;
    align-items: center;
  }

  .cars-grid {
    grid-template-columns: 1fr;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>


