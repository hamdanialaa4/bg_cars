<template>
  <div class="image-analyzer">
    <div class="analyzer-container glass-effect">
      <div class="analyzer-header">
        <h3 class="analyzer-title">
          <i class="fas fa-image"></i> {{ t('aiImageAnalyzer') }}
        </h3>
        <p class="analyzer-subtitle">{{ t('smartImageAnalysis') }}</p>
      </div>

      <!-- Upload Area -->
      <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          class="file-input"
          multiple
        >

        <div v-if="!uploadedImages.length" class="upload-placeholder">
          <i class="fas fa-cloud-upload-alt"></i>
          <h4>{{ t('dragDropImages') }}</h4>
          <p>{{ t('orClickToBrowse') }}</p>
          <button class="btn-upload">
            <i class="fas fa-folder-open"></i> {{ t('chooseFiles') }}
          </button>
        </div>

        <!-- Uploaded Images Analysis -->
        <div v-else class="images-analysis">
          <div
            v-for="(image, index) in uploadedImages"
            :key="index"
            class="image-analysis-item"
          >
            <div class="image-preview">
              <img :src="image.preview" :alt="image.filename" class="preview-img">
              <div class="image-overlay">
                <div class="quality-score" :class="getQualityClass(image.quality_score)">
                  {{ Math.round(image.quality_score) }}%
                </div>
                <button @click.stop="removeImage(index)" class="remove-btn">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>

            <div class="analysis-results">
              <div class="image-info">
                <h5>{{ image.filename }}</h5>
                <span class="category-badge" :class="getCategoryClass(image.category)">
                  <i :class="getCategoryIcon(image.category)"></i>
                  {{ image.category }}
                </span>
              </div>

              <div class="analysis-metrics">
                <div class="metric">
                  <span class="metric-label">{{ t('brightness') }}:</span>
                  <span class="metric-value" :class="getMetricClass(image.brightness_score, 70)">
                    {{ Math.round(image.brightness_score) }}
                  </span>
                </div>
                <div class="metric">
                  <span class="metric-label">{{ t('clarity') }}:</span>
                  <span class="metric-value" :class="getMetricClass(image.clarity_score, 50)">
                    {{ Math.round(image.clarity_score) }}
                  </span>
                </div>
              </div>

              <div class="suggestions">
                <div
                  v-for="suggestion in image.suggestions"
                  :key="suggestion"
                  class="suggestion-item"
                  :class="getSuggestionClass(suggestion)"
                >
                  <i :class="getSuggestionIcon(suggestion)"></i>
                  {{ suggestion }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analysis Summary -->
      <div v-if="uploadedImages.length > 0" class="analysis-summary">
        <h4>{{ t('analysisSummary') }}</h4>
        <div class="summary-stats">
          <div class="stat">
            <span class="stat-label">{{ t('totalImages') }}:</span>
            <span class="stat-value">{{ uploadedImages.length }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">{{ t('averageQuality') }}:</span>
            <span class="stat-value" :class="getQualityClass(averageQuality)">
              {{ Math.round(averageQuality) }}%
            </span>
          </div>
          <div class="stat">
            <span class="stat-label">{{ t('excellentImages') }}:</span>
            <span class="stat-value">{{ excellentImagesCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface AnalyzedImage {
  filename: string
  preview: string
  is_blurry: boolean
  is_dark: boolean
  brightness_score: number
  clarity_score: number
  suggestions: string[]
  category: string
  quality_score: number
}

const fileInput = ref<HTMLInputElement>()
const uploadedImages = ref<AnalyzedImage[]>([])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    handleFiles(Array.from(files))
  }
}

const handleFiles = async (files: File[]) => {
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      await analyzeImage(file)
    }
  }
}

const analyzeImage = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post('http://localhost:8002/analyze-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const analysis: AnalyzedImage = {
      ...response.data,
      preview: URL.createObjectURL(file)
    }

    uploadedImages.value.push(analysis)
  } catch (error) {
    console.error('Image analysis failed:', error)
    // Add with default values if analysis fails
    const defaultAnalysis: AnalyzedImage = {
      filename: file.name,
      preview: URL.createObjectURL(file),
      is_blurry: false,
      is_dark: false,
      brightness_score: 75,
      clarity_score: 60,
      suggestions: [t('analysisFailed')],
      category: 'unknown',
      quality_score: 50
    }
    uploadedImages.value.push(defaultAnalysis)
  }
}

const removeImage = (index: number) => {
  URL.revokeObjectURL(uploadedImages.value[index].preview)
  uploadedImages.value.splice(index, 1)
}

const averageQuality = computed(() => {
  if (!uploadedImages.value.length) return 0
  const sum = uploadedImages.value.reduce((acc, img) => acc + img.quality_score, 0)
  return sum / uploadedImages.value.length
})

const excellentImagesCount = computed(() => {
  return uploadedImages.value.filter(img => img.quality_score >= 80).length
})

const getQualityClass = (score: number) => {
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'fair'
  return 'poor'
}

const getCategoryClass = (category: string) => {
  switch (category) {
    case 'exterior': return 'exterior'
    case 'interior': return 'interior'
    case 'engine': return 'engine'
    default: return 'unknown'
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'exterior': return 'fas fa-car'
    case 'interior': return 'fas fa-car-seat'
    case 'engine': return 'fas fa-cogs'
    default: return 'fas fa-question'
  }
}

const getMetricClass = (value: number, threshold: number) => {
  return value >= threshold ? 'good' : 'warning'
}

const getSuggestionClass = (suggestion: string) => {
  if (suggestion.includes('excellent') || suggestion.includes('good')) {
    return 'positive'
  }
  return 'warning'
}

const getSuggestionIcon = (suggestion: string) => {
  if (suggestion.includes('excellent') || suggestion.includes('good')) {
    return 'fas fa-check-circle'
  }
  return 'fas fa-exclamation-triangle'
}
</script>

<style scoped>
.image-analyzer {
  margin: 2rem 0;
}

.analyzer-container {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.analyzer-header {
  text-align: center;
  margin-bottom: 2rem;
}

.analyzer-title {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.analyzer-subtitle {
  color: #6c757d;
  margin: 0;
}

.upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255,255,255,0.8);
}

.upload-area:hover {
  border-color: #007bff;
  background: rgba(0,123,255,0.05);
}

.file-input {
  display: none;
}

.upload-placeholder h4 {
  color: #495057;
  margin: 1rem 0 0.5rem 0;
}

.upload-placeholder p {
  color: #6c757d;
  margin-bottom: 1rem;
}

.btn-upload {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-upload:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.images-analysis {
  display: grid;
  gap: 1.5rem;
}

.image-analysis-item {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.image-preview {
  position: relative;
}

.preview-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.quality-score {
  background: rgba(255,255,255,0.9);
  color: #2c3e50;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.8rem;
}

.quality-score.excellent {
  background: rgba(40, 167, 69, 0.9);
  color: white;
}

.quality-score.good {
  background: rgba(255, 193, 7, 0.9);
  color: white;
}

.quality-score.fair {
  background: rgba(255, 193, 7, 0.9);
  color: white;
}

.quality-score.poor {
  background: rgba(220, 53, 69, 0.9);
  color: white;
}

.remove-btn {
  background: rgba(220, 53, 69, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.analysis-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-info h5 {
  margin: 0;
  color: #2c3e50;
  font-size: 1rem;
}

.category-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.category-badge.exterior {
  background: #d1ecf1;
  color: #0c5460;
}

.category-badge.interior {
  background: #d4edda;
  color: #155724;
}

.category-badge.engine {
  background: #fff3cd;
  color: #856404;
}

.analysis-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.metric-label {
  color: #6c757d;
  font-size: 0.9rem;
}

.metric-value {
  font-weight: 600;
}

.metric-value.good {
  color: #28a745;
}

.metric-value.warning {
  color: #dc3545;
}

.suggestions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.suggestion-item {
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.suggestion-item.positive {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.suggestion-item.warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.analysis-summary {
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.analysis-summary h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-label {
  color: #6c757d;
  font-weight: 500;
}

.stat-value {
  font-weight: 600;
  color: #2c3e50;
}

.stat-value.excellent {
  color: #28a745;
}

.stat-value.good {
  color: #ffc107;
}

@media (max-width: 768px) {
  .image-analysis-item {
    grid-template-columns: 1fr;
  }

  .image-preview {
    max-width: 100%;
  }

  .summary-stats {
    grid-template-columns: 1fr;
  }
}
</style>
