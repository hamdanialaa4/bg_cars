<template>
  <div class="help-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8">{{ t('help') }}</h1>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4">{{ t('helpCenter') }}</h2>
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">{{ t('gettingStarted') }}</h3>
              <p class="text-gray-700">{{ t('gettingStartedDesc') }}</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-2">{{ t('faq') }}</h3>
              <p class="text-gray-700">{{ t('faqDesc') }}</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-2">{{ t('contactSupport') }}</h3>
              <p class="text-gray-700">{{ t('contactSupportDesc') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.help-page {
  min-height: 60vh;
}
</style>
