<template>
  <div class="min-h-screen bg-gray-50">
     <!-- 顶部导航  -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <button @click="goToPage('home')" class="text-gray-600">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">组队出行</h1>
      <button @click="goToPage('team-create')" class="text-primary-600">
        <i class="fas fa-plus text-lg"></i>
      </button>
    </div>

     <!-- 筛选标签  -->
    <div class="px-4 py-3 bg-white border-b">
      <div class="flex space-x-2 overflow-x-auto">
        <button v-for="filter in filters" :key="filter" 
                :class="['px-4 py-2 rounded-full text-sm whitespace-nowrap', 
                         filter === '全部' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600']">
          {{ filter }}
        </button>
      </div>
    </div>

     <!-- 活动列表  -->
    <div class="px-4 py-4 space-y-4">
      <div v-for="activity in activities" :key="activity.id" 
           class="bg-white rounded-xl shadow-sm p-4">
         <!-- 活动头部  -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-3">
            <img :src="activity.organizer.avatar" :alt="activity.organizer.name" 
                 class="w-10 h-10 rounded-full">
            <div>
              <div class="font-medium text-gray-800">{{ activity.organizer.name }}</div>
              <div class="text-xs text-gray-500">{{ activity.organizer.level }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-600">{{ activity.date }}</div>
            <div class="text-xs text-gray-500">{{ activity.duration }}</div>
          </div>
        </div>
<!-- 
         活动信息  -->
        <h3 class="font-semibold text-gray-800 mb-2">{{ activity.title }}</h3>
        <div class="flex items-center text-gray-600 text-sm mb-3">
          <i class="fas fa-location-dot mr-1"></i>
          <span>{{ activity.destination }}</span>
        </div>

         <!-- 活动标签  -->
        <div class="flex flex-wrap gap-2 mb-3">
          <span v-for="tag in activity.tags" :key="tag" 
                class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
            {{ tag }}
          </span>
        </div>

         <!-- 活动描述  -->
        <p class="text-sm text-gray-700 mb-3 line-clamp-2">{{ activity.description }}</p>

         <!-- 底部信息  -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex items-center text-sm text-gray-600">
              <i class="fas fa-users mr-1"></i>
              <span>{{ activity.currentMembers }}/{{ activity.maxMembers }}人</span>
            </div>
            <div class="text-sm text-primary-600 font-medium">
              ¥{{ activity.cost }}/人
            </div>
          </div>
          <button @click="activity.organizer.name === '我' ? goToPage('team-application') : goToPage('team-application')" 
                  :class="['px-4 py-2 rounded-lg text-sm font-medium',
                           activity.organizer.name === '我' 
                           ? 'bg-blue-500 text-white' 
                           : activity.currentMembers >= activity.maxMembers 
                           ? 'bg-gray-100 text-gray-400' 
                           : 'bg-primary-500 text-white']"
                  :disabled="activity.organizer.name !== '我' && activity.currentMembers >= activity.maxMembers">
            {{ activity.organizer.name === '我' ? '查看组队' : (activity.currentMembers >= activity.maxMembers ? '已满员' : '申请入队') }}
          </button>
        </div>

         <!-- 成员头像  -->
        <div class="flex items-center mt-3 pt-3 border-t border-gray-100">
          <span class="text-xs text-gray-500 mr-2">已加入:</span>
          <div class="flex -space-x-2">
            <img v-for="member in activity.members.slice(0, 5)" :key="member.id" 
                 :src="member.avatar" :alt="member.name" 
                 class="w-6 h-6 rounded-full border-2 border-white">
            <div v-if="activity.members.length > 5" 
                 class="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
              <span class="text-xs text-gray-600">+{{ activity.members.length - 5 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

     <!-- 创建活动按钮  -->
    <div class="fixed bottom-6 right-6">
      <button @click="goToPage('team-create')" 
              class="w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center">
        <i class="fas fa-plus text-xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useDataStore from '../composables/useDataStore.js'

const router = useRouter()
const dataStore = useDataStore()

const goToPage = (routeName) => {
  router.push({ name: routeName })
}

const filters = ref(['全部', '自驾游', '徒步', '露营', '登山', '摄影'])
const activities = ref([])

onMounted(() => {
  // 初始化组队信息
  dataStore.initTeams()
  // 获取用户发布的组队信息
  const userTeams = dataStore.getTeams()
  
  // 默认组队信息
  const defaultTeams = [
    {
      id: 1,
      title: '武隆天坑探险之旅',
      destination: '重庆武隆天生三桥',
      date: '3月25日',
      duration: '2天1夜',
      cost: 380,
      currentMembers: 3,
      maxMembers: 6,
      tags: ['探险', '摄影', '自然'],
      description: '探索武隆天坑的神秘魅力，体验大自然的鬼斧神工。行程包括天生三桥、龙水峡地缝等著名景点，适合喜欢探险和摄影的朋友。',
      organizer: {
        name: '户外达人小王',
        level: '资深领队',
        avatar: '/src/assets/头像.png'
      },
      members: [
        { id: 1, name: '小李', avatar: '/src/assets/头像.png' },
        { id: 2, name: '小张', avatar: '/src/assets/头像.png' },
        { id: 3, name: '小陈', avatar: '/src/assets/头像.png' }
      ]
    },
    {
      id: 2,
      title: '仙女山草原露营',
      destination: '重庆武隆仙女山',
      date: '4月1日',
      duration: '1天1夜',
      cost: 220,
      currentMembers: 5,
      maxMembers: 8,
      tags: ['露营', '观星', '草原'],
      description: '在仙女山大草原上搭帐篷，享受星空下的浪漫夜晚。包含篝火晚会、观星活动，适合情侣和朋友聚会。',
      organizer: {
        name: '露营专家小刘',
        level: '中级领队',
        avatar: '/src/assets/头像.png'
      },
      members: [
        { id: 4, name: '小王', avatar: '/src/assets/头像.png' },
        { id: 5, name: '小赵', avatar: '/src/assets/头像.png' },
        { id: 6, name: '小孙', avatar: '/src/assets/头像.png' },
        { id: 7, name: '小周', avatar: '/src/assets/头像.png' },
        { id: 8, name: '小吴', avatar: '/src/assets/头像.png' }
      ]
    },
    {
      id: 3,
      title: '芙蓉洞地下探秘',
      destination: '重庆武隆芙蓉洞',
      date: '4月8日',
      duration: '1天',
      cost: 150,
      currentMembers: 8,
      maxMembers: 8,
      tags: ['溶洞', '探秘', '地质'],
      description: '深入芙蓉洞探索地下奇观，了解喀斯特地貌的形成过程。专业地质讲解，适合对地质学感兴趣的朋友。',
      organizer: {
        name: '地质爱好者小张',
        level: '初级领队',
        avatar: '/src/assets/头像.png'
      },
      members: [
        { id: 9, name: '小郑', avatar: '/src/assets/头像.png' },
        { id: 10, name: '小钱', avatar: '/src/assets/头像.png' },
        { id: 11, name: '小孙', avatar: '/src/assets/头像.png' },
        { id: 12, name: '小李', avatar: '/src/assets/头像.png' },
        { id: 13, name: '小周', avatar: '/src/assets/头像.png' },
        { id: 14, name: '小吴', avatar: '/src/assets/头像.png' },
        { id: 15, name: '小郑', avatar: '/src/assets/头像.png' },
        { id: 16, name: '小王', avatar: '/src/assets/头像.png' }
      ]
    }
  ]
  
  // 合并用户发布的组队信息和默认组队信息
  // 用户发布的在前面
  activities.value = [...userTeams, ...defaultTeams]
})
</script>