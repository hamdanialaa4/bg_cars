<template>
  <div class="about-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8">{{ t('about') }}</h1>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4">{{ t('aboutUs') }}</h2>
          <p class="text-gray-700 mb-4">
            {{ t('aboutDescription') }}
          </p>
          <p class="text-gray-700 mb-4">
            {{ t('aboutMission') }}
          </p>
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
.about-page {
  min-height: 60vh;
}
</style>
