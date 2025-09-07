<template>
  <div class="add-car-modal">
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content glass-effect" @click.stop>
        <div class="modal-header">
          <h2>{{ t('addNewCar') }}</h2>
          <button class="close-btn" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
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
                  <option value="بنزين">بنزين</option>
                  <option value="ديزل">ديزل</option>
                  <option value="كهربائي">كهربائي</option>
                  <option value="هجين">هجين</option>
                  <option value="غاز">غاز</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="transmission">{{ t('transmission') }}</label>
                <select id="transmission" v-model="form.transmission">
                  <option value="">{{ t('selectTransmission') }}</option>
                  <option value="أوتوماتيك">أوتوماتيك</option>
                  <option value="يدوي">يدوي</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>

              <div class="form-group">
                <label for="engineSize">{{ t('engineSize') }} (L)</label>
                <input
                  id="engineSize"
                  type="number"
                  v-model="form.engineSize"
                  :placeholder="t('enterEngineSize')"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="power">{{ t('power') }} (HP)</label>
                <input
                  id="power"
                  type="number"
                  v-model="form.power"
                  :placeholder="t('enterPower')"
                  min="0"
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

          <!-- معلومات إضافية -->
          <div class="form-section">
            <h3>{{ t('additionalInfo') }}</h3>
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
                <label for="location">{{ t('location') }}</label>
                <input
                  id="location"
                  type="text"
                  v-model="form.location"
                  :placeholder="t('enterLocation')"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="description">{{ t('description') }}</label>
              <textarea
                id="description"
                v-model="form.description"
                :placeholder="t('enterDescription')"
                rows="4"
              ></textarea>
            </div>
          </div>

          <!-- رفع الصور -->
          <div class="form-section">
            <h3>{{ t('photos') }}</h3>
            <div class="image-upload">
              <div class="upload-area" @click="$refs.imageInput.click()">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>{{ t('clickToUpload') }}</p>
                <span>{{ t('maxFiles') }}</span>
              </div>
              <input
                ref="imageInput"
                type="file"
                multiple
                accept="image/*"
                @change="handleImageSelect"
                style="display: none"
              />
            </div>

            <div class="image-preview" v-if="selectedImages.length > 0">
              <div
                v-for="(image, index) in selectedImages"
                :key="index"
                class="image-item"
              >
                <img :src="image.preview" :alt="`Preview ${index + 1}`" />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="remove-image"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- الميزات -->
          <div class="form-section">
            <h3>{{ t('features') }}</h3>
            <div class="features-grid">
              <label
                v-for="feature in availableFeatures"
                :key="feature.key"
                class="feature-checkbox"
              >
                <input
                  type="checkbox"
                  :value="feature.key"
                  v-model="form.features"
                />
                <span>{{ feature.label }}</span>
              </label>
            </div>
          </div>

          <!-- أزرار الإجراءات -->
          <div class="form-actions">
            <button type="button" @click="$emit('close')" class="btn-secondary">
              {{ t('cancel') }}
            </button>
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              <i class="fas fa-plus"></i>
              {{ isSubmitting ? t('adding') : t('addCar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useCarData } from '../services/carData'
import { useI18n } from '../utils/i18n'

export default {
  name: 'AddCarModal',
  emits: ['close', 'car-added'],
  setup(props, { emit }) {
    const { addCar, isLoading } = useCarData()
    const { t } = useI18n()

    const isSubmitting = ref(false)
    const selectedImages = ref([])

    const form = ref({
      make: '',
      model: '',
      year: '',
      price: '',
      mileage: '',
      fuelType: '',
      transmission: '',
      engineSize: '',
      power: '',
      doors: '',
      color: '',
      location: '',
      description: '',
      features: []
    })

    const carMakes = ref([
      'BMW', 'Mercedes', 'Audi', 'VW', 'Opel', 'Ford', 'Toyota',
      'Honda', 'Nissan', 'Hyundai', 'Kia', 'Peugeot', 'Renault',
      'Citroen', 'Fiat', 'Alfa Romeo', 'Maserati', 'Lamborghini',
      'Ferrari', 'Porsche', 'Jaguar', 'Land Rover', 'Volvo'
    ])

    const availableFeatures = ref([
      { key: 'airConditioning', label: 'مكيف' },
      { key: 'navigation', label: 'نظام ملاحة' },
      { key: 'cruiseControl', label: 'تحكم في السرعة' },
      { key: 'parkingSensors', label: 'حساسات ركن' },
      { key: 'leatherSeats', label: 'مقاعد جلد' },
      { key: 'sunroof', label: 'فتحة سقف' },
      { key: 'alloyWheels', label: 'جنوط سبائك' },
      { key: 'bluetooth', label: 'بلوتوث' },
      { key: 'backupCamera', label: 'كاميرا خلفية' },
      { key: 'heatedSeats', label: 'مقاعد مدفأة' },
      { key: 'keylessEntry', label: 'دخول بدون مفتاح' },
      { key: 'abs', label: 'نظام ABS' },
      { key: 'esp', label: 'نظام ESP' },
      { key: 'airbags', label: 'وسائد هوائية' },
      { key: 'centralLocking', label: 'قفل مركزي' }
    ])

    const handleImageSelect = (event) => {
      const files = Array.from(event.target.files)

      files.forEach(file => {
        if (file.type.startsWith('image/')) {
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
      if (!validateForm()) return

      isSubmitting.value = true

      try {
        const carData = {
          ...form.value,
          sellerId: localStorage.getItem('userId'), // من نظام المصادقة
          features: form.value.features.join(', ')
        }

        const images = selectedImages.value.map(img => img.file)
        const newCar = await addCar(carData, images)

        emit('car-added', newCar)
        emit('close')

      } catch (err) {
        console.error('Error adding car:', err)
      } finally {
        isSubmitting.value = false
      }
    }

    const validateForm = () => {
      if (!form.value.make || !form.value.model || !form.value.year || !form.value.price) {
        alert(t('fillRequiredFields'))
        return false
      }

      if (selectedImages.value.length === 0) {
        alert(t('selectAtLeastOneImage'))
        return false
      }

      return true
    }

    return {
      form,
      isSubmitting,
      selectedImages,
      carMakes,
      availableFeatures,
      handleImageSelect,
      removeImage,
      handleSubmit,
      t
    }
  }
}
</script>

<style scoped>
.add-car-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid #e1e5e9;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #333;
}

.add-car-form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.2rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
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
  border-radius: 10px;
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
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.upload-area:hover {
  background: #e3f2fd;
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
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.image-item {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.image-item img {
  width: 100%;
  height: 100px;
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
  width: 25px;
  height: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.feature-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.feature-checkbox:hover {
  background: #f8f9fa;
}

.feature-checkbox input {
  width: auto;
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e1e5e9;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
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
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e1e5e9;
}

.btn-secondary:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-height: 95vh;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .image-preview {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}
</style>
