<template>
  <div class="price-evaluator card-style">
    <h4><i class="fas fa-magic"></i> {{ t('aiPriceEvaluator') }}</h4>
    <p>{{ t('getRealTimeValuation') }}</p>

    <button @click="evaluatePrice" :disabled="isLoading || !canEvaluate" class="btn-primary">
      <span v-if="isLoading">
        <i class="fas fa-spinner fa-spin"></i> {{ t('analyzingMarket') }}
      </span>
      <span v-else>
        <i class="fas fa-calculator"></i> {{ t('suggestPrice') }}
      </span>
    </button>

    <div v-if="!canEvaluate" class="warning-message">
      <i class="fas fa-exclamation-triangle"></i>
      {{ t('fillMakeYearFirst') }}
    </div>

    <div v-if="prediction" class="prediction-result">
      <div class="suggested-price">
        <span>{{ t('suggestedPrice') }}</span>
        <strong>€{{ prediction.suggested_price.toLocaleString() }}</strong>
        <div class="confidence-badge" :class="getConfidenceClass(prediction.confidence)">
          {{ Math.round(prediction.confidence * 100) }}% {{ t('confidence') }}
        </div>
      </div>

      <div class="price-range">
        <span>{{ t('fairRange') }}: €{{ prediction.price_range_min.toLocaleString() }} - €{{ prediction.price_range_max.toLocaleString() }}</span>
      </div>

      <div class="market-insight">
        <i class="fas fa-chart-line"></i>
        <p>{{ prediction.market_insight }}</p>
      </div>

      <div class="market-data" v-if="prediction.market_data">
        <div class="data-item">
          <span>{{ t('similarListings') }}:</span>
          <strong>{{ prediction.market_data.similar_listings }}</strong>
        </div>
        <div class="data-item">
          <span>{{ t('demandLevel') }}:</span>
          <strong :class="getDemandClass(prediction.market_data.demand_level)">
            {{ prediction.market_data.demand_level }}
          </strong>
        </div>
      </div>

      <button @click="applySuggestedPrice" class="btn-secondary">
        <i class="fas fa-check"></i> {{ t('applyThisPrice') }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface CarFeatures {
  make: string
  model: string
  year: number
  mileage: number
  fuelType: string
  location: string
}

interface PricePrediction {
  suggested_price: number
  price_range_min: number
  price_range_max: number
  confidence: number
  market_insight: string
  market_data: {
    similar_listings: number
    avg_market_price: number
    price_trend: string
    demand_level: string
  }
}

const props = defineProps<{
  carFeatures: CarFeatures
}>()

const emit = defineEmits<{
  'apply-price': [price: number]
}>()

const isLoading = ref(false)
const prediction = ref<PricePrediction | null>(null)
const error = ref<string>('')

const canEvaluate = computed(() => {
  return props.carFeatures.make && props.carFeatures.year
})

const evaluatePrice = async () => {
  if (!canEvaluate.value) {
    error.value = t('fillRequiredFields')
    return
  }

  isLoading.value = true
  prediction.value = null
  error.value = ''

  try {
    // API call to the Python microservice
    const response = await axios.post('http://localhost:8001/predict-price', {
      ...props.carFeatures,
      location: props.carFeatures.location || 'Sofia'
    })

    prediction.value = response.data
  } catch (err) {
    console.error("Failed to get price prediction:", err)
    error.value = t('priceEvaluationFailed')
  } finally {
    isLoading.value = false
  }
}

const applySuggestedPrice = () => {
  if (prediction.value) {
    emit('apply-price', prediction.value.suggested_price)
  }
}

const getConfidenceClass = (confidence: number) => {
  if (confidence >= 0.9) return 'high'
  if (confidence >= 0.7) return 'medium'
  return 'low'
}

const getDemandClass = (demand: string) => {
  switch (demand.toLowerCase()) {
    case 'high': return 'high-demand'
    case 'medium': return 'medium-demand'
    case 'low': return 'low-demand'
    default: return ''
  }
}

// Watch for changes in car features to reset prediction
watch(() => props.carFeatures, () => {
  prediction.value = null
  error.value = ''
}, { deep: true })
</script>

<style scoped>
.price-evaluator {
  padding: 1.5rem;
  margin: 1rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 1px solid #dee2e6;
}

.prediction-result {
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.suggested-price {
  text-align: center;
  margin-bottom: 1rem;
}

.suggested-price strong {
  font-size: 2rem;
  color: #28a745;
  display: block;
  margin: 0.5rem 0;
}

.confidence-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.confidence-badge.high {
  background: #d4edda;
  color: #155724;
}

.confidence-badge.medium {
  background: #fff3cd;
  color: #856404;
}

.confidence-badge.low {
  background: #f8d7da;
  color: #721c24;
}

.price-range {
  text-align: center;
  color: #6c757d;
  margin: 1rem 0;
}

.market-insight {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
}

.market-insight i {
  color: #007bff;
  margin-right: 0.5rem;
}

.market-data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.data-item span:first-child {
  color: #6c757d;
}

.data-item strong {
  font-weight: 600;
}

.high-demand {
  color: #28a745;
}

.medium-demand {
  color: #ffc107;
}

.low-demand {
  color: #dc3545;
}

.warning-message, .error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.warning-message {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,123,255,0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}
</style>
