import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomePage.vue')
    },
    {
      path: '/cars',
      name: 'Cars',
      component: () => import('../views/CarsView.vue')
    },
    {
      path: '/cars/:id',
      name: 'CarDetails',
      component: () => import('../views/CarDetailView.vue')
    },
    {
      path: '/parts',
      name: 'PartsMarketplace',
      component: () => import('../views/PartsMarketplace.vue')
    },
    {
      path: '/search',
      name: 'AdvancedSearch',
      component: () => import('../views/AdvancedSearchView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/seller',
      name: 'SellerDashboard',
      component: () => import('../views/SellerDashboard.vue')
    },
    {
      path: '/add-car',
      name: 'AddCar',
      component: () => import('../views/AddCarView.vue')
    },
    {
      path: '/image-analysis',
      name: 'ImageAnalysis',
      component: () => import('../views/ImageAnalysisView.vue')
    },
    {
      path: '/comparison',
      name: 'Comparison',
      component: () => import('../views/ComparisonView.vue')
    },
    {
      path: '/messages',
      name: 'Messages',
      component: () => import('../views/MessagesView.vue')
    },
    {
      path: '/news',
      name: 'News',
      component: () => import('../views/NewsView.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/pricing',
      name: 'Pricing',
      component: () => import('../views/PricingView.vue')
    },
    {
      path: '/help',
      name: 'Help',
      component: () => import('../views/HelpView.vue')
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: () => import('../views/PrivacyView.vue')
    },
    {
      path: '/terms',
      name: 'Terms',
      component: () => import('../views/TermsView.vue')
    },
    {
      path: '/cookies',
      name: 'Cookies',
      component: () => import('../views/CookiesView.vue')
    }
  ]
})

// Route Guards
router.beforeEach(async (to, from, next) => {
  // Basic route guard implementation
  const publicRoutes = ['Home', 'Cars', 'CarDetails', 'PartsMarketplace', 'AdvancedSearch', 'Login', 'Register']
  const sellerRoutes = ['SellerDashboard', 'AddCar']

  // For now, allow all routes - authentication guards will be implemented with user auth
  console.log('Navigating to:', to.name)
  next()
})

export default router
