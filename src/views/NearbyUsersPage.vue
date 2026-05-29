<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <!-- 顶部导航栏 -->
    <div class="bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
      <div class="flex items-center space-x-3">
        <button @click="goBack" class="text-gray-600">
          <i class="fas fa-arrow-left text-lg"></i>
        </button>
        <h1 class="text-lg font-semibold text-gray-800 flex-1 text-center">附近的用户</h1>
        <div class="w-8"></div> <!-- 占位，保持标题居中 -->
      </div>
    </div>

    <!-- 筛选选项 -->
    <div class="bg-white px-4 py-3 border-b">
      <div class="flex space-x-2 overflow-x-auto pb-2">
        <button 
          v-for="filter in filters" 
          :key="filter.id" 
          :class="['flex items-center px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all', 
                   filter.active ? 'bg-primary-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
          @click="switchFilter(filter.id)"
        >
          <i :class="[filter.icon, 'mr-2']"></i>
          {{ filter.name }}
        </button>
      </div>
    </div>

    <!-- 附近用户列表 -->
    <div class="container px-4 py-4">
      <div class="space-y-4">
        <div 
          v-for="user in filteredUsers" 
          :key="user.id" 
          class="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start space-x-4">
            <!-- 用户头像 -->
            <div class="relative">
              <img :src="user.avatar" :alt="user.name" class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm">
              <div :class="['absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white', user.isOnline ? 'bg-green-500' : 'bg-gray-300']"></div>
            </div>
            
            <!-- 用户信息 -->
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-medium text-gray-800">{{ user.name }}</h3>
                <span class="text-sm text-gray-500">{{ user.distance }}</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ user.status }}</p>
              <div class="flex space-x-2 mb-3">
                <span 
                  v-for="tag in user.tags" 
                  :key="tag" 
                  class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                >
                  {{ tag }}
                </span>
              </div>
              <div class="flex space-x-3">
                <button 
                  class="flex-1 py-2 px-4 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center justify-center"
                  @click="startChat(user)"
                >
                  <i class="fas fa-comment mr-2"></i>
                  聊天
                </button>
                <button 
                  class="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                  @click="exchangeItems(user)"
                >
                  <i class="fas fa-exchange-alt mr-2"></i>
                  交换
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无用户提示 -->
      <div v-if="filteredUsers.length === 0" class="py-16 text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
          <i class="fas fa-users text-gray-400 text-3xl"></i>
        </div>
        <p class="text-gray-500">附近暂无其他用户</p>
        <p class="text-sm text-gray-400 mt-1">尝试扩大搜索范围</p>
      </div>
    </div>

    <!-- 悬浮AI小助手按钮 -->
    <div class="floating-assistant-container">
      <div class="speech-bubble">
        <span>需要智能助手帮忙吗</span>
      </div>
      <div class="floating-assistant" @click="navigateToAIAssistant">
        <img src="/AI小助手.png" alt="AI小助手" class="ai-image">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 导航返回
const goBack = () => {
  router.back()
}

// 筛选选项
const filters = ref([
  { id: 'all', name: '全部', icon: 'fas fa-users', active: true },
  { id: 'online', name: '在线', icon: 'fas fa-circle', active: false },
  { id: 'camping', name: '露营中', icon: 'fas fa-campground', active: false },
  { id: 'hiking', name: '徒步中', icon: 'fas fa-hiking', active: false }
])

// 当前选中的筛选
const currentFilter = ref(filters.value[0])

// 切换筛选
const switchFilter = (filterId) => {
  filters.value = filters.value.map(filter => ({
    ...filter,
    active: filter.id === filterId
  }))
  currentFilter.value = filters.value.find(filter => filter.id === filterId)
}

// 模拟附近用户数据
const nearbyUsers = ref([
  {
    id: 1,
    name: '户外达人小王',
    avatar: '/src/assets/头像.png',
    distance: '0.5km',
    isOnline: true,
    status: '正在仙女山露营，寻找同行伙伴',
    tags: ['露营', '徒步', '摄影']
  },
  {
    id: 2,
    name: '徒步爱好者',
    avatar: 'https://picsum.photos/seed/user2/200/200',
    distance: '1.2km',
    isOnline: true,
    status: '刚到达金佛山，准备明天徒步',
    tags: ['徒步', '登山', '户外']
  },
  {
    id: 3,
    name: '露营新手',
    avatar: 'https://picsum.photos/seed/user3/200/200',
    distance: '2.3km',
    isOnline: false,
    status: '第一次露营，需要一些装备建议',
    tags: ['露营', '新手', '装备']
  },
  {
    id: 4,
    name: '摄影爱好者',
    avatar: 'https://picsum.photos/seed/user4/200/200',
    distance: '3.1km',
    isOnline: true,
    status: '正在拍摄仙女山日落，有一起的吗？',
    tags: ['摄影', '露营', '风景']
  },
  {
    id: 5,
    name: '户外厨师',
    avatar: 'https://picsum.photos/seed/user5/200/200',
    distance: '1.8km',
    isOnline: true,
    status: '带着全套户外厨具，可分享美食',
    tags: ['露营', '美食', '烹饪']
  }
])

// 根据筛选条件过滤用户
const filteredUsers = computed(() => {
  if (currentFilter.value.id === 'all') {
    return nearbyUsers.value
  } else if (currentFilter.value.id === 'online') {
    return nearbyUsers.value.filter(user => user.isOnline)
  } else if (currentFilter.value.id === 'camping') {
    return nearbyUsers.value.filter(user => user.tags.includes('露营'))
  } else if (currentFilter.value.id === 'hiking') {
    return nearbyUsers.value.filter(user => user.tags.includes('徒步'))
  }
  return nearbyUsers.value
})

// 开始聊天
const startChat = (user) => {
  console.log('开始与', user.name, '聊天')
  router.push({ 
    name: 'chat',
    params: { userId: user.id }
  })
}

// 交换物品
const exchangeItems = (user) => {
  console.log('与', user.name, '交换物品')
  router.push({ 
    name: 'exchange',
    params: { userId: user.id }
  })
}

// 导航到AI小助手页面
const navigateToAIAssistant = () => {
  router.push({ name: 'ai-assistant' })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

.floating-assistant-container {
  position: fixed;
  top: 155px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 100;
}

.speech-bubble {
  background: white;
  border-radius: 16px;
  padding: 10px 16px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  max-width: 200px;
  position: relative;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  right: 12px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid white;
}

.speech-bubble span {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}

.floating-assistant {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.floating-assistant:hover {
  transform: scale(1.1);
}

.ai-image {
  width: auto;
  height: auto;
}

@media (max-width: 768px) {
  .floating-assistant {
    bottom: 65px;
    right: 16px;
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}
</style>