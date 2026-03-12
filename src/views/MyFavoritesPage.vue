<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white shadow-sm sticky top-0 z-10">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center">
          <button @click="goBack" class="mr-4">
            <i class="fas fa-chevron-left text-gray-600"></i>
          </button>
          <h1 class="text-lg font-bold text-gray-800">我的收藏</h1>
        </div>
      </div>
    </div>

    <!-- 标签栏 -->
    <div class="bg-white mt-1 sticky top-[49px] z-10 border-b border-gray-100">
      <div class="flex px-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab.type"
          @click="switchTab(tab.type)"
          :class="[
            'px-4 py-3 text-sm font-medium flex-shrink-0 transition-colors duration-200',
            currentTab === tab.type
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-primary-600'
          ]"
        >
          {{ tab.name }}
          <span
            v-if="tab.count > 0"
            class="ml-1 px-1.5 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- 收藏列表 -->
    <div class="px-4 py-3">
      <!-- 路线收藏 -->
      <div v-if="currentTab === 'route'" class="space-y-3">
        <div
          v-for="item in favoriteRoutes"
          :key="item.id"
          @click="goToRouteDetail(item.id)"
          class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <img :src="item.imageUrl" alt="路线图片" class="w-full h-40 object-cover">
          <div class="p-3">
            <h3 class="font-medium text-gray-800 mb-1 line-clamp-1">{{ item.title }}</h3>
            <div class="flex items-center text-xs text-gray-500 mb-2">
              <i class="fas fa-map-marker-alt mr-1"></i>
              <span>{{ item.location }}</span>
              <span class="mx-2">·</span>
              <i class="fas fa-clock mr-1"></i>
              <span>{{ item.duration }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <i class="fas fa-star text-yellow-400 mr-1"></i>
                <span class="text-sm font-medium text-yellow-600">{{ item.rating }}</span>
                <span class="text-xs text-gray-400 ml-1">({{ item.reviewCount }}条点评)</span>
              </div>
              <button @click.stop="unfavorite(item.id, 'route')" class="text-gray-400 hover:text-red-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="#ff4757" 
                  stroke="#ff4757" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-if="favoriteRoutes.length === 0" class="text-center py-12">
          <img src="../assets/empty.png" alt="空状态" class="w-24 h-24 mx-auto mb-3 opacity-30">
          <p class="text-gray-400 text-sm">暂无收藏的路线</p>
        </div>
      </div>

      <!-- 露营收藏 -->
      <div v-if="currentTab === 'campsite'" class="space-y-3">
        <div
          v-for="item in favoriteCampsites"
          :key="item.id"
          @click="goToCampsiteDetail(item.id)"
          class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <img :src="item.image" alt="营地图片" class="w-full h-40 object-cover">
          <div class="p-3">
            <h3 class="font-medium text-gray-800 mb-1 line-clamp-1">{{ item.title }}</h3>
            <div class="flex items-center text-xs text-gray-500 mb-2">
              <i class="fas fa-map-marker-alt mr-1"></i>
              <span>{{ item.location }}</span>
              <span class="mx-2">·</span>
              <i class="fas fa-campground mr-1"></i>
              <span>{{ item.facilities }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <i class="fas fa-star text-yellow-400 mr-1"></i>
                <span class="text-sm font-medium text-yellow-600">{{ item.rating }}</span>
                <span class="text-xs text-gray-400 ml-1">({{ item.reviewCount }}条点评)</span>
              </div>
              <button @click.stop="unfavorite(item.id, 'campsite')" class="text-gray-400 hover:text-red-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="#ff4757" 
                  stroke="#ff4757" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-if="favoriteCampsites.length === 0" class="text-center py-12">
          <img src="../assets/empty.png" alt="空状态" class="w-24 h-24 mx-auto mb-3 opacity-30">
          <p class="text-gray-400 text-sm">暂无收藏的露营地</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 导入数据
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { injectDataStore } from '../composables/useDataStore.js';
import { campsiteService, routeService } from '../services/dataService.js';

const router = useRouter()
const dataStore = injectDataStore();

// 当前选中的标签
const currentTab = ref('route')

// 原始数据引用
const allRoutes = ref([]);
const allCampsites = ref([]);

// 计算属性：筛选出已收藏的路线
const favoriteRoutes = computed(() => {
  return allRoutes.value.filter(route => {
    return dataStore.state.favorites.routes.has(String(route.id));
  });
});

// 计算属性：筛选出已收藏的露营地
const favoriteCampsites = computed(() => {
  return allCampsites.value.filter(campsite => {
    return dataStore.state.favorites.campsites.has(campsite.id);
  });
});

// 标签数据
const tabs = ref([
  { type: 'route', name: '路线', count: 0 },
  { type: 'campsite', name: '露营', count: 0 }
])

// 切换标签
const switchTab = (type) => {
  currentTab.value = type
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到路线详情页
const goToRouteDetail = (routeId) => {
  router.push({ name: 'route-detail', query: { id: routeId } })
}

// 跳转到露营地详情页
const goToCampsiteDetail = (campsiteId) => {
  router.push({ name: 'campsite-detail', params: { id: campsiteId } })
}

// 取消收藏
const unfavorite = (id, type) => {
  if (type === 'route') {
    dataStore.toggleRouteFavorite(id);
  } else if (type === 'campsite') {
    dataStore.toggleCampsiteFavorite(id);
  }
  updateTabCounts();
  // 使用setTimeout异步显示提示，避免阻塞事件循环
  setTimeout(() => {
    alert('已取消收藏');
  }, 0);
}

// 更新标签数量
const updateTabCounts = () => {
  tabs.value.find(tab => tab.type === 'route').count = favoriteRoutes.value.length;
  tabs.value.find(tab => tab.type === 'campsite').count = favoriteCampsites.value.length;
}

// 组件挂载时初始化
onMounted(() => {
  // 初始化数据引用
  allRoutes.value = routeService.getAll();
  allCampsites.value = campsiteService.getAll();
  
  // 更新标签数量
  updateTabCounts();
});
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>