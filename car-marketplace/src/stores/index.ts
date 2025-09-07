// File: src/stores/index.ts
/**
 * نظام إدارة الحالة المتقدم لمنصة BG Cars Platform
 * يستخدم Pinia مع دعم للـ TypeScript والمزامنة
 */

import { createPinia } from 'pinia'
import { markRaw } from 'vue'
import type { Router } from 'vue-router'

// Store plugins
import { piniaPluginPersistedstate } from 'pinia-plugin-persistedstate'

// Create main pinia instance
export const pinia = createPinia()

// Add persistence plugin
pinia.use(piniaPluginPersistedstate)

// Router plugin for stores
export function piniaRouterPlugin(router: Router) {
  return () => {
    pinia.use(({ store }) => {
      store.router = markRaw(router)
    })
  }
}

// Re-export all stores
export { useUserStore } from './userStore'
export { useListingsStore } from './listingsStore'
export { useSearchStore } from './searchStore'
export { useNotificationsStore } from './notificationsStore'
export { useUIStore } from './uiStore'
export { useAnalyticsStore } from './analyticsStore'
export { useSettingsStore } from './settingsStore'
export { useConversationsStore } from './conversationsStore'
export { useCarMindStore } from './carMindStore'

export default pinia
