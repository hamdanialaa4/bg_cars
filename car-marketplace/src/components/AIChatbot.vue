<template>
  <div class="ai-chatbot" :class="{ active: isOpen }">
    <!-- Chatbot Toggle Button -->
    <button @click="toggleChatbot" class="chatbot-toggle" :class="{ active: isOpen }">
      <i v-if="!isOpen" class="fas fa-robot"></i>
      <i v-else class="fas fa-times"></i>
    </button>

    <!-- Chatbot Window -->
    <div v-if="isOpen" class="chatbot-window glass-effect">
      <!-- Header -->
      <div class="chatbot-header">
        <div class="chatbot-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="chatbot-info">
          <h3 class="chatbot-name">{{ t('aiAssistant') }}</h3>
          <span class="chatbot-status">{{ isTyping ? t('typing') : t('online') }}</span>
        </div>
        <button @click="toggleChatbot" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Messages -->
      <div class="chatbot-messages" ref="messagesRef">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message"
          :class="{ 'user-message': message.sender === 'user', 'bot-message': message.sender === 'bot' }"
        >
          <div class="message-avatar">
            <i v-if="message.sender === 'user'" class="fas fa-user"></i>
            <i v-else class="fas fa-robot"></i>
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="typing-indicator">
          <div class="typing-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div v-if="showQuickActions" class="quick-actions">
        <button
          v-for="action in quickActions"
          :key="action.id"
          @click="sendQuickMessage(action.text)"
          class="quick-action-btn"
        >
          {{ action.label }}
        </button>
      </div>

      <!-- Input -->
      <div class="chatbot-input">
        <input
          v-model="inputMessage"
          @keypress.enter="sendMessage"
          :placeholder="t('typeYourMessage')"
          class="message-input"
          :disabled="isTyping"
        >
        <button @click="sendMessage" class="send-btn" :disabled="!inputMessage.trim() || isTyping">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useI18n } from '../utils/i18n'

export default {
  name: 'AIChatbot',
  setup() {
    const { t } = useI18n()

    const isOpen = ref(false)
    const isTyping = ref(false)
    const showQuickActions = ref(true)
    const inputMessage = ref('')
    const messages = ref([])
    const messagesRef = ref(null)

    const quickActions = ref([
      { id: 1, label: t('findCarsByPrice'), text: 'أريد سيارة بسعر معين' },
      { id: 2, label: t('findCarsByMake'), text: 'أريد سيارة ماركة معينة' },
      { id: 3, label: t('carRecommendations'), text: 'أريد توصيات لسيارات' },
      { id: 4, label: t('helpWithPurchase'), text: 'مساعدة في شراء سيارة' }
    ])

    const welcomeMessage = {
      id: 1,
      sender: 'bot',
      text: t('welcomeMessage'),
      timestamp: new Date()
    }

    const toggleChatbot = () => {
      isOpen.value = !isOpen.value
      if (isOpen.value && messages.value.length === 0) {
        messages.value.push(welcomeMessage)
      }
    }

    const sendMessage = async () => {
      if (!inputMessage.value.trim()) return

      const userMessage = {
        id: Date.now(),
        sender: 'user',
        text: inputMessage.value.trim(),
        timestamp: new Date()
      }

      messages.value.push(userMessage)
      const userInput = inputMessage.value.trim()
      inputMessage.value = ''
      showQuickActions.value = false

      await nextTick()
      scrollToBottom()

      // Simulate bot typing
      isTyping.value = true
      setTimeout(async () => {
        const botResponse = await generateBotResponse(userInput)
        messages.value.push(botResponse)
        isTyping.value = false

        await nextTick()
        scrollToBottom()
      }, 1000 + Math.random() * 2000) // Random delay between 1-3 seconds
    }

    const sendQuickMessage = async (text) => {
      inputMessage.value = text
      await sendMessage()
    }

    const generateBotResponse = async (userInput) => {
      // Simple AI responses based on keywords
      const input = userInput.toLowerCase()

      let responseText = ''

      if (input.includes('سعر') || input.includes('price')) {
        responseText = t('priceResponse')
      } else if (input.includes('مارك') || input.includes('make') || input.includes('brand')) {
        responseText = t('makeResponse')
      } else if (input.includes('توصي') || input.includes('recommend')) {
        responseText = t('recommendationResponse')
      } else if (input.includes('مساعد') || input.includes('help')) {
        responseText = t('helpResponse')
      } else if (input.includes('مرحبا') || input.includes('hello') || input.includes('hi')) {
        responseText = t('greetingResponse')
      } else {
        responseText = t('defaultResponse')
      }

      return {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
        timestamp: new Date()
      }
    }

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('bg-BG', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const scrollToBottom = () => {
      if (messagesRef.value) {
        messagesRef.value.scrollTop = messagesRef.value.scrollHeight
      }
    }

    // Auto-scroll when new messages are added
    watch(messages, () => {
      nextTick(() => {
        scrollToBottom()
      })
    }, { deep: true })

    onMounted(() => {
      // Initialize chatbot
    })

    return {
      isOpen,
      isTyping,
      showQuickActions,
      inputMessage,
      messages,
      messagesRef,
      quickActions,
      t,
      toggleChatbot,
      sendMessage,
      sendQuickMessage,
      formatTime
    }
  }
}
</script>

<style scoped>
.ai-chatbot {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chatbot-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.chatbot-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
}

.chatbot-toggle.active {
  background: #e74c3c;
}

.chatbot-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chatbot-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 16px 16px 0 0;
}

.chatbot-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.chatbot-info {
  flex: 1;
}

.chatbot-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.25rem;
}

.chatbot-status {
  font-size: 0.8rem;
  opacity: 0.8;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chatbot-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 0.75rem;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.bot-message {
  align-self: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background: #667eea;
  color: white;
}

.bot-message .message-avatar {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.message-content {
  background: white;
  padding: 0.75rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-message .message-content {
  background: #667eea;
  color: white;
}

.message-text {
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.message-time {
  font-size: 0.7rem;
  opacity: 0.7;
}

.typing-indicator {
  display: flex;
  gap: 0.75rem;
  align-self: flex-start;
  max-width: 80%;
}

.typing-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #667eea;
  flex-shrink: 0;
}

.typing-dots {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: white;
  padding: 0.75rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #667eea;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.quick-actions {
  padding: 0 1rem 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quick-action-btn {
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  background: #667eea;
  color: white;
}

.chatbot-input {
  display: flex;
  padding: 1rem;
  gap: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.message-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e1e5e9;
  border-radius: 20px;
  outline: none;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.message-input:focus {
  border-color: #667eea;
}

.message-input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

/* Mobile Styles */
@media (max-width: 480px) {
  .ai-chatbot {
    bottom: 10px;
    right: 10px;
  }

  .chatbot-window {
    width: calc(100vw - 20px);
    height: calc(100vh - 100px);
    bottom: 70px;
    right: 10px;
  }

  .chatbot-toggle {
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }
}
</style>
