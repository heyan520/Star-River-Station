<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <button @click="goToPage('profile')" class="text-gray-600 hover:text-gray-900 transition-colors">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">我的攻略</h1>
      <button @click="navigateToCreateContent" class="text-primary-600 hover:text-primary-700 transition-colors">
        <i class="fas fa-plus text-lg"></i>
      </button>
    </div>

    <!-- 攻略列表 -->
    <div class="px-4 py-4 space-y-4">
      <!-- 空状态 -->
      <div v-if="guides.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-3">
          <i class="fas fa-map text-gray-400 text-2xl"></i>
        </div>
        <p class="text-gray-500">您还没有发布过攻略</p>
        <button 
          class="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:bg-primary-600"
          @click="navigateToCreateContent"
        >
          发布攻略
        </button>
      </div>

      <!-- 攻略列表 -->
      <div v-else>
        <div 
          v-for="guide in guides" 
          :key="guide.id" 
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- 攻略头部 -->
          <div class="px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <div class="flex items-center">
              <img src="../assets/头像.png" alt="头像" class="w-8 h-8 rounded-full mr-2">
              <div>
                <div class="text-sm font-medium text-gray-800">户外爱好者</div>
                <div class="text-xs text-gray-500">{{ guide.date }}</div>
              </div>
            </div>
            <div class="relative group">
              <button class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div class="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-lg py-2 w-32 hidden group-hover:block">
                <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">编辑攻略</button>
                <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">删除攻略</button>
              </div>
            </div>
          </div>

          <!-- 攻略内容 -->
          <div class="p-4">
            <h3 class="font-medium text-gray-800 mb-2">{{ guide.title }}</h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ guide.description }}</p>
            
            <!-- 攻略封面图 -->
            <div v-if="guide.coverImage" class="mb-3">
              <img 
                :src="guide.coverImage" 
                :alt="guide.title" 
                class="w-full h-48 object-cover rounded"
              >
            </div>

            <!-- 攻略信息 -->
            <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <i class="fas fa-map-marker-alt mr-1"></i>
                  <span>{{ guide.location }}</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-clock mr-1"></i>
                  <span>{{ guide.duration }}</span>
                </div>
              </div>
              <div class="flex items-center">
                <i class="fas fa-star text-yellow-400 mr-1"></i>
                <span>{{ guide.rating }}</span>
              </div>
            </div>

            <!-- 攻略标签 -->
            <div v-if="guide.tags && guide.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
              <span 
                v-for="(tag, index) in guide.tags" 
                :key="index" 
                class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {{ tag }}
              </span>
            </div>

            <!-- 攻略互动 -->
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center space-x-4">
                <button class="flex items-center hover:text-primary-600 transition-colors">
                  <i class="fas fa-thumbs-up mr-1"></i>
                  <span>{{ guide.likes }}</span>
                </button>
                <button class="flex items-center hover:text-primary-600 transition-colors">
                  <i class="fas fa-comment mr-1"></i>
                  <span>{{ guide.comments }}</span>
                </button>
              </div>
              <div class="flex items-center">
                <button class="flex items-center hover:text-primary-600 transition-colors">
                  <i class="fas fa-share-alt mr-1"></i>
                  <span>分享</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToPage = (routeName) => {
  router.push({ name: routeName })
}

const navigateToCreateContent = () => {
  router.push({ name: 'create-content' })
}

const guides = ref([])

// 模拟加载攻略数据
const loadGuides = () => {
  // 模拟数据
  guides.value = [
    {
      id: 1,
      title: '重庆武隆天生三桥一日游攻略',
      description: '详细介绍武隆天生三桥的游览路线、最佳时间、交通方式和注意事项，帮助你轻松玩转这个世界自然遗产...',
      coverImage: 'https://picsum.photos/seed/wulong1/600/400',
      location: '重庆武隆',
      duration: '1天',
      rating: 4.8,
      tags: ['武隆', '天生三桥', '一日游'],
      likes: 128,
      comments: 45,
      date: '2024-03-18'
    },
    {
      id: 2,
      title: '仙女山露营完全指南',
      description: '从装备准备到营地选择，从安全注意事项到露营技巧，这份指南将帮助你在仙女山度过一个完美的露营之夜...',
      coverImage: 'https://picsum.photos/seed/fairy1/600/400',
      location: '重庆仙女山',
      duration: '2天1夜',
      rating: 4.9,
      tags: ['仙女山', '露营', '指南'],
      likes: 203,
      comments: 67,
      date: '2024-03-12'
    }
  ]
}

onMounted(() => {
  loadGuides()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>