<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <button @click="goToPage('profile')" class="text-gray-600 hover:text-gray-900 transition-colors">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">我的帖子</h1>
      <button @click="navigateToCreateContent" class="text-primary-600 hover:text-primary-700 transition-colors">
        <i class="fas fa-plus text-lg"></i>
      </button>
    </div>

    <!-- 帖子列表 -->
    <div class="px-4 py-4 space-y-4">
      <!-- 空状态 -->
      <div v-if="posts.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-3">
          <i class="fas fa-edit text-gray-400 text-2xl"></i>
        </div>
        <p class="text-gray-500">您还没有发布过帖子</p>
        <button 
          class="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:bg-primary-600"
          @click="navigateToCreateContent"
        >
          发布帖子
        </button>
      </div>

      <!-- 帖子列表 -->
      <div v-else>
        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- 帖子头部 -->
          <div class="px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <div class="flex items-center">
              <img src="../assets/头像.png" alt="头像" class="w-8 h-8 rounded-full mr-2">
              <div>
                <div class="text-sm font-medium text-gray-800">户外爱好者</div>
                <div class="text-xs text-gray-500">{{ post.date }}</div>
              </div>
            </div>
            <div class="relative group">
              <button class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div class="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-lg py-2 w-32 hidden group-hover:block">
                <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">编辑帖子</button>
                <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">删除帖子</button>
              </div>
            </div>
          </div>

          <!-- 帖子内容 -->
          <div class="p-4">
            <h3 class="font-medium text-gray-800 mb-2">{{ post.title }}</h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ post.content }}</p>
            
            <!-- 帖子图片 -->
            <div v-if="post.images && post.images.length > 0" class="grid grid-cols-3 gap-2 mb-3">
              <img 
                v-for="(image, index) in post.images" 
                :key="index" 
                :src="image" 
                :alt="post.title" 
                class="w-full h-24 object-cover rounded"
              >
            </div>

            <!-- 帖子标签 -->
            <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
              <span 
                v-for="(tag, index) in post.tags" 
                :key="index" 
                class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {{ tag }}
              </span>
            </div>

            <!-- 帖子互动 -->
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center space-x-4">
                <button class="flex items-center hover:text-primary-600 transition-colors">
                  <i class="fas fa-thumbs-up mr-1"></i>
                  <span>{{ post.likes }}</span>
                </button>
                <button class="flex items-center hover:text-primary-600 transition-colors">
                  <i class="fas fa-comment mr-1"></i>
                  <span>{{ post.comments }}</span>
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

const posts = ref([])

// 模拟加载帖子数据
const loadPosts = () => {
  // 模拟数据
  posts.value = [
    {
      id: 1,
      title: '分享一次难忘的露营经历',
      content: '上周末和朋友们一起去了武隆仙女山露营，那里的星空真的太美了！晚上我们围坐在篝火旁，听着虫鸣，感觉整个人都放松了...',
      images: [
        'https://picsum.photos/seed/camp1/300/200',
        'https://picsum.photos/seed/camp2/300/200',
        'https://picsum.photos/seed/camp3/300/200'
      ],
      tags: ['露营', '武隆', '星空'],
      likes: 42,
      comments: 12,
      date: '2024-03-20'
    },
    {
      id: 2,
      title: '推荐几个重庆周边的徒步路线',
      content: '作为一个重庆本地人，我整理了几个适合周末徒步的路线，难度适中，风景优美，非常适合户外爱好者...',
      images: [
        'https://picsum.photos/seed/hike1/300/200',
        'https://picsum.photos/seed/hike2/300/200'
      ],
      tags: ['徒步', '重庆周边', '路线推荐'],
      likes: 67,
      comments: 23,
      date: '2024-03-15'
    },
    {
      id: 3,
      title: '户外装备选择指南',
      content: '最近有很多朋友问我如何选择适合自己的户外装备，今天就来分享一下我的经验和建议...',
      tags: ['装备', '指南', '户外'],
      likes: 89,
      comments: 34,
      date: '2024-03-10'
    }
  ]
}

onMounted(() => {
  loadPosts()
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