<template>
  <div class="comparison-view">
    <CarComparison />
  </div>
</template>

<script>
import CarComparison from '../components/CarComparison.vue'

export default {
  name: 'ComparisonView',
  components: {
    CarComparison
  }
}
</script>

<style scoped>
.comparison-view {
  min-height: 100vh;
}
</style>
