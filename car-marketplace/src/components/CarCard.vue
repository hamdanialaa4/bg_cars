<template>
  <div class="car-card glass-effect" @click="goToCarDetail">
    <!-- Car Image -->
    <div class="car-image-container">
      <img
        v-if="car.images && car.images.length > 0"
        :src="car.images[0]"
        :alt="car.title"
        class="car-image"
        @error="handleImageError"
      >
      <div v-else class="no-image">
        <i class="fas fa-car"></i>
        <span>{{ t('noImage') }}</span>
      </div>

      <!-- Favorite Button -->
      <button
        @click.stop="toggleFavorite"
        class="favorite-btn"
        :class="{ active: isFavorite }"
      >
        <i class="fas fa-heart"></i>
      </button>

      <!-- Featured Badge -->
      <div v-if="car.featured" class="featured-badge">
        <i class="fas fa-star"></i>
        {{ t('featured') }}
      </div>

      <!-- Condition Badge -->
      <div class="condition-badge" :class="car.condition">
        {{ getConditionLabel(car.condition) }}
      </div>
    </div>

    <!-- Car Info -->
    <div class="car-info">
      <div class="car-header">
        <h3 class="car-title">{{ car.title }}</h3>
        <div class="car-price">
          <span class="price">{{ formatPrice(car.price) }}</span>
          <span v-if="car.negotiable" class="negotiable">{{ t('negotiable') }}</span>
        </div>
      </div>

      <div class="car-details">
        <div class="detail-item">
          <i class="fas fa-calendar"></i>
          <span>{{ car.year }}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-tachometer-alt"></i>
          <span>{{ formatMileage(car.mileage) }}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-gas-pump"></i>
          <span>{{ getFuelTypeLabel(car.fuelType) }}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-cogs"></i>
          <span>{{ getTransmissionLabel(car.transmission) }}</span>
        </div>
      </div>

      <div class="car-location">
        <i class="fas fa-map-marker-alt"></i>
        <span>{{ car.location }}</span>
      </div>

      <div class="car-meta">
        <span class="car-date">{{ formatDate(car.createdAt) }}</span>
        <span class="car-views">
          <i class="fas fa-eye"></i>
          {{ car.views || 0 }}
        </span>
      </div>
    </div>

    <!-- Seller Info -->
    <div class="seller-info">
      <div class="seller-avatar">
        <img
          v-if="car.seller?.avatar"
          :src="car.seller.avatar"
          :alt="car.seller.name"
        >
        <div v-else class="seller-initials">
          {{ getSellerInitials(car.seller?.name) }}
        </div>
      </div>
      <div class="seller-details">
        <span class="seller-name">{{ car.seller?.name || t('privateSeller') }}</span>
        <div class="seller-rating" v-if="car.seller?.rating">
          <div class="rating-stars">
            <i
              v-for="star in 5"
              :key="star"
              class="fas fa-star"
              :class="{ active: star <= car.seller.rating }"
            ></i>
          </div>
          <span class="rating-score">({{ car.seller.ratingCount || 0 }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '../utils/i18n.js'

export default {
  name: 'CarCard',
  props: {
    car: {
      type: Object,
      required: true
    },
    showFavorite: {
      type: Boolean,
      default: true
    }
  },
  emits: ['favorite'],
  setup(props, { emit }) {
    const router = useRouter()
    const { t } = useI18n()

    const isFavorite = ref(false) // This would come from user preferences

    const formatPrice = (price) => {
      return new Intl.NumberFormat('bg-BG', {
        style: 'currency',
        currency: 'BGN',
        minimumFractionDigits: 0
      }).format(price)
    }

    const formatMileage = (mileage) => {
      if (mileage >= 1000) {
        return `${(mileage / 1000).toFixed(0)}k km`
      }
      return `${mileage} km`
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

    const getConditionLabel = (condition) => {
      const labels = {
        new: t('new'),
        used: t('used'),
        damaged: t('damaged')
      }
      return labels[condition] || condition
    }

    const formatDate = (date) => {
      if (!date) return ''
      const now = new Date()
      const carDate = new Date(date)
      const diffTime = Math.abs(now - carDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) return t('today')
      if (diffDays === 2) return t('yesterday')
      if (diffDays <= 7) return `${diffDays} ${t('daysAgo')}`

      return carDate.toLocaleDateString('bg-BG')
    }

    const getSellerInitials = (name) => {
      if (!name) return '?'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const handleImageError = (event) => {
      event.target.style.display = 'none'
      event.target.nextElementSibling.style.display = 'flex'
    }

    const goToCarDetail = () => {
      router.push(`/car/${props.car.id}`)
    }

    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value
      emit('favorite', props.car.id)
    }

    return {
      isFavorite,
      t,
      formatPrice,
      formatMileage,
      getFuelTypeLabel,
      getTransmissionLabel,
      getConditionLabel,
      formatDate,
      getSellerInitials,
      handleImageError,
      goToCarDetail,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.car-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.car-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.car-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.car-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.car-card:hover .car-image {
  transform: scale(1.05);
}

.no-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
}

.no-image i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: white;
}

.favorite-btn.active {
  background: #e74c3c;
  color: white;
}

.favorite-btn.active i {
  color: white;
}

.featured-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.condition-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
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

.car-info {
  padding: 1.5rem;
}

.car-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.car-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  line-height: 1.3;
  flex: 1;
  margin-right: 1rem;
}

.car-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
}

.negotiable {
  font-size: 0.8rem;
  color: #27ae60;
  font-weight: 500;
}

.car-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.detail-item i {
  color: #667eea;
  width: 14px;
}

.car-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.75rem;
}

.car-location i {
  color: #667eea;
}

.car-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #95a5a6;
  margin-bottom: 1rem;
}

.car-views {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.seller-info {
  padding: 1rem 1.5rem;
  background: rgba(102, 126, 234, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.seller-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.seller-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.seller-initials {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.seller-details {
  flex: 1;
  min-width: 0;
}

.seller-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
  display: block;
  margin-bottom: 0.25rem;
}

.seller-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #7f8c8d;
}

.rating-stars {
  display: flex;
  gap: 0.125rem;
}

.rating-stars i {
  font-size: 0.7rem;
  color: #ddd;
}

.rating-stars i.active {
  color: #f39c12;
}

.rating-score {
  font-size: 0.75rem;
}

/* Mobile Styles */
@media (max-width: 480px) {
  .car-card {
    margin: 0 0.5rem;
  }

  .car-info {
    padding: 1rem;
  }

  .car-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .car-title {
    margin-right: 0;
  }

  .car-price {
    align-items: flex-start;
  }

  .car-details {
    grid-template-columns: 1fr;
  }

  .seller-info {
    padding: 0.75rem 1rem;
  }
}
</style>
