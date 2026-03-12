<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="top-nav">
      <button class="nav-btn left-btn" onclick="history.back()">
        <span>返回</span>
      </button>
      <h1 class="nav-title">路线详情</h1>
      <button class="nav-btn right-btn">
        <span>搜索</span>
      </button>
    </header>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部大图 -->
      <div class="top-banner" style="position: relative;">
        <img
          :src="routeDetail?.imageUrl || '/placeholder-image.jpg'"
          :alt="routeDetail?.name || '路线详情'"
          class="banner-img w-full h-64 object-cover"
        />
        <!-- 收藏按钮 -->
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
            <path 
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
              :fill="isFavorited ? '#ff4757' : 'none'"
            />
          </svg>
        </button>
      </div>

      <!-- 标题/难度/地点 -->
      <div class="title-section p-5 bg-white rounded-xl mt-[-10px] relative z-10">
        <div class="flex justify-between items-start mb-4">
          <div style="text-align: left;">
            <h1 class="text-xl font-bold mb-1" style="font-size: 1.7rem;">{{ routeDetail?.name || '路线名称' }}</h1>
            <div class="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 384 512" fill="currentColor">
                <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"/>
              </svg>
              <span>{{ routeDetail?.location || '未知位置' }}</span>
            </div>
          </div>
          <div class="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
            {{ routeDetail?.level || '未知' }}难度
          </div>
        </div>
        
        <!-- 关键数据 -->
        <div class="flex justify-around mb-6 p-3 bg-gray-50 rounded-xl">
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">{{ routeDetail?.distance || '0' }}</div>
            <div class="text-xs text-gray-500">公里</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">{{ routeDetail?.duration || '0' }}</div>
            <div class="text-xs text-gray-500">小时</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">{{ routeDetail?.rating || '0' }}</div>
            <div class="text-xs text-gray-500">评分</div>
          </div>
        </div>

        <!-- 路线亮点 -->
        <div class="highlight-section mb-6">
          <h2 class="section-title text-lg font-bold mb-2">路线亮点</h2>
          <p class="highlight-content text-gray-600">
            {{ routeDetail?.highlights || '暂无亮点信息' }}
          </p>
        </div>

        <!-- 安全提示 -->
        <div class="safety-tips mb-6">
          <h2 class="section-title text-lg font-bold mb-2">安全提示</h2>
          <ul class="text-gray-600 space-y-2">
            <li v-for="(tip, index) in (routeDetail?.safetyTips || [])" :key="index" class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500 mt-1 mr-2" viewBox="0 0 512 512" fill="currentColor">
                <path d="M256 32c123.5 0 223.4 100.3 223.4 224S379.5 480 256 480S32.6 379.7 32.6 256 132.5 32 256 32zm0 36.7c-114.3 0-206.7 92.4-206.7 206.6S141.7 481.3 256 481.3S462.7 388.9 462.7 274.6S370.3 68.7 256 68.7zm-23.6 146.1l95.7 95.7c3.8 3.8 3.8 10 0 13.8s-10 3.8-13.8 0l-71.9-71.9-28.9 28.9c-3.8 3.8-10 3.8-13.8 0s-3.8-10 0-13.8l42.7-42.7c3.8-3.8 10-3.8 13.8 0zm13.8-79.6c-12.5 0-22.7 10.2-22.7 22.7s10.2 22.7 22.7 22.7s22.7-10.2 22.7-22.7s-10.2-22.7-22.7-22.7z"/>
              </svg>
              <span>{{ tip }}</span>
            </li>
          </ul>
        </div>

        <!-- VR全景 -->
        <div class="vr-panorama-section mb-6">
          <div class="vr-card" :style="{ backgroundImage: `url('${routeDetail?.imageUrl || '/placeholder-image.jpg'}')` }">
            <div class="vr-content">
              <div class="vr-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512" fill="white">
                  <path d="M448 64H64C28.7 64 0 92.7 0 128v256c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64zM208 400h-48c-8.8 0-16-7.2-16-16V128c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v256c0 8.8-7.2 16-16 16zm192 0h-48c-8.8 0-16-7.2-16-16V128c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v256c0 8.8-7.2 16-16 16z"/>
                </svg>
              </div>
              <h3 class="vr-title">观景点VR全景</h3>
              <button class="vr-button" @click="showVR">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M448 64H64C28.7 64 0 92.7 0 128v256c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64zM208 400h-48c-8.8 0-16-7.2-16-16V128c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v256c0 8.8-7.2 16-16 16zm192 0h-48c-8.8 0-16-7.2-16-16V128c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v256c0 8.8-7.2 16-16 16z"/>
                </svg>
                <span>查看全景</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 功能按钮组 -->
        <div class="grid grid-cols-3 gap-3 mb-6">
          <button class="bg-blue-100 text-blue-600 py-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 512 512" fill="currentColor">
              <path d="M448 64H64C28.7 64 0 92.7 0 128v256c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64zM208 400h-48c-8.8 0-16-7.2-16-16V128c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v256c0 8.8-7.2 16-16 16zm192 0h-48c-8.8 0-16-7.2-16-16V128c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v256c0 8.8-7.2 16-16 16z"/>
            </svg> VR全景
          </button>
          <button class="bg-green-100 text-green-600 py-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 448 512" fill="currentColor">
              <path d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96V416c0 53 43 96 96 96H384h48c13.3 0 24-10.7 24-24V360h-32zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-17.2 30-33.4 30s-31.5-12.9-33.4-30z"/>
            </svg> 攻略列表
          </button>
          <button class="bg-orange-100 text-orange-600 py-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 640 512" fill="currentColor">
              <path d="M192 224c64.5 0 115.9-52.2 111.7-115.8c-1.1-14.8-20.7-22.2-31.5-13.6C258.2 95.8 222.7 96 192 96s-66.2-.2-72.2-8.2c-10.8-8.6-30.4-1.2-31.5 13.6C76.1 171.8 127.5 224 192 224zM384 224c64.5 0 115.9-52.2 111.7-115.8c-1.1-14.8-20.7-22.2-31.5-13.6C450.2 95.8 414.7 96 384 96s-66.2-.2-72.2-8.2c-10.8-8.6-30.4-1.2-31.5 13.6C276.1 171.8 327.5 224 384 224zM192 256c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64s64-28.7 64-64V320c0-35.3-28.7-64-64-64zm192 0c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64s64-28.7 64-64V320c0-35.3-28.7-64-64-64zM48 128c0-26.5 21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48zm544 256c0-26.5 21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48zM144 48C64.5 48 0 112.5 0 192s64.5 144 144 144s144-64.5 144-144s-64.5-144-144-144zm432 144c0-79.5-64.5-144-144-144s-144 64.5-144 144s64.5 144 144 144s144-64.5 144-144z"/>
            </svg> 组队
          </button>
        </div>

        <!-- 地图容器 -->
        <div class="map-section mb-6">
          <div id="routeDetailMap" class="map-container mb-6 h-64 bg-gray-200 rounded-xl" style="position: relative;"></div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex gap-3 mb-8">
          <button class="flex-1 bg-primary-500 text-white py-3 rounded-xl font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 512 512" fill="currentColor">
              <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.3c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 160H96c-8.8 0-16-7.2-16-16s7.2-16 16-16H432c8.8 0 16 7.2 16 16s-7.2 16-16 16z"/>
            </svg>下载路线
          </button>
          <button class="flex-1 bg-secondary-500 text-white py-3 rounded-xl font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 576 512" fill="currentColor">
              <path d="M384 64C384 28.65 355.3 0 320 0C284.7 0 256 28.65 256 64V288L128 384L144 399.1L272 319.1V64C272 28.65 294.7 0 320 0C345.3 0 368 28.65 368 64V288L496 384L512 399.1L384 319.1V64z"/>
            </svg>开始导航
          </button>
        </div>

        <!-- 用户评价 -->
        <h3 class="font-bold mb-4 border-b pb-2">用户评价 ({{ routeDetail?.reviews?.length || 0 }})</h3>
        <div class="space-y-4">
          <div v-for="(review, index) in (routeDetail?.reviews || [])" :key="index" class="flex">
            <div class="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
            <div class="flex-1">
              <div class="user_text">
                <h4 class="font-bold">{{ review.userName }}</h4>
                <div class="rating-stars">
                    <i v-for="(star, i) in 5" :key="i" class="fas fa-star" :class="{ 'text-yellow-400': i < review.rating, 'text-gray-300': i >= review.rating }"></i>
                  </div>
              </div>
              <p class="text-gray-600 text-sm my-1" style="text-indent: 2em;">{{ review.content }}</p>
              <!-- 评价图片 -->
              <div v-if="review.imageUrl" class="h-24 bg-cover bg-center rounded-lg mt-2" :style="{ backgroundImage: `url('${review.imageUrl}')` }"></div>
              <div class="text-xs text-gray-500 mt-1">{{ review.date }}</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部导航栏 -->
    <footer class="bottom-nav">
      <div class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 576 512" fill="currentColor">
          <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H192 160c-1.4 0-2.8 0-4.2-.1c-1.1 .1-2.2 .1-3.3 .1H104c-22.1 0-40-17.9-40-40V440c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11.8 24z"/>
        </svg>
        <span>首页</span>
      </div>
      <div class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 448 512" fill="currentColor">
          <path d="M128 0C110.3 0 96 14.3 96 32V96H48C21.5 96 0 117.5 0 144v48H48v288c0 26.5 21.5 48 48 48H352c26.5 0 48-21.5 48-48V192H448v-48c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32H128zM208 160c44.2 0 80 35.8 80 80s-35.8 80-80 80s-80-35.8-80-80s35.8-80 80-80zm-64 256H112V272c0-8.8 7.2-16 16-16s16 7.2 16 16v144zm96 0H192V272c0-8.8 7.2-16 16-16s16 7.2 16 16v144zm96 0H288V272c0-8.8 7.2-16 16-16s16 7.2 16 16v144z"/>
        </svg>
        <span>商城</span>
      </div>
      <div class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 384 512" fill="currentColor">
          <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"/>
        </svg>
        <span>附近</span>
      </div>
      <div class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 448 512" fill="currentColor">
          <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129.3-112H178.3c-66 0-120.3 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3V496c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32v-13.7z"/>
        </svg>
        <span>我的</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useRouteDetail } from '../composables/useRouteDetail.js';

// 使用composable
const {
  routeDetail,
  loading,
  error,
  isFavorited,
  loadRoute,
  toggleFavorite
} = useRouteDetail();

const router = useRouter();
const map = ref(null);

// 跳转到VR全景页面
const showVR = () => {
  if (routeDetail.value) {
    router.push({
      path: '/route/vr',
      query: {
        id: routeDetail.value.id,
        type: 'route'
      }
    });
  }
};



// 初始化地图
const initMap = () => {
  if (!routeDetail.value) return;
  
  try {
    console.log('初始化路线详情地图...');
    
    // 设置高德地图安全配置
    window._AMapSecurityConfig = {
      securityJsCode: '0ed4a735f40db8e6d423056a9a49577a'
    };
    
    // 动态加载高德地图API
    const script = document.createElement('script');
    script.src = 'https://webapi.amap.com/maps?v=2.0&key=0ed4a735f40db8e6d423056a9a49577a&plugin=AMap.Geocoder,AMap.Geolocation';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('高德地图API加载完成');
      
      // 初始化地图，优化WebGL使用
      map.value = new AMap.Map('routeDetailMap', {
        zoom: 12,
        center: routeDetail.value.center || [116.397428, 39.90923],
        mapStyle: 'amap://styles/normal',
        resizeEnable: true,
        dragEnable: true,
        scrollWheel: true,
        doubleClickZoom: true,
        keyboardEnable: true,
        zoomEnable: true,
        rotateEnable: false,
        pitchEnable: false,
        viewMode: '2D',
        renderer: 'canvas',
        optimizeMode: true
      });
      
      // 等待地图加载完成
      map.value.on('complete', () => {
        console.log('路线详情地图加载完成');
        
        // 添加路线标记和路径
        addRouteMarkers();
        
        // 如果有路径点数据，添加路线
        if (routeDetail.value.waypoints && routeDetail.value.waypoints.length > 0) {
          addRoutePath();
        }
      });
    };
    
    script.onerror = (error) => {
      console.error('高德地图API加载失败:', error);
    };
    
    document.head.appendChild(script);
    
  } catch (error) {
    console.error('地图初始化失败:', error);
  }
};

// 添加路线标记
const addRouteMarkers = () => {
  if (!map.value || !routeDetail.value.startPoint || !routeDetail.value.endPoint) return;
  
  // 起点标记
  const startMarker = new AMap.Marker({
    position: routeDetail.value.startPoint,
    title: '起点',
    icon: new AMap.Icon({
      size: new AMap.Size(30, 30),
      image: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
      imageSize: new AMap.Size(30, 30)
    })
  });
  
  // 终点标记
  const endMarker = new AMap.Marker({
    position: routeDetail.value.endPoint,
    title: '终点',
    icon: new AMap.Icon({
      size: new AMap.Size(30, 30),
      image: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
      imageSize: new AMap.Size(30, 30)
    })
  });
  
  map.value.add([startMarker, endMarker]);
};

// 添加路线路径
const addRoutePath = () => {
  if (!map.value || !routeDetail.value.waypoints) return;
  
  // 创建路径
  const polyline = new AMap.Polyline({
    path: routeDetail.value.waypoints,
    strokeColor: '#3880ff',
    strokeWeight: 4,
    strokeStyle: 'solid',
    strokeDasharray: [10, 5],
    lineJoin: 'round',
    lineCap: 'round'
  });
  
  map.value.add(polyline);
  
  // 自适应显示整个路线
  map.value.setFitView([polyline]);
};

onMounted(() => {
  // 当routeDetail加载完成后初始化地图
  const unwatch = router.afterEach(() => {
    if (routeDetail.value) {
      initMap();
      unwatch(); // 只执行一次
    }
  });
});

onBeforeUnmount(() => {
  // 清理地图实例
  if (map.value) {
    map.value.destroy();
    map.value = null;
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
  border-top: 3px solid #3880ff;
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
  background-color: #3880ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #2c66e0;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.app-container {
  max-width: 420px;
  margin: 0 auto;
  height: 100vh;
  background-color: #f9f9f9;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  left: 0;
  right: 0;
  max-width: 420px;
  margin: 0 auto;
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
  position: fixed;
  top: 50px; 
  bottom: 55px; /* 底部导航高度 */
  left: 0;
  right: 0;
  max-width: 420px;
  margin: 0 auto;
  overflow-y: auto; /* 仅主内容区滚动 */
  width: 100%;
}
/* 顶部大图及收藏 */
.top-banner {
  width: 100%;
  overflow: hidden;
  position: relative; 
}
.banner-img {
  width: 100%;
  height: 256px;
  object-fit: cover;
}

/* 收藏按钮（补充选中样式） */
.favorite-btn {
  position: absolute;
  top: 72px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 10; /* 确保在图片上方 */
}

.favorite-btn i {
  font-size: 20px;
  color: transparent;
  transition: color 0.3s;
  /* 设置边框以显示无色心形轮廓 */
  -webkit-text-stroke: 1.5px #ccc;
}

/* 收藏选中状态（红色心形） */
.favorite-btn i.favorited {
  color: #ff4757;
  /* 移除边框，显示实心 */
  -webkit-text-stroke: 0;
  font-weight: 900;
  transform: scale(1.1); /* 选中时轻微放大，增强交互感 */
}

/* 标题/难度/地点 卡片 */
.title-section {
  background-color: white;
  border-radius: 20px; 
  padding: 20px; 
  margin-top: -40px; 
  position: relative;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.title-section .flex.justify-between.items-start {
  display: flex;
  justify-content: space-between;
  align-items:start;
  margin-bottom: 16px;
  width: 100%;
}
/* 难度标签 */
.title-section .bg-primary-100 {
  background-color: #e8f5e9; 
  color: #43a047; 
  padding: 4px 12px;
  border-radius: 9999px; 
  font-size: 0.9rem; 
  font-weight: 600;
}

/* 关键数据 */
.title-section .flex.justify-around.mb-6 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  background-color: #f3f4f6; 
  border-radius: 12px; 
  padding: 16px; 
  margin-bottom: 24px; 
}
.title-section .text-center .text-2xl {
  font-size: 24px; 
  font-weight: 700; 
  color: #43a047; 
}
.title-section .text-center .text-xs {
  font-size: 12px; 
  color: #6b7280; 
  margin-top: 4px;
}

/* 路线亮点与安全提示 标题 */
.highlight-section h2, .safety-tips h2 {
  font-size: 18px; 
  font-weight: 700; 
  margin-bottom: 8px; 
  color: #111827;
  text-align: left;
}

/* 路线亮点内容 */
.highlight-content {
  color: #4b5563; 
  line-height: 1.6;
  text-indent: 2em;
  text-align: left;
  margin-bottom: 24px; 
}

/* 安全提示 */
.safety-tips ul {
  list-style: none;
  margin-bottom: 24px; 
}
.safety-tips li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px; 
  color: #4b5563;
}
.safety-tips li i {
  color: #eab308; 
  margin-top: 6px; 
  margin-right: 8px; 
  flex-shrink: 0;
}

/* VR全景 */
.vr-panorama-section {
  margin-bottom: 24px;
}

.vr-card {
  position: relative;
  height: 200px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.vr-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(181, 209, 255, 0.9), rgba(37, 99, 235, 0.8));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.vr-icon {
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
}

.vr-icon i {
  font-size: 28px;
  color: white;
}

.vr-title {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.vr-button {
  background-color: rgba(255, 255, 255, 0.9);
  color: #2563eb;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.vr-button:hover {
  background-color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.vr-button i {
  font-size: 14px;
}

/* 功能按钮组 */
.grid.grid-cols-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px; 
  margin-bottom: 24px; 
}
.grid.grid-cols-3 button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 8px; 
  border-radius: 12px; 
  border: none;
  font-weight: 600;
  cursor: pointer;
  gap: 6px; 
}
/* 按钮颜色 */
.bg-blue-100 { background-color: #dbeafe; color: #1e40af; }
.bg-green-100 { background-color: #dcfce7; color: #166534; }
.bg-orange-100 { background-color: #fff7ed; color: #c2410c; }

/* 地图区域 */
.map-section {
  margin-bottom: 24px;
}

/* 地图容器 */
.map-container {
  height: 256px; 
  background-color: #e5e7eb; 
  border-radius: 20px; 
  margin-bottom: 24px; 
  position: relative;
}

/* 操作按钮 */
.flex.gap-3 {
  display: flex;
  gap: 12px; 
  margin-bottom: 32px; 
}
.flex.gap-3 button {
  flex: 1;
  padding: 14px; 
  border-radius: 20px; 
  border: none;
  font-weight: 600; 
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; 
  cursor: pointer;
}
/* 按钮颜色 */
.bg-primary-500 { background-color: #2563eb; } 
.bg-secondary-500 { background-color: #10b981; } 

/* 用户评价区域 */
.user_text{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
h3.font-bold {
  font-size: 18px;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px; 
  margin-bottom: 16px; 
  text-align: left;
}
.space-y-4 > div {
  display: flex;
  margin-bottom: 16px; 
}
.w-10 {
  width: 40px; 
  height: 40px; 
  border-radius: 50%;
  background-color: #e5e7eb; 
  margin-right: 12px;
  flex-shrink: 0;
}
.flex-1{
  text-align: left;
}
.flex-1 h4 {
  font-weight: 700;
  color: #111827;
}
.rating-stars {
  color: #f59e0b;
}
.text-gray-300 {
  color: #d1d5db;
}
.text-sm {
  font-size: 14px;
  color: #4b5563; 
  margin: 6px 0;
  line-height: 1.5;
}
.text-xs {
  font-size: 12px;
  color: #6b7280; 
  margin-top: 4px; 
}

/* 底部导航 */
.bottom-nav {
  height: 55px;
  background-color: #fff;
  display: flex;
  border-top: 1px solid #eee;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 420px;
  margin: 0 auto;
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
</style>