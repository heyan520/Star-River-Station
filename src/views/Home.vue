<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
     <!-- 顶部状态栏 -->
    <div class="phone-top-bar">
       <!-- 位置和天气信息或页面标题 -->
      <template v-if="$route.name === 'home'">
        <div class="location-weather">
          <i class="fas fa-location-dot text-primary-600 mr-1"></i>
          <span class="font-medium mr-3">武隆区</span>
          <i class="fas fa-sun text-yellow-400 mr-1"></i>
          <span>28°C</span>
        </div>
      </template>

    </div>
    
     <!-- 页面内容区域 - 使用router-view显示当前路由对应的组件 -->
    <div class="page-content">
      <router-view />
    </div>
    
     <!-- 底部导航栏 -->
    <div class="tab-bar" v-if="showTabBar">
      <div 
        class="tab-item" 
        :class="{ active: $route.name === 'home' }"
        @click="switchTab('home')"
      >
        <i class="fas fa-home"></i>
        <span>首页</span>
      </div>
      <div 
        class="tab-item" 
        :class="{ active: $route.name === 'community' }"
        @click="switchTab('community')"
      >
        <i class="fas fa-comments"></i>
        <span>社区</span>
      </div>
      <div 
        class="tab-item" 
        :class="{ active: $route.name === 'nearby' }"
        @click="switchTab('nearby')"
      >
        <i class="fas fa-map-marker-alt"></i>
        <span>附近</span>
      </div>
      <div 
        class="tab-item" 
        :class="{ active: $route.name === 'profile' }"
        @click="switchTab('profile')"
      >
        <i class="fas fa-user"></i>
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 使用Vue Router
const router = useRouter()
const route = useRoute()

// Define missing ref
const rightActionText = ref('')

// 计算属性：是否显示底部导航栏
const showTabBar = computed(() => {
  const tabBarRoutes = ['home', 'community', 'nearby', 'profile']
  return tabBarRoutes.includes(route.name)
})

const switchTab = (tab) => {
  router.push({ name: tab })
}

const handleRightAction = () => {
  // 处理右侧按钮点击事件
  if (rightActionText.value === '创建' && router.currentRoute.value.name === 'team') {
    router.push({ name: 'team-create' })
  }
  console.log(`执行${rightActionText.value}操作`)
}
</script>

<style scoped>

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




.page-content {
  min-height: calc(100vh - 44px - 50px);
  overflow-y: auto;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: white;
  border-top: 1px solid #f0f0f0;
  display: flex;
  z-index: 100;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 10px;
  transition: all 0.2s;
  cursor: pointer;
}

.tab-item i {
  font-size: 20px;
  margin-bottom: 3px;
}

.tab-item.active {
  color: #4CAF50;
}
</style>