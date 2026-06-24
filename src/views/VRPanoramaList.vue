<template>
  <div class="vr-panorama-list">
    <!-- 顶部导航栏 -->
    <header class="top-nav">
      <button class="nav-btn left-btn" @click="goBack">
        <span>返回</span>
      </button>
      <h1 class="nav-title">VR全景体验</h1>
      <div class="nav-placeholder"></div>
    </header>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 介绍卡片 -->
      <div class="intro-card">
        <h2>全景探索</h2>
        <p>通过VR全景技术，身临其境体验热门营地和路线的壮美景色</p>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalPanoramas }}</span>
            <span class="stat-label">全景体验</span>
          </div>
        </div>
      </div>
      
      <!-- 筛选 -->
      <div class="filters-row">
        <select class="filter-select" v-model="selectedType" @change="filterItems">
          <option value="">全部类型</option>
          <option value="campsite">营地</option>
          <option value="route">路线</option>
        </select>
      </div>
      
      <!-- 全景列表 -->
      <div class="panoramas-grid">
        <div class="panorama-card" v-for="item in filteredItems" :key="`${item.type}-${item.id}`" @click="goToPanorama(item)">
          <div class="panorama-image-container">
            <img :src="item.imageUrl" :alt="item.name" class="panorama-image" />
            <div class="vr-badge">
              <i class="fas fa-vr-cardboard"></i>
              <span>{{ item.type === 'campsite' ? '营地全景' : '路线全景' }}</span>
            </div>
            <div class="item-type-badge" :class="item.type">
              {{ item.type === 'campsite' ? '营地' : '路线' }}
            </div>
          </div>
          <div class="panorama-info">
            <h3 class="panorama-title">{{ item.name }}</h3>
            <p class="panorama-description">{{ item.description }}</p>
          </div>
        </div>
        
        <!-- 无结果提示 -->
        <div class="no-result" v-if="filteredItems.length === 0">
          <i class="fas fa-vr-cardboard text-4xl text-gray-300"></i>
          <p>没有找到符合条件的VR全景体验</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { routesData } from '../data/routeData.js';
import { campsitesData } from '../data/campsitesData.js';

const router = useRouter();

// 从数据文件导入路线和营地数据
const allRoutes = ref(routesData);
const allCampsites = ref(campsitesData);

// 筛选条件
const selectedType = ref('');

// 处理数据：统一格式并筛选有VR全景的项目
const allPanoramas = computed(() => {
  // 处理路线数据
  const routeItems = allRoutes.value
    .filter(route => route.vrPanorama)
    .map(route => ({
      id: route.id,
      name: route.name,
      imageUrl: route.imageUrl,
      description: route.description,
      type: 'route'
    }));
    
  // 处理营地数据
  const campsiteItems = allCampsites.value
    .filter(campsite => campsite.vrPanorama)
    .map(campsite => ({
      id: campsite.id,
      name: campsite.title,
      imageUrl: campsite.image,
      description: campsite.description,
      type: 'campsite'
    }));
    
  // 合并数据
  return [...routeItems, ...campsiteItems];
});

// 根据筛选条件计算显示的项目
const filteredItems = computed(() => {
  if (!selectedType.value) {
    return allPanoramas.value;
  }
  return allPanoramas.value.filter(item => item.type === selectedType.value);
});

// 统计信息
const totalPanoramas = computed(() => allPanoramas.value.length);

// 跳转到VR全景页面
const goToPanorama = (item) => {
  router.push({
    path: '/route/vr',
    query: {
      id: item.id,
      type: item.type
    }
  });
};

// 筛选项目
const filterItems = () => {
  // 筛选逻辑已经通过computed属性处理
};

// 返回上一页
const goBack = () => {
  router.go(-1);
};

onMounted(() => {
  // 页面加载后的初始化逻辑
});
</script>

<style scoped>
.vr-panorama-list {
  min-height: 100vh;
  background-color: #f9f9f9;
  position: relative;
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

.left-btn {
  left: 16px;
}

.nav-placeholder {
  width: 80px;
  position: absolute;
  right: 16px;
}

/* 主内容区 */
.main-content {
  position: absolute;
  top: 50px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 20px;
  background-color: #f9f9f9;
  z-index: 1;
  max-width: 420px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

/* 介绍卡片 */
.intro-card {
  background: linear-gradient(135deg, #9C27B0, #673AB7);
  border-radius: 16px;
  padding: 20px;
  color: white;
  margin-bottom: 16px;
}

.intro-card h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.intro-card p {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 16px;
}

.stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 20px;
  font-weight: 600;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

/* 筛选栏 */
.filters-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.filter-select {
  flex: 1;
  max-width: 100%;
  width: 100%;
  padding: 8px 12px;
  padding-right: 30px;
  border-radius: 20px;
  border: 1px solid #eee;
  background-color: #fff;
  font-size: 14px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  outline: none;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

/* 全景网格 */
.panoramas-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 全景卡片 */
.panorama-card {
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.panorama-card:active {
  transform: scale(0.99);
}

/* 全景图片容器 */
.panorama-image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.panorama-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.panorama-card:hover .panorama-image {
  transform: scale(1.05);
}

/* VR全景标识 */
.vr-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(156, 39, 176, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.vr-badge i {
  font-size: 12px;
}

/* 项目类型标识 */
.item-type-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.item-type-badge.campsite {
  background-color: rgba(76, 175, 80, 0.9);
  color: white;
}

.item-type-badge.route {
  background-color: rgba(33, 150, 243, 0.9);
  color: white;
}

/* 全景信息 */
.panorama-info {
  padding: 16px;
}

.panorama-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.panorama-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 无结果提示 */
.no-result {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}

.no-result i {
  margin-bottom: 16px;
  display: block;
}

/* 滚动条优化 */
.main-content::-webkit-scrollbar {
  width: 4px;
}

.main-content::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 2px;
}

/* 移动端优化 */
@media (max-width: 420px) {
  .main-content {
    max-width: 100%;
    padding: 12px;
  }
  
  .panorama-image-container {
    height: 160px;
  }
  
  .intro-card h2 {
    font-size: 22px;
  }
}
</style>