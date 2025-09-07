<template>
  <div class="news-section">
    <div class="news-container glass-effect">
      <!-- Header -->
      <div class="news-header">
        <h1 class="news-title">{{ t('carNews') }}</h1>
        <p class="news-subtitle">{{ t('latestNewsAndUpdates') }}</p>
      </div>

      <!-- Featured News -->
      <div v-if="featuredNews" class="featured-news">
        <div class="featured-card">
          <div class="featured-image">
            <img :src="featuredNews.image" :alt="featuredNews.title" @error="handleImageError">
            <div class="featured-badge">{{ t('featured') }}</div>
          </div>
          <div class="featured-content">
            <div class="featured-meta">
              <span class="featured-category">{{ featuredNews.category }}</span>
              <span class="featured-date">{{ formatDate(featuredNews.date) }}</span>
            </div>
            <h2 class="featured-title">{{ featuredNews.title }}</h2>
            <p class="featured-excerpt">{{ featuredNews.excerpt }}</p>
            <router-link :to="`/news/${featuredNews.id}`" class="btn-read-more">
              {{ t('readMore') }}
              <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>

      <!-- News Categories -->
      <div class="news-categories">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="setActiveCategory(category.id)"
          :class="{ active: activeCategory === category.id }"
          class="category-btn"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- News Grid -->
      <div class="news-grid">
        <article
          v-for="article in filteredNews"
          :key="article.id"
          class="news-card"
        >
          <div class="news-image">
            <img :src="article.image" :alt="article.title" @error="handleImageError">
            <div class="news-category-badge">{{ article.category }}</div>
          </div>
          <div class="news-content">
            <div class="news-meta">
              <span class="news-author">{{ article.author }}</span>
              <span class="news-date">{{ formatDate(article.date) }}</span>
            </div>
            <h3 class="news-title">{{ article.title }}</h3>
            <p class="news-excerpt">{{ article.excerpt }}</p>
            <div class="news-footer">
              <router-link :to="`/news/${article.id}`" class="btn-read-article">
                {{ t('readArticle') }}
              </router-link>
              <div class="news-stats">
                <span class="stat-item">
                  <i class="fas fa-eye"></i>
                  {{ article.views }}
                </span>
                <span class="stat-item">
                  <i class="fas fa-comments"></i>
                  {{ article.comments }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Load More -->
      <div v-if="hasMoreNews" class="load-more-news">
        <button @click="loadMoreNews" class="btn-load-more" :disabled="isLoadingMore">
          <i v-if="!isLoadingMore" class="fas fa-plus"></i>
          <i v-else class="fas fa-spinner fa-spin"></i>
          {{ isLoadingMore ? t('loading') : t('loadMoreNews') }}
        </button>
      </div>

      <!-- Newsletter Signup -->
      <div class="newsletter-section">
        <div class="newsletter-card glass-effect">
          <div class="newsletter-content">
            <i class="fas fa-newspaper"></i>
            <h3 class="newsletter-title">{{ t('stayUpdated') }}</h3>
            <p class="newsletter-text">{{ t('getLatestNews') }}</p>
            <div class="newsletter-form">
              <input
                v-model="newsletterEmail"
                type="email"
                :placeholder="t('enterEmail')"
                class="newsletter-input"
              >
              <button @click="subscribeNewsletter" class="btn-subscribe" :disabled="!newsletterEmail">
                {{ t('subscribe') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../utils/i18n'

export default {
  name: 'NewsSection',
  setup() {
    const { t } = useI18n()

    const activeCategory = ref('all')
    const newsletterEmail = ref('')
    const isLoadingMore = ref(false)
    const hasMoreNews = ref(true)

    const categories = [
      { id: 'all', name: t('allCategories') },
      { id: 'reviews', name: t('reviews') },
      { id: 'technology', name: t('technology') },
      { id: 'market', name: t('market') },
      { id: 'tips', name: t('tips') }
    ]

    const newsArticles = ref([
      {
        id: '1',
        title: 'Top 10 Electric Cars for 2024: Performance and Range Compared',
        excerpt: 'Discover the best electric vehicles available this year, featuring impressive performance, extended range, and cutting-edge technology.',
        image: '/news/electric-cars-2024.jpg',
        category: 'Reviews',
        author: 'Maria Petrova',
        date: new Date('2024-01-15'),
        views: 1250,
        comments: 23,
        featured: true
      },
      {
        id: '2',
        title: 'How to Maintain Your Car During Winter: Essential Tips',
        excerpt: 'Winter driving requires special attention. Learn the key maintenance steps to keep your vehicle running smoothly in cold weather.',
        image: '/news/winter-maintenance.jpg',
        category: 'Tips',
        author: 'Ivan Dimitrov',
        date: new Date('2024-01-12'),
        views: 890,
        comments: 15,
        featured: false
      },
      {
        id: '3',
        title: 'Autonomous Driving: The Future is Here',
        excerpt: 'Explore the latest developments in autonomous vehicle technology and what it means for the future of transportation.',
        image: '/news/autonomous-driving.jpg',
        category: 'Technology',
        author: 'Georgi Ivanov',
        date: new Date('2024-01-10'),
        views: 2100,
        comments: 45,
        featured: false
      },
      {
        id: '4',
        title: 'Bulgarian Car Market Trends: Q4 2023 Analysis',
        excerpt: 'An in-depth look at the current state of the Bulgarian automotive market, including sales figures and consumer preferences.',
        image: '/news/market-analysis.jpg',
        category: 'Market',
        author: 'Sofia Angelova',
        date: new Date('2024-01-08'),
        views: 675,
        comments: 12,
        featured: false
      },
      {
        id: '5',
        title: 'Best Fuel-Efficient Cars for City Driving',
        excerpt: 'Find out which vehicles offer the best fuel economy for urban commuting and daily city driving.',
        image: '/news/fuel-efficient.jpg',
        category: 'Reviews',
        author: 'Petar Stoyanov',
        date: new Date('2024-01-05'),
        views: 980,
        comments: 18,
        featured: false
      },
      {
        id: '6',
        title: 'Essential Car Accessories for Safety and Comfort',
        excerpt: 'Upgrade your driving experience with these must-have accessories that improve both safety and comfort.',
        image: '/news/car-accessories.jpg',
        category: 'Tips',
        author: 'Elena Petrova',
        date: new Date('2024-01-03'),
        views: 750,
        comments: 9,
        featured: false
      }
    ])

    const featuredNews = computed(() => {
      return newsArticles.value.find(article => article.featured)
    })

    const filteredNews = computed(() => {
      if (activeCategory.value === 'all') {
        return newsArticles.value.filter(article => !article.featured)
      }
      return newsArticles.value.filter(article =>
        article.category.toLowerCase() === activeCategory.value && !article.featured
      )
    })

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('bg-BG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const setActiveCategory = (categoryId) => {
      activeCategory.value = categoryId
    }

    const loadMoreNews = async () => {
      if (!hasMoreNews.value || isLoadingMore.value) return

      isLoadingMore.value = true
      try {
        // In a real app, this would load more news from the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        hasMoreNews.value = false
      } catch (error) {
        console.error('Error loading more news:', error)
      } finally {
        isLoadingMore.value = false
      }
    }

    const subscribeNewsletter = () => {
      if (!newsletterEmail.value) return

      // In a real app, this would send the email to the backend
      alert(t('newsletterSubscribed'))
      newsletterEmail.value = ''
    }

    const handleImageError = (event) => {
      event.target.src = '/placeholder-news.jpg'
    }

    onMounted(() => {
      // Load initial news data
    })

    return {
      activeCategory,
      newsletterEmail,
      isLoadingMore,
      hasMoreNews,
      categories,
      newsArticles,
      featuredNews,
      filteredNews,
      t,
      formatDate,
      setActiveCategory,
      loadMoreNews,
      subscribeNewsletter,
      handleImageError
    }
  }
}
</script>

<style scoped>
.news-section {
  min-height: 100vh;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.news-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.news-header {
  text-align: center;
  margin-bottom: 2rem;
}

.news-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.news-subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
}

/* Featured News */
.featured-news {
  margin-bottom: 2rem;
}

.featured-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  min-height: 300px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.featured-image {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-card:hover .featured-image img {
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.featured-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.featured-category {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.featured-date {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.featured-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.featured-excerpt {
  color: #555;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.btn-read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.btn-read-more:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* News Categories */
.news-categories {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.category-btn:hover,
.category-btn.active {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
}

/* News Grid */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.news-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.news-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-card:hover .news-image img {
  transform: scale(1.05);
}

.news-category-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
}

.news-content {
  padding: 1.5rem;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #7f8c8d;
}

.news-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.news-excerpt {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-read-article {
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  text-decoration: none;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-read-article:hover {
  background: #667eea;
  color: white;
}

.news-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #7f8c8d;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Load More */
.load-more-news {
  text-align: center;
  margin-bottom: 2rem;
}

.btn-load-more {
  padding: 0.75rem 2rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-load-more:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
}

.btn-load-more:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Newsletter */
.newsletter-section {
  margin-top: 3rem;
}

.newsletter-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
}

.newsletter-content i {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.newsletter-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.newsletter-text {
  color: #7f8c8d;
  font-size: 1rem;
  margin-bottom: 1.5rem;
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
  border: 1px solid #e1e5e9;
  border-radius: 25px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.newsletter-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-subscribe {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-subscribe:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.btn-subscribe:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .news-container {
    margin: 0 1rem;
    padding: 1rem;
  }

  .news-title {
    font-size: 2rem;
  }

  .featured-card {
    flex-direction: column;
    min-height: auto;
  }

  .featured-content {
    padding: 1.5rem;
  }

  .featured-title {
    font-size: 1.5rem;
  }

  .news-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .news-categories {
    justify-content: center;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .btn-subscribe {
    width: 100%;
  }
}
</style>
