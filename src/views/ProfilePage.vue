<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <!-- 顶部个人信息  -->
    <div class="bg-gradient-to-br from-primary-500 to-primary-600 px-4 py-6 text-white">
      <div class="flex items-center space-x-4 mb-4">
        <img src="../assets/头像.png" alt="头像" class="w-20 h-20 rounded-full border-4 border-white">
        <div class="flex-1">
          <h2 class="text-xl font-bold mb-1">户外爱好者</h2>
          <div class="flex items-center text-primary-100 text-sm mb-2">
            <i class="fas fa-location-dot mr-1"></i>
            <span>重庆市</span>
          </div>
          <div class="flex items-center space-x-4 text-sm">
            <div class="flex items-center">
              <i class="fas fa-medal mr-1"></i>
              <span>中级户外玩家</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-calendar mr-1"></i>
              <span>加入365天</span>
            </div>
          </div>
        </div>
        <button class="text-white">
          <i class="fas fa-cog text-xl"></i>
        </button>
      </div>

      <!-- 统计数据  -->
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold">12</div>
          <div class="text-sm text-primary-100">参与活动</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold">8</div>
          <div class="text-sm text-primary-100">组织活动</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold">156</div>
          <div class="text-sm text-primary-100">获得点赞</div>
        </div>
      </div>
    </div>

    <!-- 功能菜单  -->
    <div class="container px-4 py-4 space-y-4">
      <!-- 我的活动  -->
      <div class="bg-white rounded-lg overflow-hidden">
        <div class="px-4 py-3  border-gray-100">
          <h3 class="font-medium text-gray-800">我的活动</h3>
        </div>
        <div class="grid grid-cols-4 gap-4 mb-6">
          <div class="flex flex-col items-center" @click="goToPage('my-favorites')">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <i class="fas fa-heart text-red-500"></i>
            </div>
            <span class="text-sm">我的收藏</span>
          </div>
          <div class="flex flex-col items-center" @click="goToPage('my-activities')">
            <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
              <i class="fas fa-flag text-accent-500" style="color: rgb(255 152 0 / var(--tw-text-opacity, 1));"></i>
            </div>
            <span class="text-sm">我的活动</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-2">
              <i class="fas fa-paper-plane text-pink-500" ></i>
            </div>
            <span class="text-sm">我的申请</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
              <i class="fas fa-campground text-indigo-600"></i>
            </div>
            <span class="text-sm">我的营地</span>
          </div>
        </div>
      </div>

      <!-- 我的社区  -->
      <div class="bg-white rounded-lg overflow-hidden">
        <div class="px-4 py-3  border-gray-100">
          <h3 class="font-medium text-gray-800">我的社区</h3>
        </div>
        <div class="grid grid-cols-4 gap-4 mb-6">
          <div class="flex flex-col items-center" @click="goToPage('my-posts')">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <i class="fas fa-edit text-blue-600"></i>
            </div>
            <span class="text-sm">我的帖子</span>
          </div>
          <div class="flex flex-col items-center" @click="goToPage('my-guides')">
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <i class="fas fa-map text-green-600"></i>
            </div>
            <span class="text-sm">我的攻略</span>
          </div>
          <div class="flex flex-col items-center" @click="goToPage('my-comments')">
            <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
              <i class="fas fa-comment text-yellow-600"></i>
            </div>
            <span class="text-sm">我的评论</span>
          </div>
          <div class="flex flex-col items-center" @click="goToPage('my-bookmarks')">
            <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
              <i class="fas fa-bookmark text-purple-600"></i>
            </div>
            <span class="text-sm">我的收藏</span>
          </div>
        </div>
      </div>

      <!-- 其他功能  -->
      <div class="bg-white rounded-lg overflow-hidden">
        <div class="divide-y divide-gray-100">
          <button v-for="item in otherMenus" :key="item.title" @click="goToPage(item.route)"
            class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50">
            <div class="flex items-center">
              <i :class="[item.icon, 'text-gray-500 mr-3']"></i>
              <span class="text-gray-800">{{ item.title }}</span>
            </div>
            <div class="flex items-center">
              <span v-if="item.badge" class="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                {{ item.badge }}
              </span>
              <i class="fas fa-chevron-right text-gray-400"></i>
            </div>
          </button>
        </div>
      </div>

      <!-- 成就徽章  -->
      <div class="bg-white rounded-lg p-4">
        <h3 class="font-medium text-gray-800 mb-3">我的成就</h3>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="badge in badges" :key="badge.name" class="text-center">
            <div :class="['w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center',
                          badge.earned ? 'bg-primary-100' : 'bg-gray-100']">
              <i :class="[badge.icon, badge.earned ? 'text-primary-600' : 'text-gray-400']"></i>
            </div>
            <div :class="['text-xs', badge.earned ? 'text-gray-800' : 'text-gray-400']">
              {{ badge.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToPage = (routeName) => {
  router.push({ name: routeName })
}



const otherMenus = ref([
  { title: '实名认证', icon: 'fas fa-id-card', route: 'verification', badge: '未认证' },
  { title: '紧急联系人', icon: 'fas fa-phone', route: 'emergency-contacts' },
  { title: '安全设置', icon: 'fas fa-shield-alt', route: 'security' },
  { title: '消息通知', icon: 'fas fa-bell', route: 'notifications' },
  { title: '帮助中心', icon: 'fas fa-question-circle', route: 'help' },
  { title: '关于我们', icon: 'fas fa-info-circle', route: 'about' }
])

const badges = ref([
  { name: '新手上路', icon: 'fas fa-seedling', earned: true },
  { name: '活跃分子', icon: 'fas fa-fire', earned: true },
  { name: '探险家', icon: 'fas fa-compass', earned: false },
  { name: '摄影师', icon: 'fas fa-camera', earned: true },
  { name: '领队达人', icon: 'fas fa-crown', earned: false },
  { name: '安全卫士', icon: 'fas fa-shield', earned: false },
  { name: '环保使者', icon: 'fas fa-leaf', earned: true },
  { name: '社交达人', icon: 'fas fa-handshake', earned: false }
])
</script>
<style scoped>
.container {
  margin-bottom: 40px;
} 
</style>