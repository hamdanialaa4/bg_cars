<template>
  <div class="advanced-search">
    <div class="search-container glass-effect">
      <div class="search-header">
        <h1 class="search-title">{{ t('search.advancedSearch') }}</h1>
        <p class="search-subtitle">{{ t('search.findYourPerfectCar') }}</p>
      </div>

      <!-- Search Form -->
      <form @submit.prevent="performSearch" class="search-form">
        <div class="form-grid">
          <!-- Basic Filters -->
          <div class="form-section">
            <h3 class="section-title">{{ t('search.basicFilters') }}</h3>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ t('search.make') }}</label>
                <select v-model="filters.make" class="form-select">
                  <option value="">{{ t('search.allMakes') }}</option>
                  <option v-for="make in carMakes" :key="make" :value="make">{{ make }}</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('search.model') }}</label>
                <select v-model="filters.model" class="form-select">
                  <option value="">{{ t('search.allModels') }}</option>
                  <option v-for="model in availableModels" :key="model" :value="model">{{ model }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ t('search.yearFrom') }}</label>
                <select v-model="filters.yearFrom" class="form-select">
                  <option value="">{{ t('search.any') }}</option>
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('search.yearTo') }}</label>
                <select v-model="filters.yearTo" class="form-select">
                  <option value="">{{ t('search.any') }}</option>
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Price Range -->
          <div class="form-section">
            <h3 class="section-title">{{ t('priceRange') }}</h3>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ t('minPrice') }}</label>
                <input
                  v-model.number="filters.minPrice"
                  type="number"
                  :placeholder="t('minPrice')"
                  class="form-input"
                  min="0"
                  step="1000"
                >
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('maxPrice') }}</label>
                <input
                  v-model.number="filters.maxPrice"
                  type="number"
                  :placeholder="t('maxPrice')"
                  class="form-input"
                  min="0"
                  step="1000"
                >
              </div>
            </div>

            <div class="price-range-slider">
              <div class="slider-container">
                <input
                  type="range"
                  v-model="filters.minPrice"
                  :min="priceRange.min"
                  :max="priceRange.max"
                  step="1000"
                  class="price-slider"
                >
                <input
                  type="range"
                  v-model="filters.maxPrice"
                  :min="priceRange.min"
                  :max="priceRange.max"
                  step="1000"
                  class="price-slider"
                >
              </div>
              <div class="price-display">
                <span>{{ formatPrice(filters.minPrice || priceRange.min) }}</span>
                <span>-</span>
                <span>{{ formatPrice(filters.maxPrice || priceRange.max) }}</span>
              </div>
            </div>
          </div>

          <!-- Vehicle Details -->
          <div class="form-section">
            <h3 class="section-title">{{ t('vehicleDetails') }}</h3>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ t('bodyType') }}</label>
                <select v-model="filters.bodyType" class="form-select">
                  <option value="">{{ t('allBodyTypes') }}</option>
                  <option v-for="type in bodyTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('fuelType') }}</label>
                <select v-model="filters.fuelType" class="form-select">
                  <option value="">{{ t('allFuelTypes') }}</option>
                  <option v-for="fuel in fuelTypes" :key="fuel.value" :value="fuel.value">{{ fuel.label }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ t('transmission') }}</label>
                <select v-model="filters.transmission" class="form-select">
                  <option value="">{{ t('allTransmissions') }}</option>
                  <option v-for="trans in transmissions" :key="trans.value" :value="trans.value">{{ trans.label }}</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('mileage') }}</label>
                <input
                  v-model.number="filters.maxMileage"
                  type="number"
                  :placeholder="t('maxMileage')"
                  class="form-input"
                  min="0"
                  step="1000"
                >
              </div>
            </div>
          </div>

          <!-- Location -->
          <div class="form-section">
            <h3 class="section-title">{{ t('location') }}</h3>

            <div class="form-row">
              <div class="form-group full-width">
                <label class="form-label">{{ t('city') }}</label>
                <select v-model="filters.city" class="form-select">
                  <option value="">{{ t('allCities') }}</option>
                  <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ t('radius') }}</label>
                <select v-model="filters.radius" class="form-select">
                  <option value="">{{ t('anyDistance') }}</option>
                  <option value="10">10 km</option>
                  <option value="25">25 km</option>
                  <option value="50">50 km</option>
                  <option value="100">100 km</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Actions -->
        <div class="search-actions">
          <button type="submit" class="btn-search" :disabled="isSearching">
            <i v-if="!isSearching" class="fas fa-search"></i>
            <i v-else class="fas fa-spinner fa-spin"></i>
            {{ isSearching ? t('searching') : t('search') }}
          </button>

          <button type="button" @click="resetFilters" class="btn-reset">
            <i class="fas fa-undo"></i>
            {{ t('reset') }}
          </button>
        </div>
      </form>

      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="search-results">
        <div class="results-header">
          <h2 class="results-title">{{ t('searchResults') }} ({{ totalResults }})</h2>
          <div class="results-sort">
            <label class="sort-label">{{ t('sortBy') }}:</label>
            <select v-model="sortBy" @change="sortResults" class="sort-select">
              <option value="newest">{{ t('newest') }}</option>
              <option value="oldest">{{ t('oldest') }}</option>
              <option value="price-low">{{ t('priceLowToHigh') }}</option>
              <option value="price-high">{{ t('priceHighToLow') }}</option>
              <option value="mileage-low">{{ t('mileageLowToHigh') }}</option>
              <option value="mileage-high">{{ t('mileageHighToLow') }}</option>
            </select>
          </div>
        </div>

        <div class="results-grid">
          <CarCard
            v-for="car in searchResults"
            :key="car.id"
            :car="car"
            @favorite="toggleFavorite"
          />
        </div>

        <!-- Load More -->
        <div v-if="hasMoreResults" class="load-more">
          <button @click="loadMore" class="btn-load-more" :disabled="isLoadingMore">
            <i v-if="!isLoadingMore" class="fas fa-plus"></i>
            <i v-else class="fas fa-spinner fa-spin"></i>
            {{ isLoadingMore ? t('loading') : t('loadMore') }}
          </button>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="hasSearched && !isSearching" class="no-results">
        <i class="fas fa-search"></i>
        <h3 class="no-results-title">{{ t('noResultsFound') }}</h3>
        <p class="no-results-text">{{ t('tryAdjustingFilters') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '../utils/i18n.js'
import { useCars } from '../composables/useCars'
import CarCard from '../components/CarCard.vue'

export default {
  name: 'AdvancedSearch',
  components: {
    CarCard
  },
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const { searchCars } = useCars()

    // Search filters
    const filters = ref({
      make: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      minPrice: null,
      maxPrice: null,
      bodyType: '',
      fuelType: '',
      transmission: '',
      maxMileage: null,
      city: '',
      radius: ''
    })

    // Search state
    const isSearching = ref(false)
    const hasSearched = ref(false)
    const searchResults = ref([])
    const totalResults = ref(0)
    const hasMoreResults = ref(false)
    const isLoadingMore = ref(false)
    const sortBy = ref('newest')

    // Data options
    const carMakes = ref([
      'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Opel', 'Ford', 'Toyota',
      'Honda', 'Nissan', 'Hyundai', 'Kia', 'Peugeot', 'Renault', 'Citroën',
      'Fiat', 'Alfa Romeo', 'Maserati', 'Ferrari', 'Lamborghini', 'Porsche',
      'Volvo', 'Saab', 'Jaguar', 'Land Rover', 'Mini', 'Smart'
    ])

    const availableModels = computed(() => {
      if (!filters.value.make) return []
      // In a real app, this would be fetched based on the selected make
      return ['Model 1', 'Model 2', 'Model 3'] // Placeholder
    })

    const years = computed(() => {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let year = currentYear; year >= 1990; year--) {
        years.push(year)
      }
      return years
    })

    const priceRange = ref({
      min: 0,
      max: 200000
    })

    const bodyTypes = ref([
      { value: 'sedan', label: t('sedan') },
      { value: 'hatchback', label: t('hatchback') },
      { value: 'coupe', label: t('coupe') },
      { value: 'convertible', label: t('convertible') },
      { value: 'suv', label: t('suv') },
      { value: 'pickup', label: t('pickup') },
      { value: 'van', label: t('van') },
      { value: 'wagon', label: t('wagon') }
    ])

    const fuelTypes = ref([
      { value: 'petrol', label: t('petrol') },
      { value: 'diesel', label: t('diesel') },
      { value: 'electric', label: t('electric') },
      { value: 'hybrid', label: t('hybrid') },
      { value: 'lpg', label: t('lpg') }
    ])

    const transmissions = ref([
      { value: 'manual', label: t('manual') },
      { value: 'automatic', label: t('automatic') },
      { value: 'semi-automatic', label: t('semiAutomatic') }
    ])

    const cities = ref([
      'Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora',
      'Pleven', 'Sliven', 'Dobrich', 'Shumen', 'Pernik', 'Haskovo',
      'Yambol', 'Pazardzhik', 'Blagoevgrad', 'Veliko Tarnovo'
    ])

    const formatPrice = (price) => {
      return new Intl.NumberFormat('bg-BG', {
        style: 'currency',
        currency: 'BGN',
        minimumFractionDigits: 0
      }).format(price)
    }

    const performSearch = async () => {
      isSearching.value = true
      hasSearched.value = true

      try {
        const results = await searchCars(filters.value)
        searchResults.value = results.cars
        totalResults.value = results.total
        hasMoreResults.value = results.hasMore
      } catch (error) {
        console.error('Search error:', error)
        searchResults.value = []
        totalResults.value = 0
      } finally {
        isSearching.value = false
      }
    }

    const resetFilters = () => {
      filters.value = {
        make: '',
        model: '',
        yearFrom: '',
        yearTo: '',
        minPrice: null,
        maxPrice: null,
        bodyType: '',
        fuelType: '',
        transmission: '',
        maxMileage: null,
        city: '',
        radius: ''
      }
      searchResults.value = []
      hasSearched.value = false
      totalResults.value = 0
      hasMoreResults.value = false
    }

    const sortResults = () => {
      // Implement sorting logic
      const sorted = [...searchResults.value]
      switch (sortBy.value) {
        case 'newest':
          sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        case 'oldest':
          sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          break
        case 'price-low':
          sorted.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          sorted.sort((a, b) => b.price - a.price)
          break
        case 'mileage-low':
          sorted.sort((a, b) => a.mileage - b.mileage)
          break
        case 'mileage-high':
          sorted.sort((a, b) => b.mileage - a.mileage)
          break
      }
      searchResults.value = sorted
    }

    const loadMore = async () => {
      if (!hasMoreResults.value || isLoadingMore.value) return

      isLoadingMore.value = true
      try {
        const results = await searchCars(filters.value, searchResults.value.length)
        searchResults.value.push(...results.cars)
        hasMoreResults.value = results.hasMore
      } catch (error) {
        console.error('Load more error:', error)
      } finally {
        isLoadingMore.value = false
      }
    }

    const toggleFavorite = (carId) => {
      // Implement favorite toggle logic
      console.log('Toggle favorite:', carId)
    }

    // Watch for make changes to update available models
    watch(() => filters.value.make, (newMake) => {
      if (newMake) {
        // Fetch models for the selected make
        // This would be an API call in a real app
      } else {
        filters.value.model = ''
      }
    })

    onMounted(() => {
      // Load initial data if needed
    })

    return {
      filters,
      isSearching,
      hasSearched,
      searchResults,
      totalResults,
      hasMoreResults,
      isLoadingMore,
      sortBy,
      carMakes,
      availableModels,
      years,
      priceRange,
      bodyTypes,
      fuelTypes,
      transmissions,
      cities,
      t,
      formatPrice,
      performSearch,
      resetFilters,
      sortResults,
      loadMore,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.advanced-search {
  min-height: 100vh;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.search-header {
  text-align: center;
  margin-bottom: 2rem;
}

.search-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.search-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.search-form {
  margin-bottom: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-section {
  background: rgba(255, 255, 255, 0.5);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  flex: 1 1 100%;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.price-range-slider {
  margin-top: 1rem;
}

.slider-container {
  position: relative;
  margin-bottom: 0.5rem;
}

.price-slider {
  position: absolute;
  width: 100%;
  height: 6px;
  background: transparent;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.price-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.price-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.price-display {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
}

.search-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-search,
.btn-reset {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-search {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-search:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-search:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-reset {
  background: rgba(255, 255, 255, 0.8);
  color: #2c3e50;
  border: 1px solid #e1e5e9;
}

.btn-reset:hover {
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-results {
  margin-top: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.results-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.results-sort {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  font-size: 0.9rem;
  color: #2c3e50;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.load-more {
  text-align: center;
  margin-top: 2rem;
}

.btn-load-more {
  padding: 0.75rem 2rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-load-more:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
}

.btn-load-more:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.no-results {
  text-align: center;
  padding: 3rem 2rem;
  color: #7f8c8d;
}

.no-results i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-results-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.no-results-text {
  font-size: 1rem;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .search-container {
    margin: 0 1rem;
    padding: 1rem;
  }

  .search-title {
    font-size: 2rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .results-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .search-actions {
    flex-direction: column;
  }

  .btn-search,
  .btn-reset {
    width: 100%;
    justify-content: center;
  }
}
</style>
