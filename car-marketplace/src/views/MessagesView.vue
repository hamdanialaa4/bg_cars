<template>
  <div class="messages-view">
    <MessagingSystem />
  </div>
</template>

<script>
import MessagingSystem from '../components/MessagingSystem.vue'

export default {
  name: 'MessagesView',
  components: {
    MessagingSystem
  }
}
</script>

<style scoped>
.messages-view {
  min-height: 100vh;
}
</style>
