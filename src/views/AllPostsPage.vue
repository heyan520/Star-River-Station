<template>
  <div class="flex flex-col h-screen bg-[#F5F5F5]">
    <!-- 顶部导航栏 -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between flex-shrink-0 z-50">
      <button @click="goBack" class="text-gray-600 active:scale-90 transition-transform">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h2 class="text-base font-medium text-gray-800">我的动态</h2>
      <button class="text-gray-600 active:scale-90 transition-transform" @click="showFilter">
        <i class="fas fa-sliders-h"></i>
      </button>
    </div>

    <!-- 标签筛选 -->
    <div class="bg-white px-4 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar border-b border-gray-100 flex-shrink-0">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
          activeTab === tab.id 
            ? 'bg-[#2D6A4F] text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- 动态列表 -->
    <div class="flex-1 overflow-y-auto" ref="scrollContainer" @scroll="handleScroll">
      <div class="p-4 space-y-4 pb-8">
        <!-- 动态卡片 -->
        <div 
          v-for="post in filteredPosts" 
          :key="post.id" 
          class="bg-white rounded-2xl overflow-hidden shadow-sm"
          @click="goToDetail(post)"
        >
          <!-- 用户信息 -->
          <div class="px-4 pt-4 flex items-center justify-between">
            <div class="flex items-center gap-3" @click.stop="goToUserProfile(post.author)">
              <div class="w-11 h-11 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#40916C] flex items-center justify-center text-white text-lg">
                {{ post.author.avatar }}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-gray-800 text-sm">{{ post.author.name }}</span>
                  <span v-if="post.author.isVip" class="px-1 py-0.5 bg-yellow-400 text-white text-[10px] rounded">V</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-400">
                  <span>{{ post.publishTime }}</span>
                  <span>·</span>
                  <span>{{ post.location }}</span>
                </div>
              </div>
            </div>
            <button 
              v-if="!post.author.isFollowing"
              class="px-3 py-1 bg-[#2D6A4F] text-white text-xs rounded-full active:scale-95 transition-transform"
              @click.stop="followUser(post)"
            >
              + 关注
            </button>
            <button 
              v-else
              class="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full active:scale-95 transition-transform"
              @click.stop="unfollowUser(post)"
            >
              已关注
            </button>
          </div>

          <!-- 分类标签 -->
          <div class="px-4 pt-2">
            <span class="px-2 py-0.5 bg-[#E8F5E9] text-[#2D6A4F] text-xs rounded-full">
              {{ post.category }}
            </span>
          </div>

          <!-- 文字内容 -->
          <div class="px-4 pt-3">
            <h3 class="font-semibold text-gray-800 mb-2 leading-relaxed">{{ post.title }}</h3>
            <p class="text-sm text-gray-600 leading-relaxed" :class="{ 'line-clamp-3': !post.expanded }">{{ post.content }}</p>
            <button 
              v-if="post.content.length > 100"
              class="text-[#2D6A4F] text-xs mt-1"
              @click.stop="post.expanded = !post.expanded"
            >
              {{ post.expanded ? '收起' : '展开' }}
            </button>
          </div>

          <!-- 图片区域 -->
          <div v-if="post.images && post.images.length > 0" class="px-4 pt-3">
            <div :class="[
              'grid gap-1',
              post.images.length === 1 ? 'grid-cols-1' : '',
              post.images.length === 2 ? 'grid-cols-2' : '',
              post.images.length >= 3 ? 'grid-cols-3' : ''
            ]">
              <div 
                v-for="(img, index) in post.images" 
                :key="index"
                class="relative rounded-lg overflow-hidden bg-gray-100"
                :class="post.images.length === 1 ? 'h-48' : 'h-24'"
                @click.stop="previewImages(post, index)"
              >
                <img :src="img" alt="图片" class="w-full h-full object-cover" loading="lazy">
                <div v-if="index === 2 && post.images.length > 3" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span class="text-white text-xl font-bold">+{{ post.images.length - 3 }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 标签 -->
          <div v-if="post.tags && post.tags.length > 0" class="px-4 pt-3 flex flex-wrap gap-2">
            <span 
              v-for="tag in post.tags" 
              :key="tag"
              class="text-xs text-[#2D6A4F]"
            >
              # {{ tag }}
            </span>
          </div>

          <!-- 互动栏 -->
          <div class="px-4 py-3 flex items-center justify-between border-t border-gray-100 mt-3">
            <div class="flex items-center gap-6">
              <button class="flex items-center gap-1.5 text-gray-400 active:scale-90 transition-transform" @click.stop="likePost(post)">
                <i :class="post.isLiked ? 'fas fa-heart text-red-500' : 'far fa-heart'"></i>
                <span class="text-xs">{{ post.likes }}</span>
              </button>
              <button class="flex items-center gap-1.5 text-gray-400 active:scale-90 transition-transform" @click.stop="goToDetail(post)">
                <i class="far fa-comment"></i>
                <span class="text-xs">{{ post.comments }}</span>
              </button>
              <button class="flex items-center gap-1.5 text-gray-400 active:scale-90 transition-transform" @click.stop="sharePost(post)">
                <i class="fas fa-share-alt"></i>
                <span class="text-xs">分享</span>
              </button>
            </div>
            <button class="text-gray-400 active:scale-90 transition-transform" @click.stop="bookmarkPost(post)">
              <i :class="post.isBookmarked ? 'fas fa-bookmark text-yellow-500' : 'far fa-bookmark'"></i>
            </button>
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMore" class="text-center py-6">
          <button 
            v-if="!loading"
            class="text-[#2D6A4F] text-sm"
            @click="loadMore"
          >
            加载更多
          </button>
          <div v-else class="flex items-center justify-center gap-2 text-gray-400">
            <i class="fas fa-spinner fa-spin"></i>
            <span class="text-sm">加载中...</span>
          </div>
        </div>

        <!-- 没有更多 -->
        <div v-else class="text-center py-8 text-gray-400">
          <i class="fas fa-inbox text-4xl mb-2"></i>
          <p class="text-sm">没有更多动态了</p>
        </div>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <div v-if="previewIndex >= 0" class="fixed inset-0 bg-black z-50 flex items-center justify-center" @click="closePreview">
      <button class="absolute top-4 right-4 text-white text-2xl z-10" @click="closePreview">
        <i class="fas fa-times"></i>
      </button>
      <div class="flex items-center justify-center gap-4">
        <button v-if="previewIndex > 0" class="text-white text-3xl absolute left-4" @click.stop="prevImage">
          <i class="fas fa-chevron-left"></i>
        </button>
        <img :src="currentPost?.images[previewIndex]" alt="预览" class="max-w-full max-h-full object-contain">
        <button v-if="previewIndex < (currentPost?.images?.length || 0) - 1" class="text-white text-3xl absolute right-4" @click.stop="nextImage">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div class="absolute bottom-8 text-white text-sm">
        {{ previewIndex + 1 }} / {{ currentPost?.images?.length }}
      </div>
    </div>

    <!-- 筛选弹窗 -->
    <div v-if="showFilterModal" class="fixed inset-0 bg-black/50 z-50 flex items-end" @click="showFilterModal = false">
      <div class="w-full bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800">筛选</h3>
          <button class="text-gray-400" @click="showFilterModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- 时间筛选 -->
        <div class="mb-4">
          <h4 class="text-sm text-gray-600 mb-2">时间范围</h4>
          <div class="flex gap-2">
            <button 
              v-for="time in timeFilters" 
              :key="time.id"
              @click="selectedTime = time.id"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs',
                selectedTime === time.id ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ time.name }}
            </button>
          </div>
        </div>

        <!-- 分类筛选 -->
        <div class="mb-4">
          <h4 class="text-sm text-gray-600 mb-2">内容分类</h4>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="cat in categories" 
              :key="cat"
              @click="toggleCategory(cat)"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs',
                selectedCategories.includes(cat) ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-3 pt-4 border-t border-gray-100">
          <button class="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg" @click="resetFilter">重置</button>
          <button class="flex-1 py-2.5 bg-[#2D6A4F] text-white rounded-lg" @click="applyFilter">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const activeTab = ref('all')
const tabs = [
  { id: 'all', name: '全部' },
  { id: 'original', name: '原创' },
  { id: 'photo', name: '图文' },
  { id: 'video', name: '视频' },
  { id: 'activity', name: '活动' }
]

const posts = ref([
  {
    id: 1,
    title: '周末缙云山徒步攻略 🏔️',
    content: '上周和朋友一起去了缙云山，真的太美了！从山脚到山顶大概需要3-4小时，沿途风景绝美，空气清新。建议早上8点前出发，可以避开人流高峰期。装备建议：登山杖、防滑登山鞋、足够的水和干粮、防晒用品。山顶的观景台可以俯瞰整个重庆主城区，天气好的时候还能看到南山一棵树。',
    author: {
      name: '户外爱好者',
      avatar: '🐸',
      isFollowing: false,
      isVip: true
    },
    category: '徒步',
    location: '重庆',
    tags: ['缙云山', '徒步', '周末游', '户外攻略'],
    images: [
      'https://modao.cc/agent-py/media/generated_images/2026-05-30/d3df85fa8ef24d08ae1ab762cfad063d.jpg',
      'https://modao.cc/agent-py/media/generated_images/2026-05-30/f723d6f3e3964a07917ff03eb28da52d.jpg',
      'https://modao.cc/agent-py/media/generated_images/2026-05-30/177982f670344e1b8855addb0aa9c575.jpg'
    ],
    publishTime: '2小时前',
    likes: 89,
    comments: 24,
    isLiked: false,
    isBookmarked: false,
    expanded: false
  },
  {
    id: 2,
    title: '仙女山露营全指南 ⛺',
    content: '这次给大家分享一下仙女山露营的全攻略！包括最佳露营点、必备装备、注意事项等。强烈建议大家秋天去，枫叶红了的仙女山简直美翻了！',
    author: {
      name: '露营达人',
      avatar: '🏕️',
      isFollowing: true,
      isVip: false
    },
    category: '露营',
    location: '武隆',
    tags: ['仙女山', '露营', '攻略'],
    images: [
      'https://modao.cc/agent-py/media/generated_images/2026-05-30/f723d6f3e3964a07917ff03eb28da52d.jpg',
      'https://modao.cc/agent-py/media/generated_images/2026-05-30/d3df85fa8ef24d08ae1ab762cfad063d.jpg'
    ],
    publishTime: '昨天',
    likes: 156,
    comments: 45,
    isLiked: true,
    isBookmarked: false,
    expanded: false
  },
  {
    id: 3,
    title: '重庆周边最美骑行路线 🚴',
    content: '作为一个骑行爱好者，给大家推荐几条重庆周边最美的骑行路线！包括南山樱花大道、嘉陵江滨江路、大学城环线等。每条路线都有详细的距离、难度评级和沿途风景介绍。',
    author: {
      name: '骑行侠',
      avatar: '🚴',
      isFollowing: false,
      isVip: true
    },
    category: '骑行',
    location: '重庆',
    tags: ['骑行', '路线推荐', '周末游'],
    images: [
      'https://modao.cc/agent-py/media/generated_images/2026-05-30/177982f670344e1b8855addb0aa9c575.jpg',
      'https://modao.cc/agent-py/media/generated_images/2026-05-30/e05fd7e4b81a4d8ebae8c6067a035c9f.jpg',
      'https://modao.cc/agent-py/media/generated_images/2026-05-30/d3df85fa8ef24d08ae1ab762cfad063d.jpg',
      'https://modao.cc/agent-py/media/generated_images/2026-05-30/f723d6f3e3964a07917ff03eb28da52d.jpg'
    ],
    publishTime: '3天前',
    likes: 234,
    comments: 67,
    isLiked: false,
    isBookmarked: true,
    expanded: false
  },
  {
    id: 4,
    title: '新手露营必看装备清单 🎒',
    content: '最近很多朋友问我第一次露营需要准备什么，今天就来给大家整理一份新手露营必看装备清单！从帐篷、睡袋、防潮垫到照明、炊具，每一样都给出推荐品牌和选购要点。',
    author: {
      name: '装备专家',
      avatar: '🎒',
      isFollowing: true,
      isVip: false
    },
    category: '装备',
    location: '重庆',
    tags: ['露营装备', '新手必看', '装备推荐'],
    images: [],
    publishTime: '1周前',
    likes: 456,
    comments: 123,
    isLiked: false,
    isBookmarked: false,
    expanded: false
  },
  {
    id: 5,
    title: '雨崩徒步：一次灵魂的洗礼 🏔️',
    content: '终于完成了雨崩徒步！这是我这辈子最难忘的经历之一。从西当村到雨崩村，途经雪山、森林、草原，一路的美景让人窒息。特别推荐神瀑线，景色最美但也最辛苦。建议至少安排4天时间。',
    author: {
      name: '户外爱好者',
      avatar: '🐸',
      isFollowing: true,
      isVip: true
    },
    category: '徒步',
    location: '云南',
    tags: ['雨崩', '徒步', '西藏'],
    images: [
      'https://modao.cc/agent-py/media/generated_images/2026-05-30/e05fd7e4b81a4d8ebae8c6067a035c9f.jpg',
      'https://modao.cc/agent-py/media/generated_images/2026-05-30/177982f670344e1b8855addb0aa9c575.jpg',
      'https://modao.cc/agent-py/media/generated_images/2026-05-30/d3df85fa8ef24d08ae1ab762cfad063d.jpg'
    ],
    publishTime: '2周前',
    likes: 678,
    comments: 189,
    isLiked: false,
    isBookmarked: false,
    expanded: false
  }
])

const filteredPosts = computed(() => {
  if (activeTab.value === 'all') return posts.value
  if (activeTab.value === 'photo') {
    return posts.value.filter(p => p.images && p.images.length > 0)
  }
  if (activeTab.value === 'original') {
    return posts.value.filter(p => !p.images || p.images.length === 0)
  }
  return posts.value
})

const previewIndex = ref(-1)
const currentPost = ref(null)

const previewImages = (post, index) => {
  currentPost.value = post
  previewIndex.value = index
}

const closePreview = () => {
  previewIndex.value = -1
}

const prevImage = () => {
  if (previewIndex.value > 0) {
    previewIndex.value--
  }
}

const nextImage = () => {
  if (previewIndex.value < (currentPost.value?.images?.length || 0) - 1) {
    previewIndex.value++
  }
}

const likePost = (post) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

const bookmarkPost = (post) => {
  post.isBookmarked = !post.isBookmarked
}

const followUser = (post) => {
  post.author.isFollowing = true
}

const unfollowUser = (post) => {
  post.author.isFollowing = false
}

const goToDetail = (post) => {
  router.push({ name: 'post-detail', query: { post: JSON.stringify(post) } })
}

const goToUserProfile = (author) => {
  console.log('前往用户主页:', author.name)
}

const sharePost = (post) => {
  if (navigator.share) {
    navigator.share({
      title: post.title,
      text: post.content.substring(0, 100),
      url: window.location.href
    })
  }
}

const showFilterModal = ref(false)
const selectedTime = ref('all')
const timeFilters = [
  { id: 'all', name: '全部' },
  { id: 'week', name: '一周内' },
  { id: 'month', name: '一月内' },
  { id: 'year', name: '一年内' }
]

const categories = ['徒步', '露营', '骑行', '摄影', '装备', '亲子', '问答']
const selectedCategories = ref([])

const showFilter = () => {
  showFilterModal.value = true
}

const toggleCategory = (cat) => {
  const index = selectedCategories.value.indexOf(cat)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(cat)
  }
}

const resetFilter = () => {
  selectedTime.value = 'all'
  selectedCategories.value = []
}

const applyFilter = () => {
  showFilterModal.value = false
}

const hasMore = ref(true)
const loading = ref(false)

const loadMore = () => {
  loading.value = true
  setTimeout(() => {
    const lastId = posts.value[posts.value.length - 1]?.id || 0
    const newPosts = [
      {
        id: lastId + 1,
        title: '新加载的动态标题',
        content: '这里是新加载的动态内容摘要...',
        author: {
          name: '新用户',
          avatar: '👤',
          isFollowing: false,
          isVip: false
        },
        category: '徒步',
        location: '重庆',
        tags: ['徒步'],
        images: [],
        publishTime: '刚刚',
        likes: 0,
        comments: 0,
        isLiked: false,
        isBookmarked: false,
        expanded: false
      }
    ]
    posts.value.push(...newPosts)
    loading.value = false
    if (posts.value.length >= 10) {
      hasMore.value = false
    }
  }, 1000)
}

const handleScroll = () => {
  const container = document.querySelector('.overflow-y-auto')
  if (container) {
    const { scrollTop, scrollHeight, clientHeight } = container
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore.value && !loading.value) {
      loadMore()
    }
  }
}

onMounted(() => {
})
</script>

<style scoped>
.bg-\[\#2D6A4F\] {
  background-color: #2D6A4F;
}

.text-\[\#2D6A4F\] {
  color: #2D6A4F;
}

.bg-\[\#E8F5E9\] {
  background-color: #E8F5E9;
}

.bg-\[\#40916C\] {
  background-color: #40916C;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
