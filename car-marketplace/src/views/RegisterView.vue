<template>
  <div class="register-page">
    <div class="language-switcher">
      <button
        v-for="locale in availableLocales"
        :key="locale"
        @click="setLocale(locale)"
        :class="{ active: locale === $i18n.locale }"
        class="lang-btn"
      >
        {{ getLocaleName(locale) }}
      </button>
    </div>

    <div class="register-container glass-effect">
      <div class="register-header">
        <h1>{{ t('signup') }}</h1>
        <p>{{ t('createAccount') }}</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">{{ t('firstName') }}</label>
            <input
              id="firstName"
              type="text"
              v-model="form.firstName"
              :placeholder="t('enterFirstName')"
              required
            />
          </div>

          <div class="form-group">
            <label for="lastName">{{ t('lastName') }}</label>
            <input
              id="lastName"
              type="text"
              v-model="form.lastName"
              :placeholder="t('enterLastName')"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email">{{ t('email') }}</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            :placeholder="t('enterEmail')"
            required
          />
        </div>

        <div class="form-group">
          <label for="phone">{{ t('phone') }}</label>
          <input
            id="phone"
            type="tel"
            v-model="form.phone"
            :placeholder="t('enterPhone')"
          />
        </div>

        <div class="form-group">
          <label for="password">{{ t('password') }}</label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            :placeholder="t('enterPassword')"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">{{ t('confirmPassword') }}</label>
          <input
            id="confirmPassword"
            type="password"
            v-model="form.confirmPassword"
            :placeholder="t('confirmPassword')"
            required
          />
        </div>

        <div class="form-group">
          <label>{{ t('userType') }}</label>
          <div class="user-type-options">
            <label class="radio-label">
              <input type="radio" v-model="form.userType" value="buyer" />
              <span>{{ t('buyer') }}</span>
            </label>
            <label class="radio-label">
              <input type="radio" v-model="form.userType" value="seller" />
              <span>{{ t('seller') }}</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.agreeToTerms" required />
            <span>{{ t('agreeTo') }}
              <a href="#" @click.prevent="showTerms">{{ t('termsAndConditions') }}</a>
            </span>
          </label>
        </div>

        <button type="submit" class="btn-primary" :disabled="authStore.loading || !form.agreeToTerms">
          <i class="fas fa-user-plus"></i>
          {{ authStore.loading ? t('common.loading') : t('auth.registerButton') }}
        </button>

        <div class="divider">
          <span>{{ t('or') }}</span>
        </div>

        <button type="button" @click="handleGoogleRegister" class="btn-google" :disabled="authStore.loading">
          <i class="fab fa-google"></i>
          {{ t('auth.registerWithGoogle') }}
        </button>
      </form>

      <div class="register-footer">
        <p>{{ t('haveAccount') }}
          <router-link to="/login" class="login-link">{{ t('login') }}</router-link>
        </p>
      </div>
    </div>

    <!-- Terms Modal -->
    <div v-if="showTermsModal" class="modal-overlay" @click="showTermsModal = false">
      <div class="modal-content glass-effect" @click.stop>
        <h3>{{ t('termsAndConditions') }}</h3>
        <div class="terms-content">
          <p>{{ t('termsText') }}</p>
        </div>
        <div class="modal-actions">
          <button @click="showTerms" class="btn-primary">{{ t('auth.agreeToTerms') }}</button>
          <button @click="showTermsModal = false" class="btn-secondary">{{ t('close') }}</button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="authStore.error" class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      {{ authStore.error }}
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="success-message">
      <i class="fas fa-check-circle"></i>
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const { t, locale } = useI18n()
const authStore = useAuthStore()

const availableLocales = ref(['bg', 'en'])
const showTermsModal = ref(false)
const successMessage = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  userType: 'buyer',
  agreeToTerms: false
})

const getLocaleName = (localeCode: string) => {
  const names: { [key: string]: string } = {
    bg: 'БГ',
    en: 'EN'
  }
  return names[localeCode] || localeCode
}

const setLocale = (localeCode: string) => {
  locale.value = localeCode
}

const validateForm = () => {
  if (form.value.password !== form.value.confirmPassword) {
    authStore.error = t('auth.passwordMismatch')
    return false
  }
  if (!form.value.agreeToTerms) {
    authStore.error = t('auth.agreeToTerms')
    return false
  }
  return true
}

const handleRegister = async () => {
  if (!validateForm()) return

  try {
    const displayName = `${form.value.firstName} ${form.value.lastName}`
    await authStore.register(form.value.email, form.value.password, displayName)

    // Update additional user info
    await authStore.updateUserProfile({
      phone: form.value.phone,
      isSeller: form.value.userType === 'seller'
    })

    router.push('/')
  } catch (err) {
    console.error('Registration error:', err)
  }
}

const handleGoogleRegister = async () => {
  // TODO: Implement Google registration
  console.log('Google registration not implemented yet')
}

const showTerms = () => {
  showTermsModal.value = true
}

const acceptTerms = () => {
  form.value.agreeToTerms = true
  showTermsModal.value = false
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.register-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-header p {
  color: #666;
  font-size: 1.1rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.form-group input {
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.user-type-options {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.radio-label input {
  width: auto;
  margin: 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1.4;
}

.checkbox-label input {
  width: auto;
  margin-top: 0.2rem;
}

.checkbox-label a {
  color: #667eea;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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

.btn-google {
  background: #4285f4;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-google:hover:not(:disabled) {
  background: #3367d6;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 133, 244, 0.3);
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e1e5e9;
}

.divider span {
  background: white;
  padding: 0 1rem;
  color: #666;
  font-size: 0.9rem;
}

.register-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e1e5e9;
}

.login-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}

.modal-overlay {
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

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.terms-content {
  text-align: left;
  margin: 1rem 0;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e1e5e9;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.error-message,
.success-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-message {
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.success-message {
  background: #efe;
  color: #363;
  border: 1px solid #cfc;
}

@media (max-width: 768px) {
  .register-container {
    padding: 2rem;
    margin: 1rem;
  }

  .register-header h1 {
    font-size: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .user-type-options {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
