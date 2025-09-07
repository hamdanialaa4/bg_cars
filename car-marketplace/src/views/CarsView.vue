<template>
  <div class="cars-view">
    <div class="cars-container glass-effect">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">{{ t('allCars') }}</h1>
        <p class="page-subtitle">{{ t('browseAllAvailableCars') }}</p>

        <!-- Filters Toggle -->
        <button @click="toggleFilters" class="filters-toggle">
          <i class="fas fa-filter"></i>
          {{ showFilters ? t('hideFilters') : t('showFilters') }}
        </button>
      </div>

      <!-- Quick Filters -->
      <div v-if="showFilters" class="quick-filters">
        <div class="filter-group">
          <label class="filter-label">{{ t('make') }}</label>
          <select v-model="filters.make" class="filter-select">
            <option value="">{{ t('allMakes') }}</option>
            <option v-for="make in carMakes" :key="make" :value="make">{{ make }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">{{ t('priceRange') }}</label>
          <select v-model="filters.priceRange" class="filter-select">
            <option value="">{{ t('anyPrice') }}</option>
            <option value="0-10000">0 - 10,000 BGN</option>
            <option value="10000-25000">10,000 - 25,000 BGN</option>
            <option value="25000-50000">25,000 - 50,000 BGN</option>
            <option value="50000-100000">50,000 - 100,000 BGN</option>
            <option value="100000+">100,000+ BGN</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">{{ t('year') }}</label>
          <select v-model="filters.year" class="filter-select">
            <option value="">{{ t('anyYear') }}</option>
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">{{ t('bodyType') }}</label>
          <select v-model="filters.bodyType" class="filter-select">
            <option value="">{{ t('allBodyTypes') }}</option>
            <option v-for="type in bodyTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
          </select>
        </div>

        <button @click="applyFilters" class="btn-apply-filters">
          {{ t('applyFilters') }}
        </button>
      </div>

      <!-- Results Header -->
      <div class="results-header">
        <div class="results-count">
          {{ t('showing') }} {{ displayedCars.length }} {{ t('of') }} {{ totalCars }} {{ t('cars') }}
        </div>

        <div class="results-sort">
          <label class="sort-label">{{ t('sortBy') }}:</label>
          <select v-model="sortBy" @change="sortCars" class="sort-select">
            <option value="newest">{{ t('newest') }}</option>
            <option value="oldest">{{ t('oldest') }}</option>
            <option value="price-low">{{ t('priceLowToHigh') }}</option>
            <option value="price-high">{{ t('priceHighToLow') }}</option>
            <option value="mileage-low">{{ t('mileageLowToHigh') }}</option>
            <option value="mileage-high">{{ t('mileageHighToLow') }}</option>
          </select>
        </div>
      </div>

      <!-- Cars Grid -->
      <div v-if="displayedCars.length > 0" class="cars-grid">
        <CarCard
          v-for="car in displayedCars"
          :key="car.id"
          :car="car"
          @favorite="toggleFavorite"
        />
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="loading-state">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
          <p>{{ t('loadingCars') }}</p>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="no-results">
        <i class="fas fa-car"></i>
        <h3 class="no-results-title">{{ t('noCarsFound') }}</h3>
        <p class="no-results-text">{{ t('tryAdjustingFilters') }}</p>
        <router-link to="/search" class="btn-advanced-search">
          {{ t('advancedSearch') }}
        </router-link>
      </div>

      <!-- Load More -->
      <div v-if="hasMoreCars && displayedCars.length > 0" class="load-more">
        <button @click="loadMoreCars" class="btn-load-more" :disabled="isLoadingMore">
          <i v-if="!isLoadingMore" class="fas fa-plus"></i>
          <i v-else class="fas fa-spinner fa-spin"></i>
          {{ isLoadingMore ? t('loading') : t('loadMoreCars') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCarStore } from '../stores/useCarStore'
import CarCard from '../components/CarCard.vue'

const { t } = useI18n()
const carStore = useCarStore()

// State
const showFilters = ref(false)
const sortBy = ref('newest')

// Filters
const filters = ref({
  make: '',
  priceRange: '',
  year: '',
  bodyType: [] as string[]
})

// Computed
const displayedCars = computed(() => carStore.cars)
const totalCars = computed(() => carStore.cars.length)
const isLoading = computed(() => carStore.loading)
const hasMoreCars = computed(() => carStore.hasMore)
const isLoadingMore = ref(false)

// Data options
const carMakes = ref([
  'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Opel', 'Ford', 'Toyota',
  'Honda', 'Nissan', 'Hyundai', 'Kia', 'Peugeot', 'Renault', 'Citroën',
  'Fiat', 'Alfa Romeo', 'Maserati', 'Ferrari', 'Lamborghini', 'Porsche',
  'Volvo', 'Saab', 'Jaguar', 'Land Rover', 'Mini', 'Smart'
])

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = currentYear; year >= 1990; year--) {
    years.push(year)
  }
  return years
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

// Computed
const filteredCars = computed(() => {
  return carStore.cars
})

// Methods
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const applyFilters = () => {
  // Apply filters using the car store
  carStore.fetchCars(filters.value)
}

const loadMoreCars = () => {
  carStore.fetchCars(filters.value, true)
}

const sortCars = () => {
  // TODO: Implement sorting
  console.log('Sorting by:', sortBy.value)
}

const toggleFavorite = (carId: string) => {
  // TODO: Implement favorite functionality
  console.log('Toggle favorite for car:', carId)
}

// Lifecycle
onMounted(() => {
  carStore.fetchCars()
})
</script>

<style scoped>
.cars-view {
  min-height: 100vh;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.cars-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.page-subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin: 0;
  flex: 1;
}

.filters-toggle {
  padding: 0.75rem 1.5rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filters-toggle:hover {
  background: #667eea;
  color: white;
}

.quick-filters {
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.btn-apply-filters {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  grid-column: 1 / -1;
  justify-self: center;
}

.btn-apply-filters:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  flex-wrap: wrap;
  gap: 1rem;
}

.results-count {
  font-size: 1rem;
  color: #7f8c8d;
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

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.loading-state,
.no-results {
  text-align: center;
  padding: 3rem 2rem;
}

.loading-spinner {
  color: #667eea;
}

.loading-spinner i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-results i {
  font-size: 4rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
}

.no-results-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.no-results-text {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.btn-advanced-search {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-advanced-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
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

/* Mobile Styles */
@media (max-width: 768px) {
  .cars-container {
    margin: 0 1rem;
    padding: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .quick-filters {
    grid-template-columns: 1fr;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .cars-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }

  .filters-toggle {
    width: 100%;
    justify-content: center;
  }
}
</style>
