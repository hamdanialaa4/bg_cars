<template>
  <div class="terms-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8">{{ t('termsOfService') }}</h1>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4">{{ t('termsOfService') }}</h2>
          <div class="prose max-w-none">
            <p class="text-gray-700 mb-4">{{ t('termsIntro') }}</p>
            <h3 class="text-lg font-semibold mb-2">{{ t('userResponsibilities') }}</h3>
            <p class="text-gray-700 mb-4">{{ t('userResponsibilitiesDesc') }}</p>
            <h3 class="text-lg font-semibold mb-2">{{ t('serviceUsage') }}</h3>
            <p class="text-gray-700 mb-4">{{ t('serviceUsageDesc') }}</p>
            <h3 class="text-lg font-semibold mb-2">{{ t('contactUs') }}</h3>
            <p class="text-gray-700">{{ t('termsContact') }}</p>
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
.terms-page {
  min-height: 60vh;
}
</style>
