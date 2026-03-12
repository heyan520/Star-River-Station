<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="top-nav">
      <button class="nav-btn left-btn" onclick="history.back()">
        <span>返回</span>
      </button>
      <h1 class="nav-title">自驾游路线</h1>
      <button class="nav-btn right-btn">
        <span>搜索</span>
      </button>
    </header>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 地图容器 -->
      <div id="mapContainer" class="map-wrapper"></div>
      
      <!-- 筛选 -->
      <div class="filters-row">
        <select class="filter-select" v-model="selectedType" @change="filterRoutes">
          <option value="">类型</option>
          <option>沿海</option>
          <option>山区</option>
          <option>古镇</option>
          <option>特色</option>
          <option>郊区</option>
          <option>原始</option>
        </select>
        
        <select class="filter-select" v-model="selectedDuration" @change="filterRoutes">
          <option value="">时长</option>
          <option>1日游</option>
          <option>2-3日</option>
          <option>5日以上</option>
        </select>
        
        <select class="filter-select" v-model="selectedLevel" @change="filterRoutes">
          <option value="">等级</option>
          <option>休闲</option>
          <option>综合</option>
          <option>挑战</option>
          <option>极限</option>
        </select>
      </div>
      
      <!-- 路线列表 -->
      <div class="routes-list">
        <div class="route-card" v-for="(route, index) in filteredRoutes" :key="route.id">
          <img :src="route.imageUrl" :alt="route.name" class="route-img">
          <div class="route-info">
            <h3 class="route-title">{{ route.name }}</h3>
            <div class="route-tags">
              <span class="level-tag" :class="getLevelClass(route.level)">{{ route.level }}级</span>
              <span class="theme-tag">{{ route.theme }}</span>
            </div>
            <p class="route-desc">{{ route.description }}</p>
            <div class="route-meta">
                <div class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 576 512" fill="currentColor">
                    <path d="M384 64C384 28.65 355.3 0 320 0C284.7 0 256 28.65 256 64V288L128 384L144 399.1L272 319.1V64C272 28.65 294.7 0 320 0C345.3 0 368 28.65 368 64V288L496 384L512 399.1L384 319.1V64z"/>
                  </svg>
                  <span>{{ route.distance }}</span>
                </div>
                <div class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
                  </svg>
                  <span>{{ route.duration }}</span>
                </div>
                <div class="btn-group">
                  <button class="detail-btn" @click="goToDetail(route.id)">
                    查看详情
                  </button>

                </div>
              </div>
          </div>
        </div>
        
        <!-- 无结果提示 -->
        <div class="no-result" v-if="filteredRoutes.length === 0">
          <i class="fas fa-search"></i>
          <p>没有找到符合条件的路线</p>
        </div>
      </div>
    </main>
    
    <!-- 底部导航栏 -->
    <footer class="bottom-nav">
      <div class="nav-item">
        <i class="fas fa-home"></i>
        <span>首页</span>
      </div>
      <div class="nav-item">
        <i class="fas fa-shopping-bag"></i>
        <span>商城</span>
      </div>
      <div class="nav-item">
        <i class="fas fa-map-marker-alt"></i>
        <span>附近</span>
      </div>
      <div class="nav-item">
        <i class="fas fa-user"></i>
        <span>我的</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getAllRoutes } from '../data/routeData.js';

const router = useRouter();

const goToDetail = (routeId) => {
  router.push({
    name: 'route-detail',
    query: { id: routeId }
  });
};
// 从数据文件导入路线数据
const allRoutes = ref(getAllRoutes());

const selectedType = ref('');
const selectedDuration = ref('');
const selectedLevel = ref('');

let mapInstance = null;

// 根据筛选条件计算显示的路线
const filteredRoutes = computed(() => {
  return allRoutes.value.filter(route => {
    if (selectedType.value && route.theme !== selectedType.value) {
      return false;
    }

    if (selectedLevel.value && route.level !== selectedLevel.value) {
      return false;
    }

    if (selectedDuration.value) {
      if (selectedDuration.value === '1日游') {
        if (!route.duration.includes('1日') && !route.duration.includes('1-2')) {
          return false;
        }
      }
      else if (selectedDuration.value === '2-3日') {
        if (!(route.duration.includes('2-3') || route.duration.includes('2') || route.duration.includes('3'))) {
          return false;
        }
      }
      else if (selectedDuration.value === '5日以上') {
        if (!route.duration.includes('5') && !route.duration.includes('7') &&
          !route.duration.includes('10')) {
          return false;
        }
      }
    }

    return true;
  });
});

const getLevelClass = (level) => {
  const levelMap = {
    "休闲": "level-low",
    "舒适": "level-medium",
    "挑战": "level-high",
    "极限": "level-extreme"
  };
  return levelMap[level] || "";
};

// 筛选路线并更新地图标记
const filterRoutes = () => {
  if (mapInstance) {
    mapInstance.remove(mapInstance.getAllOverlays('marker'));

    const markers = filteredRoutes.value.map(route => {
      return new window.AMap.Marker({
        position: route.coordinates,
        title: route.name
      });
    });

    mapInstance.add(markers);
  }
  setTimeout(initLazyLoading, 0);
};

// 在页面挂载后初始化地图
onMounted(() => {
  initLazyLoading();

  setTimeout(() => {
    loadAmapScript().then(() => {
      initMap();
    }).catch(err => {
      console.error('地图加载失败:', err);
    });
  }, 500);
});

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.destroy();
    mapInstance = null;
  }
});

// 初始化图片懒加载
function initLazyLoading() {
  const images = document.querySelectorAll('.route-img:not([data-loaded])');

  const loadImage = (img) => {
    if (img.getAttribute('data-loaded')) return;

    const src = img.src;
    img.src = '';

    const tempImg = new Image();
    tempImg.src = src;
    tempImg.onload = () => {
      img.src = src;
      img.setAttribute('data-loaded', 'true');
      img.classList.add('loaded');
    };
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadImage(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });

  images.forEach(img => observer.observe(img));
}

function loadAmapScript() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap);
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://webapi.amap.com/maps?v=2.0&key=dfd36d667109b8826702b8b69ca42af3';
    script.onerror = reject;
    script.onload = () => resolve(window.AMap);
    document.head.appendChild(script);
  });
}

// 初始化地图
function initMap() {
  mapInstance = new window.AMap.Map('mapContainer', {
    zoom: 2.5,
    center: [110.0, 37.0],
    resizeEnable: true,
    features: ['road', 'point']
  });

  window.AMap.plugin(
    [
      "AMap.ToolBar",
      "AMap.Geolocation"
    ],
    () => {
      mapInstance.addControl(new window.AMap.ToolBar({
        position: 'RT'
      }));

      mapInstance.addControl(new window.AMap.Geolocation({
        position: 'RB',
        showButton: true,
        panToLocation: true
      }));
    }
  );

  filterRoutes();
}
</script>

<style scoped>
/* 基础样式重置与统一 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 禁用全局滚动条 */
html, body {
  height: 100%;
  overflow: hidden;
}

.app-container {
  max-width: 420px;
  margin: 0 auto;
  height: 100vh;
  background-color: #f9f9f9;
  position: relative;
  overflow: hidden;
}

/* 顶部导航 */
.top-nav {
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 420px;
  z-index: 100;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.nav-btn {
  position: absolute;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: 15px;
  color: #333;
  padding: 6px 10px;
  border-radius: 15px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.nav-btn i {
  margin-right: 4px;
  font-size: 14px;
}

.left-btn {
  left: 16px;
}

.right-btn {
  right: 16px;
}

/* 主内容区 */
.main-content {
  position: absolute;
  top: 50px; /* 顶部导航高度 */
  bottom: 55px; /* 底部导航高度 */
  left: 0;
  right: 0;
  overflow-y: auto;
  padding: 16px;
  background-color: #f9f9f9;
  z-index: 1;
}

/* 地图样式 */
.map-wrapper {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  background-color: #e8f4f8;
}

/* 筛选栏 */
.filters-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.filter-select {
  flex: 1;
  padding: 8px 12px;
  padding-right: 30px;
  border-radius: 20px;
  border: 1px solid #eee;
  background-color: #fff;
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  outline: none;
}

/* 路线列表 */
.routes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.route-card {
  display: flex;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

.route-card:active {
  transform: scale(0.99);
}

.route-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  background-color: #f0f0f0;
  opacity: 0;
  transition: opacity 0.3s;
}

.route-img.loaded {
  opacity: 1;
}

.route-info {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.route-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.route-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.level-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.theme-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: #e8f4f8;
  color: #1e88e5;
  font-weight: 500;
}

.level-low {
  background-color: #e8f5e9;
  color: #43a047;
}

.level-medium {
  background-color: #fff8e1;
  color: #ffb300;
}

.level-high {
  background-color: #ffebee;
  color: #e53935;
}

.level-extreme {
  background-color: #f3e5f5;
  color: #8e24aa;
}

.route-desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.route-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #888;
  margin-right: 12px;
}

.meta-item i {
  font-size: 12px;
  margin-right: 4px;
}

.detail-btn {
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
}

/* 底部导航 */
.bottom-nav {
  height: 55px;
  background-color: #fff;
  display: flex;
  border-top: 1px solid #eee;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 420px;
  z-index: 100;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 11px;
  gap: 4px;
}

.nav-item i {
  font-size: 20px;
}

.nav-item.active {
  color: #4caf50;
}

/* 滚动条优化 */
.main-content::-webkit-scrollbar {
  width: 4px;
}

.main-content::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 2px;
}

.no-result {
  text-align: center;
  padding: 40px 20px;
  color: #888;
}

.no-result i {
  font-size: 32px;
  margin-bottom: 12px;
  display: block;
  color: #ddd;
}

/* 移动端优化 */
@media (max-width: 420px) {
  .app-container {
    max-width: 100%;
  }
  
  .top-nav,
  .bottom-nav {
    max-width: 100%;
  }
  
  .main-content {
    padding: 12px;
  }
  
  .route-card {
    margin-bottom: 8px;
  }
  
  .route-img {
        width: 141px;
        height: 200px;
  }
  
  .route-info {
    padding: 10px;
  }
}

/* 确保在移动设备上正确显示 */
@media (max-width: 768px) {
  .app-container {
    width: 100%;
    max-width: 100%;
  }
}

/* 针对不同高度的设备优化 */
@media (max-height: 600px) {
  .main-content {
    padding: 8px;
  }
  
  .map-wrapper {
    height: 150px;
  }
  
  .route-img {
    width: 70px;
    height: 70px;
  }
}

/* 针对横屏模式优化 */
@media (orientation: landscape) and (max-height: 500px) {
  .main-content {
    padding: 8px;
  }
  
  .map-wrapper {
    height: 120px;
  }
  
  .top-nav {
    height: 45px;
  }
  
  .bottom-nav {
    height: 50px;
  }
  
  .main-content {
    top: 45px;
    bottom: 50px;
  }
}



</style>