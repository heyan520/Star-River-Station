<template>
  <div class="campsite-list-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在加载露营地信息...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ error }}</p>
      <button class="retry-btn" @click="loadCampsites">重试</button>
    </div>

    <!-- 内容区域 -->
    <div v-else class="content-wrapper">
      <!-- 顶部导航栏 -->
      <div class="header">
        <button class="back-btn" @click="goBack">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="title">露营地列表</h1>
        <button class="search-btn" @click="handleSearch">
          <i class="fas fa-search"></i>
        </button>
      </div>

      <!-- 地图区域 -->
      <div class="map-section">
        <div id="campsite-map-container" class="map-container">
          <div class="amap-logo" style="position: absolute; bottom: 0; right: 0; z-index: 100;">
            <img src="https://a.amap.com/jsapi_demos/static/demo-center/images/amap-logo.png" alt="高德地图" style="width: 50px; height: 25px;">
          </div>
        </div>
        <div class="map-brand">
          <span>高德地图</span>
        </div>
      </div>

      <!-- 筛选器 -->
      <div class="filter-section">
        <div class="filter-item" @click="toggleTypeFilter">
          <span class="filter-text">{{ selectedType || '类型' }}</span>
          <i class="fas fa-chevron-down arrow" :class="{ 'rotate': showTypeDropdown }"></i>
          <!-- 类型下拉框 -->
          <div class="dropdown-menu" v-if="showTypeDropdown">
            <div class="dropdown-item" @click="selectType('全部')">全部</div>
            <div class="dropdown-item" @click="selectType('摄影')">摄影</div>
            <div class="dropdown-item" @click="selectType('亲子')">亲子</div>
            <div class="dropdown-item" @click="selectType('团建')">团建</div>
            <div class="dropdown-item" @click="selectType('湖边')">湖边</div>
            <div class="dropdown-item" @click="selectType('山林')">山林</div>
          </div>
        </div>
        <div class="filter-item" @click="toggleAreaFilter">
          <span class="filter-text">{{ selectedArea || '区域' }}</span>
          <i class="fas fa-chevron-down arrow" :class="{ 'rotate': showAreaDropdown }"></i>
          <!-- 区域下拉框 -->
          <div class="dropdown-menu" v-if="showAreaDropdown">
            <div class="dropdown-item" @click="selectArea('全部')">全部</div>
            <div class="dropdown-item" @click="selectArea('主城')">主城</div>
            <div class="dropdown-item" @click="selectArea('东部')">东部</div>
            <div class="dropdown-item" @click="selectArea('西部')">西部</div>
            <div class="dropdown-item" @click="selectArea('南部')">南部</div>
            <div class="dropdown-item" @click="selectArea('北部')">北部</div>
          </div>
        </div>
        <div class="filter-item" @click="toggleLevelFilter">
          <span class="filter-text">{{ selectedLevel || '等级' }}</span>
          <i class="fas fa-chevron-down arrow" :class="{ 'rotate': showLevelDropdown }"></i>
          <!-- 等级下拉框 -->
          <div class="dropdown-menu" v-if="showLevelDropdown">
            <div class="dropdown-item" @click="selectLevel('全部')">全部</div>
            <div class="dropdown-item" @click="selectLevel('休闲')">休闲</div>
            <div class="dropdown-item" @click="selectLevel('综合')">综合</div>
            <div class="dropdown-item" @click="selectLevel('挑战')">挑战</div>
            <div class="dropdown-item" @click="selectLevel('极限')">极限</div>
          </div>
        </div>
      </div>

      <!-- 下拉框遮罩 -->
      <div class="dropdown-overlay" v-if="showTypeDropdown || showAreaDropdown || showLevelDropdown" @click="closeAllDropdowns"></div>

      <!-- 露营地列表 -->
      <div class="campsite-list">
        <div 
          v-for="campsite in filteredCampsites" 
          :key="campsite.id" 
          class="campsite-card"
          @click="viewCampsiteDetail(campsite)"
        >
          <div class="image-container">
            <img class="campsite-image" :src="campsite.image" :alt="campsite.title" />
          </div>
          <div class="campsite-content">
            <h3 class="campsite-title">{{ campsite.title }}</h3>
            <div class="campsite-tags">
              <span 
                v-for="tag in campsite.tags" 
                :key="tag.text"
                :class="['tag', tag.type]"
              >
                {{ tag.text }}
              </span>
            </div>
            <p class="campsite-description">{{ campsite.description }}</p>
            <div class="campsite-rating">
              <div class="stars">
                <i v-for="n in 5" :key="n" class="fas fa-star" :class="{ 'filled': n <= Math.floor(campsite.rating), 'half': n === Math.ceil(campsite.rating) && campsite.rating % 1 !== 0 }"></i>
              </div>
              <span class="rating-text">{{ campsite.rating }} ({{ campsite.reviews }})</span>
            </div>
          </div>
          <div class="campsite-actions">
            <button class="view-detail-btn" @click.stop="viewCampsiteDetail(campsite)">
              查看详情
            </button>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-if="filteredCampsites.length === 0" class="empty-state">
          <div class="empty-icon">🏕️</div>
          <p class="empty-text">没有找到符合条件的露营地</p>
          <button 
            v-if="selectedType || selectedArea || selectedLevel" 
            class="clear-filter-btn" 
            @click="clearFilters"
          >
            清除筛选条件
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useCampsiteList } from '../composables/useCampsiteList';

// 从useCampsiteList中解构所需的状态和方法
const {
  loading,
  error,
  campsites,
  filteredCampsites,
  selectedType,
  selectedArea,
  selectedLevel,
  showTypeDropdown,
  showAreaDropdown,
  showLevelDropdown,
  loadCampsites,
  initMap,
  loadAmapScript,
  toggleTypeFilter,
  toggleAreaFilter,
  toggleLevelFilter,
  selectType,
  selectArea,
  selectLevel,
  closeAllDropdowns,
  handleSearch,
  clearFilters,
  goBack,
  viewCampsiteDetail
} = useCampsiteList();

// 在页面挂载后执行
onMounted(async () => {
  // 加载露营地数据
  await loadCampsites();
  
  // 延迟初始化地图，与路线列表保持一致的方式
  setTimeout(() => {
    loadAmapScript().then(() => {
      initMap();
    }).catch(err => {
      console.error('地图加载失败:', err);
    });
  }, 500);
});

// 移除了地图交互功能，只保留基本展示
</script>

<style scoped>
.campsite-list-page {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  overflow: visible;
}

/* 加载状态样式 - 增强版 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f5f5f5;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(66, 133, 244, 0.2);
  border-top: 4px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  box-shadow: 0 0 15px rgba(66, 133, 244, 0.15);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
  font-size: 16px;
  font-weight: 500;
}

/* 错误状态样式 - 增强版 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f5f5f5;
  padding: 0 24px;
  text-align: center;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.8;
}

.error-message {
  color: #d32f2f;
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.5;
  max-width: 500px;
}

.retry-btn {
  background: #4285f4;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
}

.retry-btn:hover {
  background: #3367d6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.4);
}

/* 空状态样式 - 增强版 */
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 24px;
  color: #666;
  text-align: center;
  background: white;
  margin: 20px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.8;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 20px;
  color: #666;
  line-height: 1.5;
}

.clear-filter-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.clear-filter-btn:hover {
  background: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
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
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.95);
}

.back-btn, .search-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.back-btn:hover, .search-btn:hover {
  background: #f5f5f5;
  color: #4285f4;
  transform: scale(1.05);
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 地图区域 - 确保容器有明确尺寸 */
.map-section {
  height: 300px;
  min-height: 300px;
  position: relative;
  flex-shrink: 0;
  margin: 0 16px 16px 16px;
  padding: 0;
  width: calc(100% - 32px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5; /* 添加背景色以便在地图加载前可见 */
  transition: all 0.3s ease;
}

/* 确保地图容器有明确的固定尺寸，这对高德地图初始化至关重要 */
.map-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: relative;
  margin: 0;
  padding: 0;
  border: none;
  z-index: 1; /* 确保在正确的层级 */
  background-color: transparent;
}

/* 地图加载样式已移除 */

/* 模拟标记的样式增强 */
.mock-marker {
  transition: all 0.2s ease;
}

.mock-marker:hover {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
  background-color: #3367d6;
}

/* 地图控制按钮增强 */
.map-control-btn {
  transition: all 0.2s ease;
}

.map-control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 1);
}

.map-control-btn:active {
  transform: translateY(0);
}

/* 错误状态下的地图区域样式 */
.map-section.error {
  border: 2px dashed #d32f2f;
  background-color: #ffebee;
}

/* 地图品牌标识样式增强 */
.map-brand {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 12px;
  color: #666;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 100;
  pointer-events: none;
}

.map-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
}

.map-control-btn {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ddd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  font-size: 16px;
}

.map-control-btn:hover {
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.location-btn {
  background: rgba(66, 133, 244, 0.95);
  color: white;
  border-color: #4285f4;
}

.location-btn:hover {
  background: #4285f4;
}

.map-brand {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 筛选器 */
.filter-section {
  display: flex;
  background: white;
  padding: 16px;
  gap: 16px;
  margin: 0 16px 16px 16px;
  position: relative;
  flex-shrink: 0;
  width: calc(100% - 32px);
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: visible;
  z-index: 100;
}

.filter-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  min-width: 0;
  overflow: visible;
}

.filter-item:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.filter-text {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow {
  font-size: 12px;
  color: #666;
  transition: transform 0.3s ease;
  flex-shrink: 0;
  margin-left: 8px;
}

.arrow.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  margin-top: 4px;
  animation: slideDown 0.2s ease-out;
  overflow: visible;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  color: #333;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f0f5ff;
  color: #4285f4;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

/* 露营地列表 */
.campsite-list {
  padding: 0 0 80px 0;
  background: #f5f5f5;
  width: 100%;
  position: relative;
  z-index: 1;
}

.campsite-card {
  background: white;
  border-radius: 12px;
  margin: 0 16px 16px 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 12px;
  width: calc(100% - 32px);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.campsite-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.image-container {
  width: 100px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.campsite-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.campsite-card:hover .campsite-image {
  transform: scale(1.05);
}

.campsite-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.campsite-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.campsite-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.level-beginner { background: #e8f5e9; color: #4caf50; }
.level-intermediate { background: #fff3e0; color: #ff9800; }
.level-advanced { background: #ffebee; color: #f44336; }
.level-extreme { background: #f3e5f5; color: #9c27b0; }
.type-photo { background: #e3f2fd; color: #2196f3; }
.type-family { background: #fce4ec; color: #e91e63; }
.type-hiking { background: #e8f5e9; color: #4caf50; }

.campsite-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.campsite-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  font-size: 14px;
  color: #ddd;
}

.stars i.filled, .stars i.half {
  color: #ffc107;
}

.rating-text {
  font-size: 12px;
  color: #666;
}

.view-detail-btn {
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.view-detail-btn:hover {
  background: #45a049;
  transform: scale(1.05);
}

/* 地图样式 */
.map-section {
  margin: 0 16px 16px 16px;
  width: calc(100% - 32px);
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #f0f0f0;
}

.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}



.map-brand {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-section {
    margin: 0 12px 12px 12px;
    width: calc(100% - 24px);
    height: 250px;
  }
  
  .filter-section {
    margin: 0 12px 12px 12px;
    width: calc(100% - 24px);
    padding: 12px;
    gap: 12px;
  }
  
  .filter-item {
    padding: 10px 12px;
  }
  
  .campsite-card {
    flex-direction: column;
    padding: 16px;
    margin: 0 12px 12px 12px;
    width: calc(100% - 24px);
  }
  
  .image-container {
    width: 100%;
    height: 160px;
  }
  
  .campsite-content {
    margin-top: 8px;
  }
  
  .campsite-actions {
    margin-top: 12px;
    width: 100%;
  }
  
  .view-detail-btn {
    width: 100%;
  }
  
  .error-icon, .empty-icon {
    font-size: 48px;
  }
}

@media (min-width: 769px) {
  .campsite-list-page {
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* 性能优化 */
.campsite-card, .header, .map-section {
  will-change: transform;
}

/* 平滑过渡 */
* {
  scroll-behavior: smooth;
}
</style>
