<template>
  <footer class="footer glass-effect">
    <div class="footer-container">
      <!-- Main Footer Content -->
      <div class="footer-main">
        <!-- Company Info -->
        <div class="footer-section">
          <div class="footer-logo">
            <i class="fas fa-car"></i>
            <span>CarMarketBG</span>
          </div>
          <p class="footer-description">
            {{ t('footerDescription') }}
          </p>
          <div class="social-links">
            <a href="#" class="social-link">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h3 class="footer-title">{{ t('quickLinks') }}</h3>
          <ul class="footer-links">
            <li>
              <router-link to="/" class="footer-link">{{ t('home') }}</router-link>
            </li>
            <li>
              <router-link to="/search" class="footer-link">{{ t('search') }}</router-link>
            </li>
            <li>
              <router-link to="/cars" class="footer-link">{{ t('cars') }}</router-link>
            </li>
            <li>
              <router-link to="/about" class="footer-link">{{ t('about') }}</router-link>
            </li>
          </ul>
        </div>

        <!-- For Sellers -->
        <div class="footer-section">
          <h3 class="footer-title">{{ t('forSellers') }}</h3>
          <ul class="footer-links">
            <li>
              <router-link to="/seller" class="footer-link">{{ t('sellerDashboard') }}</router-link>
            </li>
            <li>
              <router-link to="/add-car" class="footer-link">{{ t('addNewCar') }}</router-link>
            </li>
            <li>
              <router-link to="/pricing" class="footer-link">{{ t('pricing') }}</router-link>
            </li>
            <li>
              <router-link to="/help" class="footer-link">{{ t('help') }}</router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section">
          <h3 class="footer-title">{{ t('contact') }}</h3>
          <div class="contact-info">
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <span>info@carmarketbg.com</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-phone"></i>
              <span>+359 2 123 4567</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ t('sofiaBulgaria') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Newsletter Signup -->
      <div class="newsletter-section">
        <div class="newsletter-content">
          <h3 class="newsletter-title">{{ t('newsletterTitle') }}</h3>
          <p class="newsletter-description">
            {{ t('newsletterDescription') }}
          </p>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input
              v-model="email"
              type="email"
              :placeholder="t('enterEmail')"
              class="newsletter-input"
              required
            >
            <button type="submit" class="newsletter-btn" :disabled="isSubscribing">
              <span v-if="!isSubscribing">{{ t('subscribe') }}</span>
              <i v-else class="fas fa-spinner fa-spin"></i>
            </button>
          </form>
          <p v-if="subscriptionMessage" class="subscription-message" :class="{ success: subscriptionSuccess }">
            {{ subscriptionMessage }}
          </p>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} CarMarketBG. {{ t('allRightsReserved') }}
          </p>
          <div class="footer-bottom-links">
            <router-link to="/privacy" class="footer-bottom-link">{{ t('privacyPolicy') }}</router-link>
            <router-link to="/terms" class="footer-bottom-link">{{ t('termsOfService') }}</router-link>
            <router-link to="/cookies" class="footer-bottom-link">{{ t('cookiePolicy') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref, computed } from 'vue'
import { useI18n } from '../../utils/i18n'

export default {
  name: 'Footer',
  setup() {
    const { t } = useI18n()
    const email = ref('')
    const isSubscribing = ref(false)
    const subscriptionMessage = ref('')
    const subscriptionSuccess = ref(false)

    const currentYear = computed(() => new Date().getFullYear())

    const subscribeNewsletter = async () => {
      if (!email.value) return

      isSubscribing.value = true
      subscriptionMessage.value = ''
      subscriptionSuccess.value = false

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // In a real app, you would send this to your backend
        console.log('Newsletter subscription:', email.value)

        subscriptionMessage.value = t('subscriptionSuccess')
        subscriptionSuccess.value = true
        email.value = ''
      } catch (error) {
        subscriptionMessage.value = t('subscriptionError')
        subscriptionSuccess.value = false
      } finally {
        isSubscribing.value = false
      }
    }

    return {
      email,
      isSubscribing,
      subscriptionMessage,
      subscriptionSuccess,
      currentYear,
      t,
      subscribeNewsletter
    }
  }
}
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  margin-top: auto;
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.03"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.03"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.02"/><circle cx="10" cy="50" r="0.5" fill="white" opacity="0.02"/><circle cx="90" cy="30" r="0.5" fill="white" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 1rem;
}

.footer-main {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #667eea;
}

.footer-logo i {
  color: #667eea;
}

.footer-description {
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #667eea;
  transform: translateY(-2px);
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-link {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #667eea;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #bdc3c7;
}

.contact-item i {
  color: #667eea;
  width: 16px;
}

.newsletter-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.newsletter-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.newsletter-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
}

.newsletter-description {
  color: #bdc3c7;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
  max-width: 400px;
  margin: 0 auto;
}

.newsletter-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
}

.newsletter-input::placeholder {
  color: #bdc3c7;
}

.newsletter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.newsletter-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
}

.newsletter-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.newsletter-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.subscription-message {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.subscription-message.success {
  color: #27ae60;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: #bdc3c7;
  font-size: 0.9rem;
}

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
}

.footer-bottom-link {
  color: #bdc3c7;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-bottom-link:hover {
  color: #667eea;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .footer-container {
    padding: 2rem 1rem 1rem;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-btn {
    width: 100%;
  }

  .footer-bottom-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .footer-bottom-links {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .social-links {
    justify-content: center;
  }

  .contact-item {
    font-size: 0.9rem;
  }
}
</style>
