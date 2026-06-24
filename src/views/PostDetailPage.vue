<template>
  <div class="min-h-screen bg-[#F5F5F5]">
    <!-- 顶部导航栏 -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <button @click="goBack" class="text-gray-600 active:scale-90 transition-transform">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h2 class="text-base font-medium text-gray-800">帖子详情</h2>
      <button class="text-gray-600 active:scale-90 transition-transform" @click="showMoreActions">
        <i class="fas fa-ellipsis-v"></i>
      </button>
    </div>

    <!-- 帖子内容区域 -->
    <div class="overflow-y-auto" :style="{ height: 'calc(100vh - 110px)' }">
      <!-- 帖子主体 -->
      <div class="bg-white px-5 py-4">
        <!-- 用户信息 -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#40916C] flex items-center justify-center text-white text-lg">
              {{ post.author.avatar }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">{{ post.author.name }}</h3>
              <p class="text-xs text-gray-500">{{ post.author.level }} · {{ post.publishTime }}</p>
            </div>
          </div>
          <button 
            class="px-4 py-1.5 bg-[#2D6A4F] text-white text-xs rounded-full active:scale-95 transition-transform"
            @click="followAuthor"
          >
            {{ post.isFollowing ? '已关注' : '关注' }}
          </button>
        </div>

        <!-- 分类标签 -->
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 bg-[#E8F5E9] text-[#2D6A4F] text-xs rounded-full">
            {{ post.category }}
          </span>
          <span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
            {{ post.location }}
          </span>
        </div>

        <!-- 标题 -->
        <h1 class="text-xl font-bold text-gray-800 mb-3">{{ post.title }}</h1>

        <!-- 内容 -->
        <p class="text-gray-600 leading-relaxed mb-4">{{ post.content }}</p>

        <!-- 图片网格 -->
        <div v-if="post.images && post.images.length > 0" :class="[
          'grid gap-2 mb-4',
          post.images.length === 1 ? 'grid-cols-1' : '',
          post.images.length === 2 ? 'grid-cols-2' : '',
          post.images.length >= 3 ? 'grid-cols-3' : ''
        ]">
          <div 
            v-for="(img, index) in post.images" 
            :key="index"
            class="relative rounded-xl overflow-hidden bg-gray-100"
            :class="post.images.length === 1 ? 'h-64' : 'h-24'"
            @click="previewImage(index)"
          >
            <img :src="img" alt="图片" class="w-full h-full object-cover">
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="tag in post.tags" 
            :key="tag"
            class="px-3 py-1 bg-gray-100 text-[#2D6A4F] text-xs rounded-full"
          >
            # {{ tag }}
          </span>
        </div>

        <!-- 互动数据 -->
        <div class="flex items-center gap-6 text-sm text-gray-500 pb-4 border-b border-gray-100">
          <span class="flex items-center gap-1">
            <i class="fas fa-eye text-gray-400"></i>
            {{ post.views }} 浏览
          </span>
          <span class="flex items-center gap-1">
            <i class="fas fa-heart text-red-400"></i>
            {{ post.likes }} 点赞
          </span>
          <span class="flex items-center gap-1">
            <i class="fas fa-comment text-blue-400"></i>
            {{ post.comments }} 评论
          </span>
        </div>
      </div>

      <!-- 热门评论 -->
      <div class="bg-white mt-2 px-5 py-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <i class="fas fa-fire text-orange-400"></i>
          热门评论
        </h3>
        
        <div v-if="hotComments.length > 0" class="space-y-4">
          <div v-for="comment in hotComments" :key="comment.id" class="flex gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm flex-shrink-0">
              {{ comment.avatar }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-medium text-gray-800 text-sm">{{ comment.author }}</span>
                <span class="text-xs text-gray-400">{{ comment.time }}</span>
              </div>
              <p class="text-gray-600 text-sm leading-relaxed mb-2">{{ comment.content }}</p>
              <div class="flex items-center gap-4 text-xs text-gray-400">
                <button class="flex items-center gap-1 active:scale-90 transition-transform" @click="likeComment(comment)">
                  <i class="fas fa-heart text-red-400"></i>
                  {{ comment.likes }}
                </button>
                <button class="flex items-center gap-1 active:scale-90 transition-transform" @click="replyToComment(comment)">
                  <i class="fas fa-reply"></i>
                  回复
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <i class="fas fa-comment-dots text-4xl mb-2"></i>
          <p class="text-sm">暂无热门评论</p>
        </div>
      </div>

      <!-- 最新评论 -->
      <div class="bg-white mt-2 px-5 py-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <i class="fas fa-comments text-blue-400"></i>
          最新评论 ({{ comments.length }})
        </h3>
        
        <div v-if="comments.length > 0" class="space-y-4">
          <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm flex-shrink-0">
              {{ comment.avatar }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-medium text-gray-800 text-sm">{{ comment.author }}</span>
                <span v-if="comment.isAuthor" class="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded">作者</span>
                <span class="text-xs text-gray-400">{{ comment.time }}</span>
              </div>
              <p class="text-gray-600 text-sm leading-relaxed mb-2">{{ comment.content }}</p>
              <div class="flex items-center gap-4 text-xs text-gray-400">
                <button class="flex items-center gap-1 active:scale-90 transition-transform" @click="likeComment(comment)">
                  <i :class="comment.isLiked ? 'fas fa-heart text-red-400' : 'far fa-heart'"></i>
                  {{ comment.likes }}
                </button>
                <button class="flex items-center gap-1 active:scale-90 transition-transform" @click="replyToComment(comment)">
                  <i class="fas fa-reply"></i>
                  回复
                </button>
              </div>
              
              <!-- 回复列表 -->
              <div v-if="comment.replies && comment.replies.length > 0" class="mt-3 pl-4 border-l-2 border-gray-100 space-y-3">
                <div v-for="reply in comment.replies" :key="reply.id" class="flex gap-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs flex-shrink-0">
                    {{ reply.avatar }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-gray-800 text-xs">{{ reply.author }}</span>
                      <span v-if="reply.isAuthor" class="px-1 py-0.5 bg-red-500 text-white text-[10px] rounded">作者</span>
                      <span class="text-xs text-gray-400">{{ reply.time }}</span>
                    </div>
                    <p class="text-gray-600 text-xs leading-relaxed">{{ reply.content }}</p>
                    <div class="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <button class="flex items-center gap-1" @click="likeReply(reply)">
                        <i :class="reply.isLiked ? 'fas fa-heart text-red-400' : 'far fa-heart'"></i>
                        {{ reply.likes }}
                      </button>
                      <button class="flex items-center gap-1" @click="replyToReply(comment, reply)">
                        <i class="fas fa-reply"></i>
                        回复
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <i class="fas fa-comment-slash text-4xl mb-2"></i>
          <p class="text-sm">暂无评论，快来抢沙发吧</p>
        </div>
      </div>
    </div>

    <!-- 底部评论输入栏 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3 z-50">
      <div class="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2" @click="showCommentInput">
        <i class="fas fa-edit text-gray-400 text-sm"></i>
        <span class="text-gray-400 text-sm">说点什么...</span>
      </div>
      <button class="flex flex-col items-center gap-0.5 active:scale-90 transition-transform" @click="toggleLike">
        <i :class="post.isLiked ? 'fas fa-heart text-red-500' : 'far fa-heart text-gray-400'"></i>
        <span class="text-[10px] text-gray-400">{{ post.likes }}</span>
      </button>
      <button class="flex flex-col items-center gap-0.5 active:scale-90 transition-transform" @click="scrollToComments">
        <i class="fas fa-comment text-gray-400"></i>
        <span class="text-[10px] text-gray-400">{{ post.comments }}</span>
      </button>
      <button class="flex flex-col items-center gap-0.5 active:scale-90 transition-transform" @click="toggleBookmark">
        <i :class="post.isBookmarked ? 'fas fa-bookmark text-yellow-500' : 'far fa-bookmark text-gray-400'"></i>
        <span class="text-[10px] text-gray-400">收藏</span>
      </button>
      <button class="flex flex-col items-center gap-0.5 active:scale-90 transition-transform" @click="sharePost">
        <i class="fas fa-share text-gray-400"></i>
        <span class="text-[10px] text-gray-400">分享</span>
      </button>
    </div>

    <!-- 评论输入弹窗 -->
    <div v-if="showCommentBox" class="fixed inset-0 bg-black/50 z-50 flex items-end" @click.self="hideCommentBox">
      <div class="w-full bg-white rounded-t-2xl p-4" @click.stop>
        <div class="flex items-center gap-3 mb-3">
          <button @click="hideCommentBox" class="text-gray-500">取消</button>
          <div class="flex-1 text-center text-sm text-gray-800">
            {{ replyTo ? '回复 ' + replyTo : '发表评论' }}
          </div>
          <button @click="submitComment" class="text-[#2D6A4F] font-medium">发送</button>
        </div>
        <textarea 
          ref="commentInput"
          v-model="commentText"
          :placeholder="replyTo ? '回复 ' + replyTo + '...' : '说点什么...'"
          class="w-full h-32 p-3 bg-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-sm"
        ></textarea>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <div v-if="previewIndex >= 0" class="fixed inset-0 bg-black z-50 flex items-center justify-center" @click="closePreview">
      <button class="absolute top-4 right-4 text-white text-2xl z-10" @click="closePreview">
        <i class="fas fa-times"></i>
      </button>
      <div class="w-full h-full flex items-center justify-center p-4" @click.stop>
        <img :src="post.images[previewIndex]" alt="预览" class="max-w-full max-h-full object-contain">
      </div>
    </div>

    <!-- 更多操作弹窗 -->
    <div v-if="showActions" class="fixed inset-0 bg-black/50 z-50 flex items-end" @click="showActions = false">
      <div class="w-full bg-white rounded-t-2xl p-4 space-y-2" @click.stop>
        <button class="w-full py-3 text-center text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg">不感兴趣</button>
        <button class="w-full py-3 text-center text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg">举报</button>
        <button class="w-full py-3 text-center text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg">分享到朋友圈</button>
        <button class="w-full py-3 text-center text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg">复制链接</button>
        <button class="w-full py-3 text-center text-gray-500 hover:bg-gray-50 active:bg-gray-100 rounded-lg mt-2" @click="showActions = false">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const goBack = () => {
  router.back()
}

const post = reactive({
  id: 1,
  title: '周末缙云山徒步攻略 🏔️',
  content: '上周和朋友一起去了缙云山，真的太美了！从山脚到山顶大概需要3-4小时，沿途风景绝美，空气清新。建议早上8点前出发，可以避开人流高峰期。\n\n装备建议：\n1. 登山杖（很重要！）\n2. 防滑登山鞋\n3. 足够的水和干粮\n4. 防晒用品\n5. 创可贴和常用药品\n\n山顶的观景台可以俯瞰整个重庆主城区，天气好的时候还能看到南山一棵树。下山后可以去附近的农家乐吃一顿地道的农家菜，简直完美！',
  author: {
    name: '户外爱好者',
    avatar: '🐸',
    level: '中级户外玩家',
    isFollowing: false
  },
  category: '徒步',
  location: '重庆·缙云山',
  tags: ['缙云山', '徒步', '周末游', '户外攻略'],
  images: [
    'https://modao.cc/agent-py/media/generated_images/2026-05-30/d3df85fa8ef24d08ae1ab762cfad063d.jpg',
    'https://modao.cc/agent-py/media/generated_images/2026-05-30/f723d6f3e3964a07917ff03eb28da52d.jpg',
    'https://modao.cc/agent-py/media/generated_images/2026-05-30/177982f670344e1b8855addb0aa9c575.jpg'
  ],
  publishTime: '2小时前',
  views: 1256,
  likes: 89,
  comments: 24,
  isLiked: false,
  isBookmarked: false
})

const hotComments = ref([
  {
    id: 1,
    author: '山野小驴',
    avatar: '🦁',
    content: '写的太详细了！下周就去试试，感谢分享~',
    time: '1小时前',
    likes: 45,
    isLiked: false
  },
  {
    id: 2,
    author: '露营达人',
    avatar: '🏕️',
    content: '山顶风景真的很美，我去年也去过。不过建议带个充电宝，山上信号不太好。',
    time: '2小时前',
    likes: 32,
    isLiked: false
  }
])

const comments = ref([
  {
    id: 1,
    author: '徒步新手',
    avatar: '🌿',
    content: '请问从山脚到山顶有几段比较陡的路？需要多久休息一次？',
    time: '30分钟前',
    likes: 12,
    isLiked: false,
    isAuthor: false,
    replies: [
      {
        id: 101,
        author: '户外爱好者',
        avatar: '🐸',
        content: '主要有一段连续爬坡比较累，建议每40分钟休息一次，补充水分。',
        time: '25分钟前',
        likes: 8,
        isLiked: false,
        isAuthor: true
      }
    ]
  },
  {
    id: 2,
    author: '星空摄影师',
    avatar: '📸',
    content: '山顶拍星空怎么样？光污染严重吗？',
    time: '1小时前',
    likes: 8,
    isLiked: false,
    isAuthor: false,
    replies: []
  },
  {
    id: 3,
    author: '健身打卡',
    avatar: '💪',
    content: '这条路线适合新手吗？平时没什么运动基础',
    time: '1.5小时前',
    likes: 5,
    isLiked: false,
    isAuthor: false,
    replies: []
  }
])

const showCommentBox = ref(false)
const showActions = ref(false)
const previewIndex = ref(-1)
const commentText = ref('')
const replyTo = ref('')
const commentInput = ref(null)

const followAuthor = () => {
  post.author.isFollowing = !post.author.isFollowing
}

const toggleLike = () => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

const toggleBookmark = () => {
  post.isBookmarked = !post.isBookmarked
}

const showMoreActions = () => {
  showActions.value = true
}

const previewImage = (index) => {
  previewIndex.value = index
}

const closePreview = () => {
  previewIndex.value = -1
}

const showCommentInput = () => {
  replyTo.value = ''
  showCommentBox.value = true
  nextTick(() => {
    if (commentInput.value) {
      commentInput.value.focus()
    }
  })
}

const replyToComment = (comment) => {
  replyTo.value = comment.author
  showCommentBox.value = true
  nextTick(() => {
    if (commentInput.value) {
      commentInput.value.focus()
    }
  })
}

const replyToReply = (comment, reply) => {
  replyTo.value = reply.author
  showCommentBox.value = true
  nextTick(() => {
    if (commentInput.value) {
      commentInput.value.focus()
    }
  })
}

const hideCommentBox = () => {
  showCommentBox.value = false
  commentText.value = ''
  replyTo.value = ''
}

const submitComment = () => {
  if (!commentText.value.trim()) return
  
  const newComment = {
    id: Date.now(),
    author: '当前用户',
    avatar: '👤',
    content: commentText.value,
    time: '刚刚',
    likes: 0,
    isLiked: false,
    isAuthor: false,
    replies: []
  }
  
  comments.value.unshift(newComment)
  post.comments++
  
  hideCommentBox()
}

const likeComment = (comment) => {
  comment.isLiked = !comment.isLiked
  comment.likes += comment.isLiked ? 1 : -1
}

const likeReply = (reply) => {
  reply.isLiked = !reply.isLiked
  reply.likes += reply.isLiked ? 1 : -1
}

const scrollToComments = () => {
  const commentsSection = document.querySelector('.overflow-y-auto')
  if (commentsSection) {
    commentsSection.scrollTo({
      top: commentsSection.scrollHeight,
      behavior: 'smooth'
    })
  }
}

const sharePost = () => {
  if (navigator.share) {
    navigator.share({
      title: post.title,
      text: post.content.substring(0, 100),
      url: window.location.href
    })
  } else {
    showActions.value = true
  }
}

onMounted(() => {
  if (route.query.post) {
    Object.assign(post, JSON.parse(route.query.post))
  }
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

.bg-\[\#F5F5F5\] {
  background-color: #F5F5F5;
}

.bg-\[\#40916C\] {
  background-color: #40916C;
}
</style>
