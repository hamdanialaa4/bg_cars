<template>
  <div class="login-page">
    <div class="language-switcher">
      <button
        v-for="locale in availableLocales"
        :key="locale"
        @click="setLocale(locale)"
        :class="{ active: locale === locale }"
        class="lang-btn"
      >
        {{ getLocaleName(locale) }}
      </button>
    </div>

    <div class="login-container glass-effect">
      <div class="login-header">
        <h1>{{ t('login') }}</h1>
        <p>{{ t('welcomeBack') }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
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
          <label for="password">{{ t('password') }}</label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            :placeholder="t('enterPassword')"
            required
          />
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.rememberMe" />
            <span>{{ t('rememberMe') }}</span>
          </label>
          <button type="button" @click="showForgotPassword" class="forgot-btn">
            {{ t('forgotPassword') }}
          </button>
        </div>

        <button type="submit" class="btn-primary" :disabled="authStore.loading">
          <i class="fas fa-sign-in-alt"></i>
          {{ authStore.loading ? t('common.loading') : t('auth.loginButton') }}
        </button>

        <div class="divider">
          <span>{{ t('or') }}</span>
        </div>

        <button type="button" @click="handleGoogleLogin" class="btn-google" :disabled="authStore.loading">
          <i class="fab fa-google"></i>
          {{ t('auth.loginWithGoogle') }}
        </button>
      </form>

      <div class="login-footer">
        <p>{{ t('dontHaveAccount') }}
          <router-link to="/register" class="register-link">{{ t('signup') }}</router-link>
        </p>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotModal" class="modal-overlay" @click="showForgotModal = false">
      <div class="modal-content glass-effect" @click.stop>
        <h3>{{ t('resetPassword') }}</h3>
        <p>{{ t('enterEmailForReset') }}</p>
        <input
          type="email"
          v-model="resetEmail"
          :placeholder="t('email')"
          class="modal-input"
        />
        <div class="modal-actions">
          <button @click="handlePasswordReset" class="btn-primary" :disabled="authStore.loading">
            {{ authStore.loading ? t('common.loading') : t('auth.sendResetLink') }}
          </button>
          <button @click="showForgotModal = false" class="btn-secondary">
            {{ t('cancel') }}
          </button>
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
const showForgotModal = ref(false)
const resetEmail = ref('')
const successMessage = ref('')

const form = ref({
  email: '',
  password: '',
  rememberMe: false
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

const handleLogin = async () => {
  try {
    await authStore.login(form.value.email, form.value.password)
    router.push('/')
  } catch (err) {
    console.error('Login error:', err)
  }
}

const handleGoogleLogin = async () => {
  // TODO: Implement Google login
  console.log('Google login not implemented yet')
}

const showForgotPassword = () => {
  showForgotModal.value = true
  resetEmail.value = form.value.email
}

const handlePasswordReset = async () => {
  if (!resetEmail.value) {
    authStore.error = t('auth.enterEmail')
    return
  }

  try {
    // TODO: Implement password reset
    successMessage.value = t('auth.resetLinkSent')
    showForgotModal.value = false
    setTimeout(() => successMessage.value = '', 5000)
  } catch (err) {
    console.error('Password reset error:', err)
  }
}
</script>
      error,
      availableLocales,
      currentLocale,
      handleLogin,
      handleGoogleLogin,
      showForgotPassword,
      handlePasswordReset,
      getLocaleName,
      setLocale,
      t
    }
  }
}
</script>

<style scoped>
.login-page {
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

.login-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-header p {
  color: #666;
  font-size: 1.1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.checkbox-label input {
  width: auto;
  margin: 0;
}

.forgot-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9rem;
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

.login-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e1e5e9;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover {
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
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  margin: 1rem 0;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
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
  .login-container {
    padding: 2rem;
    margin: 1rem;
  }

  .login-header h1 {
    font-size: 2rem;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
