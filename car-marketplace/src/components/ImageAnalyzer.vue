<template>
  <div class="image-analyzer">
    <div class="analyzer-container glass-effect">
      <div class="analyzer-header">
        <h2 class="analyzer-title">{{ t('imageAnalysis') }}</h2>
        <p class="analyzer-subtitle">{{ t('uploadCarImage') }}</p>
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

        <div v-if="!selectedImages.length" class="upload-placeholder">
          <i class="fas fa-cloud-upload-alt"></i>
          <h3>{{ t('dragDropImages') }}</h3>
          <p>{{ t('orClickToBrowse') }}</p>
          <button class="btn-upload">
            {{ t('chooseFiles') }}
          </button>
        </div>

        <!-- Selected Images Preview -->
        <div v-else class="images-preview">
          <div
            v-for="(image, index) in selectedImages"
            :key="index"
            class="image-item"
          >
            <img :src="image.preview" :alt="image.file.name" class="preview-image">
            <button @click.stop="removeImage(index)" class="remove-btn">
              <i class="fas fa-times"></i>
            </button>
            <div class="image-info">
              <span class="image-name">{{ image.file.name }}</span>
              <span class="image-size">{{ formatFileSize(image.file.size) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Analysis Options -->
      <div v-if="selectedImages.length > 0" class="analysis-options">
        <h3 class="options-title">{{ t('analysisOptions') }}</h3>

        <div class="options-grid">
          <label class="option-item">
            <input v-model="analysisOptions" type="checkbox" value="damage">
            <span class="checkmark"></span>
            {{ t('damageDetection') }}
          </label>

          <label class="option-item">
            <input v-model="analysisOptions" type="checkbox" value="condition">
            <span class="checkmark"></span>
            {{ t('conditionAssessment') }}
          </label>

          <label class="option-item">
            <input v-model="analysisOptions" type="checkbox" value="market">
            <span class="checkmark"></span>
            {{ t('marketValue') }}
          </label>

          <label class="option-item">
            <input v-model="analysisOptions" type="checkbox" value="features">
            <span class="checkmark"></span>
            {{ t('featureRecognition') }}
          </label>
        </div>
      </div>

      <!-- Analysis Results -->
      <div v-if="analysisResults.length > 0" class="analysis-results">
        <h3 class="results-title">{{ t('analysisResults') }}</h3>

        <div class="results-list">
          <div
            v-for="(result, index) in analysisResults"
            :key="index"
            class="result-item"
          >
            <div class="result-header">
              <img :src="result.image" :alt="result.filename" class="result-image">
              <div class="result-info">
                <h4 class="result-filename">{{ result.filename }}</h4>
                <div class="result-confidence">
                  {{ t('confidence') }}: {{ result.confidence }}%
                </div>
              </div>
            </div>

            <div class="result-details">
              <div v-if="result.damage" class="result-section">
                <h5>{{ t('damageAnalysis') }}</h5>
                <div class="damage-indicators">
                  <span
                    v-for="damage in result.damage"
                    :key="damage.type"
                    class="damage-badge"
                    :class="damage.severity"
                  >
                    {{ damage.type }} ({{ damage.severity }})
                  </span>
                </div>
              </div>

              <div v-if="result.condition" class="result-section">
                <h5>{{ t('conditionAssessment') }}</h5>
                <div class="condition-score">
                  <div class="score-bar">
                    <div
                      class="score-fill"
                      :style="{ width: result.condition.score + '%' }"
                      :class="getConditionClass(result.condition.score)"
                    ></div>
                  </div>
                  <span class="score-text">{{ result.condition.score }}/100</span>
                </div>
                <p class="condition-description">{{ result.condition.description }}</p>
              </div>

              <div v-if="result.marketValue" class="result-section">
                <h5>{{ t('estimatedValue') }}</h5>
                <div class="value-range">
                  <span class="value-min">{{ formatPrice(result.marketValue.min) }}</span>
                  <span class="value-separator">-</span>
                  <span class="value-max">{{ formatPrice(result.marketValue.max) }}</span>
                </div>
                <p class="value-description">{{ result.marketValue.description }}</p>
              </div>

              <div v-if="result.features" class="result-section">
                <h5>{{ t('recognizedFeatures') }}</h5>
                <div class="features-list">
                  <span
                    v-for="feature in result.features"
                    :key="feature"
                    class="feature-tag"
                  >
                    {{ feature }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="selectedImages.length > 0" class="action-buttons">
        <button @click="analyzeImages" class="btn-analyze" :disabled="isAnalyzing || analysisOptions.length === 0">
          <i v-if="!isAnalyzing" class="fas fa-brain"></i>
          <i v-else class="fas fa-spinner fa-spin"></i>
          {{ isAnalyzing ? t('analyzing') : t('analyzeImages') }}
        </button>

        <button @click="clearAll" class="btn-clear">
          <i class="fas fa-trash"></i>
          {{ t('clearAll') }}
        </button>
      </div>

      <!-- Loading Overlay -->
      <div v-if="isAnalyzing" class="loading-overlay">
        <div class="loading-content">
          <i class="fas fa-spinner fa-spin"></i>
          <h3>{{ t('analyzingImages') }}</h3>
          <p>{{ t('pleaseWait') }}</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: analysisProgress + '%' }"></div>
          </div>
          <span class="progress-text">{{ analysisProgress }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useI18n } from '../utils/i18n'

export default {
  name: 'ImageAnalyzer',
  setup() {
    const { t } = useI18n()

    const fileInput = ref(null)
    const selectedImages = ref([])
    const analysisOptions = ref(['damage', 'condition'])
    const analysisResults = ref([])
    const isAnalyzing = ref(false)
    const analysisProgress = ref(0)

    const maxFileSize = 10 * 1024 * 1024 // 10MB
    const maxFiles = 5

    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }

    const handleDrop = (event) => {
      const files = Array.from(event.dataTransfer.files)
      processFiles(files)
    }

    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files)
      processFiles(files)
    }

    const processFiles = (files) => {
      const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
          alert(t('invalidFileType'))
          return false
        }
        if (file.size > maxFileSize) {
          alert(t('fileTooLarge'))
          return false
        }
        return true
      })

      if (selectedImages.value.length + validFiles.length > maxFiles) {
        alert(t('tooManyFiles'))
        return
      }

      validFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          selectedImages.value.push({
            file,
            preview: e.target.result
          })
        }
        reader.readAsDataURL(file)
      })
    }

    const removeImage = (index) => {
      selectedImages.value.splice(index, 1)
    }

    const clearAll = () => {
      selectedImages.value = []
      analysisResults.value = []
      analysisOptions.value = ['damage', 'condition']
    }

    const analyzeImages = async () => {
      if (selectedImages.value.length === 0 || analysisOptions.value.length === 0) return

      isAnalyzing.value = true
      analysisProgress.value = 0
      analysisResults.value = []

      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        analysisProgress.value += Math.random() * 15
        if (analysisProgress.value >= 100) {
          analysisProgress.value = 100
          clearInterval(progressInterval)
        }
      }, 500)

      try {
        // Simulate API call to AI service
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Generate mock results
        selectedImages.value.forEach((image, index) => {
          const result = {
            image: image.preview,
            filename: image.file.name,
            confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
            damage: analysisOptions.value.includes('damage') ? generateDamageAnalysis() : null,
            condition: analysisOptions.value.includes('condition') ? generateConditionAnalysis() : null,
            marketValue: analysisOptions.value.includes('market') ? generateMarketValue() : null,
            features: analysisOptions.value.includes('features') ? generateFeatures() : null
          }
          analysisResults.value.push(result)
        })

      } catch (error) {
        console.error('Analysis error:', error)
        alert(t('analysisError'))
      } finally {
        isAnalyzing.value = false
        analysisProgress.value = 100
        setTimeout(() => {
          analysisProgress.value = 0
        }, 1000)
      }
    }

    const generateDamageAnalysis = () => {
      const damages = ['dent', 'scratch', 'rust', 'crack']
      const severities = ['minor', 'moderate', 'severe']
      const selectedDamages = []

      if (Math.random() > 0.5) {
        const damageCount = Math.floor(Math.random() * 3) + 1
        for (let i = 0; i < damageCount; i++) {
          selectedDamages.push({
            type: damages[Math.floor(Math.random() * damages.length)],
            severity: severities[Math.floor(Math.random() * severities.length)]
          })
        }
      }

      return selectedDamages.length > 0 ? selectedDamages : [{ type: 'none', severity: 'none' }]
    }

    const generateConditionAnalysis = () => {
      const score = Math.floor(Math.random() * 40) + 60 // 60-100
      const descriptions = {
        excellent: t('excellentCondition'),
        good: t('goodCondition'),
        fair: t('fairCondition'),
        poor: t('poorCondition')
      }

      let description = descriptions.poor
      if (score >= 90) description = descriptions.excellent
      else if (score >= 80) description = descriptions.good
      else if (score >= 70) description = descriptions.fair

      return { score, description }
    }

    const generateMarketValue = () => {
      const baseValue = Math.floor(Math.random() * 50000) + 10000
      const min = Math.floor(baseValue * 0.8)
      const max = Math.floor(baseValue * 1.2)

      return {
        min,
        max,
        description: t('marketValueDescription')
      }
    }

    const generateFeatures = () => {
      const features = [
        'alloy wheels', 'sunroof', 'navigation', 'leather seats',
        'heated seats', 'backup camera', 'bluetooth', 'cruise control'
      ]

      const selectedFeatures = []
      const featureCount = Math.floor(Math.random() * 4) + 2

      for (let i = 0; i < featureCount; i++) {
        const randomFeature = features[Math.floor(Math.random() * features.length)]
        if (!selectedFeatures.includes(randomFeature)) {
          selectedFeatures.push(randomFeature)
        }
      }

      return selectedFeatures
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('bg-BG', {
        style: 'currency',
        currency: 'BGN',
        minimumFractionDigits: 0
      }).format(price)
    }

    const getConditionClass = (score) => {
      if (score >= 90) return 'excellent'
      if (score >= 80) return 'good'
      if (score >= 70) return 'fair'
      return 'poor'
    }

    return {
      fileInput,
      selectedImages,
      analysisOptions,
      analysisResults,
      isAnalyzing,
      analysisProgress,
      t,
      triggerFileInput,
      handleDrop,
      handleFileSelect,
      removeImage,
      clearAll,
      analyzeImages,
      formatFileSize,
      formatPrice,
      getConditionClass
    }
  }
}
</script>

<style scoped>
.image-analyzer {
  min-height: 100vh;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.analyzer-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.analyzer-header {
  text-align: center;
  margin-bottom: 2rem;
}

.analyzer-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.analyzer-subtitle {
  color: #7f8c8d;
  font-size: 1rem;
}

.upload-area {
  border: 2px dashed #667eea;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  position: relative;
}

.upload-area:hover {
  border-color: #5a67d8;
  background: rgba(102, 126, 234, 0.05);
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.upload-placeholder i {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.upload-placeholder h3 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.upload-placeholder p {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.btn-upload {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-upload:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.images-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.image-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #e74c3c;
  transform: scale(1.1);
}

.image-info {
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.8rem;
}

.image-name {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.analysis-options {
  margin-bottom: 2rem;
}

.options-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #2c3e50;
}

.option-item input {
  margin-right: 0.5rem;
}

.analysis-results {
  margin-bottom: 2rem;
}

.results-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-item {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.result-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.result-filename {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.result-confidence {
  font-size: 0.8rem;
  color: #27ae60;
  font-weight: 500;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-section h5 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.damage-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.damage-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.damage-badge.minor {
  background: rgba(46, 204, 113, 0.2);
  color: #27ae60;
}

.damage-badge.moderate {
  background: rgba(241, 196, 15, 0.2);
  color: #f39c12;
}

.damage-badge.severe {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.condition-score {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.score-bar {
  flex: 1;
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.score-fill.excellent {
  background: #27ae60;
}

.score-fill.good {
  background: #f39c12;
}

.score-fill.fair {
  background: #e67e22;
}

.score-fill.poor {
  background: #e74c3c;
}

.score-text {
  font-weight: 600;
  color: #2c3e50;
  min-width: 50px;
}

.condition-description {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0;
}

.value-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #667eea;
}

.value-description {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0.5rem 0 0 0;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-analyze,
.btn-clear {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-analyze {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-analyze:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-analyze:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-clear {
  background: rgba(255, 255, 255, 0.8);
  color: #2c3e50;
  border: 1px solid #e1e5e9;
}

.btn-clear:hover {
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.loading-content i {
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.loading-content h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.loading-content p {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .analyzer-container {
    margin: 0 1rem;
    padding: 1rem;
  }

  .images-preview {
    grid-template-columns: 1fr;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .result-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-analyze,
  .btn-clear {
    width: 100%;
    justify-content: center;
  }
}
</style>
