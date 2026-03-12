<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <h2 class="text-lg font-medium text-gray-800">户外社区</h2>
      <div class="flex items-center space-x-4">
        <button class="text-gray-600">
          <i class="fas fa-search text-lg"></i>
        </button>
        <button @click="goToPostPage" class="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
          发贴
        </button>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="bg-white px-4 py-3 border-b overflow-x-auto">
      <div class="flex space-x-3 min-w-max">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['flex items-center px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all', 
                   selectedCategory === category.id ? 'bg-primary-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
          @click="selectCategory(category.id)"
        >
          <i :class="[category.icon, 'mr-1']"></i>
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- 排序选项 -->
    <div class="bg-white px-4 py-3 border-b flex items-center space-x-4">
      <button 
        v-for="sortOption in sortOptions" 
        :key="sortOption.id"
        :class="['text-sm transition-all', 
                 selectedSort === sortOption.id ? 'text-primary-500 font-medium' : 'text-gray-600 hover:text-primary-500']"
        @click="selectSort(sortOption.id)"
      >
        {{ sortOption.name }}
      </button>
    </div>

    <!-- 帖子列表 -->
    <div class="bg-white">
      <div 
        v-for="post in filteredPosts" 
        :key="post.id"
        class="border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-start space-x-3">
          <!-- 用户头像和信息 -->
          <div class="flex-shrink-0">
            <img :src="post.userAvatar" :alt="post.userName" class="w-10 h-10 rounded-full object-cover">
          </div>
          
          <!-- 帖子内容 -->
          <div class="flex-1">
            <!-- 用户名和时间 -->
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <h3 class="font-medium text-gray-800">{{ post.userName }}</h3>
                <span v-if="post.userTitle" class="ml-2 bg-primary-100 text-primary-600 px-2 py-0.5 rounded text-xs">{{ post.userTitle }}</span>
              </div>
              <span class="text-xs text-gray-500">{{ post.postTime }}</span>
            </div>
            
            <!-- 帖子标题和正文 -->
            <h4 class="font-medium text-gray-800 mb-2">{{ post.title }}</h4>
            <p class="text-gray-600 text-sm mb-3">{{ post.content }}</p>
            
            <!-- 帖子图片 -->
            <div v-if="post.images && post.images.length > 0" class="mb-3">
              <div class="grid grid-cols-3 gap-1">
                <img 
                  v-for="(image, index) in (post.images.length > 3 ? post.images.slice(0, 3) : post.images)" 
                  :key="index"
                  :src="image" 
                  :alt="'Post image ' + (index + 1)"
                  class="rounded-lg object-cover aspect-square"
                  :style="{ height: '80px' }"
                >
                <div v-if="post.images.length > 3" 
                     class="rounded-lg bg-black bg-opacity-50 flex items-center justify-center aspect-square"
                     :style="{ height: '80px' }"
                >
                  <span class="text-white text-sm">+{{ post.images.length - 3 }}</span>
                </div>
              </div>
            </div>
            
            <!-- 互动数据 -->
            <div class="flex items-center justify-between text-gray-500 text-sm">
              <div class="flex items-center space-x-4">
                <button class="flex items-center space-x-1 hover:text-primary-500">
                  <i class="fas fa-heart"></i>
                  <span>{{ post.likes }}</span>
                </button>
                <button class="flex items-center space-x-1 hover:text-primary-500">
                  <i class="fas fa-comment"></i>
                  <span>{{ post.comments }}</span>
                </button>
                <button class="flex items-center space-x-1 hover:text-primary-500">
                  <i class="fas fa-bookmark"></i>
                  <span>{{ post.bookmarks }}</span>
                </button>
              </div>
              <button class="hover:text-primary-500">
                <i class="fas fa-share"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 分类数据
const categories = ref([
  { id: 'all', name: '全部', icon: 'fas fa-th-large' },
  { id: 'hiking', name: '徒步', icon: 'fas fa-hiking' },
  { id: 'camping', name: '露营', icon: 'fas fa-campground' },
  { id: 'travel', name: '旅行', icon: 'fas fa-plane' },
  { id: 'photography', name: '摄影', icon: 'fas fa-camera' },
  { id: 'parenting', name: '亲子', icon: 'fas fa-users' },
  { id: 'equipment', name: '装备', icon: 'fas fa-backpack' },
  { id: 'qa', name: '问答', icon: 'fas fa-question-circle' }
])

// 排序选项
const sortOptions = ref([
  { id: 'latest', name: '最新' },
  { id: 'hottest', name: '最热' },
  { id: 'recommended', name: '推荐' }
])

// 当前选中的分类和排序
const selectedCategory = ref('all')
const selectedSort = ref('latest')

// 帖子数据（模拟）
const posts = ref([
  {
    id: 1,
    userId: 1,
    userName: '户外老杨',
    userAvatar: 'https://picsum.photos/seed/user1/100/100',
    userTitle: '徒步圈',
    title: '贡嘎环线5天4晚轻装徒步全攻略',
    content: '新手友好型贡嘎徒步路线，避开高反路段，每日行程控制在8公里内。必备装备：防滑登山鞋、羽绒服或冲锋衣、能量补给...',
    images: [
      'https://picsum.photos/seed/hiking1/800/600',
      'https://picsum.photos/seed/hiking2/800/600',
      'https://picsum.photos/seed/hiking3/800/600'
    ],
    categoryId: 'hiking',
    postTime: '2小时前',
    likes: 128,
    comments: 42,
    bookmarks: 56
  },
  {
    id: 2,
    userId: 2,
    userName: '露营达人小王',
    userAvatar: 'https://picsum.photos/seed/user2/100/100',
    userTitle: '露营推荐官',
    title: '重庆周边5个绝美露营地推荐',
    content: '周末不想去太远？这里有重庆周边5个绝美露营地推荐，适合家庭和朋友聚会，有的还可以看到星空哦！',
    images: [
      'https://picsum.photos/seed/camping1/800/600',
      'https://picsum.photos/seed/camping2/800/600'
    ],
    categoryId: 'camping',
    postTime: '5小时前',
    likes: 96,
    comments: 28,
    bookmarks: 41
  },
  {
    id: 3,
    userId: 3,
    userName: '摄影爱好者小李',
    userAvatar: 'https://picsum.photos/seed/user3/100/100',
    title: '川西摄影之旅，记录最美秋景',
    content: '川西的秋天太美了，分享一些摄影技巧和最佳拍摄地点，希望大家都能拍出好看的照片。',
    images: [
      'https://picsum.photos/seed/photography1/800/600',
      'https://picsum.photos/seed/photography2/800/600',
      'https://picsum.photos/seed/photography3/800/600',
      'https://picsum.photos/seed/photography4/800/600'
    ],
    categoryId: 'photography',
    postTime: '1天前',
    likes: 156,
    comments: 35,
    bookmarks: 72
  }
])

// 筛选后的帖子
const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    if (selectedCategory.value === 'all') {
      return true
    }
    return post.categoryId === selectedCategory.value
  })
})

// 选择分类
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
}

// 选择排序
const selectSort = (sortId) => {
  selectedSort.value = sortId
}

// 跳转发贴页面
const goToPostPage = () => {
  router.push({ name: 'post' })
}
</script>

<style scoped>
/* 自定义样式可以在这里添加 */
</style>
