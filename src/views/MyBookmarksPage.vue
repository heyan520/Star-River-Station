<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <button @click="goToPage('profile')" class="text-gray-600 hover:text-gray-900 transition-colors">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">我的收藏</h1>
      <div></div>
    </div>

    <!-- 收藏分类 -->
    <div class="px-4 py-3 bg-white border-b">
      <div class="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          v-for="category in categories" 
          :key="category"
          :class="[
            'px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all',
            currentCategory === category ? 'bg-primary-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
          @click="switchCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- 收藏列表 -->
    <div class="px-4 py-4 space-y-4">
      <!-- 空状态 -->
      <div v-if="filteredBookmarks.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-3">
          <i class="fas fa-bookmark text-gray-400 text-2xl"></i>
        </div>
        <p class="text-gray-500">您还没有收藏任何内容</p>
        <button 
          class="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:bg-primary-600"
          @click="goToPage('community')"
        >
          去社区发现
        </button>
      </div>

      <!-- 收藏列表 -->
      <div v-else>
        <div 
          v-for="bookmark in filteredBookmarks" 
          :key="bookmark.id" 
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- 收藏内容 -->
          <div class="p-4">
            <div class="flex items-start">
              <!-- 封面图 -->
              <div v-if="bookmark.image" class="mr-3">
                <img 
                  :src="bookmark.image" 
                  :alt="bookmark.title" 
                  class="w-24 h-24 object-cover rounded"
                >
              </div>
              
              <!-- 内容信息 -->
              <div class="flex-1">
                <!-- 类型标签 -->
                <div class="flex items-center mb-2">
                  <span 
                    :class="[
                      'text-xs px-2 py-1 rounded-full',
                      bookmark.type === '攻略' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    ]"
                  >
                    {{ bookmark.type }}
                  </span>
                  <span class="text-xs text-gray-500 ml-2">{{ bookmark.date }}</span>
                </div>
                
                <!-- 标题 -->
                <h3 class="font-medium text-gray-800 mb-2 line-clamp-2">{{ bookmark.title }}</h3>
                
                <!-- 描述 -->
                <p v-if="bookmark.description" class="text-sm text-gray-600 mb-3 line-clamp-2">{{ bookmark.description }}</p>
                
                <!-- 作者信息 -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <img :src="bookmark.authorAvatar" :alt="bookmark.authorName" class="w-6 h-6 rounded-full mr-2">
                    <span class="text-sm text-gray-600">{{ bookmark.authorName }}</span>
                  </div>
                  <button class="text-gray-400 hover:text-red-500 transition-colors">
                    <i class="fas fa-bookmark text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToPage = (routeName) => {
  router.push({ name: routeName })
}

const categories = ref(['全部', '攻略', '帖子'])
const currentCategory = ref('全部')
const bookmarks = ref([])

// 切换分类
const switchCategory = (category) => {
  currentCategory.value = category
}

// 筛选收藏内容
const filteredBookmarks = computed(() => {
  if (currentCategory.value === '全部') {
    return bookmarks.value
  }
  return bookmarks.value.filter(bookmark => bookmark.type === currentCategory.value)
})

// 模拟加载收藏数据
const loadBookmarks = () => {
  // 模拟数据
  bookmarks.value = [
    {
      id: 1,
      type: '攻略',
      title: '重庆武隆天生三桥一日游攻略',
      description: '详细介绍武隆天生三桥的游览路线、最佳时间、交通方式和注意事项...',
      image: 'https://picsum.photos/seed/wulong1/300/200',
      authorName: '旅行达人',
      authorAvatar: 'https://picsum.photos/seed/avatar1/100/100',
      date: '2024-03-18'
    },
    {
      id: 2,
      type: '帖子',
      title: '分享一次难忘的露营经历',
      description: '上周末和朋友们一起去了武隆仙女山露营，那里的星空真的太美了！',
      image: 'https://picsum.photos/seed/camp1/300/200',
      authorName: '户外新手',
      authorAvatar: 'https://picsum.photos/seed/avatar2/100/100',
      date: '2024-03-17'
    },
    {
      id: 3,
      type: '攻略',
      title: '仙女山露营完全指南',
      description: '从装备准备到营地选择，从安全注意事项到露营技巧...',
      image: 'https://picsum.photos/seed/fairy1/300/200',
      authorName: '户外达人',
      authorAvatar: 'https://picsum.photos/seed/avatar3/100/100',
      date: '2024-03-12'
    },
    {
      id: 4,
      type: '帖子',
      title: '推荐几个重庆周边的徒步路线',
      description: '作为一个重庆本地人，我整理了几个适合周末徒步的路线...',
      image: 'https://picsum.photos/seed/hike1/300/200',
      authorName: '徒步爱好者',
      authorAvatar: 'https://picsum.photos/seed/avatar4/100/100',
      date: '2024-03-15'
    }
  ]
}

onMounted(() => {
  loadBookmarks()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 隐藏滚动条 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>