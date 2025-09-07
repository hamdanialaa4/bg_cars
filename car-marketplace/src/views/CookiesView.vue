<template>
  <div class="cookies-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8">{{ t('cookiePolicy') }}</h1>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4">{{ t('cookiePolicy') }}</h2>
          <div class="prose max-w-none">
            <p class="text-gray-700 mb-4">{{ t('cookiesIntro') }}</p>
            <h3 class="text-lg font-semibold mb-2">{{ t('whatAreCookies') }}</h3>
            <p class="text-gray-700 mb-4">{{ t('cookiesDefinition') }}</p>
            <h3 class="text-lg font-semibold mb-2">{{ t('howWeUseCookies') }}</h3>
            <p class="text-gray-700 mb-4">{{ t('cookiesUsage') }}</p>
            <h3 class="text-lg font-semibold mb-2">{{ t('managingCookies') }}</h3>
            <p class="text-gray-700">{{ t('cookiesManagement') }}</p>
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
.cookies-page {
  min-height: 60vh;
}
</style>
