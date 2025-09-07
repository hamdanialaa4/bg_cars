<template>
  <div class="car-detail" v-if="car">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>{{ t('common.loading') }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <i class="fas fa-exclamation-triangle"></i>
      <h2>{{ t('common.errorLoadingCar') }}</h2>
      <p>{{ error }}</p>
      <router-link to="/" class="btn-back">
        {{ t('common.backToHome') }}
      </router-link>
    </div>

    <!-- Car Detail Content -->
    <div v-else class="car-detail-content">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <router-link to="/" class="breadcrumb-link">{{ t('common.home') }}</router-link>
        <span class="breadcrumb-separator">></span>
        <router-link to="/cars" class="breadcrumb-link">{{ t('common.cars') }}</router-link>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-current">{{ car.title }}</span>
      </nav>

      <!-- Main Content -->
      <div class="car-main">
        <!-- Image Gallery -->
        <div class="car-gallery">
          <div class="main-image-container">
            <img
              :src="currentImage"
              :alt="car.title"
              class="main-image"
              @error="handleImageError"
            >
            <button
              v-if="car.images && car.images.length > 1"
              @click="previousImage"
              class="nav-btn prev-btn"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button
              v-if="car.images && car.images.length > 1"
              @click="nextImage"
              class="nav-btn next-btn"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>

          <!-- Thumbnail Images -->
          <div v-if="car.images && car.images.length > 1" class="thumbnail-container">
            <button @click="scrollThumbnails(-1)" class="scroll-btn left-scroll">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="thumbnails" ref="thumbnailsRef">
              <img
                v-for="(image, index) in car.images"
                :key="index"
                :src="image"
                :alt="`${car.title} ${index + 1}`"
                class="thumbnail"
                :class="{ active: index === currentImageIndex }"
                @click="setCurrentImage(index)"
                @error="handleThumbnailError"
              >
            </div>
            <button @click="scrollThumbnails(1)" class="scroll-btn right-scroll">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Car Information -->
        <div class="car-info-section">
          <!-- Header -->
          <div class="car-header">
            <div class="car-title-section">
              <h1 class="car-title">{{ car.title }}</h1>
              <div class="car-badges">
                <span v-if="car.featured" class="badge featured">
                  <i class="fas fa-star"></i>
                  {{ t('featured') }}
                </span>
                <span class="badge condition" :class="car.condition">
                  {{ getConditionLabel(car.condition) }}
                </span>
              </div>
            </div>

            <div class="car-price-section">
              <div class="price">{{ formatPrice(car.price) }}</div>
              <div v-if="car.negotiable" class="negotiable">{{ t('negotiable') }}</div>
              <button @click="toggleFavorite" class="favorite-btn" :class="{ active: isFavorite }">
                <i class="fas fa-heart"></i>
                {{ isFavorite ? t('removeFromFavorites') : t('addToFavorites') }}
              </button>
            </div>
          </div>

          <!-- Key Details -->
          <div class="key-details">
            <div class="detail-grid">
              <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <div>
                  <span class="detail-label">{{ t('year') }}</span>
                  <span class="detail-value">{{ car.year }}</span>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-tachometer-alt"></i>
                <div>
                  <span class="detail-label">{{ t('mileage') }}</span>
                  <span class="detail-value">{{ formatMileage(car.mileage) }}</span>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-gas-pump"></i>
                <div>
                  <span class="detail-label">{{ t('fuelType') }}</span>
                  <span class="detail-value">{{ getFuelTypeLabel(car.fuelType) }}</span>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-cogs"></i>
                <div>
                  <span class="detail-label">{{ t('transmission') }}</span>
                  <span class="detail-value">{{ getTransmissionLabel(car.transmission) }}</span>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-car"></i>
                <div>
                  <span class="detail-label">{{ t('bodyType') }}</span>
                  <span class="detail-value">{{ getBodyTypeLabel(car.bodyType) }}</span>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-palette"></i>
                <div>
                  <span class="detail-label">{{ t('color') }}</span>
                  <span class="detail-value">{{ car.color }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button @click="contactSeller" class="btn-contact">
              <i class="fas fa-envelope"></i>
              {{ t('contactSeller') }}
            </button>
            <button @click="scheduleViewing" class="btn-viewing">
              <i class="fas fa-calendar"></i>
              {{ t('scheduleViewing') }}
            </button>
            <button @click="shareCar" class="btn-share">
              <i class="fas fa-share"></i>
              {{ t('share') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Detailed Specifications -->
      <div class="specifications-section">
        <h2 class="section-title">{{ t('specifications') }}</h2>
        <div class="specs-grid">
          <div class="spec-group">
            <h3 class="spec-group-title">{{ t('engine') }}</h3>
            <div class="spec-items">
              <div class="spec-item">
                <span class="spec-label">{{ t('engineSize') }}</span>
                <span class="spec-value">{{ car.engineSize }}L</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">{{ t('power') }}</span>
                <span class="spec-value">{{ car.power }} HP</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">{{ t('torque') }}</span>
                <span class="spec-value">{{ car.torque }} Nm</span>
              </div>
            </div>
          </div>

          <div class="spec-group">
            <h3 class="spec-group-title">{{ t('dimensions') }}</h3>
            <div class="spec-items">
              <div class="spec-item">
                <span class="spec-label">{{ t('length') }}</span>
                <span class="spec-value">{{ car.length }} mm</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">{{ t('width') }}</span>
                <span class="spec-value">{{ car.width }} mm</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">{{ t('height') }}</span>
                <span class="spec-value">{{ car.height }} mm</span>
              </div>
            </div>
          </div>

          <div class="spec-group">
            <h3 class="spec-group-title">{{ t('features') }}</h3>
            <div class="features-list">
              <span
                v-for="feature in car.features"
                :key="feature"
                class="feature-tag"
              >
                {{ feature }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="description-section">
        <h2 class="section-title">{{ t('description') }}</h2>
        <div class="description-content">
          <p>{{ car.description }}</p>
        </div>
      </div>

      <!-- Seller Information -->
      <div class="seller-section">
        <h2 class="section-title">{{ t('sellerInformation') }}</h2>
        <div class="seller-card">
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
            <h3 class="seller-name">{{ car.seller?.name || t('privateSeller') }}</h3>
            <div class="seller-meta">
              <span class="seller-type">{{ car.seller?.type === 'dealer' ? t('dealer') : t('privateSeller') }}</span>
              <div v-if="car.seller?.rating" class="seller-rating">
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
            <p class="seller-location">
              <i class="fas fa-map-marker-alt"></i>
              {{ car.location }}
            </p>
          </div>
          <div class="seller-actions">
            <button @click="contactSeller" class="btn-contact-seller">
              {{ t('contact') }}
            </button>
            <button @click="viewSellerProfile" class="btn-view-profile">
              {{ t('viewProfile') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Similar Cars -->
      <div class="similar-cars-section">
        <h2 class="section-title">{{ t('similarCars') }}</h2>
        <div class="similar-cars-grid">
          <CarCard
            v-for="similarCar in similarCars"
            :key="similarCar.id"
            :car="similarCar"
            @favorite="toggleFavorite"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '../utils/i18n.js'
import { useCars } from '../composables/useCars'
import CarCard from '../components/CarCard.vue'

export default {
  name: 'CarDetailView',
  components: {
    CarCard
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const { getCarById, getSimilarCars } = useCars()

    const car = ref(null)
    const similarCars = ref([])
    const isLoading = ref(true)
    const error = ref('')
    const currentImageIndex = ref(0)
    const isFavorite = ref(false)
    const thumbnailsRef = ref(null)

    const currentImage = computed(() => {
      if (!car.value?.images || car.value.images.length === 0) return ''
      return car.value.images[currentImageIndex.value]
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

    const getSellerInitials = (name) => {
      if (!name) return '?'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const setCurrentImage = (index) => {
      currentImageIndex.value = index
    }

    const previousImage = () => {
      if (!car.value?.images) return
      currentImageIndex.value = currentImageIndex.value === 0
        ? car.value.images.length - 1
        : currentImageIndex.value - 1
    }

    const nextImage = () => {
      if (!car.value?.images) return
      currentImageIndex.value = currentImageIndex.value === car.value.images.length - 1
        ? 0
        : currentImageIndex.value + 1
    }

    const scrollThumbnails = (direction) => {
      if (!thumbnailsRef.value) return
      const scrollAmount = 120
      thumbnailsRef.value.scrollLeft += direction * scrollAmount
    }

    const handleImageError = (event) => {
      event.target.src = '/placeholder-car.jpg' // Fallback image
    }

    const handleThumbnailError = (event) => {
      event.target.style.display = 'none'
    }

    const toggleFavorite = (carId) => {
      if (carId) {
        isFavorite.value = !isFavorite.value
      } else {
        isFavorite.value = !isFavorite.value
      }
      // Implement favorite logic
    }

    const contactSeller = () => {
      // Implement contact seller logic
      console.log('Contact seller:', car.value.seller)
    }

    const scheduleViewing = () => {
      // Implement schedule viewing logic
      console.log('Schedule viewing for car:', car.value.id)
    }

    const shareCar = () => {
      if (navigator.share) {
        navigator.share({
          title: car.value.title,
          text: car.value.description,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href)
        // Show success message
      }
    }

    const viewSellerProfile = () => {
      if (car.value.seller?.id) {
        router.push(`/seller/${car.value.seller.id}`)
      }
    }

    const loadCar = async () => {
      try {
        isLoading.value = true
        error.value = ''

        const carId = route.params.id
        const carData = await getCarById(carId)

        if (!carData) {
          error.value = t('carNotFound')
          return
        }

        car.value = carData

        // Load similar cars
        similarCars.value = await getSimilarCars(carId)

      } catch (err) {
        console.error('Error loading car:', err)
        error.value = t('errorLoadingCar')
      } finally {
        isLoading.value = false
      }
    }

    // Keyboard navigation for images
    const handleKeydown = (event) => {
      if (!car.value?.images || car.value.images.length <= 1) return

      if (event.key === 'ArrowLeft') {
        previousImage()
      } else if (event.key === 'ArrowRight') {
        nextImage()
      }
    }

    onMounted(() => {
      loadCar()
      document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
    })

    return {
      car,
      similarCars,
      isLoading,
      error,
      currentImageIndex,
      isFavorite,
      thumbnailsRef,
      currentImage,
      t,
      formatPrice,
      formatMileage,
      getFuelTypeLabel,
      getTransmissionLabel,
      getBodyTypeLabel,
      getConditionLabel,
      getSellerInitials,
      setCurrentImage,
      previousImage,
      nextImage,
      scrollThumbnails,
      handleImageError,
      handleThumbnailError,
      toggleFavorite,
      contactSeller,
      scheduleViewing,
      shareCar,
      viewSellerProfile
    }
  }
}
</script>

<style scoped>
.car-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.loading-spinner {
  color: #667eea;
}

.loading-spinner i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-container {
  color: #e74c3c;
}

.error-container i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.btn-back {
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.car-detail-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.breadcrumb {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.breadcrumb-link {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: #5a67d8;
}

.breadcrumb-separator {
  color: #7f8c8d;
}

.breadcrumb-current {
  color: #2c3e50;
  font-weight: 500;
}

.car-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.car-gallery {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.main-image-container {
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-btn:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
}

.prev-btn {
  left: 1rem;
}

.next-btn {
  right: 1rem;
}

.thumbnail-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  flex: 1;
  padding: 0 1rem;
}

.thumbnail {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  flex-shrink: 0;
}

.thumbnail:hover,
.thumbnail.active {
  border-color: #667eea;
  transform: scale(1.05);
}

.scroll-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.scroll-btn:hover {
  background: white;
  transform: scale(1.1);
}

.car-info-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.car-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.car-title-section {
  flex: 1;
}

.car-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.car-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.badge.featured {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

.badge.condition.new {
  background: #27ae60;
  color: white;
}

.badge.condition.used {
  background: #3498db;
  color: white;
}

.badge.condition.damaged {
  background: #e74c3c;
  color: white;
}

.car-price-section {
  text-align: right;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.negotiable {
  font-size: 0.9rem;
  color: #27ae60;
  font-weight: 500;
  margin-bottom: 1rem;
}

.favorite-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e1e5e9;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.favorite-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
}

.favorite-btn.active {
  background: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.key-details {
  margin-bottom: 2rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
}

.detail-item i {
  color: #667eea;
  font-size: 1.2rem;
}

.detail-label {
  display: block;
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-weight: 600;
  color: #2c3e50;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-contact,
.btn-viewing,
.btn-share {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
}

.btn-contact {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-contact:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-viewing {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  border: 1px solid #3498db;
}

.btn-viewing:hover {
  background: #3498db;
  color: white;
}

.btn-share {
  background: rgba(155, 89, 182, 0.1);
  color: #9b59b6;
  border: 1px solid #9b59b6;
}

.btn-share:hover {
  background: #9b59b6;
  color: white;
}

.specifications-section,
.description-section,
.seller-section,
.similar-cars-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.spec-group {
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
}

.spec-group-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.spec-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spec-label {
  color: #7f8c8d;
}

.spec-value {
  font-weight: 600;
  color: #2c3e50;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.description-content {
  line-height: 1.6;
  color: #555;
}

.seller-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
}

.seller-avatar {
  width: 60px;
  height: 60px;
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
  font-size: 1.2rem;
}

.seller-details {
  flex: 1;
}

.seller-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.seller-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.seller-type {
  font-size: 0.9rem;
  color: #667eea;
  font-weight: 500;
}

.seller-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.rating-stars {
  display: flex;
  gap: 0.125rem;
}

.rating-stars i {
  font-size: 0.8rem;
  color: #ddd;
}

.rating-stars i.active {
  color: #f39c12;
}

.seller-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.seller-location i {
  color: #667eea;
}

.seller-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-contact-seller,
.btn-view-profile {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-contact-seller {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-contact-seller:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-view-profile {
  background: rgba(255, 255, 255, 0.8);
  color: #2c3e50;
  border: 1px solid #e1e5e9;
}

.btn-view-profile:hover {
  background: white;
  border-color: #667eea;
}

.similar-cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .car-detail-content {
    padding: 0 1rem;
  }

  .car-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .car-title {
    font-size: 1.5rem;
  }

  .price {
    font-size: 1.5rem;
  }

  .car-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .car-price-section {
    text-align: left;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-contact,
  .btn-viewing,
  .btn-share {
    flex: none;
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }

  .seller-card {
    flex-direction: column;
    text-align: center;
  }

  .seller-actions {
    flex-direction: row;
    justify-content: center;
  }

  .similar-cars-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .main-image-container {
    height: 250px;
  }

  .thumbnail {
    width: 60px;
    height: 45px;
  }

  .car-gallery {
    padding: 0.5rem;
  }

  .car-info-section {
    padding: 1rem;
  }
}
</style>
