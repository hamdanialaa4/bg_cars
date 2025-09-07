<template>
  <div class="part-card" @click="handleClick">
    <div class="part-image">
      <img
        v-if="part.images && part.images.length > 0"
        :src="part.images[0]"
        :alt="part.partName_en || part.partName_bg"
        @error="handleImageError"
      />
      <div v-else class="no-image">
        <i class="fas fa-tools"></i>
        <span>{{ t('parts.noImage') }}</span>
      </div>
      <div class="part-condition" :class="part.condition">
        {{ getConditionText(part.condition) }}
      </div>
    </div>

    <div class="part-info">
      <h4 class="part-name">
        {{ part.partName_en || part.partName_bg }}
      </h4>

      <div class="part-details">
        <div class="detail-item">
          <i class="fas fa-tag"></i>
          <span>{{ part.brand || t('parts.undefined') }}</span>
        </div>

        <div class="detail-item" v-if="part.category">
          <i class="fas fa-cogs"></i>
          <span>{{ getCategoryText(part.category) }}</span>
        </div>

        <div class="detail-item" v-if="part.location">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ getLocationText(part.location) }}</span>
        </div>
      </div>

      <div class="part-price">
        <span class="price">{{ formatPrice(part.price) }}</span>
        <span class="currency">{{ part.currency || 'EUR' }}</span>
      </div>

      <div class="part-actions">
        <button @click.stop="addToFavorites" class="btn-favorite" :class="{ active: isFavorite }">
          <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
        </button>
        <button @click.stop="contactSeller" class="btn-contact">
          <i class="fas fa-envelope"></i>
          {{ t('parts.contactSeller') }}
        </button>
      </div>
    </div>

    <div class="part-stats" v-if="part.stats">
      <div class="stat-item">
        <i class="fas fa-eye"></i>
        <span>{{ part.stats.views || 0 }}</span>
      </div>
      <div class="stat-item">
        <i class="fas fa-envelope"></i>
        <span>{{ part.stats.messages || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
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

const props = defineProps<{
  part: Part
}>()

const emit = defineEmits<{
  favorite: [part: Part]
  contact: [part: Part]
}>()

const isFavorite = ref(false)

const handleClick = () => {
  router.push(`/parts/${props.part.id}`)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    parent.innerHTML = `
      <div class="no-image">
        <i class="fas fa-tools"></i>
        <span>لا توجد صورة</span>
      </div>
    `
  }
}

const getConditionText = (condition?: string) => {
  const conditions = {
    new: 'جديد',
    used: 'مستعمل',
    refurbished: 'مُجدد'
  }
  return conditions[condition as keyof typeof conditions] || condition || 'غير محدد'
}

const getCategoryText = (category?: string) => {
  const categories = {
    engine: 'محرك',
    brakes: 'فرامل',
    body: 'هيكل',
    interior: 'داخلية',
    tuning: 'تعديل',
    electrical: 'كهربائيات'
  }
  return categories[category as keyof typeof categories] || category || 'غير محدد'
}

const getLocationText = (location?: string) => {
  const locations = {
    sofia: 'صوفيا',
    plovdiv: 'بلوفديف',
    varna: 'فارنا',
    burgas: 'بورغاس'
  }
  return locations[location as keyof typeof locations] || location || 'غير محدد'
}

const formatPrice = (price?: number) => {
  if (!price) return 'غير محدد'
  return new Intl.NumberFormat('bg-BG').format(price)
}

const addToFavorites = () => {
  isFavorite.value = !isFavorite.value
  emit('favorite', props.part)
}

const contactSeller = () => {
  emit('contact', props.part)
}
</script>

<style scoped>
.part-card {
  background: var(--color-background);
  border-radius: var(--border-radius-main);
  box-shadow: var(--shadow-main);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
}

.part-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-color: var(--color-primary-green);
}

.part-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.part-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.part-card:hover .part-image img {
  transform: scale(1.05);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-background-soft);
  color: var(--color-text-light);
}

.no-image i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.part-condition {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-small);
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.part-condition.new {
  background: #10b981;
  color: white;
}

.part-condition.used {
  background: #f59e0b;
  color: white;
}

.part-condition.refurbished {
  background: #3b82f6;
  color: white;
}

.part-info {
  padding: 1rem;
}

.part-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-dark);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.part-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.detail-item i {
  color: var(--color-primary-green);
  width: 14px;
}

.part-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-primary-green);
}

.currency {
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.part-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-favorite {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-light);
  padding: 0.5rem;
  border-radius: var(--border-radius-small);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-favorite:hover,
.btn-favorite.active {
  border-color: #ef4444;
  color: #ef4444;
}

.btn-contact {
  flex: 1;
  background: var(--color-primary-green);
  color: white;
  border: 1px solid var(--color-primary-green);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-small);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-contact:hover {
  background: var(--color-primary-green-hover);
  border-color: var(--color-primary-green-hover);
}

.part-stats {
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 1rem;
  background: var(--color-background-soft);
  border-top: 1px solid var(--color-border);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.stat-item i {
  color: var(--color-primary-green);
}

@media (max-width: 768px) {
  .part-image {
    height: 150px;
  }

  .part-info {
    padding: 0.75rem;
  }

  .part-actions {
    flex-direction: column;
  }

  .btn-contact {
    flex: none;
  }
}
</style>
