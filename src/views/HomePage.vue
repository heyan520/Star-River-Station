<template>
  <div class="p-5 h-full overflow-y-auto pb-16">
         <div class="location-weather-container">
       <div class="location-weather">
          <i class="fas fa-location-dot text-primary-600 mr-1"></i>
          <span class="font-medium mr-3">武隆区</span>
          <i class="fas fa-sun text-yellow-400 mr-1"></i>
          <span>28°C</span>
       </div>
      </div>
     <!-- Banner  -->
    <div class="relative rounded-xl overflow-hidden mb-6 h-40">
      <div class="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 opacity-90"></div>
      <div class="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
        <h3 class="text-xl font-bold mb-2">发现自然之美</h3>
        <p class="text-center text-sm mb-4">精选徒步路线 · 露营基地 · 自驾游推荐</p>
        <button class="bg-white text-green-600 px-4 py-2 rounded-full font-medium" @click="goToPage('VRPanoramaList')">
          开始探索
        </button>
      </div>
    </div>
    
     <!-- 功能入口  -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="flex flex-col items-center" @click="goToPage('VRPanoramaList')">
        <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
          <i class="fas fa-vr-cardboard text-purple-600 text-xl"></i>
        </div>
        <span class="text-xs">VR全景</span>
      </div>
      <div class="flex flex-col items-center" @click="goToPage('campsite-list')">
        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
          <i class="fas fa-campground text-blue-600 text-xl"></i>
        </div>
        <span class="text-xs">露营基地</span>
      </div>
      <div class="flex flex-col items-center" @click="goToPage('driving-routes')">
        <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
          <i class="fas fa-car text-green-600 text-xl"></i>
        </div>
        <span class="text-xs">自驾路线</span>
      </div>
      <div class="flex flex-col items-center" @click="goToPage('team')">
        <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
          <i class="fas fa-users text-orange-500 text-xl"></i>
        </div>
        <span class="text-xs">社交组队</span>
      </div>
    </div>
    
     <!-- 推荐路线  -->
    <h3 class="text-lg font-bold mb-4">精选路线</h3>
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="card" v-for="route in featuredRoutes" :key="route.id" @click="goToRouteDetail(route.id)">
        <div class="h-32 bg-cover bg-center rounded-t-2xl" :style="`background-image: url('${route.imageUrl}');`"></div>
        <div class="p-3">
          <h4 class="font-bold mb-1">{{ route.name }}</h4>
          <div class="flex items-center text-xs text-gray-500 mb-2">
            <i class="fas fa-mountain mr-1"></i>
            <span>{{ route.level }}难度 · {{ route.distance }}公里</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-green-600 font-medium">¥0</span>
            <span class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">免费</span>
          </div>
        </div>
      </div>
    </div>
    
     <!-- 热门露营地  -->
    <h3 class="text-lg font-bold mb-4">热门露营地</h3>
    <div class="relative overflow-hidden mb-6">
      <div 
        class="marquee-container" 
        ref="marqueeContainer"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
      >
        <div class="marquee-track" ref="marqueeTrack">
          <!-- 原始卡片 -->
          <div class="camp-card" v-for="camp in hotCampsites" :key="camp.id" @click="goToCampsiteDetail(camp.id)">
            <div class="camp-image" :style="`background-image: url('${camp.image}');`"></div>
            <div class="p-2">
              <h4 class="font-bold text-sm mb-1">{{ camp.title }}</h4>
              <div class="flex gap-1 mb-1">
                <span class="camp-level" :class="camp.levelClass">{{ camp.level }}</span>
                <span class="camp-theme">{{ camp.theme }}</span>
              </div>
              <div class="flex items-center text-xs text-gray-500">
                <i class="fas fa-star text-yellow-400 mr-1"></i>
                <span>{{ camp.rating }} ({{ camp.reviews }}评价)</span>
              </div>
            </div>
          </div>
          <!-- 克隆卡片用于无缝循环 -->
          <div class="camp-card" v-for="camp in hotCampsites" :key="`clone-${camp.id}`" @click="goToCampsiteDetail(camp.id)">
            <div class="camp-image" :style="`background-image: url('${camp.image}');`"></div>
            <div class="p-2">
              <h4 class="font-bold text-sm mb-1">{{ camp.title }}</h4>
              <div class="flex gap-1 mb-1">
                <span class="camp-level" :class="camp.levelClass">{{ camp.level }}</span>
                <span class="camp-theme">{{ camp.theme }}</span>
              </div>
              <div class="flex items-center text-xs text-gray-500">
                <i class="fas fa-star text-yellow-400 mr-1"></i>
                <span>{{ camp.rating }} ({{ camp.reviews }}评价)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
     <!-- 活动预告  -->
    <div class="card p-4 bg-gradient-to-r from-blue-100 to-green-100" style="margin-bottom: 50px;">
      <div class="flex items-center">
        <div class="bg-white p-3 rounded-lg mr-3">
          <i class="fas fa-calendar-alt text-blue-600 text-xl"></i>
        </div>
        <div>
          <h4 class="font-bold">周末露营活动</h4>
          <p class="text-sm text-gray-600">8月12日 · 重庆南山露营地</p>
        </div>
        <button class="ml-auto bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
          报名
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { routesData } from '../data/routeData.js'
import { campsitesData } from '../data/campsitesData.js'

const router = useRouter()

// 定义跳转方法
const goToPage = (routeName, params = {}) => {
  router.push({ 
    name: routeName,
    params
  })
}



// 跳转到路线详情页
  const goToRouteDetail = (routeId) => {
    router.push({
      name: 'route-detail',
      query: { id: routeId }
    })
  }
  
  // 跳转到露营地详情页
  const goToCampsiteDetail = (campsiteId) => {
    router.push({
      name: 'campsite-detail',
      query: { id: campsiteId }
    })
  }

// 自动滚动相关
const marqueeContainer = ref(null)
const marqueeTrack = ref(null)
let animationFrame = null
let scrollPosition = 0
let animationSpeed = 0.1 // 滚动速度
let isDragging = false
let startX = 0
let dragStartPosition = 0

// 开始自动滚动
const startAutoScroll = () => {
  if (!marqueeContainer.value || !marqueeTrack.value) return
  
  const trackWidth = marqueeTrack.value.offsetWidth / 2
  
  const animate = () => {
    scrollPosition += animationSpeed
    
    // 当滚动到原始内容的末尾时重置位置
    if (scrollPosition >= trackWidth) {
      scrollPosition = 0
    }
    
    // 应用滚动位置
    if (marqueeTrack.value) {
      marqueeTrack.value.style.transform = `translateX(-${scrollPosition}px)`
    }
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  animate()
}

// 停止自动滚动
const stopAutoScroll = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

// 触摸事件处理
const handleTouchStart = (e) => {
  stopAutoScroll()
  isDragging = true
  startX = e.touches[0].clientX
  dragStartPosition = scrollPosition
}

const handleTouchMove = (e) => {
  if (!isDragging) return
  
  const currentX = e.touches[0].clientX
  const deltaX = currentX - startX
  
  scrollPosition = dragStartPosition - deltaX
  
  // 确保滚动位置在有效范围内
  const trackWidth = marqueeTrack.value.offsetWidth / 2
  if (scrollPosition < 0) {
    scrollPosition = 0
  } else if (scrollPosition > trackWidth) {
    scrollPosition = trackWidth
  }
  
  // 应用滚动位置
  marqueeTrack.value.style.transform = `translateX(-${scrollPosition}px)`
}

const handleTouchEnd = () => {
  isDragging = false
  startAutoScroll()
}

// 鼠标事件处理
const handleMouseDown = (e) => {
  stopAutoScroll()
  isDragging = true
  startX = e.clientX
  dragStartPosition = scrollPosition
  // 添加用户选择禁止
  document.body.style.userSelect = 'none'
}

const handleMouseMove = (e) => {
  if (!isDragging) return
  
  const currentX = e.clientX
  const deltaX = currentX - startX
  
  scrollPosition = dragStartPosition - deltaX
  
  // 确保滚动位置在有效范围内
  const trackWidth = marqueeTrack.value.offsetWidth / 2
  if (scrollPosition < 0) {
    scrollPosition = 0
  } else if (scrollPosition > trackWidth) {
    scrollPosition = trackWidth
  }
  
  // 应用滚动位置
  marqueeTrack.value.style.transform = `translateX(-${scrollPosition}px)`
}

const handleMouseUp = () => {
  isDragging = false
  startAutoScroll()
  // 恢复用户选择
  document.body.style.userSelect = ''
}

// 组件挂载后开始自动滚动
onMounted(() => {
  setTimeout(() => {
    startAutoScroll()
  }, 100)
})

// 组件卸载前清理
onUnmounted(() => {
  stopAutoScroll()
  // 恢复用户选择
  document.body.style.userSelect = ''
})

// 获取精选路线（isFeatured为true的数据）
const featuredRoutes = computed(() => {
  return routesData.filter(route => route.isFeatured).slice(0, 2) // 最多显示2个
})

// 获取热门露营地（isHot为true的数据）
const hotCampsites = computed(() => {
  return campsitesData.filter(camp => camp.isHot).map(camp => {
    // 为了保持原有样式，添加levelClass映射
    let levelClass = 'level-medium';
    if (camp.level === '休闲') {
      levelClass = 'level-low';
    } else if (camp.level === '挑战') {
      levelClass = 'level-high';
    }
    
    // 提取第一个标签作为theme
    const theme = camp.tags && camp.tags.length > 0 ? camp.tags[0].text : camp.type || '其他';
    
    return {
      ...camp,
      levelClass,
      theme
    };
  });
})
</script>

<style scoped>
.location-weather-container {
  height: 33px;
}
.location-weather {
  position: absolute;
  top: 6px;
  left: 10px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.camp-level {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.level-low {
  background: #E8F5E9;
  color: #4CAF50;
}

.level-medium {
  background: #FFF9C4;
  color: #F57F17;
}

.level-high {
  background: #FFEBEE;
  color: #C62828;
}

.camp-theme {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: #E3F2FD;
  color: #1976D2;
}

/* 热门露营地容器样式 */
.marquee-container {
  overflow: hidden;
  width: 100%;
  height: 180px; /* 固定高度 */
  position: relative;
  cursor: grab;
}

.marquee-container:active {
  cursor: grabbing;
}

.marquee-track {
  display: flex;
  gap: 0.5rem;
  position: absolute;
  left: 0;
  top: 0;
  width: max-content;
  transition: transform 0.1s ease-out;
}

/* 热门露营地卡片样式 */
.camp-card {
  flex-shrink: 0;
  width: 130px;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  transition: transform 0.2s ease;
  cursor: pointer;
}

.camp-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.camp-image {
  height: 80px;
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem 0.5rem 0 0;
}

/* 隐藏滚动条 */
.marquee-container::-webkit-scrollbar {
  display: none;
}

.marquee-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>