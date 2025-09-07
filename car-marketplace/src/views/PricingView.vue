<template>
  <div class="pricing-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8">{{ t('pricing') }}</h1>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4">{{ t('pricingPlans') }}</h2>
          <p class="text-gray-700 mb-4">
            {{ t('pricingDescription') }}
          </p>
          <div class="grid md:grid-cols-3 gap-6 mt-8">
            <div class="border rounded-lg p-6 text-center">
              <h3 class="text-xl font-semibold mb-2">{{ t('basicPlan') }}</h3>
              <p class="text-2xl font-bold text-blue-600 mb-4">Free</p>
              <ul class="text-sm text-gray-600">
                <li>{{ t('basicFeatures') }}</li>
              </ul>
            </div>
            <div class="border rounded-lg p-6 text-center bg-blue-50">
              <h3 class="text-xl font-semibold mb-2">{{ t('premiumPlan') }}</h3>
              <p class="text-2xl font-bold text-blue-600 mb-4">€9.99/month</p>
              <ul class="text-sm text-gray-600">
                <li>{{ t('premiumFeatures') }}</li>
              </ul>
            </div>
            <div class="border rounded-lg p-6 text-center">
              <h3 class="text-xl font-semibold mb-2">{{ t('enterprisePlan') }}</h3>
              <p class="text-2xl font-bold text-blue-600 mb-4">{{ t('contactUs') }}</p>
              <ul class="text-sm text-gray-600">
                <li>{{ t('enterpriseFeatures') }}</li>
              </ul>
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
.pricing-page {
  min-height: 60vh;
}
</style>
