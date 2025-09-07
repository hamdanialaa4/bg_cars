<template>
  <div class="news-view">
    <NewsSection />
  </div>
</template>

<script>
import NewsSection from '../components/NewsSection.vue'

export default {
  name: 'NewsView',
  components: {
    NewsSection
  }
}
</script>

<style scoped>
.news-view {
  min-height: 100vh;
}
</style>
