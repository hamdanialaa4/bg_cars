<template>
  <div class="seller-dashboard">
    <div class="dashboard-header">
      <h1>{{ t('seller.dashboardTitle') }}</h1>
      <div class="header-actions">
        <router-link to="/add-car" class="btn-primary">
          <i class="fas fa-plus"></i> {{ t('seller.addNewCar') }}
        </router-link>
      </div>
    </div>

    <div class="dashboard-stats">
      <div class="stat-card glass-effect">
        <div class="stat-icon">
          <i class="fas fa-car"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalCars }}</h3>
          <p>{{ t('seller.totalCars') }}</p>
        </div>
      </div>

      <div class="stat-card glass-effect">
        <div class="stat-icon">
          <i class="fas fa-eye"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalViews }}</h3>
          <p>{{ t('seller.totalViews') }}</p>
        </div>
      </div>

      <div class="stat-card glass-effect">
        <div class="stat-icon">
          <i class="fas fa-heart"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalLikes }}</h3>
          <p>{{ t('seller.totalLikes') }}</p>
        </div>
      </div>

      <div class="stat-card glass-effect">
        <div class="stat-icon">
          <i class="fas fa-envelope"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalMessages }}</h3>
          <p>{{ t('seller.totalMessages') }}</p>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="content-section">
        <h2>سياراتي</h2>
        <div class="cars-grid">
          <div v-for="car in myCars" :key="car.id" class="car-card glass-effect">
            <div class="car-image">
              <img :src="car.images[0] || '/placeholder-car.jpg'" :alt="car.make + ' ' + car.model">
              <div class="car-status" :class="car.status">
                {{ car.status === 'active' ? 'نشط' : 'غير نشط' }}
              </div>
            </div>
            <div class="car-info">
              <h4>{{ car.make }} {{ car.model }} {{ car.year }}</h4>
              <p class="car-price">€{{ car.price.toLocaleString() }}</p>
              <div class="car-stats">
                <span><i class="fas fa-eye"></i> {{ car.views }}</span>
                <span><i class="fas fa-heart"></i> {{ car.likes }}</span>
                <span><i class="fas fa-comment"></i> {{ car.messages }}</span>
              </div>
            </div>
            <div class="car-actions">
              <button @click="editCar(car)" class="btn-icon" title="تعديل">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="toggleCarStatus(car)" class="btn-icon" title="تغيير الحالة">
                <i :class="car.status === 'active' ? 'fas fa-pause' : 'fas fa-play'"></i>
              </button>
              <button @click="showAnalytics(car)" class="btn-icon" title="التحليلات">
                <i class="fas fa-chart-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2>التحليلات والتقارير</h2>
        <div class="analytics-container">
          <div class="analytics-chart glass-effect">
            <h3>أداء السيارات</h3>
            <div class="chart-placeholder">
              <i class="fas fa-chart-bar"></i>
              <p>رسم بياني تفاعلي قيد التطوير</p>
            </div>
          </div>
          <div class="analytics-summary glass-effect">
            <h3>ملخص الأداء</h3>
            <div class="summary-item">
              <span>معدل المشاهدات اليومية</span>
              <span class="value">{{ analytics.dailyViews }}</span>
            </div>
            <div class="summary-item">
              <span>معدل التحويل</span>
              <span class="value">{{ analytics.conversionRate }}%</span>
            </div>
            <div class="summary-item">
              <span>السيارات الأكثر مشاهدة</span>
              <span class="value">{{ analytics.mostViewedCar }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Car Modal (placeholder for now) -->
    <div v-if="showAddCarModal" class="modal-overlay" @click="showAddCarModal = false">
      <div class="modal-content glass-effect" @click.stop>
        <h3>إضافة سيارة جديدة</h3>
        <p>نموذج إضافة السيارة قيد التطوير...</p>
        <button class="btn-primary" @click="showAddCarModal = false">إغلاق</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'SellerDashboard',
  setup() {
    const showAddCarModal = ref(false)

    const stats = ref({
      totalCars: 12,
      totalViews: 1542,
      totalLikes: 89,
      totalMessages: 23
    })

    const analytics = ref({
      dailyViews: 42,
      conversionRate: 3.2,
      mostViewedCar: 'BMW X5 2022'
    })

    const myCars = ref([
      {
        id: 1,
        make: 'BMW',
        model: 'X5',
        year: 2022,
        price: 85000,
        images: ['/images/bmw-x5-1.jpg'],
        views: 150,
        likes: 25,
        messages: 8,
        status: 'active'
      },
      {
        id: 2,
        make: 'Mercedes',
        model: 'C-Class',
        year: 2021,
        price: 45000,
        images: ['/images/mercedes-c-class.jpg'],
        views: 89,
        likes: 12,
        messages: 5,
        status: 'active'
      },
      {
        id: 3,
        make: 'Audi',
        model: 'A4',
        year: 2020,
        price: 35000,
        images: ['/images/audi-a4.jpg'],
        views: 67,
        likes: 8,
        messages: 3,
        status: 'inactive'
      }
    ])

    onMounted(() => {
      loadSellerData()
    })

    const loadSellerData = async () => {
      // Load seller data from API/Firebase
      console.log('Loading seller data...')
    }

    const editCar = (car) => {
      console.log('Editing car:', car)
      // Navigate to edit page or open edit modal
    }

    const toggleCarStatus = (car) => {
      car.status = car.status === 'active' ? 'inactive' : 'active'
      console.log('Toggled car status:', car)
    }

    const showAnalytics = (car) => {
      console.log('Showing analytics for:', car)
      // Show detailed analytics modal or navigate to analytics page
    }

    return {
      showAddCarModal,
      stats,
      analytics,
      myCars,
      editCar,
      toggleCarStatus,
      showAnalytics
    }
  }
}
</script>

<style scoped>
.seller-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 15px;
}

.dashboard-header h1 {
  margin: 0;
  color: #2c3e50;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: 15px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
  margin-right: 1rem;
  color: #667eea;
}

.stat-content h3 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.stat-content p {
  margin: 0;
  color: #7f8c8d;
}

.dashboard-content {
  display: grid;
  gap: 2rem;
}

.content-section {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.content-section h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.car-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.car-card:hover {
  transform: translateY(-5px);
}

.car-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.car-status.active {
  background: #4CAF50;
  color: white;
}

.car-status.inactive {
  background: #FF9800;
  color: white;
}

.car-info {
  padding: 1rem;
}

.car-info h4 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.car-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 0.5rem;
}

.car-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.car-actions {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  border-top: 1px solid #eee;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #667eea;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.btn-icon:hover {
  background: #f5f7fa;
}

.analytics-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.analytics-chart, .analytics-summary {
  padding: 1.5rem;
  border-radius: 12px;
}

.analytics-chart h3, .analytics-summary h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.chart-placeholder {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.chart-placeholder i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid #eee;
}

.summary-item .value {
  font-weight: 600;
  color: #667eea;
}

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
  padding: 2rem;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

@media (max-width: 768px) {
  .dashboard-stats {
    grid-template-columns: 1fr 1fr;
  }

  .cars-grid {
    grid-template-columns: 1fr;
  }

  .analytics-container {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
