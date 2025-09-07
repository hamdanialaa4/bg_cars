<!-- File: src/components/ai/CarMindAssistant.vue -->
<template>
  <div class="carmind-assistant" :class="{ 'expanded': isExpanded }">
    <!-- أيقونة الذكاء الاصطناعي العائمة -->
    <div class="ai-avatar" @click="toggleExpansion" v-if="!isExpanded">
      <div class="avatar-icon">
        <i class="fas fa-robot"></i>
      </div>
      <div class="pulsing-indicator" v-if="hasNewSuggestions"></div>
      <div class="typing-indicator" v-if="isTyping">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <!-- واجهة المحادثة الكاملة -->
    <div class="chat-interface" v-if="isExpanded">
      <!-- رأس المحادثة -->
      <div class="chat-header">
        <div class="ai-info">
          <div class="ai-avatar-small">
            <i class="fas fa-robot"></i>
          </div>
          <div class="ai-details">
            <h4>CarMind AI</h4>
            <span class="ai-status">{{ aiStatus }}</span>
          </div>
        </div>
        <div class="chat-controls">
          <button @click="clearChat" class="btn-icon" title="Clear chat">
            <i class="fas fa-trash"></i>
          </button>
          <button @click="toggleExpansion" class="btn-icon" title="Minimize">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- منطقة المحادثة -->
      <div class="chat-messages" ref="messagesContainer">
        <!-- رسالة الترحيب -->
        <div class="message ai-message" v-if="messages.length === 0">
          <div class="message-content">
            <p>{{ $t('ai.welcome') }}</p>
            <div class="quick-suggestions">
              <button 
                v-for="suggestion in quickSuggestions" 
                :key="suggestion.id"
                @click="askQuestion(suggestion.question)"
                class="suggestion-btn"
              >
                {{ suggestion.text }}
              </button>
            </div>
          </div>
        </div>

        <!-- الرسائل -->
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="message"
          :class="{ 'user-message': message.role === 'user', 'ai-message': message.role === 'assistant' }"
        >
          <div class="message-content">
            <p v-html="formatMessage(message.content)"></p>
            
            <!-- التوصيات العملية -->
            <div v-if="message.recommendations && message.recommendations.length" class="recommendations">
              <h5>{{ $t('ai.recommendations') }}</h5>
              <div 
                v-for="rec in message.recommendations" 
                :key="rec.type"
                class="recommendation-card"
              >
                <div class="rec-header">
                  <i :class="getRecommendationIcon(rec.type)"></i>
                  <span>{{ rec.title }}</span>
                </div>
                <div class="rec-items">
                  <div 
                    v-for="item in rec.items" 
                    :key="item.id"
                    class="rec-item"
                    @click="handleRecommendationClick(rec.action, item)"
                  >
                    <span>{{ item.name }}</span>
                    <span class="item-details">{{ item.details }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- أسئلة المتابعة -->
            <div v-if="message.followUpQuestions && message.followUpQuestions.length" class="follow-up">
              <p class="follow-up-label">{{ $t('ai.mightAlsoAsk') }}</p>
              <div class="follow-up-questions">
                <button 
                  v-for="question in message.followUpQuestions"
                  :key="question"
                  @click="askQuestion(question)"
                  class="follow-up-btn"
                >
                  {{ question }}
                </button>
              </div>
            </div>
          </div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>

        <!-- مؤشر الكتابة -->
        <div v-if="isTyping" class="message ai-message typing">
          <div class="typing-indicator-large">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- منطقة الإدخال -->
      <div class="chat-input">
        <div class="input-container">
          <input 
            v-model="currentMessage"
            @keyup.enter="sendMessage"
            :placeholder="$t('ai.inputPlaceholder')"
            :disabled="isTyping"
            class="message-input"
            ref="messageInput"
          >
          <button 
            @click="sendMessage" 
            :disabled="!currentMessage.trim() || isTyping"
            class="send-btn"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        
        <!-- اقتراحات سريعة -->
        <div class="quick-actions" v-if="contextualSuggestions.length">
          <button 
            v-for="suggestion in contextualSuggestions"
            :key="suggestion.id"
            @click="askQuestion(suggestion.question)"
            class="quick-action-btn"
          >
            <i :class="suggestion.icon"></i>
            {{ suggestion.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCarMindAI } from '@/services/ai/CarMindAI/core'
import { useUserStore } from '@/stores/user'
import { useGeolocation } from '@vueuse/core'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const carMindAI = useCarMindAI()
const userStore = useUserStore()
const { coords } = useGeolocation()

const isExpanded = ref(false)
const isTyping = ref(false)
const currentMessage = ref('')
const messages = ref([])
const messagesContainer = ref(null)
const messageInput = ref(null)
const hasNewSuggestions = ref(false)

const aiStatus = computed(() => {
  if (isTyping.value) return t('ai.status.thinking')
  if (carMindAI.isProcessing.value) return t('ai.status.analyzing')
  return t('ai.status.ready')
})

const quickSuggestions = ref([
  {
    id: 1,
    text: t('ai.suggestions.priceCheck'),
    question: 'Каква е справедливата цена за BMW X5 от 2020 година?',
    icon: 'fas fa-calculator'
  },
  {
    id: 2,
    text: t('ai.suggestions.nearbyServices'),
    question: 'Къде мога да намеря сервиз за Mercedes в София?',
    icon: 'fas fa-map-marker-alt'
  },
  {
    id: 3,
    text: t('ai.suggestions.buyingAdvice'),
    question: 'Какво трябва да проверя преди да купя употребявана кола?',
    icon: 'fas fa-clipboard-check'
  },
  {
    id: 4,
    text: t('ai.suggestions.marketTrends'),
    question: 'Какви са тенденциите на пазара през този сезон?',
    icon: 'fas fa-chart-line'
  }
])

const contextualSuggestions = computed(() => {
  const suggestions = []
  
  // اقتراحات بناءً على الصفحة الحالية
  if (route.name === 'CarDetails') {
    suggestions.push({
      id: 'price_compare',
      text: t('ai.contextual.comparePrice'),
      question: `Сравни цената на тази кола с пазара`,
      icon: 'fas fa-balance-scale'
    })
    
    suggestions.push({
      id: 'inspection_tips',
      text: t('ai.contextual.inspectionTips'),
      question: 'Какво да проверя при този модел кола?',
      icon: 'fas fa-search'
    })
  }
  
  if (route.name === 'Search') {
    suggestions.push({
      id: 'refine_search',
      text: t('ai.contextual.refineSearch'),
      question: 'Как да подобря търсенето си?',
      icon: 'fas fa-filter'
    })
  }
  
  return suggestions
})

const toggleExpansion = () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    nextTick(() => {
      messageInput.value?.focus()
    })
  }
}

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isTyping.value) return
  
  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: currentMessage.value,
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  const question = currentMessage.value
  currentMessage.value = ''
  
  // تمرير المحادثة للأسفل
  scrollToBottom()
  
  // بدء مؤشر الكتابة
  isTyping.value = true
  
  try {
    // بناء سياق المستخدم
    const userContext = {
      userId: userStore.currentUser?.uid,
      location: coords.value ? {
        city: await getCityFromCoordinates(coords.value.latitude, coords.value.longitude),
        coordinates: { lat: coords.value.latitude, lng: coords.value.longitude }
      } : undefined,
      preferences: userStore.preferences,
      currentPage: route.name,
      deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop'
    }
    
    // معالجة السؤال بواسطة الذكاء الاصطناعي
    const aiResponse = await carMindAI.processUserQuery(
      question,
      userContext,
      messages.value.slice(-5) // آخر 5 رسائل للسياق
    )
    
    // إضافة إجابة الذكاء الاصطناعي
    const assistantMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: aiResponse.response,
      timestamp: new Date(),
      recommendations: aiResponse.recommendations,
      followUpQuestions: aiResponse.followUpQuestions,
      confidence: aiResponse.confidence
    }
    
    messages.value.push(assistantMessage)
    
    // إضافة الرسالة لسجل المحادثة
    carMindAI.conversationHistory.value.push(userMessage, assistantMessage)
    
  } catch (error) {
    console.error('AI response failed:', error)
    
    const errorMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: t('ai.error.general'),
      timestamp: new Date(),
      isError: true
    }
    
    messages.value.push(errorMessage)
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

const askQuestion = (question: string) => {
  currentMessage.value = question
  sendMessage()
}

const formatMessage = (content: string) => {
  // تنسيق الرسالة مع إبراز الكلمات المهمة
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/€(\d+)/g, '<span class="price">€$1</span>')
}

const formatTime = (timestamp: Date) => {
  return new Intl.DateTimeFormat('bg-BG', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp)
}

const getRecommendationIcon = (type: string) => {
  const icons = {
    'location_based': 'fas fa-map-marker-alt',
    'personalized': 'fas fa-star',
    'pricing': 'fas fa-euro-sign',
    'technical': 'fas fa-cog'
  }
  return icons[type] || 'fas fa-lightbulb'
}

const handleRecommendationClick = (action: string, item: any) => {
  switch (action) {
    case 'view_map':
      // فتح الخريطة مع موقع الخدمة
      window.open(`https://www.google.com/maps/search/${item.name}+${item.address}`, '_blank')
      break
    case 'view_listings':
      // الانتقال للإعلانات
      router.push(`/cars/${item.id}`)
      break
    case 'call_service':
      // اتصال بالخدمة
      window.open(`tel:${item.phone}`)
      break
  }
}

const clearChat = () => {
  messages.value = []
  carMindAI.conversationHistory.value = []
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const getCityFromCoordinates = async (lat: number, lng: number) => {
  // استخدام Geocoding API لتحديد المدينة
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    )
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const cityComponent = data.results[0].address_components.find(
        component => component.types.includes('locality')
      )
      return cityComponent?.long_name || 'Sofia'
    }
  } catch (error) {
    console.error('Geocoding failed:', error)
  }
  
  return 'Sofia' // القيمة الافتراضية
}

// مراقبة تغيير الصفحة لتحديث الاقتراحات السياقية
watch(() => route.name, () => {
  hasNewSuggestions.value = true
  setTimeout(() => {
    hasNewSuggestions.value = false
  }, 3000)
})

onMounted(() => {
  // تحميل سجل المحادثة المحفوظ إن وجد
  // loadChatHistory()
})
</script>

<style scoped>
.carmind-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: var(--font-main);
}

.ai-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--color-primary-green), #00a86b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 103, 71, 0.3);
  transition: all 0.3s ease;
  position: relative;
}

.ai-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(0, 103, 71, 0.4);
}

.avatar-icon {
  color: white;
  font-size: 24px;
}

.pulsing-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  background: #ff4757;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

.chat-interface {
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  margin-bottom: 20px;
}

.chat-header {
  background: var(--color-primary-green);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar-small {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-details h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.ai-status {
  font-size: 12px;
  opacity: 0.8;
}

.chat-controls {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.user-message {
  align-self: flex-end;
}

.user-message .message-content {
  background: var(--color-primary-green);
  color: white;
  border-radius: 18px 18px 4px 18px;
}

.ai-message .message-content {
  background: #f5f7fa;
  border-radius: 18px 18px 18px 4px;
  border-left: 3px solid var(--color-primary-green);
}

.message-content {
  padding: 12px 16px;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.ai-message .message-time {
  text-align: left;
}

.quick-suggestions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.suggestion-btn {
  background: var(--color-primary-green);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
  text-align: left;
}

.suggestion-btn:hover {
  background: var(--color-primary-green-hover);
}

.recommendations {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.recommendations h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--color-primary-green);
  font-weight: 600;
}

.recommendation-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.rec-header {
  background: #f8f9fa;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
}

.rec-items {
  padding: 8px;
}

.rec-item {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rec-item:hover {
  background: #f0f0f0;
}

.item-details {
  font-size: 12px;
  color: #666;
}

.follow-up {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.follow-up-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.follow-up-questions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.follow-up-btn {
  background: none;
  border: 1px solid var(--color-primary-green);
  color: var(--color-primary-green);
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  text-align: left;
}

.follow-up-btn:hover {
  background: var(--color-primary-green);
  color: white;
}

.chat-input {
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  background: white;
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: var(--color-primary-green);
}

.send-btn {
  background: var(--color-primary-green);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.send-btn:hover:not(:disabled) {
  background: var(--color-primary-green-hover);
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.quick-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.quick-action-btn {
  background: #f5f7fa;
  border: 1px solid #e0e0e0;
  color: var(--color-text-dark);
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.quick-action-btn:hover {
  background: var(--color-primary-green);
  color: white;
  border-color: var(--color-primary-green);
}

.typing-indicator-large {
  display: flex;
  gap: 4px;
  padding: 8px;
}

.typing-indicator-large span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator-large span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator-large span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.2); opacity: 1; }
}

.typing-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  padding: 4px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.typing-dots {
  display: flex;
  gap: 3px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary-green);
  animation: typing 1.4s infinite ease-in-out;
}

/* تحسينات للجوال */
@media (max-width: 768px) {
  .chat-interface {
    width: calc(100vw - 40px);
    height: calc(100vh - 40px);
    position: fixed;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    margin: 0;
  }
  
  .ai-avatar {
    width: 50px;
    height: 50px;
  }
  
  .avatar-icon {
    font-size: 20px;
  }
}
</style>
