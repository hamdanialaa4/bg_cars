<template>
  <div class="car-comparison">
    <div class="comparison-container glass-effect">
      <!-- Header -->
      <div class="comparison-header">
        <h1 class="comparison-title">{{ t('compareCars') }}</h1>
        <p class="comparison-subtitle">{{ t('selectCarsToCompare') }}</p>
      </div>

      <!-- Selected Cars -->
      <div v-if="selectedCars.length > 0" class="selected-cars">
        <h2 class="section-title">{{ t('selectedCars') }} ({{ selectedCars.length }}/4)</h2>
        <div class="selected-cars-grid">
          <div
            v-for="(car, index) in selectedCars"
            :key="car.id"
            class="selected-car-card"
          >
            <div class="car-image">
              <img :src="car.images?.[0]" :alt="car.title" @error="handleImageError">
            </div>
            <div class="car-info">
              <h3 class="car-title">{{ car.title }}</h3>
              <p class="car-price">{{ formatPrice(car.price) }}</p>
              <button @click="removeCar(index)" class="remove-btn">
                <i class="fas fa-times"></i>
                {{ t('remove') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparison Table -->
      <div v-if="selectedCars.length >= 2" class="comparison-table">
        <div class="table-container">
          <table class="comparison-table-content">
            <thead>
              <tr>
                <th class="feature-column">{{ t('features') }}</th>
                <th
                  v-for="car in selectedCars"
                  :key="car.id"
                  class="car-column"
                >
                  <div class="car-header-cell">
                    <img :src="car.images?.[0]" :alt="car.title" class="car-thumbnail" @error="handleImageError">
                    <div class="car-title-cell">{{ car.title }}</div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="feature-name">{{ t('price') }}</td>
                <td
                  v-for="car in selectedCars"
                  :key="car.id + '-price'"
                  class="feature-value"
                >
                  {{ formatPrice(car.price) }}
                </td>
              </tr>
              <tr>
                <td class="feature-name">{{ t('year') }}</td>
                <td
                  v-for="car in selectedCars"
                  :key="car.id + '-year'"
                  class="feature-value"
                >
                  {{ car.year }}
                </td>
              </tr>
              <tr>
                <td class="feature-name">{{ t('mileage') }}</td>
                <td
                  v-for="car in selectedCars"
                  :key="car.id + '-mileage'"
                  class="feature-value"
                >
                  {{ formatMileage(car.mileage) }}
                </td>
              </tr>
              <tr>
                <td class="feature-name">{{ t('fuelType') }}</td>
                <td
                  v-for="car in selectedCars"
                  :key="car.id + '-fuel'"
                  class="feature-value"
                >
                  {{ getFuelTypeLabel(car.fuelType) }}
                </td>
              </tr>
              <tr>
                <td class="feature-name">{{ t('transmission') }}</td>
                <td
                  v-for="car in selectedCars"
                  :key="car.id + '-transmission'"
                  class="feature-value"
                >
                  {{ getTransmissionLabel(car.transmission) }}
                </td>
              </tr>
              <tr>
                <td class="feature-name">{{ t('bodyType') }}</td>
                <td
                  v-for="car in selectedCars"
                  :key="car.id + '-body'"
                  class="feature-value"
                >
                  {{ getBodyTypeLabel(car.bodyType) }}
                </td>
              </tr>
              <tr>
                <td class="feature-name">{{ t('engineSize') }}</td>
                <td
                  v-for="car in selectedCars"
                  :key="car.id + '-engine'"
                  class="feature-value"
                >
                  {{ car.engineSize }}L
                </td>
              </tr>
              <tr>
                <td class="feature-name">{{ t('power') }}</td>
                <td
                  v-for="car in selectedCars"
                  :key="car.id + '-power'"
                  class="feature-value"
                >
                  {{ car.power }} HP
                </td>
              </tr>
              <tr>
                <td class="feature-name">{{ t('color') }}</td>
                <td
                  v-for="car in selectedCars"
                  :key="car.id + '-color'"
                  class="feature-value"
                >
                  {{ car.color }}
                </td>
              </tr>
              <tr>
                <td class="feature-name">{{ t('location') }}</td>
                <td
                  v-for="car in selectedCars"
                  :key="car.id + '-location'"
                  class="feature-value"
                >
                  {{ car.location }}
                </td>
              </tr>
              <tr>
                <td class="feature-name">{{ t('condition') }}</td>
                <td
                  v-for="car in selectedCars"
                  :key="car.id + '-condition'"
                  class="feature-value"
                >
                  <span class="condition-badge" :class="car.condition">
                    {{ getConditionLabel(car.condition) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Car Selection -->
      <div class="car-selection">
        <h2 class="section-title">{{ t('chooseCarsToCompare') }}</h2>

        <!-- Search/Filter -->
        <div class="search-section">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('searchCars')"
            class="search-input"
          >
          <select v-model="sortBy" class="sort-select">
            <option value="newest">{{ t('newest') }}</option>
            <option value="oldest">{{ t('oldest') }}</option>
            <option value="price-low">{{ t('priceLowToHigh') }}</option>
            <option value="price-high">{{ t('priceHighToLow') }}</option>
          </select>
        </div>

        <!-- Available Cars -->
        <div class="available-cars">
          <div
            v-for="car in filteredCars"
            :key="car.id"
            class="available-car-card"
            :class="{ selected: isSelected(car.id) }"
            @click="toggleCarSelection(car)"
          >
            <div class="car-image">
              <img :src="car.images?.[0]" :alt="car.title" @error="handleImageError">
            </div>
            <div class="car-info">
              <h3 class="car-title">{{ car.title }}</h3>
              <p class="car-price">{{ formatPrice(car.price) }}</p>
              <p class="car-details">{{ car.year }} • {{ formatMileage(car.mileage) }}</p>
            </div>
            <div class="selection-indicator">
              <i v-if="isSelected(car.id)" class="fas fa-check-circle"></i>
              <i v-else class="far fa-circle"></i>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="hasMoreCars" class="load-more">
          <button @click="loadMoreCars" class="btn-load-more" :disabled="isLoadingMore">
            <i v-if="!isLoadingMore" class="fas fa-plus"></i>
            <i v-else class="fas fa-spinner fa-spin"></i>
            {{ isLoadingMore ? t('loading') : t('loadMore') }}
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="selectedCars.length === 0" class="empty-state">
        <i class="fas fa-balance-scale"></i>
        <h3 class="empty-title">{{ t('noCarsSelected') }}</h3>
        <p class="empty-text">{{ t('selectAtLeastTwoCars') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../utils/i18n'
import { useCars } from '../composables/useCars'

export default {
  name: 'CarComparison',
  setup() {
    const { t } = useI18n()
    const { getAllCars } = useCars()

    const selectedCars = ref([])
    const availableCars = ref([])
    const searchQuery = ref('')
    const sortBy = ref('newest')
    const isLoadingMore = ref(false)
    const hasMoreCars = ref(false)

    const filteredCars = computed(() => {
      let filtered = [...availableCars.value]

      // Search filter
      if (searchQuery.value) {
        filtered = filtered.filter(car =>
          car.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          car.make.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          car.model.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }

      // Sort
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt)
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt)
          case 'price-low':
            return a.price - b.price
          case 'price-high':
            return b.price - a.price
          default:
            return 0
        }
      })

      return filtered
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('bg-BG', {
        style: 'currency',
        currency: 'BGN',
        minimumFractionDigits: 0
      }).format(price)
    }

    const formatMileage = (mileage) => {
      return new Intl.NumberFormat('bg-BG').format(mileage) + ' km'
    }

    const getFuelTypeLabel = (fuelType) => {
      const labels = {
        petrol: t('petrol'),
        diesel: t('diesel'),
        electric: t('electric'),
        hybrid: t('hybrid'),
        lpg: t('lpg')
      }
      return labels[fuelType] || fuelType
    }

    const getTransmissionLabel = (transmission) => {
      const labels = {
        manual: t('manual'),
        automatic: t('automatic'),
        'semi-automatic': t('semiAutomatic')
      }
      return labels[transmission] || transmission
    }

    const getBodyTypeLabel = (bodyType) => {
      const labels = {
        sedan: t('sedan'),
        hatchback: t('hatchback'),
        coupe: t('coupe'),
        convertible: t('convertible'),
        suv: t('suv'),
        pickup: t('pickup'),
        van: t('van'),
        wagon: t('wagon')
      }
      return labels[bodyType] || bodyType
    }

    const getConditionLabel = (condition) => {
      const labels = {
        new: t('new'),
        used: t('used'),
        damaged: t('damaged')
      }
      return labels[condition] || condition
    }

    const isSelected = (carId) => {
      return selectedCars.value.some(car => car.id === carId)
    }

    const toggleCarSelection = (car) => {
      if (isSelected(car.id)) {
        selectedCars.value = selectedCars.value.filter(c => c.id !== car.id)
      } else if (selectedCars.value.length < 4) {
        selectedCars.value.push(car)
      } else {
        alert(t('maximumCarsSelected'))
      }
    }

    const removeCar = (index) => {
      selectedCars.value.splice(index, 1)
    }

    const handleImageError = (event) => {
      event.target.src = '/placeholder-car.jpg'
    }

    const loadMoreCars = async () => {
      if (!hasMoreCars.value || isLoadingMore.value) return

      isLoadingMore.value = true
      try {
        // In a real app, this would load more cars from the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        hasMoreCars.value = false
      } catch (error) {
        console.error('Error loading more cars:', error)
      } finally {
        isLoadingMore.value = false
      }
    }

    const loadCars = async () => {
      try {
        const result = await getAllCars()
        availableCars.value = result.cars
        hasMoreCars.value = result.hasMore
      } catch (error) {
        console.error('Error loading cars:', error)
        availableCars.value = []
      }
    }

    onMounted(() => {
      loadCars()
    })

    return {
      selectedCars,
      availableCars,
      searchQuery,
      sortBy,
      isLoadingMore,
      hasMoreCars,
      filteredCars,
      t,
      formatPrice,
      formatMileage,
      getFuelTypeLabel,
      getTransmissionLabel,
      getBodyTypeLabel,
      getConditionLabel,
      isSelected,
      toggleCarSelection,
      removeCar,
      handleImageError,
      loadMoreCars
    }
  }
}
</script>

<style scoped>
.car-comparison {
  min-height: 100vh;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.comparison-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.comparison-header {
  text-align: center;
  margin-bottom: 2rem;
}

.comparison-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.comparison-subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.selected-cars {
  margin-bottom: 2rem;
}

.selected-cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.selected-car-card {
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.car-image {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-info {
  flex: 1;
}

.car-info .car-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.car-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.remove-btn {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #c0392b;
  transform: scale(1.05);
}

.comparison-table {
  margin-bottom: 2rem;
  overflow-x: auto;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.comparison-table-content {
  width: 100%;
  border-collapse: collapse;
}

.comparison-table-content th,
.comparison-table-content td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.feature-column {
  background: rgba(102, 126, 234, 0.1);
  font-weight: 600;
  color: #2c3e50;
  min-width: 150px;
}

.car-column {
  min-width: 200px;
  background: rgba(102, 126, 234, 0.05);
}

.car-header-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.car-thumbnail {
  width: 60px;
  height: 45px;
  object-fit: cover;
  border-radius: 4px;
}

.car-title-cell {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.feature-name {
  font-weight: 600;
  color: #2c3e50;
}

.feature-value {
  color: #555;
}

.condition-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.condition-badge.new {
  background: #27ae60;
  color: white;
}

.condition-badge.used {
  background: #3498db;
  color: white;
}

.condition-badge.damaged {
  background: #e74c3c;
  color: white;
}

.car-selection {
  margin-bottom: 2rem;
}

.search-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.sort-select {
  padding: 0.75rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
}

.available-cars {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.available-car-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.available-car-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.available-car-card.selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.available-car-card .car-image {
  width: 80px;
  height: 60px;
}

.available-car-card .car-info {
  flex: 1;
}

.available-car-card .car-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.available-car-card .car-price {
  font-size: 1rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.available-car-card .car-details {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.selection-indicator {
  color: #667eea;
  font-size: 1.2rem;
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

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #7f8c8d;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-text {
  font-size: 1rem;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .comparison-container {
    margin: 0 1rem;
    padding: 1rem;
  }

  .comparison-title {
    font-size: 2rem;
  }

  .selected-cars-grid {
    grid-template-columns: 1fr;
  }

  .comparison-table {
    font-size: 0.9rem;
  }

  .car-header-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .search-section {
    flex-direction: column;
  }

  .available-cars {
    grid-template-columns: 1fr;
  }

  .available-car-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
