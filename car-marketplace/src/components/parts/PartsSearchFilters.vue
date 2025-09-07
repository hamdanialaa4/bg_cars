<template>
  <div class="parts-search-filters">
    <div class="filters-header">
      <h3>{{ t('parts.searchParts') }}</h3>
      <button @click="toggleAdvanced" class="btn-toggle">
        <i :class="showAdvanced ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        {{ showAdvanced ? t('parts.hideAdvanced') : t('parts.showAdvanced') }}
      </button>
    </div>

    <!-- البحث الأساسي -->
    <div class="basic-search">
      <div class="search-input-group">
        <input
          v-model="filters.searchTerm"
          type="text"
          :placeholder="t('parts.searchPlaceholder')"
          @keyup.enter="emitSearch"
          class="search-input"
        />
        <button @click="emitSearch" class="btn-search">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>

    <!-- الفلاتر المتقدمة -->
    <div v-if="showAdvanced" class="advanced-filters">
      <div class="filter-row">
        <div class="filter-group">
          <label>{{ t('parts.category') }}</label>
          <select v-model="filters.category" @change="emitSearch">
            <option value="">{{ t('parts.allCategories') }}</option>
            <option value="engine">{{ t('parts.engine') }}</option>
            <option value="brakes">{{ t('parts.brakes') }}</option>
            <option value="body">{{ t('parts.body') }}</option>
            <option value="interior">{{ t('parts.interior') }}</option>
            <option value="tuning">{{ t('parts.tuning') }}</option>
            <option value="electrical">{{ t('parts.electrical') }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>{{ t('parts.condition') }}</label>
          <select v-model="filters.condition" @change="emitSearch">
            <option value="">{{ t('parts.all') }}</option>
            <option value="new">{{ t('parts.new') }}</option>
            <option value="used">{{ t('parts.used') }}</option>
            <option value="refurbished">{{ t('parts.refurbished') }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>{{ t('parts.priceRange') }}</label>
          <div class="price-range">
            <input
              v-model="filters.minPrice"
              type="number"
              :placeholder="t('parts.from')"
              @change="emitSearch"
            />
            <span>-</span>
            <input
              v-model="filters.maxPrice"
              type="number"
              :placeholder="t('parts.to')"
              @change="emitSearch"
            />
          </div>
        </div>
      </div>

      <div class="filter-row">
        <div class="filter-group">
          <label>{{ t('parts.brand') }}</label>
          <input
            v-model="filters.brand"
            type="text"
            :placeholder="t('parts.brandPlaceholder')"
            @keyup.enter="emitSearch"
          />
        </div>

        <div class="filter-group">
          <label>{{ t('parts.compatibility') }}</label>
          <input
            v-model="filters.carCompatibility"
            type="text"
            :placeholder="t('parts.compatibilityPlaceholder')"
            @keyup.enter="emitSearch"
          />
        </div>

        <div class="filter-group">
          <label>{{ t('parts.location') }}</label>
          <select v-model="filters.location" @change="emitSearch">
            <option value="">{{ t('parts.allLocations') }}</option>
            <option value="sofia">{{ t('parts.sofia') }}</option>
            <option value="plovdiv">{{ t('parts.plovdiv') }}</option>
            <option value="varna">{{ t('parts.varna') }}</option>
            <option value="burgas">{{ t('parts.burgas') }}</option>
          </select>
        </div>
      </div>

      <div class="filter-actions">
        <button @click="clearFilters" class="btn-secondary">
          <i class="fas fa-times"></i>
          {{ t('parts.clearFilters') }}
        </button>
        <button @click="emitSearch" class="btn-primary">
          <i class="fas fa-search"></i>
          {{ t('parts.search') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  search: [filters: any]
}>()

const showAdvanced = ref(false)

const filters = reactive({
  searchTerm: '',
  category: '',
  condition: '',
  minPrice: '',
  maxPrice: '',
  brand: '',
  carCompatibility: '',
  location: ''
})

const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

const emitSearch = () => {
  emit('search', { ...filters })
}

const clearFilters = () => {
  filters.searchTerm = ''
  filters.category = ''
  filters.condition = ''
  filters.minPrice = ''
  filters.maxPrice = ''
  filters.brand = ''
  filters.carCompatibility = ''
  filters.location = ''
  emitSearch()
}
</script>

<style scoped>
.parts-search-filters {
  background: var(--color-background);
  border-radius: var(--border-radius-main);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-main);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters-header h3 {
  margin: 0;
  color: var(--color-text-dark);
}

.btn-toggle {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-light);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-small);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-toggle:hover {
  border-color: var(--color-primary-green);
  color: var(--color-primary-green);
}

.basic-search {
  margin-bottom: 1rem;
}

.search-input-group {
  display: flex;
  gap: 0;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-small) 0 0 var(--border-radius-small);
  font-size: 1rem;
}

.btn-search {
  background: var(--color-primary-green);
  color: white;
  border: 1px solid var(--color-primary-green);
  padding: 0.75rem 1rem;
  border-radius: 0 var(--border-radius-small) var(--border-radius-small) 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-search:hover {
  background: var(--color-primary-green-hover);
  border-color: var(--color-primary-green-hover);
}

.advanced-filters {
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
}

.filter-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text-dark);
}

.filter-group select,
.filter-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-small);
  font-size: 0.9rem;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-range input {
  flex: 1;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-secondary {
  background: var(--color-background-soft);
  color: var(--color-text-light);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-small);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--color-border);
}

.btn-primary {
  background: var(--color-primary-green);
  color: white;
  border: 1px solid var(--color-primary-green);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-small);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--color-primary-green-hover);
  border-color: var(--color-primary-green-hover);
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
  }

  .filters-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
