<template>
  <div class="add-car-page">
    <div class="language-switcher">
      <button
        v-for="locale in availableLocales"
        :key="locale"
        @click="setLocale(locale)"
        :class="{ active: currentLocale === locale }"
        class="lang-btn"
      >
        {{ getLocaleName(locale) }}
      </button>
    </div>

    <div class="add-car-container glass-effect">
      <div class="add-car-header">
        <h1>{{ t('addNewCar') }}</h1>
        <p>{{ t('fillCarDetails') }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="add-car-form">
        <!-- معلومات أساسية -->
        <div class="form-section">
          <h3>{{ t('basicInfo') }}</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="make">{{ t('make') }} *</label>
              <select id="make" v-model="form.make" required>
                <option value="">{{ t('selectMake') }}</option>
                <option v-for="make in carMakes" :key="make" :value="make">{{ make }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="model">{{ t('model') }} *</label>
              <input
                id="model"
                type="text"
                v-model="form.model"
                :placeholder="t('enterModel')"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="year">{{ t('year') }} *</label>
              <input
                id="year"
                type="number"
                v-model="form.year"
                :placeholder="t('enterYear')"
                :min="1900"
                :max="new Date().getFullYear() + 1"
                required
              />
            </div>

            <div class="form-group">
              <label for="price">{{ t('price') }} (€) *</label>
              <input
                id="price"
                type="number"
                v-model="form.price"
                :placeholder="t('enterPrice')"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <!-- مواصفات فنية -->
        <div class="form-section">
          <h3>{{ t('technicalSpecs') }}</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="mileage">{{ t('mileage') }} (km)</label>
              <input
                id="mileage"
                type="number"
                v-model="form.mileage"
                :placeholder="t('enterMileage')"
                min="0"
              />
            </div>

            <div class="form-group">
              <label for="fuelType">{{ t('fuelType') }}</label>
              <select id="fuelType" v-model="form.fuelType">
                <option value="">{{ t('selectFuelType') }}</option>
                <option value="بنزين">{{ t('petrol') }}</option>
                <option value="ديزل">{{ t('diesel') }}</option>
                <option value="كهربائي">{{ t('electric') }}</option>
                <option value="هجين">{{ t('hybrid') }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="transmission">{{ t('transmission') }}</label>
              <select id="transmission" v-model="form.transmission">
                <option value="">{{ t('selectTransmission') }}</option>
                <option value="أوتوماتيك">{{ t('automatic') }}</option>
                <option value="يدوي">{{ t('manual') }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="engineSize">{{ t('engineSize') }} (L)</label>
              <input
                id="engineSize"
                type="number"
                v-model="form.engineSize"
                :placeholder="t('enterEngineSize')"
                step="0.1"
                min="0"
              />
            </div>
          </div>
        </div>

        <!-- معلومات إضافية -->
        <div class="form-section">
          <h3>{{ t('additionalInfo') }}</h3>
          <div class="form-group">
            <label for="description">{{ t('description') }}</label>
            <textarea
              id="description"
              v-model="form.description"
              :placeholder="t('enterDescription')"
              rows="4"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="color">{{ t('color') }}</label>
              <input
                id="color"
                type="text"
                v-model="form.color"
                :placeholder="t('enterColor')"
              />
            </div>

            <div class="form-group">
              <label for="doors">{{ t('doors') }}</label>
              <select id="doors" v-model="form.doors">
                <option value="">{{ t('selectDoors') }}</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
        </div>

        <!-- رفع الصور -->
        <div class="form-section">
          <h3>{{ t('carImages') }}</h3>
          <div class="image-upload">
            <div class="upload-area" @click="$refs.imageInput.click()">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>{{ t('clickToUpload') }}</p>
              <span>{{ t('maxImages') }}</span>
            </div>
            <input
              ref="imageInput"
              type="file"
              multiple
              accept="image/*"
              @change="handleImageUpload"
              style="display: none"
            />
          </div>

          <div class="image-preview" v-if="selectedImages.length > 0">
            <div
              v-for="(image, index) in selectedImages"
              :key="index"
              class="image-item"
            >
              <img :src="image.preview" :alt="`Car image ${index + 1}`" />
              <button type="button" @click="removeImage(index)" class="remove-image">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- أزرار الإجراءات -->
        <div class="form-actions">
          <button type="button" @click="goBack" class="btn-secondary">
            {{ t('cancel') }}
          </button>
          <button type="submit" :disabled="isLoading" class="btn-primary">
            <i class="fas fa-plus"></i>
            {{ isLoading ? t('addingCar') : t('addCar') }}
          </button>
        </div>
      </form>
    </div>

    <!-- رسالة النجاح -->
    <div v-if="successMessage" class="success-modal">
      <div class="success-content glass-effect">
        <i class="fas fa-check-circle"></i>
        <h3>{{ t('carAddedSuccessfully') }}</h3>
        <p>{{ successMessage }}</p>
        <button @click="goToDashboard" class="btn-primary">
          {{ t('goToDashboard') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useCars } from '../composables/useCars'
import { useI18n } from '../utils/i18n.js'

export default {
  name: 'AddCarView',
  setup() {
    const router = useRouter()
    const { user } = useAuth()
    const { addCar, isLoading, error } = useCars()
    const { t, currentLocale, setLocale } = useI18n()

    const availableLocales = ref(['bg', 'en'])
    const selectedImages = ref([])
    const successMessage = ref('')

    const form = ref({
      make: '',
      model: '',
      year: '',
      price: '',
      mileage: '',
      fuelType: '',
      transmission: '',
      engineSize: '',
      description: '',
      color: '',
      doors: ''
    })

    const carMakes = ref([
      'BMW', 'Mercedes', 'Audi', 'VW', 'Opel', 'Ford', 'Toyota', 'Honda',
      'Nissan', 'Mazda', 'Kia', 'Hyundai', 'Peugeot', 'Renault', 'Citroen',
      'Fiat', 'Alfa Romeo', 'Maserati', 'Lamborghini', 'Ferrari', 'Porsche',
      'Jaguar', 'Land Rover', 'Volvo', 'Saab', 'Skoda', 'Seat'
    ])

    const getLocaleName = (locale) => {
      const names = {
        bg: 'БГ',
        en: 'EN'
      }
      return names[locale] || locale
    }

    const handleImageUpload = (event) => {
      const files = Array.from(event.target.files)
      files.forEach(file => {
        if (selectedImages.value.length < 10) { // حد أقصى 10 صور
          const reader = new FileReader()
          reader.onload = (e) => {
            selectedImages.value.push({
              file: file,
              preview: e.target.result
            })
          }
          reader.readAsDataURL(file)
        }
      })
    }

    const removeImage = (index) => {
      selectedImages.value.splice(index, 1)
    }

    const handleSubmit = async () => {
      if (!user.value) {
        error.value = t('loginRequired')
        return
      }

      try {
        const carData = {
          ...form.value,
          sellerId: user.value.uid,
          sellerName: user.value.displayName || user.value.email,
          location: 'Sofia' // يمكن تحسينه لاحقاً
        }

        const images = selectedImages.value.map(img => img.file)
        const newCar = await addCar(carData, images)

        successMessage.value = `${t('carAddedSuccessfully')} ${newCar.make} ${newCar.model}`

        // إعادة تعيين النموذج
        form.value = {
          make: '', model: '', year: '', price: '', mileage: '',
          fuelType: '', transmission: '', engineSize: '',
          description: '', color: '', doors: ''
        }
        selectedImages.value = []

      } catch (err) {
        console.error('Error adding car:', err)
      }
    }

    const goBack = () => {
      router.go(-1)
    }

    const goToDashboard = () => {
      successMessage.value = ''
      router.push('/seller')
    }

    onMounted(() => {
      if (!user.value) {
        router.push('/login')
      }
    })

    return {
      form,
      selectedImages,
      successMessage,
      isLoading,
      error,
      availableLocales,
      carMakes,
      t,
      currentLocale,
      setLocale,
      getLocaleName,
      handleImageUpload,
      removeImage,
      handleSubmit,
      goBack,
      goToDashboard
    }
  }
}
</script>

<style scoped>
.add-car-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  position: relative;
}

.language-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.lang-btn:hover,
.lang-btn.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.add-car-container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.add-car-header {
  text-align: center;
  margin-bottom: 2rem;
}

.add-car-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.add-car-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 1.5rem;
}

.form-section h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.image-upload {
  margin-bottom: 1rem;
}

.upload-area {
  border: 2px dashed #667eea;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(102, 126, 234, 0.05);
}

.upload-area:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: #5a67d8;
}

.upload-area i {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.upload-area p {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #333;
}

.upload-area span {
  color: #666;
  font-size: 0.9rem;
}

.image-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.image-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4/3;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.remove-image:hover {
  background: rgba(231, 76, 60, 1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.success-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.success-content {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.success-content i {
  font-size: 4rem;
  color: #4CAF50;
  margin-bottom: 1rem;
}

.success-content h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.success-content p {
  margin-bottom: 2rem;
  color: #666;
}

@media (max-width: 768px) {
  .add-car-container {
    padding: 2rem;
    margin: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .image-preview {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
