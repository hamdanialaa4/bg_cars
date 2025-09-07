// File: src/views/SettingsView.vue
<template>
  <div class="settings-view">
    <!-- Page Header -->
    <div class="settings-header">
      <div class="container">
        <div class="header-content">
          <h1 class="settings-title">
            <Icon name="settings" class="title-icon" />
            {{ $t('settings.title') }}
          </h1>
          <p class="settings-subtitle">{{ $t('settings.subtitle') }}</p>
        </div>
      </div>
    </div>

    <!-- Settings Content -->
    <div class="settings-content">
      <div class="container">
        <div class="settings-layout">
          <!-- Settings Navigation -->
          <aside class="settings-nav">
            <nav class="nav-menu">
              <button
                v-for="section in settingsSections"
                :key="section.id"
                :class="['nav-item', { active: activeSection === section.id }]"
                @click="setActiveSection(section.id)"
              >
                <Icon :name="section.icon" class="nav-icon" />
                <span class="nav-label">{{ $t(section.label) }}</span>
                <Icon name="chevron-right" class="nav-arrow" />
              </button>
            </nav>
          </aside>

          <!-- Settings Panels -->
          <main class="settings-main">
            <!-- Account Settings -->
            <div v-show="activeSection === 'account'" class="settings-section">
              <div class="section-header">
                <h2 class="section-title">{{ $t('settings.account.title') }}</h2>
                <p class="section-description">{{ $t('settings.account.description') }}</p>
              </div>

              <div class="settings-cards">
                <!-- Profile Information -->
                <div class="settings-card">
                  <div class="card-header">
                    <h3 class="card-title">{{ $t('settings.account.profile.title') }}</h3>
                  </div>
                  <div class="card-content">
                    <form @submit.prevent="updateProfile" class="profile-form">
                      <div class="form-grid">
                        <div class="form-group">
                          <label class="form-label">{{ $t('settings.account.profile.displayName') }}</label>
                          <input
                            v-model="profileForm.displayName"
                            type="text"
                            class="form-input"
                            :placeholder="$t('settings.account.profile.displayNamePlaceholder')"
                          />
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label">{{ $t('settings.account.profile.email') }}</label>
                          <input
                            :value="user?.email"
                            type="email"
                            class="form-input"
                            disabled
                          />
                          <small class="form-help">{{ $t('settings.account.profile.emailHelp') }}</small>
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label">{{ $t('settings.account.profile.phone') }}</label>
                          <input
                            v-model="profileForm.phoneNumber"
                            type="tel"
                            class="form-input"
                            :placeholder="$t('settings.account.profile.phonePlaceholder')"
                          />
                        </div>
                        
                        <div class="form-group full-width">
                          <label class="form-label">{{ $t('settings.account.profile.bio') }}</label>
                          <textarea
                            v-model="profileForm.bio"
                            class="form-textarea"
                            rows="3"
                            :placeholder="$t('settings.account.profile.bioPlaceholder')"
                          ></textarea>
                        </div>
                      </div>
                      
                      <div class="form-actions">
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                          <Icon v-if="isLoading" name="loading" class="btn-icon spinning" />
                          <Icon v-else name="save" class="btn-icon" />
                          {{ $t('common.save') }}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <!-- Security Settings -->
                <div class="settings-card">
                  <div class="card-header">
                    <h3 class="card-title">{{ $t('settings.account.security.title') }}</h3>
                  </div>
                  <div class="card-content">
                    <div class="security-options">
                      <div class="security-item">
                        <div class="security-info">
                          <h4 class="security-label">{{ $t('settings.account.security.password') }}</h4>
                          <p class="security-description">{{ $t('settings.account.security.passwordDescription') }}</p>
                        </div>
                        <button class="btn btn-outline" @click="showPasswordModal = true">
                          {{ $t('settings.account.security.changePassword') }}
                        </button>
                      </div>
                      
                      <div class="security-item">
                        <div class="security-info">
                          <h4 class="security-label">{{ $t('settings.account.security.twoFactor') }}</h4>
                          <p class="security-description">{{ $t('settings.account.security.twoFactorDescription') }}</p>
                        </div>
                        <div class="security-toggle">
                          <label class="toggle">
                            <input type="checkbox" v-model="securitySettings.twoFactorEnabled" />
                            <span class="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      
                      <div class="security-item">
                        <div class="security-info">
                          <h4 class="security-label">{{ $t('settings.account.security.sessions') }}</h4>
                          <p class="security-description">{{ $t('settings.account.security.sessionsDescription') }}</p>
                        </div>
                        <button class="btn btn-outline">
                          {{ $t('settings.account.security.manageSessions') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Preferences Settings -->
            <div v-show="activeSection === 'preferences'" class="settings-section">
              <div class="section-header">
                <h2 class="section-title">{{ $t('settings.preferences.title') }}</h2>
                <p class="section-description">{{ $t('settings.preferences.description') }}</p>
              </div>

              <div class="settings-cards">
                <!-- Language & Region -->
                <div class="settings-card">
                  <div class="card-header">
                    <h3 class="card-title">{{ $t('settings.preferences.language.title') }}</h3>
                  </div>
                  <div class="card-content">
                    <div class="preference-group">
                      <div class="preference-item">
                        <label class="preference-label">{{ $t('settings.preferences.language.language') }}</label>
                        <select v-model="preferences.language" class="form-select">
                          <option value="bg">Български</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      
                      <div class="preference-item">
                        <label class="preference-label">{{ $t('settings.preferences.language.currency') }}</label>
                        <select v-model="preferences.currency" class="form-select">
                          <option value="EUR">EUR (€)</option>
                          <option value="BGN">BGN (лв.)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Notification Preferences -->
                <div class="settings-card">
                  <div class="card-header">
                    <h3 class="card-title">{{ $t('settings.preferences.notifications.title') }}</h3>
                  </div>
                  <div class="card-content">
                    <div class="notification-options">
                      <div class="notification-item">
                        <div class="notification-info">
                          <h4 class="notification-label">{{ $t('settings.preferences.notifications.email') }}</h4>
                          <p class="notification-description">{{ $t('settings.preferences.notifications.emailDescription') }}</p>
                        </div>
                        <div class="notification-toggle">
                          <label class="toggle">
                            <input type="checkbox" v-model="preferences.notifications.email" />
                            <span class="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      
                      <div class="notification-item">
                        <div class="notification-info">
                          <h4 class="notification-label">{{ $t('settings.preferences.notifications.newMessages') }}</h4>
                          <p class="notification-description">{{ $t('settings.preferences.notifications.newMessagesDescription') }}</p>
                        </div>
                        <div class="notification-toggle">
                          <label class="toggle">
                            <input type="checkbox" v-model="preferences.notifications.newMessages" />
                            <span class="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      
                      <div class="notification-item">
                        <div class="notification-info">
                          <h4 class="notification-label">{{ $t('settings.preferences.notifications.priceAlerts') }}</h4>
                          <p class="notification-description">{{ $t('settings.preferences.notifications.priceAlertsDescription') }}</p>
                        </div>
                        <div class="notification-toggle">
                          <label class="toggle">
                            <input type="checkbox" v-model="preferences.notifications.priceAlerts" />
                            <span class="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      
                      <div class="notification-item">
                        <div class="notification-info">
                          <h4 class="notification-label">{{ $t('settings.preferences.notifications.marketing') }}</h4>
                          <p class="notification-description">{{ $t('settings.preferences.notifications.marketingDescription') }}</p>
                        </div>
                        <div class="notification-toggle">
                          <label class="toggle">
                            <input type="checkbox" v-model="preferences.notifications.marketingEmails" />
                            <span class="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Search Preferences -->
                <div class="settings-card">
                  <div class="card-header">
                    <h3 class="card-title">{{ $t('settings.preferences.search.title') }}</h3>
                  </div>
                  <div class="card-content">
                    <div class="search-preferences">
                      <div class="preference-item">
                        <label class="preference-label">{{ $t('settings.preferences.search.defaultLocation') }}</label>
                        <input
                          v-model="preferences.searchFilters.defaultLocation"
                          type="text"
                          class="form-input"
                          :placeholder="$t('settings.preferences.search.defaultLocationPlaceholder')"
                        />
                      </div>
                      
                      <div class="preference-item">
                        <label class="preference-label">{{ $t('settings.preferences.search.maxPrice') }}</label>
                        <input
                          v-model.number="preferences.searchFilters.maxPrice"
                          type="number"
                          class="form-input"
                          :placeholder="$t('settings.preferences.search.maxPricePlaceholder')"
                        />
                      </div>
                      
                      <div class="preference-item">
                        <label class="preference-label">{{ $t('settings.preferences.search.preferredMakes') }}</label>
                        <div class="makes-selection">
                          <label
                            v-for="make in availableMakes"
                            :key="make"
                            class="make-checkbox"
                          >
                            <input
                              type="checkbox"
                              :value="make"
                              v-model="preferences.searchFilters.preferredMakes"
                            />
                            <span class="make-label">{{ make }}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Privacy Settings -->
            <div v-show="activeSection === 'privacy'" class="settings-section">
              <div class="section-header">
                <h2 class="section-title">{{ $t('settings.privacy.title') }}</h2>
                <p class="section-description">{{ $t('settings.privacy.description') }}</p>
              </div>

              <div class="settings-cards">
                <div class="settings-card">
                  <div class="card-header">
                    <h3 class="card-title">{{ $t('settings.privacy.visibility.title') }}</h3>
                  </div>
                  <div class="card-content">
                    <div class="privacy-options">
                      <div class="privacy-item">
                        <div class="privacy-info">
                          <h4 class="privacy-label">{{ $t('settings.privacy.visibility.email') }}</h4>
                          <p class="privacy-description">{{ $t('settings.privacy.visibility.emailDescription') }}</p>
                        </div>
                        <div class="privacy-toggle">
                          <label class="toggle">
                            <input type="checkbox" v-model="preferences.privacy.showEmail" />
                            <span class="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      
                      <div class="privacy-item">
                        <div class="privacy-info">
                          <h4 class="privacy-label">{{ $t('settings.privacy.visibility.phone') }}</h4>
                          <p class="privacy-description">{{ $t('settings.privacy.visibility.phoneDescription') }}</p>
                        </div>
                        <div class="privacy-toggle">
                          <label class="toggle">
                            <input type="checkbox" v-model="preferences.privacy.showPhone" />
                            <span class="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      
                      <div class="privacy-item">
                        <div class="privacy-info">
                          <h4 class="privacy-label">{{ $t('settings.privacy.visibility.location') }}</h4>
                          <p class="privacy-description">{{ $t('settings.privacy.visibility.locationDescription') }}</p>
                        </div>
                        <div class="privacy-toggle">
                          <label class="toggle">
                            <input type="checkbox" v-model="preferences.privacy.showLocation" />
                            <span class="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      
                      <div class="privacy-item">
                        <div class="privacy-info">
                          <h4 class="privacy-label">{{ $t('settings.privacy.visibility.analytics') }}</h4>
                          <p class="privacy-description">{{ $t('settings.privacy.visibility.analyticsDescription') }}</p>
                        </div>
                        <div class="privacy-toggle">
                          <label class="toggle">
                            <input type="checkbox" v-model="preferences.privacy.allowAnalytics" />
                            <span class="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Data & Storage -->
            <div v-show="activeSection === 'data'" class="settings-section">
              <div class="section-header">
                <h2 class="section-title">{{ $t('settings.data.title') }}</h2>
                <p class="section-description">{{ $t('settings.data.description') }}</p>
              </div>

              <div class="settings-cards">
                <div class="settings-card">
                  <div class="card-header">
                    <h3 class="card-title">{{ $t('settings.data.export.title') }}</h3>
                  </div>
                  <div class="card-content">
                    <div class="data-options">
                      <div class="data-item">
                        <div class="data-info">
                          <h4 class="data-label">{{ $t('settings.data.export.personal') }}</h4>
                          <p class="data-description">{{ $t('settings.data.export.personalDescription') }}</p>
                        </div>
                        <button class="btn btn-outline">
                          <Icon name="download" class="btn-icon" />
                          {{ $t('settings.data.export.download') }}
                        </button>
                      </div>
                      
                      <div class="data-item">
                        <div class="data-info">
                          <h4 class="data-label">{{ $t('settings.data.export.listings') }}</h4>
                          <p class="data-description">{{ $t('settings.data.export.listingsDescription') }}</p>
                        </div>
                        <button class="btn btn-outline">
                          <Icon name="download" class="btn-icon" />
                          {{ $t('settings.data.export.download') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="settings-card danger-card">
                  <div class="card-header">
                    <h3 class="card-title">{{ $t('settings.data.danger.title') }}</h3>
                  </div>
                  <div class="card-content">
                    <div class="danger-zone">
                      <div class="danger-item">
                        <div class="danger-info">
                          <h4 class="danger-label">{{ $t('settings.data.danger.deleteAccount') }}</h4>
                          <p class="danger-description">{{ $t('settings.data.danger.deleteAccountDescription') }}</p>
                        </div>
                        <button class="btn btn-danger" @click="showDeleteModal = true">
                          <Icon name="trash" class="btn-icon" />
                          {{ $t('settings.data.danger.delete') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <PasswordChangeModal v-model="showPasswordModal" />
    <AccountDeleteModal v-model="showDeleteModal" />
    
    <!-- Save Toast -->
    <Toast
      v-model="showSaveToast"
      :type="saveToastType"
      :message="saveToastMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import Icon from '@/components/ui/Icon.vue'
import PasswordChangeModal from '@/components/modals/PasswordChangeModal.vue'
import AccountDeleteModal from '@/components/modals/AccountDeleteModal.vue'
import Toast from '@/components/ui/Toast.vue'

// Composables
const { t } = useI18n()
const userStore = useUserStore()
const { user, profile } = storeToRefs(userStore)

// State
const activeSection = ref('account')
const isLoading = ref(false)
const showPasswordModal = ref(false)
const showDeleteModal = ref(false)
const showSaveToast = ref(false)
const saveToastType = ref<'success' | 'error'>('success')
const saveToastMessage = ref('')

// Forms
const profileForm = reactive({
  displayName: '',
  phoneNumber: '',
  bio: '',
  businessName: '',
  website: ''
})

const securitySettings = reactive({
  twoFactorEnabled: false,
  sessionManagement: true
})

const preferences = reactive({
  language: 'bg' as 'bg' | 'en',
  currency: 'EUR' as 'EUR',
  notifications: {
    email: true,
    inApp: true,
    newMessages: true,
    listingUpdates: true,
    priceAlerts: true,
    marketingEmails: false
  },
  searchFilters: {
    defaultLocation: '',
    maxPrice: undefined as number | undefined,
    preferredMakes: [] as string[]
  },
  privacy: {
    showEmail: false,
    showPhone: true,
    showLocation: true,
    allowAnalytics: true
  }
})

// Constants
const settingsSections = [
  { id: 'account', label: 'settings.nav.account', icon: 'user' },
  { id: 'preferences', label: 'settings.nav.preferences', icon: 'settings' },
  { id: 'privacy', label: 'settings.nav.privacy', icon: 'shield' },
  { id: 'data', label: 'settings.nav.data', icon: 'database' }
]

const availableMakes = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Ford', 
  'Opel', 'Renault', 'Peugeot', 'Hyundai', 'Toyota'
]

// Methods
const setActiveSection = (section: string) => {
  activeSection.value = section
}

const updateProfile = async () => {
  try {
    isLoading.value = true
    await userStore.updateUserProfile(profileForm)
    showSuccessToast(t('settings.messages.profileUpdated'))
  } catch (error) {
    showErrorToast(t('settings.messages.profileUpdateError'))
  } finally {
    isLoading.value = false
  }
}

const updatePreferences = async () => {
  try {
    await userStore.updatePreferences(preferences)
    showSuccessToast(t('settings.messages.preferencesUpdated'))
  } catch (error) {
    showErrorToast(t('settings.messages.preferencesUpdateError'))
  }
}

const showSuccessToast = (message: string) => {
  saveToastType.value = 'success'
  saveToastMessage.value = message
  showSaveToast.value = true
}

const showErrorToast = (message: string) => {
  saveToastType.value = 'error'
  saveToastMessage.value = message
  showSaveToast.value = true
}

const loadUserData = () => {
  if (profile.value) {
    profileForm.displayName = profile.value.displayName || ''
    profileForm.phoneNumber = profile.value.phoneNumber || ''
    // Load other profile data...
  }
}

// Watchers
watch([preferences], updatePreferences, { deep: true })

// Lifecycle
onMounted(() => {
  loadUserData()
})
</script>

<style scoped lang="scss">
.settings-view {
  min-height: 100vh;
  background: var(--color-background);
}

.settings-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  padding: 2rem 0;
  
  .header-content {
    text-align: center;
  }
  
  .settings-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    
    .title-icon {
      width: 2.5rem;
      height: 2.5rem;
    }
  }
  
  .settings-subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0;
  }
}

.settings-content {
  padding: 2rem 0;
}

.settings-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;
}

.settings-nav {
  .nav-menu {
    background: white;
    border-radius: 12px;
    box-shadow: var(--shadow-md);
    overflow: hidden;
    position: sticky;
    top: 2rem;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    transition: all 0.2s ease;
    cursor: pointer;
    border-bottom: 1px solid var(--color-border);
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background: var(--color-background);
    }
    
    &.active {
      background: var(--color-primary-light);
      color: var(--color-primary);
      
      .nav-icon {
        color: var(--color-primary);
      }
    }
  }
  
  .nav-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-text-secondary);
  }
  
  .nav-label {
    flex: 1;
    font-weight: 500;
  }
  
  .nav-arrow {
    width: 1rem;
    height: 1rem;
    color: var(--color-text-secondary);
    transition: transform 0.2s ease;
  }
  
  .nav-item.active .nav-arrow {
    transform: rotate(90deg);
  }
}

.settings-main {
  .settings-section {
    .section-header {
      margin-bottom: 2rem;
      
      .section-title {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--color-text-primary);
      }
      
      .section-description {
        color: var(--color-text-secondary);
        margin: 0;
        font-size: 1.1rem;
      }
    }
  }
}

.settings-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-card {
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  
  &.danger-card {
    border: 2px solid var(--color-danger-light);
    
    .card-header {
      background: var(--color-danger-light);
      color: var(--color-danger);
    }
  }
  
  .card-header {
    padding: 1.5rem;
    background: var(--color-background);
    border-bottom: 1px solid var(--color-border);
    
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }
  }
  
  .card-content {
    padding: 1.5rem;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  .full-width {
    grid-column: 1 / -1;
  }
}

.form-group {
  .form-label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
  }
  
  .form-input,
  .form-textarea,
  .form-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }
    
    &:disabled {
      background: var(--color-background);
      cursor: not-allowed;
    }
  }
  
  .form-help {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
}

.form-actions {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-icon {
    width: 1rem;
    height: 1rem;
    
    &.spinning {
      animation: spin 1s linear infinite;
    }
  }
  
  &.btn-primary {
    background: var(--color-primary);
    color: white;
    
    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
    }
  }
  
  &.btn-outline {
    border-color: var(--color-border);
    color: var(--color-text-primary);
    
    &:hover {
      background: var(--color-background);
    }
  }
  
  &.btn-danger {
    background: var(--color-danger);
    color: white;
    
    &:hover {
      background: var(--color-danger-dark);
    }
  }
}

.security-options,
.notification-options,
.privacy-options,
.data-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.security-item,
.notification-item,
.privacy-item,
.data-item,
.danger-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--color-background);
  border-radius: 8px;
  gap: 1rem;
}

.security-info,
.notification-info,
.privacy-info,
.data-info,
.danger-info {
  flex: 1;
  
  h4 {
    margin: 0 0 0.25rem 0;
    font-weight: 500;
    color: var(--color-text-primary);
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
}

.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color-border);
    transition: 0.2s;
    border-radius: 24px;
    
    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 2px;
      bottom: 2px;
      background: white;
      transition: 0.2s;
      border-radius: 50%;
    }
  }
  
  input:checked + .toggle-slider {
    background: var(--color-primary);
  }
  
  input:checked + .toggle-slider:before {
    transform: translateX(20px);
  }
}

.preference-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preference-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  .preference-label {
    font-weight: 500;
    color: var(--color-text-primary);
  }
}

.makes-selection {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  
  .make-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--color-background);
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;
    
    &:hover {
      background: var(--color-primary-light);
    }
    
    input[type="checkbox"] {
      margin: 0;
    }
    
    .make-label {
      font-size: 0.875rem;
    }
  }
}

.danger-zone {
  .danger-item {
    background: var(--color-danger-light);
    border: 1px solid var(--color-danger);
  }
  
  .danger-info {
    h4 {
      color: var(--color-danger);
    }
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// Responsive Design
@media (max-width: 1024px) {
  .settings-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .settings-nav {
    order: 2;
    
    .nav-menu {
      position: static;
    }
  }
  
  .settings-main {
    order: 1;
  }
}

@media (max-width: 768px) {
  .settings-header {
    padding: 1.5rem 0;
    
    .settings-title {
      font-size: 2rem;
    }
  }
  
  .settings-content {
    padding: 1rem 0;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .makes-selection {
    grid-template-columns: 1fr;
  }
}
</style>
