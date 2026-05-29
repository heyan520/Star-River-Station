<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <button @click="goToPage('profile')" class="text-gray-600 hover:text-gray-900 transition-colors">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">我的评论</h1>
      <div></div>
    </div>

    <!-- 评论列表 -->
    <div class="px-4 py-4 space-y-4">
      <!-- 空状态 -->
      <div v-if="comments.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-3">
          <i class="fas fa-comment text-gray-400 text-2xl"></i>
        </div>
        <p class="text-gray-500">您还没有发表过评论</p>
        <button 
          class="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:bg-primary-600"
          @click="goToPage('community')"
        >
          去社区看看
        </button>
      </div>

      <!-- 评论列表 -->
      <div v-else>
        <div 
          v-for="comment in comments" 
          :key="comment.id" 
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- 评论头部 -->
          <div class="px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <div class="flex items-center">
              <img src="../assets/头像.png" alt="头像" class="w-8 h-8 rounded-full mr-2">
              <div>
                <div class="text-sm font-medium text-gray-800">户外爱好者</div>
                <div class="text-xs text-gray-500">{{ comment.date }}</div>
              </div>
            </div>
            <div class="relative group">
              <button class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div class="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-lg py-2 w-32 hidden group-hover:block">
                <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">编辑评论</button>
                <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">删除评论</button>
              </div>
            </div>
          </div>

          <!-- 评论内容 -->
          <div class="p-4">
            <!-- 评论对象 -->
            <div class="mb-3 p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center mb-2">
                <img :src="comment.targetAvatar" :alt="comment.targetName" class="w-6 h-6 rounded-full mr-2">
                <span class="text-sm font-medium text-gray-800">{{ comment.targetName }}</span>
                <span class="text-xs text-gray-500 ml-2">{{ comment.targetType }}</span>
              </div>
              <h4 class="text-sm font-medium text-gray-700 mb-1">{{ comment.targetTitle }}</h4>
              <p v-if="comment.targetContent" class="text-xs text-gray-600 line-clamp-2">{{ comment.targetContent }}</p>
              <img v-if="comment.targetImage" :src="comment.targetImage" :alt="comment.targetTitle" class="w-full h-24 object-cover rounded mt-2">
            </div>

            <!-- 评论内容 -->
            <div class="mb-3">
              <p class="text-sm text-gray-800">{{ comment.content }}</p>
            </div>

            <!-- 评论互动 -->
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center space-x-4">
                <button class="flex items-center hover:text-primary-600 transition-colors">
                  <i class="fas fa-thumbs-up mr-1"></i>
                  <span>{{ comment.likes }}</span>
                </button>
                <button class="flex items-center hover:text-primary-600 transition-colors">
                  <i class="fas fa-reply mr-1"></i>
                  <span>回复</span>
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

const comments = ref([])

// 模拟加载评论数据
const loadComments = () => {
  // 模拟数据
  comments.value = [
    {
      id: 1,
      content: '非常详细的攻略，已经收藏了，准备下周就去！',
      targetType: '攻略',
      targetTitle: '重庆武隆天生三桥一日游攻略',
      targetContent: '详细介绍武隆天生三桥的游览路线、最佳时间、交通方式和注意事项...',
      targetImage: 'https://picsum.photos/seed/wulong1/300/200',
      targetName: '旅行达人',
      targetAvatar: 'https://picsum.photos/seed/avatar1/100/100',
      likes: 12,
      date: '2024-03-19'
    },
    {
      id: 2,
      content: '分享得很详细，请问露营地需要提前预订吗？',
      targetType: '帖子',
      targetTitle: '分享一次难忘的露营经历',
      targetContent: '上周末和朋友们一起去了武隆仙女山露营，那里的星空真的太美了！',
      targetImage: 'https://picsum.photos/seed/camp1/300/200',
      targetName: '户外新手',
      targetAvatar: 'https://picsum.photos/seed/avatar2/100/100',
      likes: 8,
      date: '2024-03-17'
    },
    {
      id: 3,
      content: '谢谢分享，这些路线看起来都很棒！',
      targetType: '帖子',
      targetTitle: '推荐几个重庆周边的徒步路线',
      targetName: '徒步爱好者',
      targetAvatar: 'https://picsum.photos/seed/avatar3/100/100',
      likes: 5,
      date: '2024-03-16'
    }
  ]
}

onMounted(() => {
  loadComments()
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