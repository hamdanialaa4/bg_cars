<template>
  <nav class="navbar glass-effect">
    <div class="nav-container">
      <!-- Logo -->
      <router-link to="/" class="nav-logo">
        <i class="fas fa-car"></i>
        <span>CarMarketBG</span>
      </router-link>

      <!-- Desktop Navigation -->
      <div class="nav-menu">
        <router-link to="/" class="nav-link" :class="{ active: $route.name === 'Home' }">
          {{ t('nav.home') }}
        </router-link>
        <router-link to="/search" class="nav-link" :class="{ active: $route.name === 'AdvancedSearch' }">
          {{ t('nav.search') }}
        </router-link>
        <router-link to="/cars" class="nav-link">
          {{ t('nav.cars') }}
        </router-link>
        <router-link to="/parts" class="nav-link" :class="{ active: $route.name === 'PartsMarketplace' }">
          {{ t('parts.marketplace') }}
        </router-link>
        <router-link to="/comparison" class="nav-link" :class="{ active: $route.name === 'Comparison' }">
          {{ t('nav.compare') }}
        </router-link>
        <router-link to="/messages" class="nav-link" :class="{ active: $route.name === 'Messages' }">
          <i class="fas fa-envelope"></i>
          {{ t('nav.messages') }}
        </router-link>
        <router-link to="/news" class="nav-link" :class="{ active: $route.name === 'News' }">
          {{ t('nav.news') }}
        </router-link>
        <router-link to="/image-analysis" class="nav-link" :class="{ active: $route.name === 'ImageAnalysis' }">
          {{ t('nav.imageAnalysis') }}
        </router-link>
      </div>

      <!-- User Actions -->
      <div class="nav-actions">
        <!-- Language Switcher -->
        <div class="language-switcher">
          <button
            v-for="locale in availableLocales"
            :key="locale"
            @click="setLocale(locale)"
            :class="{ active: currentLocale === locale }"
            class="lang-btn"
          >
            {{ getLocaleName(locale) }}
          </button>
        </div>

        <!-- User Menu -->
        <div v-if="user" class="user-menu">
          <button @click="toggleUserMenu" class="user-btn">
            <i class="fas fa-user"></i>
            <span class="user-name">{{ user.displayName || user.email }}</span>
            <i class="fas fa-chevron-down"></i>
          </button>

          <div v-if="showUserMenu" class="user-dropdown glass-effect">
            <router-link v-if="isSeller" to="/seller" class="dropdown-item">
              <i class="fas fa-tachometer-alt"></i>
              {{ t('sellerDashboard') }}
            </router-link>
            <router-link v-if="isSeller" to="/add-car" class="dropdown-item">
              <i class="fas fa-plus"></i>
              {{ t('addNewCar') }}
            </router-link>
            <div class="dropdown-divider"></div>
            <button @click="logout" class="dropdown-item">
              <i class="fas fa-sign-out-alt"></i>
              {{ t('logout') }}
            </button>
          </div>
        </div>

        <!-- Auth Buttons -->
        <div v-else class="auth-buttons">
          <router-link to="/login" class="btn-login">
            {{ t('login') }}
          </router-link>
          <router-link to="/register" class="btn-register">
            {{ t('signup') }}
          </router-link>
        </div>

        <!-- Mobile Menu Toggle -->
        <button @click="toggleMobileMenu" class="mobile-menu-btn">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="showMobileMenu" class="mobile-menu glass-effect">
      <router-link to="/" @click="closeMobileMenu" class="mobile-link">
        {{ t('home') }}
      </router-link>
      <router-link to="/search" @click="closeMobileMenu" class="mobile-link">
        {{ t('nav.search') }}
      </router-link>
      <router-link to="/cars" @click="closeMobileMenu" class="mobile-link">
        {{ t('nav.cars') }}
      </router-link>
      <router-link to="/parts" @click="closeMobileMenu" class="mobile-link">
        {{ t('parts.marketplace') }}
      </router-link>
      <router-link to="/comparison" @click="closeMobileMenu" class="mobile-link">
        {{ t('nav.compare') }}
      </router-link>
      <router-link to="/messages" @click="closeMobileMenu" class="mobile-link">
        <i class="fas fa-envelope"></i>
        {{ t('nav.messages') }}
      </router-link>
      <router-link to="/news" @click="closeMobileMenu" class="mobile-link">
        {{ t('nav.news') }}
      </router-link>
      <router-link to="/image-analysis" @click="closeMobileMenu" class="mobile-link">
        {{ t('nav.imageAnalysis') }}
      </router-link>

      <div class="mobile-auth">
        <router-link v-if="!user" to="/login" @click="closeMobileMenu" class="mobile-link">
          {{ t('login') }}
        </router-link>
        <router-link v-if="!user" to="/register" @click="closeMobileMenu" class="mobile-link">
          {{ t('signup') }}
        </router-link>
        <button v-if="user" @click="logout" class="mobile-link">
          {{ t('logout') }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const { user, logout, isSeller } = useAuth()
    const { t, locale } = useI18n()

    const availableLocales = ref(['bg', 'en'])
    const showUserMenu = ref(false)
    const showMobileMenu = ref(false)

    const currentLocale = computed(() => locale.value)
    const setLocale = (newLocale) => {
      locale.value = newLocale
    }

    const getLocaleName = (locale) => {
      const names = {
        bg: 'БГ',
        en: 'EN'
      }
      return names[locale] || locale
    }

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
    }

    const closeMobileMenu = () => {
      showMobileMenu.value = false
    }

    const handleLogout = async () => {
      try {
        await logout()
        showUserMenu.value = false
        router.push('/')
      } catch (err) {
        console.error('Logout error:', err)
      }
    }

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu')) {
        showUserMenu.value = false
      }
      if (!event.target.closest('.mobile-menu-btn') && !event.target.closest('.mobile-menu')) {
        showMobileMenu.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      user,
      isSeller,
      availableLocales,
      showUserMenu,
      showMobileMenu,
      t,
      currentLocale,
      setLocale,
      getLocaleName,
      toggleUserMenu,
      toggleMobileMenu,
      closeMobileMenu,
      logout: handleLogout
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-logo:hover {
  color: #667eea;
}

.nav-logo i {
  color: #667eea;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.language-switcher {
  display: flex;
  gap: 0.25rem;
  margin-right: 1rem;
}

.lang-btn {
  padding: 0.25rem 0.75rem;
  border: 1px solid #e1e5e9;
  background: white;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.lang-btn:hover,
.lang-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid #667eea;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-btn:hover {
  background: rgba(102, 126, 234, 0.2);
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  min-width: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  transition: background 0.3s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(102, 126, 234, 0.1);
}

.dropdown-divider {
  height: 1px;
  background: #e1e5e9;
  margin: 0.25rem 0;
}

.auth-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-login {
  padding: 0.5rem 1rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.btn-login:hover {
  background: rgba(102, 126, 234, 0.1);
}

.btn-register {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  text-decoration: none;
  font-weight: 500;
  border-radius: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
}

.btn-register:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #2c3e50;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-link {
  color: #2c3e50;
  text-decoration: none;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: color 0.3s ease;
}

.mobile-link:hover {
  color: #667eea;
}

.mobile-auth {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .nav-menu {
    display: none;
  }

  .nav-actions .auth-buttons {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-menu {
    display: flex;
  }

  .user-name {
    display: none;
  }

  .language-switcher {
    margin-right: 0.5rem;
  }
}

@media (max-width: 480px) {
  .nav-logo span {
    display: none;
  }

  .language-switcher {
    display: none;
  }
}
</style>
