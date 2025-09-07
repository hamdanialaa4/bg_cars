<template>
  <div class="app-layout">
    <!-- Navigation -->
    <Navbar />

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- AI Chatbot -->
    <AIChatbot />
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import AIChatbot from '../AIChatbot.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  margin-top: 70px; /* Height of navbar */
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 70px);
}

.main-content > * {
  min-height: 100%;
}
</style>
