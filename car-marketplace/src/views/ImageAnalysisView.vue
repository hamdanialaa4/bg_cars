<template>
  <div class="image-analysis-page">
    <ImageAnalyzer />
  </div>
</template>

<script>
import ImageAnalyzer from '../components/ImageAnalyzer.vue'

export default {
  name: 'ImageAnalysisView',
  components: {
    ImageAnalyzer
  }
}
</script>

<style scoped>
.image-analysis-page {
  min-height: 100vh;
}
</style>
