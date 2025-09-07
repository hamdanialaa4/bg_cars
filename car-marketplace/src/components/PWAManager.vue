<template>
  <div class="pwa-manager">
    <!-- PWA Install Prompt -->
    <div v-if="showInstallPrompt && !isInstalled" class="install-prompt glass-effect">
      <div class="install-content">
        <i class="fas fa-mobile-alt"></i>
        <div class="install-text">
          <h3 class="install-title">{{ t('installApp') }}</h3>
          <p class="install-description">{{ t('installDescription') }}</p>
        </div>
        <div class="install-actions">
          <button @click="installPWA" class="btn-install">
            {{ t('install') }}
          </button>
          <button @click="dismissInstallPrompt" class="btn-dismiss">
            {{ t('later') }}
          </button>
        </div>
      </div>
    </div>

    <!-- PWA Status -->
    <div v-if="isInstalled" class="pwa-status">
      <div class="status-indicator online">
        <i class="fas fa-check-circle"></i>
        <span>{{ t('appInstalled') }}</span>
      </div>
    </div>

    <!-- Offline Indicator -->
    <div v-if="!isOnline" class="offline-indicator">
      <div class="status-indicator offline">
        <i class="fas fa-wifi-slash"></i>
        <span>{{ t('offlineMode') }}</span>
      </div>
    </div>

    <!-- Update Available -->
    <div v-if="updateAvailable" class="update-prompt glass-effect">
      <div class="update-content">
        <i class="fas fa-sync-alt"></i>
        <div class="update-text">
          <h3 class="update-title">{{ t('updateAvailable') }}</h3>
          <p class="update-description">{{ t('updateDescription') }}</p>
        </div>
        <div class="update-actions">
          <button @click="updateApp" class="btn-update">
            {{ t('update') }}
          </button>
          <button @click="dismissUpdate" class="btn-dismiss">
            {{ t('later') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../utils/i18n'

export default {
  name: 'PWAManager',
  setup() {
    const { t } = useI18n()

    const showInstallPrompt = ref(false)
    const isInstalled = ref(false)
    const isOnline = ref(navigator.onLine)
    const updateAvailable = ref(false)
    const deferredPrompt = ref(null)

    // Check if app is already installed
    const checkInstallStatus = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        isInstalled.value = true
      } else if (window.navigator.standalone === true) {
        isInstalled.value = true
      } else {
        isInstalled.value = false
      }
    }

    // Handle install prompt
    const handleInstallPrompt = (event) => {
      event.preventDefault()
      deferredPrompt.value = event
      showInstallPrompt.value = true
    }

    // Install PWA
    const installPWA = async () => {
      if (!deferredPrompt.value) return

      deferredPrompt.value.prompt()
      const { outcome } = await deferredPrompt.value.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
        isInstalled.value = true
      }

      deferredPrompt.value = null
      showInstallPrompt.value = false
    }

    // Dismiss install prompt
    const dismissInstallPrompt = () => {
      showInstallPrompt.value = false
      // Store dismissal in localStorage to not show again for some time
      localStorage.setItem('pwaInstallDismissed', Date.now().toString())
    }

    // Handle online/offline status
    const handleOnlineStatus = () => {
      isOnline.value = navigator.onLine
    }

    // Check for updates
    const checkForUpdates = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                updateAvailable.value = true
              }
            })
          }
        })
      }
    }

    // Update app
    const updateApp = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
          window.location.reload()
        }
      }
    }

    // Dismiss update
    const dismissUpdate = () => {
      updateAvailable.value = false
    }

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          console.log('Service Worker registered:', registration)

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  updateAvailable.value = true
                }
              })
            }
          })

          // Handle service worker messages
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
              updateAvailable.value = true
            }
          })

        } catch (error) {
          console.error('Service Worker registration failed:', error)
        }
      }
    }

    // Handle beforeinstallprompt
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      deferredPrompt.value = event

      // Check if user has dismissed before
      const dismissedTime = localStorage.getItem('pwaInstallDismissed')
      if (dismissedTime) {
        const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24)
        if (daysSinceDismissed < 7) return // Don't show again for 7 days
      }

      showInstallPrompt.value = true
    }

    onMounted(() => {
      checkInstallStatus()
      registerServiceWorker()
      checkForUpdates()

      // Listen for install prompt
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

      // Listen for online/offline events
      window.addEventListener('online', handleOnlineStatus)
      window.addEventListener('offline', handleOnlineStatus)

      // Listen for app installed
      window.addEventListener('appinstalled', () => {
        isInstalled.value = true
        showInstallPrompt.value = false
      })
    })

    onUnmounted(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    })

    return {
      showInstallPrompt,
      isInstalled,
      isOnline,
      updateAvailable,
      t,
      installPWA,
      dismissInstallPrompt,
      updateApp,
      dismissUpdate
    }
  }
}
</script>

<style scoped>
.pwa-manager {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
}

.install-prompt,
.update-prompt {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  min-width: 300px;
  max-width: 90vw;
  pointer-events: all;
  animation: slideDown 0.3s ease-out;
}

.install-content,
.update-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.install-content i,
.update-content i {
  font-size: 2rem;
  color: #667eea;
  flex-shrink: 0;
}

.install-text,
.update-text {
  flex: 1;
}

.install-title,
.update-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.install-description,
.update-description {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin: 0;
}

.install-actions,
.update-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-install,
.btn-update {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-install:hover,
.btn-update:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.btn-dismiss {
  padding: 0.5rem 1rem;
  background: rgba(127, 140, 141, 0.1);
  color: #7f8c8d;
  border: 1px solid rgba(127, 140, 141, 0.2);
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-dismiss:hover {
  background: rgba(127, 140, 141, 0.2);
}

.pwa-status,
.offline-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

.status-indicator.online {
  background: rgba(39, 174, 96, 0.1);
  color: #27ae60;
  border: 1px solid rgba(39, 174, 96, 0.2);
}

.status-indicator.offline {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.2);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .install-prompt,
  .update-prompt {
    left: 10px;
    right: 10px;
    transform: none;
    min-width: auto;
  }

  .install-content,
  .update-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .install-actions,
  .update-actions {
    justify-content: center;
  }

  .pwa-status,
  .offline-indicator {
    top: 10px;
    right: 10px;
  }
}
</style>
