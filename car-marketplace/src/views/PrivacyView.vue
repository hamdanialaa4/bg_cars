<template>
  <div class="privacy-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8">{{ t('privacyPolicy') }}</h1>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4">{{ t('privacyPolicy') }}</h2>
          <div class="prose max-w-none">
            <p class="text-gray-700 mb-4">{{ t('privacyIntro') }}</p>
            <h3 class="text-lg font-semibold mb-2">{{ t('dataCollection') }}</h3>
            <p class="text-gray-700 mb-4">{{ t('dataCollectionDesc') }}</p>
            <h3 class="text-lg font-semibold mb-2">{{ t('dataUsage') }}</h3>
            <p class="text-gray-700 mb-4">{{ t('dataUsageDesc') }}</p>
            <h3 class="text-lg font-semibold mb-2">{{ t('contactUs') }}</h3>
            <p class="text-gray-700">{{ t('privacyContact') }}</p>
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
.privacy-page {
  min-height: 60vh;
}
</style>
