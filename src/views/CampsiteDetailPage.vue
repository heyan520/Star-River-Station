<template>
  <div class="campsite-detail-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button class="retry-btn" @click="loadCampsite">重试</button>
    </div>

    <!-- 内容区域 -->
    <div v-else-if="campsite">
      <!-- 顶部导航栏 -->
      <div class="header">
        <button class="back-btn" onclick="history.back()">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="title">露营点详情</h1>
        <button class="share-btn" @click="handleShare">
          <i class="fas fa-share-alt"></i>
        </button>
      </div>

      <!-- 主图区域 -->
      <div class="hero-image">
        <img :src="campsite.image" :alt="campsite.title" />
        <button class="favorite-btn" @click="toggleFavorite" :title="isFavorited ? '取消收藏' : '添加收藏'">
          <svg 
            :class="isFavorited ? 'favorited-svg' : ''"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#ff4757" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          >
            <!-- 未收藏状态显示轮廓 -->
            <path 
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
              :fill="isFavorited ? '#ff4757' : 'none'"
            />
          </svg>
        </button>
      </div>

      <!-- 露营地基本信息 -->
      <div class="campsite-info">
        <div class="campsite-header">
          <h2 class="campsite-title">{{ campsite.title }}</h2>
          <div class="campsite-tags">
            <span 
              v-for="tag in campsite.tags" 
              :key="tag.text"
              :class="['tag', tag.type]"
            >
              {{ tag.text }}
            </span>
          </div>
        </div>
        
        <div class="location">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ campsite.location }}</span>
        </div>

        <!-- 统计信息卡片 -->
        <div class="stats-card">
          <div class="stat-item">
            <div class="stat-value">{{ campsite.rating }}</div>
            <div class="stat-label">评分</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">¥{{ campsite.price }}</div>
            <div class="stat-label">起/晚</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ campsite.capacity }}</div>
            <div class="stat-label">营位</div>
          </div>
        </div>
      </div>

      <!-- 营地特色 -->
      <div class="features-section">
        <h3 class="section-title">营地特色</h3>
        <p class="features-description">{{ campsite.features }}</p>
      </div>

      <!-- 营地设施 -->
      <div class="facilities-section">
        <h3 class="section-title">营地设施</h3>
        <div class="facilities-list">
          <div 
            v-for="facility in campsite.facilities" 
            :key="facility"
            class="facility-item"
          >
            <i class="fas fa-check-circle"></i>
            <span>{{ facility }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <div class="action-btn vr-btn">
          <button class="action-btn vr-btn" @click="showVR">
            <i class="fas fa-vr-cardboard"></i>
            <span>VR全景</span>
          </button>
        </div>
        <button class="action-btn details-btn" @click="showDetails">
          <i class="fas fa-file-alt"></i>
          <span>展示详情</span>
        </button>
        <button class="action-btn team-btn" @click="joinTeam">
          <i class="fas fa-users"></i>
          <span>组队</span>
        </button>
      </div>

      <!-- 地图区域 -->
      <div class="map-section">
        <div id="detail-map-container" class="map-container"></div>
        <div class="map-brand">
          <span>高德地图</span>
        </div>
      </div>

      <!-- 预订和联系按钮 -->
      <div class="booking-section">
        <button class="book-btn" @click="handleBooking">
          <i class="fas fa-calendar-alt"></i>
          <span>立即预订</span>
        </button>
        <button class="contact-btn" @click="handleContact">
          <i class="fas fa-phone"></i>
          <span>联系营地</span>
        </button>
      </div>

      <!-- 用户评价 -->
      <div class="reviews-section">
        <h3 class="section-title">用户评价 ({{ campsite.reviews }})</h3>
        <div class="reviews-list">
          <div 
            v-for="review in campsite.userReviews" 
            :key="review.id"
            class="review-item"
          >
            <div class="review-header">
              <div class="reviewer-avatar">
                <img 
                  :src="review.avatar" 
                  :alt="review.name"
                  @error="handleAvatarError"
                  @load="handleAvatarLoad"
                />
              </div>
              <div class="reviewer-info">
                <div class="reviewer-name">{{ review.name }}</div>
                <div class="review-rating">
                  <i 
                    v-for="n in 5" 
                    :key="n" 
                    class="fas fa-star" 
                    :class="{ 'filled': n <= review.rating }"
                  ></i>
                </div>
              </div>
            </div>
            <div class="review-content">
              <p class="review-text">{{ review.content }}</p>
              <div v-if="review.image" class="review-image">
                <img :src="review.image" :alt="review.name" />
              </div>
              <div class="review-date">{{ review.date }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCampsiteDetail } from '../composables/useCampsiteDetail.js';

// 使用composable
const {  
  campsite,
  loading,
  error,
  isFavorited,
  loadCampsite,
  toggleFavorite
} = useCampsiteDetail();

const router = useRouter();
const map = ref(null);

// 加载高德地图脚本
function loadAmapScript() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap);
      return;
    }

    // 设置高德地图安全密钥
    window._AMapSecurityConfig = {
      securityJsCode: '56e9a98a513c4761b8e7b632b4df28ea'
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://webapi.amap.com/maps?v=2.0&key=dfd36d667109b8826702b8b69ca42af3';
    script.onerror = reject;
    script.onload = () => resolve(window.AMap);
    document.head.appendChild(script);
  });
}

// 初始化地图 - 使用路线列表中的地图实现
const initMap = () => {
  if (!campsite.value) return;
  
  // 确保地图容器存在
  const mapContainer = document.getElementById('detail-map-container');
  if (!mapContainer) {
    console.warn('地图容器不存在，稍后重试...');
    setTimeout(initMap, 100);
    return;
  }

  loadAmapScript().then(() => {
    try {
      // 使用路线列表中的地图初始化方式
      map.value = new window.AMap.Map('detail-map-container', {
        zoom: 12,
        center: campsite.value.coordinates || [110.0, 37.0],
        resizeEnable: true,
        features: ['road', 'point']
      });

      // 添加地图控件
      window.AMap.plugin(
        [
          "AMap.ToolBar",
          "AMap.Geolocation"
        ],
        () => {
          if (map.value) {
            map.value.addControl(new window.AMap.ToolBar({
              position: 'RT'
            }));

            map.value.addControl(new window.AMap.Geolocation({
              position: 'RB',
              showButton: true,
              panToLocation: true
            }));
          }
        }
      );

      // 添加露营地点标记
      if (campsite.value.coordinates && map.value) {
        const markers = [new window.AMap.Marker({
          position: campsite.value.coordinates,
          title: campsite.value.title
        })];
        
        map.value.add(markers);
        map.value.setFitView(); // 自动调整地图视野以显示标记
      }

      console.log('详情页地图初始化成功');

      // 确保地图容器有明确的尺寸
      mapContainer.style.width = '100%';
      mapContainer.style.height = '100%';

      // 手动触发地图渲染
      setTimeout(() => {
        if (map.value && typeof map.value.resize === 'function') {
          console.log('手动触发地图重绘');
          map.value.resize();
        }
      }, 100);
      
    } catch (err) {
      console.error('详情页地图初始化失败:', err);
      // 1秒后重试
      setTimeout(initMap, 1000);
    }
  }).catch(err => {
    console.error('加载高德地图脚本失败:', err);
    // 1秒后重试
    setTimeout(initMap, 1000);
  });
};

// 处理分享
const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: campsite.value?.title || '露营点详情',
      text: campsite.value?.features || '查看这个精彩的露营点',
      url: window.location.href
    }).catch(err => {
      console.log('分享失败:', err);
    });
  } else {
    // 复制链接到剪贴板作为后备方案
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('链接已复制到剪贴板');
    });
  }
};



// 其他方法保留
const showDetails = () => {
  // 实现展示详情的逻辑
  alert('展示详情功能');
};

const joinTeam = () => {
  // 实现组队功能
  alert('组队功能');
};

// 跳转到VR全景页面
const showVR = () => {
  if (campsite.value) {
    router.push({
      path: '/route/vr',
      query: {
        id: campsite.value.id,
        type: 'panorama'
      }
    });
  }
};

// 移除地图交互方法，只保留基本展示功能

const handleBooking = () => {
  // 预订逻辑
  alert('预订功能');
};

const handleContact = () => {
  // 联系营地逻辑
  alert('联系营地功能');
};

const handleAvatarError = (event) => {
  // 处理头像加载失败
  event.target.src = '/default-avatar.png';
};

const handleAvatarLoad = () => {
  // 处理头像加载成功
};

const ensureHeaderVisibility = () => {
  // 确保头部可见的逻辑
};

onMounted(() => {
  window.scrollTo(0, 0);
  ensureHeaderVisibility();
  
  // 初始化地图
  if (campsite.value) {
    initMap();
  }
});

// 监听营地数据变化，重新初始化地图
watch(campsite, (newCampsite) => {
  if (newCampsite && newCampsite.coordinates) {
    initMap();
  }
});
</script>

<style scoped>
/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #9C27B0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态样式 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 16px;
  text-align: center;
  padding: 20px;
}

.error-message {
  color: #d32f2f;
  font-size: 16px;
  margin: 0;
}

.retry-btn {
  padding: 8px 16px;
  background-color: #9C27B0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #673AB7;
}

.campsite-detail-page {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 顶部导航栏 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 9999;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.back-btn, .share-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.back-btn:hover, .share-btn:hover {
  background: #f5f5f5;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 主图区域 */
.hero-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.favorite-btn:hover {
  background: white;
  transform: scale(1.1);
}

.favorite-btn i {
  font-size: 18px;
  color: transparent;
  transition: color 0.2s;
  /* 设置边框以显示无色心形轮廓 */
  -webkit-text-stroke: 1.5px #ccc;
}

.favorite-btn i.favorited {
  color: #ff4757;
  /* 移除边框，显示实心 */
  -webkit-text-stroke: 0;
  font-weight: 900;
}

/* 露营地信息 */
.campsite-info {
  background: white;
  padding: 20px 16px;
  margin-bottom: 8px;
}

.campsite-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.campsite-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.campsite-tags {
  display: flex;
  gap: 8px;
  margin-left: 12px;
}

.tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 等级标签颜色 */
.level-leisure {
  background: #e8f5e8;
  color: #4caf50;
}

.level-intermediate {
  background: #fff3e0;
  color: #ff9800;
}

.level-challenge {
  background: #ffebee;
  color: #f44336;
}

.level-extreme {
  background: #f3e5f5;
  color: #9c27b0;
}

/* 类型标签颜色 */
.type-photo {
  background: #e3f2fd;
  color: #2196f3;
}

.type-family {
  background: #fff8e1;
  color: #ff9800;
}

.type-team {
  background: #e8f5e8;
  color: #4caf50;
}

.type-lakeside {
  background: #e0f2f1;
  color: #009688;
}

.type-hiking {
  background: #f1f8e9;
  color: #689f38;
}

.location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.location i {
  color: #999;
}

/* 统计信息卡片 */
.stats-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #4caf50;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

/* 内容区域 */
.features-section,
.facilities-section {
  background: white;
  padding: 20px 16px;
  margin-bottom: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.features-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.facilities-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.facility-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #333;
}

.facility-item i {
  color: #4caf50;
  font-size: 16px;
}

/* 操作按钮 */
.action-buttons {
  background: white;
  padding: 16px;
  margin-bottom: 8px;
  display: flex;
  gap: 12px;
  flex-direction: row; /* 确保水平布局 */
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.vr-btn {
  color: #2196f3;
  border-color: #2196f3;
}

.details-btn {
  color: #4caf50;
  border-color: #4caf50;
}

.team-btn {
  color: #ff9800;
  border-color: #ff9800;
}

.action-btn i {
  font-size: 18px;
}

/* 地图区域 */
.map-section {
  height: 200px;
  position: relative;
  margin: 0 16px 8px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #e8f4f8; /* 添加背景色，与路线列表地图样式一致 */
}

.map-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
}

.map-control-btn {
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  font-size: 14px;
  color: #333;
}

.map-control-btn:hover {
  background: #f5f5f5;
  border-color: #4caf50;
  color: #4caf50;
}

.map-brand {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 预订和联系按钮 */
.booking-section {
  padding: 16px;
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  flex-direction: row; /* 确保水平布局 */
}

.book-btn, .contact-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.book-btn {
  background: #4caf50;
  color: white;
}

.book-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.contact-btn {
  background: #2196f3;
  color: white;
}

.contact-btn:hover {
  background: #1976d2;
  transform: translateY(-2px);
}

/* 用户评价 */
.reviews-section {
  background: white;
  padding: 20px 16px;
  margin-bottom: 8px;
  padding-bottom: 100px; /* 为底部导航栏留出空间 */
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-item {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reviewer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.reviewer-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.review-rating i {
  font-size: 12px;
  color: #ddd;
}

.review-rating i.filled {
  color: #ffc107;
}

.review-content {
  margin-left: 52px;
}

.review-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin: 0 0 8px 0;
}

.review-image {
  margin: 8px 0;
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
}

.review-image img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.review-date {
  font-size: 12px;
  color: #999;
}

/* 大屏幕优化 */
@media (min-width: 1200px) {
  .campsite-detail-page {
    max-width: 1200px;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
  
  .hero-image {
    height: 400px;
  }
  
  .campsite-info {
    padding: 30px 24px;
  }
  
  .features-section,
  .facilities-section,
  .reviews-section {
    padding: 30px 24px;
  }
  
  .action-buttons {
    padding: 24px;
    gap: 16px;
  }
  
  .map-section {
    height: 300px;
    margin: 0 24px 16px 24px;
  }
  
  .booking-section {
    padding: 24px;
  }
  
  .reviews-section {
    padding: 30px 24px;
    padding-bottom: 100px;
  }
}

/* 平板横屏优化 */
@media (min-width: 769px) and (max-width: 1199px) {
  .campsite-detail-page {
    max-width: 100%;
    padding: 0 20px;
  }
  
  .hero-image {
    height: 300px;
  }
  
  .campsite-info {
    padding: 24px 20px;
  }
  
  .features-section,
  .facilities-section,
  .reviews-section {
    padding: 24px 20px;
  }
  
  .map-section {
    height: 250px;
    margin: 0 20px 16px 20px;
  }
  
  .booking-section {
    padding: 20px;
  }
  
  .reviews-section {
    padding: 24px 20px;
    padding-bottom: 100px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .campsite-detail-page {
    padding: 0;
  }

  .header {
    padding: 12px 16px;
  }

  .title {
    font-size: 16px;
  }

  .campsite-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
  }
  
  .campsite-tags {
    margin-left: 0;
    margin-top: 8px;
  }

  .hero-image {
    height: 200px;
  }

  .hero-overlay {
    padding: 16px;
  }

  .hero-title {
    font-size: 20px;
    margin-bottom: 8px;
  }

  .hero-location {
    font-size: 14px;
  }

  .hero-rating {
    font-size: 14px;
  }

  .content {
    padding: 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .info-item {
    padding: 12px;
  }

  .info-label {
    font-size: 12px;
  }

  .info-value {
    font-size: 16px;
  }

  .section {
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .features-text {
    font-size: 14px;
    line-height: 1.6;
  }

  .facilities-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .facility-item {
    padding: 12px;
    font-size: 14px;
  }

  .action-buttons {
    flex-direction: row; /* 移动端也保持水平布局 */
    gap: 8px; /* 减少间距以适应小屏幕 */
  }

  .action-btn {
    flex: 1; /* 平均分布 */
    padding: 12px 8px; /* 调整内边距 */
    font-size: 14px; /* 稍微减小字体 */
  }

  .map-section {
    height: 200px;
    margin: 16px 0;
  }

  .booking-section {
    flex-direction: row; /* 移动端也保持水平布局 */
    padding: 16px;
    gap: 8px; /* 减少间距以适应小屏幕 */
  }

  .book-btn, .contact-btn {
    flex: 1; /* 平均分布 */
    padding: 12px 8px; /* 调整内边距 */
    font-size: 14px; /* 稍微减小字体 */
  }

  .booking-price {
    font-size: 20px;
  }

  .booking-btn {
    width: 100%;
    padding: 14px;
    font-size: 16px;
  }

  .reviews-section {
    padding: 16px;
    padding-bottom: 100px; /* 为底部导航栏留出空间 */
  }

  .reviews-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .reviews-title {
    font-size: 16px;
  }

  .reviews-count {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 10px 12px;
  }

  .back-btn, .share-btn {
    font-size: 16px;
    padding: 6px;
  }

  .title {
    font-size: 15px;
  }

  .hero-image {
    height: 180px;
  }

  .hero-overlay {
    padding: 12px;
  }

  .hero-title {
    font-size: 18px;
  }

  .hero-location {
    font-size: 13px;
  }

  .content {
    padding: 12px;
  }

  .info-grid {
    gap: 8px;
    margin-bottom: 16px;
  }

  .info-item {
    padding: 10px;
  }

  .info-label {
    font-size: 11px;
  }

  .info-value {
    font-size: 15px;
  }

  .section {
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 15px;
    margin-bottom: 10px;
  }

  .features-text {
    font-size: 13px;
    line-height: 1.5;
  }

  .facility-item {
    padding: 10px;
    font-size: 13px;
  }

  .action-buttons {
    flex-direction: row; /* 小屏幕也保持水平布局 */
    gap: 6px; /* 进一步减少间距 */
  }

  .action-btn {
    flex: 1; /* 平均分布 */
    padding: 10px 6px; /* 调整内边距 */
    font-size: 13px; /* 减小字体以适应小屏幕 */
  }

  .map-section {
    height: 180px;
    margin: 12px 0;
  }

  .booking-section {
    padding: 12px;
    flex-direction: row; /* 小屏幕也保持水平布局 */
    gap: 6px; /* 进一步减少间距 */
  }

  .book-btn, .contact-btn {
    flex: 1; /* 平均分布 */
    padding: 10px 6px; /* 调整内边距 */
    font-size: 13px; /* 减小字体以适应小屏幕 */
  }

  .booking-price {
    font-size: 18px;
  }

  .reviews-section {
    padding: 12px;
    padding-bottom: 100px; /* 为底部导航栏留出空间 */
  }

  .reviews-title {
    font-size: 15px;
  }

  .reviews-count {
    font-size: 13px;
  }
}
</style>
