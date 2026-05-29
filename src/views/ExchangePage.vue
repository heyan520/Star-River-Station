<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <div class="bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
      <div class="flex items-center space-x-3">
        <button @click="goBack" class="text-gray-600">
          <i class="fas fa-arrow-left text-lg"></i>
        </button>
        <h1 class="text-lg font-semibold text-gray-800 flex-1 text-center">物品交换</h1>
        <div class="w-8"></div> <!-- 占位，保持标题居中 -->
      </div>
    </div>

    <!-- 用户信息 -->
    <div class="bg-white p-4 border-b">
      <div class="flex items-center space-x-4">
        <img :src="exchangeUser.avatar" :alt="exchangeUser.name" class="w-12 h-12 rounded-full object-cover">
        <div>
          <h3 class="font-medium text-gray-800">{{ exchangeUser.name }}</h3>
          <p class="text-sm text-gray-600">{{ exchangeUser.distance }} · {{ exchangeUser.status }}</p>
        </div>
        <button class="ml-auto bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center" @click="startChat">
          <i class="fas fa-comment mr-2"></i>
          聊天
        </button>
      </div>
    </div>

    <!-- 交换物品区域 -->
    <div class="p-4">
      <!-- 我的物品 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-user mr-2 text-primary-500"></i>
          我的物品
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div 
            v-for="item in myItems" 
            :key="item.id" 
            class="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
            :class="{ 'border-primary-500 bg-primary-50': selectedMyItem === item.id }"
            @click="selectMyItem(item.id)"
          >
            <div class="aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center">
              <i :class="[item.icon, 'text-gray-400 text-2xl']"></i>
            </div>
            <h4 class="font-medium text-gray-800 text-sm mb-1">{{ item.name }}</h4>
            <p class="text-xs text-gray-600">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- 交换箭头 -->
      <div class="flex justify-center my-6">
        <div class="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-sm">
          <i class="fas fa-exchange-alt text-primary-500 text-2xl"></i>
        </div>
      </div>

      <!-- 对方物品 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-user-friends mr-2 text-blue-500"></i>
          {{ exchangeUser.name }}的物品
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div 
            v-for="item in userItems" 
            :key="item.id" 
            class="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
            :class="{ 'border-blue-500 bg-blue-50': selectedUserItem === item.id }"
            @click="selectUserItem(item.id)"
          >
            <div class="aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center">
              <i :class="[item.icon, 'text-gray-400 text-2xl']"></i>
            </div>
            <h4 class="font-medium text-gray-800 text-sm mb-1">{{ item.name }}</h4>
            <p class="text-xs text-gray-600">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- 交换按钮 -->
      <button 
        class="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center"
        :disabled="!selectedMyItem || !selectedUserItem"
        :class="{ 'opacity-50 cursor-not-allowed': !selectedMyItem || !selectedUserItem }"
        @click="confirmExchange"
      >
        <i class="fas fa-handshake mr-2"></i>
        确认交换
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 交换用户信息
const exchangeUser = ref({
  id: 1,
  name: '户外达人小王',
  avatar: 'https://picsum.photos/seed/user1/200/200',
  distance: '0.5km',
  status: '正在仙女山露营'
})

// 我的物品
const myItems = ref([
  {
    id: 1,
    name: '备用睡袋',
    description: '全新，适合0-10°C',
    icon: 'fas fa-bed'
  },
  {
    id: 2,
    name: '登山杖',
    description: '可调节长度',
    icon: 'fas fa-hiking'
  },
  {
    id: 3,
    name: '户外炉具',
    description: '便携式燃气炉',
    icon: 'fas fa-fire'
  },
  {
    id: 4,
    name: '防水背包',
    description: '20L容量',
    icon: 'fas fa-backpack'
  }
])

// 对方物品
const userItems = ref([
  {
    id: 101,
    name: '双人帐篷',
    description: '九成新，防风防雨',
    icon: 'fas fa-campground'
  },
  {
    id: 102,
    name: '户外灯',
    description: '充电式LED灯',
    icon: 'fas fa-lightbulb'
  },
  {
    id: 103,
    name: '野餐垫',
    description: '防水防潮',
    icon: 'fas fa-blanket'
  },
  {
    id: 104,
    name: '急救包',
    description: '基本医疗用品',
    icon: 'fas fa-first-aid'
  }
])

// 选中的物品
const selectedMyItem = ref(null)
const selectedUserItem = ref(null)

// 选择我的物品
const selectMyItem = (itemId) => {
  selectedMyItem.value = itemId
}

// 选择对方物品
const selectUserItem = (itemId) => {
  selectedUserItem.value = itemId
}

// 导航返回
const goBack = () => {
  router.back()
}

// 开始聊天
const startChat = () => {
  router.push({ 
    name: 'chat',
    params: { userId: exchangeUser.value.id }
  })
}

// 确认交换
const confirmExchange = () => {
  if (selectedMyItem.value && selectedUserItem.value) {
    alert('交换申请已发送，等待对方确认！')
    // 这里可以实现交换申请的逻辑
    router.back()
  }
}
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>