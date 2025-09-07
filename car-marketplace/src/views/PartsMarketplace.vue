<template>
  <div class="parts-marketplace">
    <!-- رأس الصفحة -->
    <div class="page-header">
      <div class="header-content">
        <h1>{{ t('parts.marketplace') }}</h1>
        <p>{{ t('parts.discover') }}</p>
      </div>
      <div class="header-actions">
        <router-link to="/sell/part" class="btn-primary">
          <i class="fas fa-plus"></i>
          {{ t('parts.addPart') }}
        </router-link>
      </div>
    </div>

    <!-- شريط التصفح السريع -->
    <div class="quick-nav">
      <button
        v-for="category in categories"
        :key="category.key"
        @click="setCategoryFilter(category.key)"
        class="nav-item"
        :class="{ active: activeCategory === category.key }"
      >
        <i :class="category.icon"></i>
        <span>{{ category.name }}</span>
      </button>
    </div>

    <!-- فلاتر البحث -->
    <PartsSearchFilters @search="handleSearch" />

    <!-- نتائج البحث -->
    <div class="results-section">
      <div class="results-header">
        <h2>{{ t('parts.results') }}</h2>
        <div class="results-count">
          <span>{{ totalResults }} {{ t('parts.partsCount') }}</span>
        </div>
        <div class="sort-options">
          <select v-model="sortBy" @change="handleSort">
            <option value="newest">{{ t('parts.newest') }}</option>
            <option value="price-low">{{ t('parts.priceLowToHigh') }}</option>
            <option value="price-high">{{ t('parts.priceHighToLow') }}</option>
            <option value="popular">{{ t('parts.mostPopular') }}</option>
          </select>
        </div>
      </div>

      <!-- حالة التحميل -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>{{ t('parts.loading') }}</p>
      </div>

      <!-- رسالة عدم وجود نتائج -->
      <div v-else-if="parts.length === 0" class="no-results">
        <i class="fas fa-search"></i>
        <h3>{{ t('parts.noResults') }}</h3>
        <p>{{ t('parts.tryDifferentSearch') }}</p>
      </div>

      <!-- شبكة النتائج -->
      <div v-else class="parts-grid">
        <PartCard
          v-for="part in parts"
          :key="part.id"
          :part="part"
          @favorite="handleFavorite"
          @contact="handleContact"
        />
      </div>

      <!-- تحميل المزيد -->
      <div v-if="hasMore && !isLoading" class="load-more">
        <button @click="loadMore" class="btn-secondary">
          {{ t('parts.loadMore') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import PartsSearchFilters from '../components/parts/PartsSearchFilters.vue'
import PartCard from '../components/parts/PartCard.vue'

const { t } = useI18n()

interface Part {
  id: string
  partName_en?: string
  partName_bg?: string
  brand?: string
  category?: string
  condition?: string
  price?: number
  currency?: string
  location?: string
  images?: string[]
  stats?: {
    views: number
    messages: number
  }
}

const parts = ref<Part[]>([])
const isLoading = ref(false)
const totalResults = ref(0)
const hasMore = ref(true)
const sortBy = ref('newest')
const activeCategory = ref('')

const categories = [
  { key: '', name: t('parts.all'), icon: 'fas fa-tools' },
  { key: 'engine', name: t('parts.engine'), icon: 'fas fa-cogs' },
  { key: 'brakes', name: t('parts.brakes'), icon: 'fas fa-stop-circle' },
  { key: 'body', name: t('parts.body'), icon: 'fas fa-car' },
  { key: 'interior', name: t('parts.interior'), icon: 'fas fa-chair' },
  { key: 'tuning', name: t('parts.tuning'), icon: 'fas fa-magic' },
  { key: 'electrical', name: t('parts.electrical'), icon: 'fas fa-bolt' }
]

// بيانات تجريبية للعرض
const mockParts: Part[] = [
  {
    id: '1',
    partName_en: 'Brake Discs',
    partName_bg: 'Спирачни дискове',
    brand: 'Brembo',
    category: 'brakes',
    condition: 'new',
    price: 120,
    currency: 'EUR',
    location: 'sofia',
    images: ['https://via.placeholder.com/300x200?text=Brake+Discs'],
    stats: { views: 45, messages: 3 }
  },
  {
    id: '2',
    partName_en: 'Engine Oil Filter',
    partName_bg: 'Маслен филтър',
    brand: 'Bosch',
    category: 'engine',
    condition: 'new',
    price: 15,
    currency: 'EUR',
    location: 'plovdiv',
    images: ['https://via.placeholder.com/300x200?text=Oil+Filter'],
    stats: { views: 23, messages: 1 }
  },
  {
    id: '3',
    partName_en: 'LED Headlights',
    partName_bg: 'LED фарове',
    brand: 'Osram',
    category: 'electrical',
    condition: 'new',
    price: 85,
    currency: 'EUR',
    location: 'varna',
    images: ['https://via.placeholder.com/300x200?text=LED+Headlights'],
    stats: { views: 67, messages: 5 }
  }
]

const handleSearch = (filters: any) => {
  console.log('Search filters:', filters)
  // هنا سيتم استدعاء API للبحث
  loadParts(filters)
}

const loadParts = async (filters: any = {}) => {
  isLoading.value = true
  try {
    // محاكاة استدعاء API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // في التطبيق الحقيقي، هنا سيتم استدعاء API
    // const response = await fetch('/api/parts/search', {
    //   method: 'POST',
    //   body: JSON.stringify(filters)
    // })
    // const data = await response.json()

    console.log('Applying filters:', filters)
    parts.value = mockParts
    totalResults.value = mockParts.length
  } catch (error) {
    console.error('Error loading parts:', error)
  } finally {
    isLoading.value = false
  }
}

const setCategoryFilter = (category: string) => {
  activeCategory.value = category
  handleSearch({ category })
}

const handleSort = () => {
  console.log('Sort by:', sortBy.value)
  // تنفيذ الترتيب
}

const handleFavorite = (part: Part) => {
  console.log('Add to favorites:', part)
  // تنفيذ إضافة للمفضلة
}

const handleContact = (part: Part) => {
  console.log('Contact seller:', part)
  // تنفيذ التواصل مع البائع
}

const loadMore = () => {
  console.log('Load more parts')
  // تنفيذ تحميل المزيد
}

onMounted(() => {
  loadParts()
})
</script>

<style scoped>
.parts-marketplace {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.header-content h1 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-dark);
}

.header-content p {
  margin: 0;
  color: var(--color-text-light);
}

.header-actions {
  flex-shrink: 0;
}

.btn-primary {
  background: var(--color-primary-green);
  color: white;
  border: 1px solid var(--color-primary-green);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-small);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--color-primary-green-hover);
  border-color: var(--color-primary-green-hover);
}

.quick-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-main);
  background: var(--color-background);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.nav-item:hover,
.nav-item.active {
  border-color: var(--color-primary-green);
  background: var(--color-primary-green);
  color: white;
}

.nav-item i {
  font-size: 1.5rem;
}

.results-section {
  margin-top: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.results-header h2 {
  margin: 0;
  color: var(--color-text-dark);
}

.results-count {
  color: var(--color-text-light);
}

.sort-options select {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-small);
}

.loading-state {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-light);
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--color-border);
}

.parts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.load-more {
  text-align: center;
  margin-top: 2rem;
}

.btn-secondary {
  background: var(--color-background-soft);
  color: var(--color-text-light);
  border: 1px solid var(--color-border);
  padding: 0.75rem 2rem;
  border-radius: var(--border-radius-small);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--color-border);
}

@media (max-width: 768px) {
  .parts-marketplace {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .quick-nav {
    padding-bottom: 1rem;
  }

  .nav-item {
    min-width: 80px;
    padding: 0.75rem;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .parts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
