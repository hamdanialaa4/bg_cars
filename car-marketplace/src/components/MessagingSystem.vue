<template>
  <div class="messaging-system">
    <div class="messaging-container glass-effect">
      <!-- Header -->
      <div class="messaging-header">
        <h1 class="messaging-title">{{ t('messages') }}</h1>
        <button @click="startNewConversation" class="btn-new-conversation">
          <i class="fas fa-plus"></i>
          {{ t('newMessage') }}
        </button>
      </div>

      <div class="messaging-content">
        <!-- Conversations List -->
        <div class="conversations-panel">
          <div class="conversations-header">
            <h2 class="panel-title">{{ t('conversations') }}</h2>
            <div class="search-box">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('searchConversations')"
                class="search-input"
              >
              <i class="fas fa-search"></i>
            </div>
          </div>

          <div class="conversations-list">
            <div
              v-for="conversation in filteredConversations"
              :key="conversation.id"
              class="conversation-item"
              :class="{ active: selectedConversation?.id === conversation.id }"
              @click="selectConversation(conversation)"
            >
              <div class="conversation-avatar">
                <img
                  :src="conversation.otherUser.avatar"
                  :alt="conversation.otherUser.name"
                  @error="handleAvatarError"
                >
                <div v-if="conversation.unreadCount > 0" class="unread-badge">
                  {{ conversation.unreadCount }}
                </div>
              </div>
              <div class="conversation-info">
                <div class="conversation-name">{{ conversation.otherUser.name }}</div>
                <div class="conversation-preview">{{ conversation.lastMessage }}</div>
                <div class="conversation-time">{{ formatTime(conversation.lastMessageTime) }}</div>
              </div>
            </div>

            <div v-if="filteredConversations.length === 0" class="no-conversations">
              <i class="fas fa-comments"></i>
              <p>{{ t('noConversations') }}</p>
            </div>
          </div>
        </div>

        <!-- Chat Panel -->
        <div class="chat-panel">
          <div v-if="selectedConversation" class="chat-content">
            <!-- Chat Header -->
            <div class="chat-header">
              <div class="chat-user-info">
                <img
                  :src="selectedConversation.otherUser.avatar"
                  :alt="selectedConversation.otherUser.name"
                  class="chat-avatar"
                  @error="handleAvatarError"
                >
                <div class="chat-user-details">
                  <h3 class="chat-user-name">{{ selectedConversation.otherUser.name }}</h3>
                  <p class="chat-user-status">{{ selectedConversation.otherUser.isOnline ? t('online') : t('offline') }}</p>
                </div>
              </div>
              <div class="chat-actions">
                <button @click="viewCarDetails" class="btn-view-car">
                  <i class="fas fa-car"></i>
                  {{ t('viewCar') }}
                </button>
                <button @click="blockUser" class="btn-block">
                  <i class="fas fa-ban"></i>
                  {{ t('block') }}
                </button>
              </div>
            </div>

            <!-- Messages -->
            <div ref="messagesContainer" class="messages-container" @scroll="handleScroll">
              <div
                v-for="message in selectedConversation.messages"
                :key="message.id"
                class="message"
                :class="{ 'own-message': message.isOwn }"
              >
                <div class="message-content">
                  <p class="message-text">{{ message.text }}</p>
                  <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                </div>
                <div v-if="!message.isOwn" class="message-avatar">
                  <img
                    :src="selectedConversation.otherUser.avatar"
                    :alt="selectedConversation.otherUser.name"
                    @error="handleAvatarError"
                  >
                </div>
              </div>

              <div v-if="isTyping" class="typing-indicator">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span class="typing-text">{{ t('typing') }}</span>
              </div>
            </div>

            <!-- Message Input -->
            <div class="message-input-container">
              <div class="message-input-wrapper">
                <textarea
                  v-model="newMessage"
                  :placeholder="t('typeMessage')"
                  class="message-input"
                  @keydown.enter.exact.prevent="sendMessage"
                  @keydown.enter.shift.exact="addNewLine"
                  rows="1"
                  ref="messageInput"
                ></textarea>
                <button
                  @click="sendMessage"
                  :disabled="!newMessage.trim()"
                  class="btn-send"
                >
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>

              <!-- Quick Actions -->
              <div class="quick-actions">
                <button @click="sendQuickMessage('interested')" class="quick-btn">
                  {{ t('interested') }}
                </button>
                <button @click="sendQuickMessage('price')" class="quick-btn">
                  {{ t('askPrice') }}
                </button>
                <button @click="sendQuickMessage('location')" class="quick-btn">
                  {{ t('askLocation') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-chat">
            <i class="fas fa-comments"></i>
            <h3 class="empty-title">{{ t('selectConversation') }}</h3>
            <p class="empty-text">{{ t('chooseConversationToStart') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- New Conversation Modal -->
    <div v-if="showNewConversationModal" class="modal-overlay" @click="closeNewConversationModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ t('startNewConversation') }}</h3>
          <button @click="closeNewConversationModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="search-users">
            <input
              v-model="userSearchQuery"
              type="text"
              :placeholder="t('searchUsers')"
              class="search-users-input"
            >
          </div>

          <div class="users-list">
            <div
              v-for="user in filteredUsers"
              :key="user.id"
              class="user-item"
              @click="startConversationWithUser(user)"
            >
              <img :src="user.avatar" :alt="user.name" class="user-avatar" @error="handleAvatarError">
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-details">{{ user.location }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useI18n } from '../utils/i18n'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

export default {
  name: 'MessagingSystem',
  setup() {
    const { t } = useI18n()
    const { user } = useAuth()
    const router = useRouter()

    const conversations = ref([])
    const selectedConversation = ref(null)
    const searchQuery = ref('')
    const newMessage = ref('')
    const isTyping = ref(false)
    const showNewConversationModal = ref(false)
    const userSearchQuery = ref('')
    const messagesContainer = ref(null)
    const messageInput = ref(null)

    // Mock data - in real app this would come from Firebase
    const mockConversations = [
      {
        id: '1',
        otherUser: {
          id: 'user1',
          name: 'Ivan Petrov',
          avatar: '/avatars/user1.jpg',
          isOnline: true,
          location: 'Sofia'
        },
        lastMessage: 'Is the car still available?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        unreadCount: 2,
        messages: [
          {
            id: '1',
            text: 'Hello, I\'m interested in your BMW X5',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            isOwn: false
          },
          {
            id: '2',
            text: 'Hi! Yes, it\'s still available. Would you like to schedule a viewing?',
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
            isOwn: true
          },
          {
            id: '3',
            text: 'Is the car still available?',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            isOwn: false
          }
        ]
      },
      {
        id: '2',
        otherUser: {
          id: 'user2',
          name: 'Maria Dimitrova',
          avatar: '/avatars/user2.jpg',
          isOnline: false,
          location: 'Plovdiv'
        },
        lastMessage: 'Can you send more photos?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        unreadCount: 0,
        messages: [
          {
            id: '1',
            text: 'Hi, I saw your Audi A4 listing',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            isOwn: false
          },
          {
            id: '2',
            text: 'Hello! Sure, I can send more photos.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
            isOwn: true
          }
        ]
      }
    ]

    const mockUsers = [
      { id: 'user1', name: 'Ivan Petrov', avatar: '/avatars/user1.jpg', location: 'Sofia' },
      { id: 'user2', name: 'Maria Dimitrova', avatar: '/avatars/user2.jpg', location: 'Plovdiv' },
      { id: 'user3', name: 'Georgi Ivanov', avatar: '/avatars/user3.jpg', location: 'Varna' }
    ]

    const filteredConversations = computed(() => {
      if (!searchQuery.value) return conversations.value
      return conversations.value.filter(conv =>
        conv.otherUser.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const filteredUsers = computed(() => {
      if (!userSearchQuery.value) return mockUsers
      return mockUsers.filter(user =>
        user.name.toLowerCase().includes(userSearchQuery.value.toLowerCase()) ||
        user.location.toLowerCase().includes(userSearchQuery.value.toLowerCase())
      )
    })

    const formatTime = (timestamp) => {
      const now = new Date()
      const messageTime = new Date(timestamp)
      const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60))

      if (diffInMinutes < 1) return t('justNow')
      if (diffInMinutes < 60) return `${diffInMinutes}m`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
      return messageTime.toLocaleDateString()
    }

    const selectConversation = (conversation) => {
      selectedConversation.value = conversation
      conversation.unreadCount = 0
      nextTick(() => {
        scrollToBottom()
      })
    }

    const sendMessage = () => {
      if (!newMessage.value.trim() || !selectedConversation.value) return

      const message = {
        id: Date.now().toString(),
        text: newMessage.value,
        timestamp: new Date(),
        isOwn: true
      }

      selectedConversation.value.messages.push(message)
      selectedConversation.value.lastMessage = message.text
      selectedConversation.value.lastMessageTime = message.timestamp

      newMessage.value = ''
      nextTick(() => {
        scrollToBottom()
        messageInput.value?.focus()
      })

      // Simulate typing indicator
      isTyping.value = true
      setTimeout(() => {
        isTyping.value = false
        // Simulate response
        setTimeout(() => {
          const response = {
            id: (Date.now() + 1).toString(),
            text: 'Thank you for your message. I\'ll get back to you soon.',
            timestamp: new Date(),
            isOwn: false
          }
          selectedConversation.value.messages.push(response)
          selectedConversation.value.lastMessage = response.text
          selectedConversation.value.lastMessageTime = response.timestamp
          nextTick(() => scrollToBottom())
        }, 2000)
      }, 1000)
    }

    const sendQuickMessage = (type) => {
      const messages = {
        interested: t('imInterested'),
        price: t('canYouTellMeThePrice'),
        location: t('whereIsTheCarLocated')
      }
      newMessage.value = messages[type]
      sendMessage()
    }

    const addNewLine = () => {
      newMessage.value += '\n'
    }

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }

    const handleScroll = () => {
      // Handle scroll to load more messages if needed
    }

    const startNewConversation = () => {
      showNewConversationModal.value = true
    }

    const closeNewConversationModal = () => {
      showNewConversationModal.value = false
      userSearchQuery.value = ''
    }

    const startConversationWithUser = (selectedUser) => {
      // Check if conversation already exists
      const existingConv = conversations.value.find(conv => conv.otherUser.id === selectedUser.id)
      if (existingConv) {
        selectConversation(existingConv)
        closeNewConversationModal()
        return
      }

      // Create new conversation
      const newConv = {
        id: Date.now().toString(),
        otherUser: selectedUser,
        lastMessage: '',
        lastMessageTime: new Date(),
        unreadCount: 0,
        messages: []
      }

      conversations.value.unshift(newConv)
      selectConversation(newConv)
      closeNewConversationModal()
    }

    const viewCarDetails = () => {
      // In real app, navigate to car details
      router.push('/cars/1')
    }

    const blockUser = () => {
      if (confirm(t('blockUserConfirm'))) {
        // Implement block functionality
        console.log('User blocked')
      }
    }

    const handleAvatarError = (event) => {
      event.target.src = '/default-avatar.png'
    }

    watch(newMessage, () => {
      if (messageInput.value) {
        messageInput.value.style.height = 'auto'
        messageInput.value.style.height = messageInput.value.scrollHeight + 'px'
      }
    })

    onMounted(() => {
      conversations.value = mockConversations
    })

    return {
      conversations,
      selectedConversation,
      searchQuery,
      newMessage,
      isTyping,
      showNewConversationModal,
      userSearchQuery,
      messagesContainer,
      messageInput,
      filteredConversations,
      filteredUsers,
      t,
      formatTime,
      selectConversation,
      sendMessage,
      sendQuickMessage,
      addNewLine,
      handleScroll,
      startNewConversation,
      closeNewConversationModal,
      startConversationWithUser,
      viewCarDetails,
      blockUser,
      handleAvatarError
    }
  }
}
</script>

<style scoped>
.messaging-system {
  min-height: 100vh;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.messaging-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
}

.messaging-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.messaging-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.btn-new-conversation {
  padding: 0.75rem 1.5rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-new-conversation:hover {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
}

.messaging-content {
  flex: 1;
  display: flex;
  gap: 2rem;
  overflow: hidden;
}

.conversations-panel {
  width: 350px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.conversations-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.panel-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.search-box {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-box i {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.conversation-item:hover,
.conversation-item.active {
  background: rgba(102, 126, 234, 0.1);
}

.conversation-avatar {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.conversation-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-preview {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-time {
  font-size: 0.75rem;
  color: #95a5a6;
}

.no-conversations {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: #7f8c8d;
  text-align: center;
}

.no-conversations i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.chat-panel {
  flex: 1;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #ecf0f1;
  background: rgba(102, 126, 234, 0.05);
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.chat-user-details h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.chat-user-status {
  font-size: 0.8rem;
  color: #27ae60;
  margin: 0;
}

.chat-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view-car,
.btn-block {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-view-car {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.btn-view-car:hover {
  background: #667eea;
  color: white;
}

.btn-block {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.btn-block:hover {
  background: #e74c3c;
  color: white;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 0.75rem;
  max-width: 70%;
}

.message.own-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-content {
  background: rgba(102, 126, 234, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
}

.own-message .message-content {
  background: #667eea;
  color: white;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 4px;
}

.message-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 0.7rem;
  color: #95a5a6;
  margin-top: 0.25rem;
  text-align: right;
}

.own-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.message-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  align-self: flex-end;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #7f8c8d;
  font-size: 0.8rem;
}

.typing-dots {
  display: flex;
  gap: 0.25rem;
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

.message-input-container {
  border-top: 1px solid #ecf0f1;
  padding: 1rem 1.5rem;
  background: rgba(102, 126, 234, 0.02);
}

.message-input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  margin-bottom: 0.75rem;
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 20px;
  font-size: 0.9rem;
  resize: none;
  min-height: 40px;
  max-height: 120px;
  transition: border-color 0.3s ease;
}

.message-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-send {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #667eea;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-send:hover:not(:disabled) {
  background: #5a67d8;
  transform: scale(1.05);
}

.btn-send:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.quick-btn:hover {
  background: #667eea;
  color: white;
}

.empty-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  text-align: center;
  padding: 2rem;
}

.empty-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 1rem 0 0.5rem 0;
}

.empty-text {
  font-size: 0.9rem;
  margin: 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #ecf0f1;
}

.modal-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.modal-body {
  padding: 1.5rem;
  max-height: calc(80vh - 100px);
  overflow-y: auto;
}

.search-users-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.search-users-input:focus {
  outline: none;
  border-color: #667eea;
}

.users-list {
  max-height: 300px;
  overflow-y: auto;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-item:hover {
  background: rgba(102, 126, 234, 0.1);
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.user-details {
  font-size: 0.8rem;
  color: #7f8c8d;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .messaging-container {
    margin: 0 1rem;
    padding: 1rem;
    height: calc(100vh - 2rem);
  }

  .messaging-content {
    flex-direction: column;
    gap: 1rem;
  }

  .conversations-panel {
    width: 100%;
    max-height: 300px;
  }

  .chat-header {
    padding: 1rem;
  }

  .messages-container {
    padding: 1rem;
  }

  .message-input-container {
    padding: 1rem;
  }

  .quick-actions {
    justify-content: center;
  }
}
</style>
