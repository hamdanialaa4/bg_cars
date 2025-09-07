<template>
  <div id="app">
    <PWAManager />
    <AppLayout />
  </div>
</template>

<script setup lang="ts">
import AppLayout from './components/layout/AppLayout.vue'
import PWAManager from './components/PWAManager.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}
</style>
