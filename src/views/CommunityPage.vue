<template>
  <div class="community-page">
    <!-- 顶部导航栏 -->
    <div class="community-header">
      <h1 class="community-title">社区</h1>
      <div class="header-actions">
        <button class="create-button" @click="navigateToCreateContent">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>

    <!-- 内容类型切换 -->
    <div class="content-tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        全部
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'guide' }"
        @click="activeTab = 'guide'"
      >
        攻略
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'forum' }"
        @click="activeTab = 'forum'"
      >
        论坛
      </button>
    </div>

    <!-- 分类筛选 -->
    <div class="category-filter">
      <button 
        v-for="category in categories" 
        :key="category.id"
        class="category-button"
        :class="{ active: selectedCategory === category.id }"
        @click="selectedCategory = category.id"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- 内容列表 -->
    <div class="content-list">
      <div 
        v-for="item in filteredContent" 
        :key="item.id"
        class="content-item"
        @click="navigateToContentDetail(item.id, item.type)"
      >
        <!-- 攻略类型 -->
        <div v-if="item.type === 'guide'" class="guide-card">
          <div class="guide-image" :style="{ backgroundImage: `url(${item.images[0]})` }"></div>
          <div class="guide-content">
            <div class="guide-tag">攻略</div>
            <h3 class="guide-title">{{ item.title }}</h3>
            <p class="guide-description">{{ item.description }}</p>
            <div class="guide-meta">
              <span class="guide-destination">{{ item.guideInfo.destination }}</span>
              <span class="guide-duration">{{ item.guideInfo.duration }}</span>
              <div class="guide-stats">
                <span><i class="fas fa-eye"></i> {{ item.guideInfo.views }}</span>
                <span><i class="fas fa-heart"></i> {{ item.guideInfo.likes }}</span>
                <span><i class="fas fa-bookmark"></i> {{ item.guideInfo.favorites }}</span>
              </div>
            </div>
            <div class="guide-author">
              <img :src="item.author.avatar" alt="作者头像" class="author-avatar">
              <span class="author-name">{{ item.author.name }}</span>
              <span class="author-level">{{ item.author.level }}</span>
            </div>
          </div>
        </div>

        <!-- 论坛帖子类型 -->
        <div v-else-if="item.type === 'forum'" class="forum-card">
          <div class="forum-content">
            <div class="forum-tag">论坛</div>
            <h3 class="forum-title">{{ item.title }}</h3>
            <p class="forum-description">{{ item.description }}</p>
            <div class="forum-meta">
              <div class="forum-stats">
                <span><i class="fas fa-eye"></i> {{ item.forumInfo.views }}</span>
                <span><i class="fas fa-comment"></i> {{ item.forumInfo.replies }}</span>
              </div>
              <span class="forum-time">{{ item.forumInfo.lastReplyTime }}</span>
            </div>
            <div class="forum-author">
              <img :src="item.author.avatar" alt="作者头像" class="author-avatar">
              <span class="author-name">{{ item.author.name }}</span>
            </div>
          </div>
        </div>
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

// 状态管理
const activeTab = ref('all')
const selectedCategory = ref('all')

// 分类数据
const categories = [
  { id: 'all', name: '全部' },
  { id: 'camping', name: '露营' },
  { id: 'hiking', name: '徒步' },
  { id: 'driving', name: '自驾游' },
  { id: 'equipment', name: '装备' }
]

// 模拟内容数据
const contentData = [
  {
    id: 1,
    type: 'guide',
    title: '武隆仙女山2日自驾游攻略',
    description: '详细的仙女山自驾游路线、住宿、美食推荐，适合周末出行',
    images: ['/assets/仙女山-天生三桥环线.png'],
    guideInfo: {
      destination: '武隆仙女山',
      duration: '2天1夜',
      views: 528,
      likes: 128,
      favorites: 86
    },
    author: {
      id: 1,
      name: '户外达人小王',
      avatar: '/assets/头像.png',
      level: '资深攻略作者'
    }
  },
  {
    id: 2,
    type: 'forum',
    title: '大家推荐一下重庆周边适合露营的地方',
    description: '想找个周末和朋友一起去露营，有没有好的推荐？最好交通方便，设施齐全的地方。',
    forumInfo: {
      views: 320,
      replies: 15,
      lastReplyTime: '2026-04-01 16:30'
    },
    author: {
      id: 2,
      name: '户外爱好者',
      avatar: '/src/assets/头像.png'
    }
  },
  {
    id: 3,
    type: 'guide',
    title: '南川金佛山徒步攻略',
    description: '金佛山经典徒步路线，包含路况、装备建议和注意事项',
    images: ['/assets/南川178环线.png'],
    guideInfo: {
      destination: '南川金佛山',
      duration: '1天',
      views: 312,
      likes: 89,
      favorites: 56
    },
    author: {
      id: 3,
      name: '徒步爱好者',
      avatar: '/assets/头像.png',
      level: '攻略作者'
    }
  },
  {
    id: 4,
    type: 'forum',
    title: '新手露营装备推荐',
    description: '第一次露营，需要准备哪些装备？预算1000元左右，有什么推荐的吗？',
    forumInfo: {
      views: 456,
      replies: 23,
      lastReplyTime: '2026-04-02 10:15'
    },
    author: {
      id: 4,
      name: '露营新手',
      avatar: '/src/assets/头像.png'
    }
  }
]

// 筛选内容
const filteredContent = computed(() => {
  let result = contentData
  
  // 按类型筛选
  if (activeTab.value !== 'all') {
    result = result.filter(item => item.type === activeTab.value)
  }
  
  // 按分类筛选（这里简化处理，实际应该根据内容的tags或category字段筛选）
  if (selectedCategory.value !== 'all') {
    // 这里只是示例，实际需要根据具体分类逻辑筛选
    result = result
  }
  
  return result
})

// 导航到内容详情页
const navigateToContentDetail = (id, type) => {
  router.push({
    name: 'content-detail',
    params: { id, type }
  })
}

// 导航到发布内容页面
const navigateToCreateContent = () => {
  router.push({ name: 'create-content' })
}

// 导航到AI小助手页面
const navigateToAIAssistant = () => {
  router.push({ name: 'ai-assistant' })
}
</script>

<style scoped>
.community-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f5f7fa, #e4f1fe);
  padding-bottom: 60px;
}

.community-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.community-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.create-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4CAF50;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.create-button:hover {
  background: #45a049;
  transform: scale(1.05);
}

.content-tabs {
  display: flex;
  background: white;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.tab-button {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button.active {
  background: #4CAF50;
  color: white;
}

.category-filter {
  display: flex;
  overflow-x: auto;
  padding: 0 16px 12px;
  gap: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-filter::-webkit-scrollbar {
  display: none;
}

.category-button {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 16px;
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-button.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.content-list {
  padding: 0 16px;
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.content-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.content-item:hover {
  transform: translateY(-2px);
}

.guide-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.guide-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.guide-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #4CAF50;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.guide-content {
  padding: 16px;
  position: relative;
  padding-top: 36px; /* 为标签留出空间 */
}

.guide-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.guide-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.guide-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
  align-items: center;
}

.guide-destination {
  background: #f0f9ff;
  color: #3b82f6;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
}

.guide-duration {
  background: #f0fdf4;
  color: #22c55e;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
}

.guide-stats {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

.guide-stats span {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

.guide-author {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.author-level {
  font-size: 10px;
  color: #999;
  background: #f5f5f5;
  padding: 1px 6px;
  border-radius: 8px;
}

.forum-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: relative;
  padding-top: 36px; /* 为标签留出空间 */
}

.forum-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #3b82f6;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.forum-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.forum-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.forum-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.forum-stats {
  display: flex;
  gap: 12px;
}

.forum-stats span {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

.forum-time {
  font-size: 12px;
  color: #999;
}

.forum-author {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
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
  .community-header {
    padding: 12px 16px;
  }
  
  .guide-image {
    height: 150px;
  }
  
  .content-list {
    padding: 0 12px;
  }
  
  .floating-assistant {
    bottom: 65px;
    right: 16px;
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}
</style>