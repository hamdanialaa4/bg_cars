<template>
  <div class="advanced-search">
    <div class="search-header glass-effect">
      <h2>البحث المتقدم بالذكاء الاصطناعي</h2>
      <p>اكتشف السيارة المثالية مع مساعدتنا الذكية</p>
    </div>

    <div class="search-filters glass-effect">
      <div class="filter-row">
        <div class="filter-group">
          <label>الماركة</label>
          <select v-model="filters.make" @change="updateAISuggestions">
            <option value="">جميع الماركات</option>
            <option v-for="make in availableMakes" :key="make" :value="make">{{ make }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>الموديل</label>
          <select v-model="filters.model" @change="updateAISuggestions">
            <option value="">جميع الموديلات</option>
            <option v-for="model in availableModels" :key="model" :value="model">{{ model }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>السعر الأدنى</label>
          <input type="number" v-model="filters.minPrice" placeholder="€0" @input="updateAISuggestions">
        </div>

        <div class="filter-group">
          <label>السعر الأعلى</label>
          <input type="number" v-model="filters.maxPrice" placeholder="€100000" @input="updateAISuggestions">
        </div>
      </div>

      <div class="filter-row">
        <div class="filter-group">
          <label>نوع الوقود</label>
          <select v-model="filters.fuelType" @change="updateAISuggestions">
            <option value="">جميع الأنواع</option>
            <option value="بنزين">بنزين</option>
            <option value="ديزل">ديزل</option>
            <option value="كهربائي">كهربائي</option>
            <option value="هجين">هجين</option>
          </select>
        </div>

        <div class="filter-group">
          <label>ناقل الحركة</label>
          <select v-model="filters.transmission" @change="updateAISuggestions">
            <option value="">جميع الأنواع</option>
            <option value="أوتوماتيك">أوتوماتيك</option>
            <option value="يدوي">يدوي</option>
          </select>
        </div>

        <div class="filter-group">
          <label>السنة من</label>
          <input type="number" v-model="filters.minYear" placeholder="2020" @input="updateAISuggestions">
        </div>

        <div class="filter-group">
          <label>السنة إلى</label>
          <input type="number" v-model="filters.maxYear" placeholder="2024" @input="updateAISuggestions">
        </div>
      </div>

      <div class="ai-suggestions" v-if="aiSuggestions.length > 0">
        <h3>اقتراحات ذكية</h3>
        <div class="suggestions-list">
          <div v-for="suggestion in aiSuggestions" :key="suggestion.id" class="suggestion-item">
            <i class="fas fa-lightbulb"></i>
            <span>{{ suggestion.text }}</span>
          </div>
        </div>
      </div>

      <div class="search-actions">
        <button class="btn-primary" @click="performSmartSearch" :disabled="isSearching">
          <i class="fas fa-search"></i>
          {{ isSearching ? 'جاري البحث...' : 'البحث الذكي' }}
        </button>
        <button class="btn-secondary" @click="resetFilters">
          <i class="fas fa-undo"></i> إعادة تعيين
        </button>
      </div>
    </div>

    <div class="search-results" v-if="searchResults.length > 0">
      <div class="results-header">
        <h3>نتائج البحث ({{ searchResults.length }} سيارة)</h3>
        <div class="sort-options">
          <select v-model="sortBy" @change="sortResults">
            <option value="relevance">الأكثر صلة</option>
            <option value="price-low">السعر: من الأقل للأعلى</option>
            <option value="price-high">السعر: من الأعلى للأقل</option>
            <option value="year-new">الأحدث</option>
            <option value="mileage-low">أقل مسافة</option>
          </select>
        </div>
      </div>

      <div class="results-grid">
        <div v-for="car in searchResults" :key="car.id" class="car-result-card glass-effect">
          <div class="car-image">
            <img :src="car.images[0] || '/placeholder-car.jpg'" :alt="car.make + ' ' + car.model">
            <div class="car-price">€{{ car.price.toLocaleString() }}</div>
          </div>
          <div class="car-details">
            <h4>{{ car.make }} {{ car.model }}</h4>
            <div class="car-specs">
              <span>{{ car.year }}</span>
              <span>{{ car.mileage }} كم</span>
              <span>{{ car.fuelType }}</span>
            </div>
            <div class="car-location">
              <i class="fas fa-map-marker-alt"></i>
              {{ car.location || 'صوفيا' }}
            </div>
            <router-link :to="`/cars/${car.id}`" class="btn-view-details">
              عرض التفاصيل
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="market-insights" v-if="marketTrends">
      <div class="insights-header">
        <h3>تحليلات السوق</h3>
      </div>
      <div class="insights-grid">
        <div class="insight-card glass-effect">
          <h4>متوسط الأسعار</h4>
          <p class="insight-value">€{{ marketTrends.averagePrice?.toLocaleString() }}</p>
        </div>
        <div class="insight-card glass-effect">
          <h4>الماركات الأكثر شعبية</h4>
          <div class="popular-makes">
            <span v-for="make in marketTrends.popularMakes?.slice(0, 3)" :key="make.make">
              {{ make.make }} ({{ make.count }})
            </span>
          </div>
        </div>
        <div class="insight-card glass-effect">
          <h4>نطاقات الأسعار</h4>
          <div class="price-ranges">
            <div v-for="(count, range) in marketTrends.priceRanges" :key="range">
              {{ range }}€: {{ count }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAI } from '../../services/ai/aiService'

export default {
  name: 'AdvancedSearch',
  setup() {
    const router = useRouter()
    const { getCarRecommendations, analyzeMarketTrends, smartSearch, isLoading } = useAI()

    const filters = ref({
      make: '',
      model: '',
      minPrice: '',
      maxPrice: '',
      fuelType: '',
      transmission: '',
      minYear: '',
      maxYear: ''
    })

    const sortBy = ref('relevance')
    const isSearching = ref(false)
    const searchResults = ref([])
    const marketTrends = ref(null)
    const aiSuggestions = ref([])

    // Mock data - in real app, this would come from API
    const availableMakes = ref(['BMW', 'Mercedes', 'Audi', 'VW', 'Opel', 'Ford'])
    const availableModels = ref(['X5', 'C-Class', 'A4', 'Golf', 'Astra', 'Focus'])

    const availableModelsComputed = computed(() => {
      if (!filters.value.make) return availableModels.value
      // Filter models based on selected make
      return availableModels.value.filter(model =>
        ['X5', 'C-Class', 'A4', 'Golf', 'Astra', 'Focus'].includes(model)
      )
    })

    onMounted(() => {
      loadInitialData()
    })

    const loadInitialData = async () => {
      // Load market trends
      const mockCars = generateMockCars()
      marketTrends.value = await analyzeMarketTrends(mockCars)
    }

    const updateAISuggestions = () => {
      aiSuggestions.value = []

      if (filters.value.minPrice && filters.value.maxPrice) {
        const priceRange = filters.value.maxPrice - filters.value.minPrice
        if (priceRange < 5000) {
          aiSuggestions.value.push({
            id: 1,
            text: 'نطاق السعر ضيق جداً، قد يقلل من نتائج البحث'
          })
        }
      }

      if (filters.value.make && !filters.value.model) {
        aiSuggestions.value.push({
          id: 2,
          text: `جرب البحث في موديلات ${filters.value.make} المحددة لنتائج أفضل`
        })
      }

      if (filters.value.fuelType === 'كهربائي') {
        aiSuggestions.value.push({
          id: 3,
          text: 'السيارات الكهربائية تتميز بتكاليف صيانة أقل وكفاءة أعلى'
        })
      }
    }

    const performSmartSearch = async () => {
      isSearching.value = true
      try {
        const mockCars = generateMockCars()

        // Apply filters
        let filteredCars = mockCars.filter(car => {
          if (filters.value.make && car.make !== filters.value.make) return false
          if (filters.value.model && car.model !== filters.value.model) return false
          if (filters.value.minPrice && car.price < filters.value.minPrice) return false
          if (filters.value.maxPrice && car.price > filters.value.maxPrice) return false
          if (filters.value.fuelType && car.fuelType !== filters.value.fuelType) return false
          if (filters.value.transmission && car.transmission !== filters.value.transmission) return false
          if (filters.value.minYear && car.year < filters.value.minYear) return false
          if (filters.value.maxYear && car.year > filters.value.maxYear) return false
          return true
        })

        // Get AI recommendations
        const aiResults = await getCarRecommendations({
          maxPrice: filters.value.maxPrice,
          preferredMakes: filters.value.make ? [filters.value.make] : [],
          fuelType: filters.value.fuelType
        }, filteredCars)

        searchResults.value = aiResults.length > 0 ? aiResults : filteredCars
        sortResults()

      } finally {
        isSearching.value = false
      }
    }

    const sortResults = () => {
      searchResults.value.sort((a, b) => {
        switch (sortBy.value) {
          case 'price-low':
            return a.price - b.price
          case 'price-high':
            return b.price - a.price
          case 'year-new':
            return b.year - a.year
          case 'mileage-low':
            return a.mileage - b.mileage
          default:
            return 0 // relevance (already sorted by AI)
        }
      })
    }

    const resetFilters = () => {
      filters.value = {
        make: '',
        model: '',
        minPrice: '',
        maxPrice: '',
        fuelType: '',
        transmission: '',
        minYear: '',
        maxYear: ''
      }
      searchResults.value = []
      aiSuggestions.value = []
    }

    const generateMockCars = () => {
      return [
        { id: 1, make: 'BMW', model: 'X5', year: 2022, price: 85000, mileage: 15000, fuelType: 'ديزل', transmission: 'أوتوماتيك', images: [], location: 'صوفيا' },
        { id: 2, make: 'Mercedes', model: 'C-Class', year: 2021, price: 45000, mileage: 25000, fuelType: 'بنزين', transmission: 'أوتوماتيك', images: [], location: 'بلغراد' },
        { id: 3, make: 'Audi', model: 'A4', year: 2020, price: 35000, mileage: 35000, fuelType: 'ديزل', transmission: 'يدوي', images: [], location: 'صوفيا' },
        { id: 4, make: 'BMW', model: 'X3', year: 2023, price: 65000, mileage: 5000, fuelType: 'هجين', transmission: 'أوتوماتيك', images: [], location: 'برلين' },
        { id: 5, make: 'Mercedes', model: 'E-Class', year: 2019, price: 55000, mileage: 45000, fuelType: 'ديزل', transmission: 'أوتوماتيك', images: [], location: 'صوفيا' }
      ]
    }

    return {
      filters,
      sortBy,
      isSearching,
      searchResults,
      marketTrends,
      aiSuggestions,
      availableMakes,
      availableModels: availableModelsComputed,
      performSmartSearch,
      resetFilters,
      sortResults,
      updateAISuggestions
    }
  }
}
</script>

<style scoped>
.advanced-search {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.search-header {
  text-align: center;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 15px;
}

.search-header h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.search-header p {
  margin: 0;
  color: #7f8c8d;
}

.search-filters {
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 15px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.filter-group input,
.filter-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.ai-suggestions {
  margin-top: 1rem;
  padding: 1rem;
  background: #e3f2fd;
  border-radius: 8px;
}

.ai-suggestions h3 {
  margin: 0 0 1rem 0;
  color: #1976d2;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
}

.suggestion-item i {
  color: #ffb300;
}

.search-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.search-results {
  margin-bottom: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.results-header h3 {
  margin: 0;
  color: #2c3e50;
}

.sort-options select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.car-result-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.car-result-card:hover {
  transform: translateY(-5px);
}

.car-image {
  position: relative;
  height: 180px;
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
  padding: 0.5rem;
  border-radius: 6px;
  font-weight: bold;
}

.car-details {
  padding: 1rem;
}

.car-details h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.car-specs {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.car-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.btn-view-details {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.btn-view-details:hover {
  background: #5a67d8;
}

.market-insights {
  margin-top: 2rem;
}

.insights-header h3 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  padding: 1.5rem;
  text-align: center;
  border-radius: 12px;
}

.insight-card h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.insight-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  margin: 0;
}

.popular-makes, .price-ranges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.popular-makes span, .price-ranges div {
  padding: 0.25rem 0;
  font-size: 0.9rem;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .filter-row {
    grid-template-columns: 1fr;
  }

  .results-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }

  .search-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
