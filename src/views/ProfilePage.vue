<template>
  <div class="min-h-screen bg-[#F0F7F4] pb-16">
    <!-- 内容区域 -->
    <div class="overflow-y-auto no-scrollbar" >
      <!-- 1. 沉浸式实景头部 -->
      <div class="relative h-[320px] w-full overflow-hidden">
        <!-- 背景图 -->
        <img
          alt="Background"
          class="absolute inset-0 w-full h-full object-cover scale-110"
          :src="currentBgImage"
          :style="{ transform: `translateY(${scrollOffset * 0.3}px) scale(1.1)` }"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#F0F7F4]"></div>

        <!-- 设置按钮 -->
        <div class="absolute top-12 right-6">
          <button
            class="w-10 h-10 rounded-full glass flex items-center justify-center text-white active:scale-90 transition-transform"
            @click="goToPage('settings')"
          >
            <i class="fas fa-cog"></i>
          </button>
        </div>

        <!-- 更换背景图按钮 -->
        <div class="absolute top-24 right-6">
          <button
            class="w-10 h-10 rounded-full glass flex items-center justify-center text-white active:scale-90 transition-transform"
            @click="showBgModal = true"
          >
            <i class="fas fa-image"></i>
          </button>
        </div>

        <!-- 用户信息区 (毛玻璃卡片) -->
        <div class="absolute bottom-6 left-5 right-5 glass rounded-2xl p-4 flex flex-col gap-3 shadow-lg">
          <div class="flex items-center gap-4">
            <!-- 头像 -->
            <button 
              class="w-16 h-16 rounded-full border-2 border-white overflow-hidden shadow-md bg-white flex items-center justify-center relative group active:scale-95 transition-transform"
              @click="changeAvatar"
            >
              <img 
                v-if="currentAvatar" 
                :src="currentAvatar" 
                alt="头像" 
                class="w-full h-full object-cover"
              />
              <span v-else class="text-4xl">🐸</span>
              <!-- 更换图标 -->
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <i class="fas fa-camera text-white text-xl"></i>
              </div>
            </button>
            <div class="flex-1">
              <h1 class="text-xl font-bold text-white">户外爱好者</h1>
              <div class="flex items-center gap-2 mt-1">
                <span class="bg-green-500/80 text-[10px] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <i class="fas fa-map-marker-alt" style="font-size: 10px;"></i>
                  重庆市
                </span>
                <span class="bg-orange-500/80 text-[10px] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <i class="fas fa-award" style="font-size: 10px;"></i>
                  中级户外玩家
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-4 text-white/90 text-xs pl-1">
            <span class="flex items-center gap-1">
              <i class="fas fa-calendar" style="font-size: 12px;"></i>
              已加入 365 天
            </span>
            <span class="w-px h-3 bg-white/30"></span>
            <span class="flex items-center gap-1">
              <i class="fas fa-users" style="font-size: 12px;"></i>
              关注 128
            </span>
          </div>
        </div>
      </div>

      <!-- 2. 核心统计数据 -->
      <div class="px-5 -mt-3 relative z-10">
        <div class="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center text-center">
          <div class="flex-1">
            <div class="text-2xl font-bold text-[#2D6A4F]">12</div>
            <div class="text-[10px] text-gray-500 mt-1">参与活动</div>
          </div>
          <div class="w-px h-8 bg-gray-100"></div>
          <div class="flex-1">
            <div class="text-2xl font-bold text-[#2D6A4F]">8</div>
            <div class="text-[10px] text-gray-500 mt-1">组织活动</div>
          </div>
          <div class="w-px h-8 bg-gray-100"></div>
          <div class="flex-1">
            <div class="text-2xl font-bold text-[#2D6A4F]">156</div>
            <div class="text-[10px] text-gray-500 mt-1">获得点赞</div>
          </div>
        </div>
      </div>



      <!-- 4. 最近动态预览 -->
      <div class="mt-6 px-5 pb-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-bold text-gray-800">📝 最近动态</h2>
          <button class="text-[10px] text-gray-400" @click="goToPage('all-posts')">更多内容</button>
        </div>
        <div class="flex gap-4 overflow-x-auto no-scrollbar">
          <div class="flex-shrink-0 w-44 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100" @click="goToPage('post-detail')">
            <div class="h-28 relative">
              <img alt="Hiking" class="w-full h-full object-cover" src="https://modao.cc/agent-py/media/generated_images/2026-05-30/d3df85fa8ef24d08ae1ab762cfad063d.jpg"/>
              <div class="absolute bottom-2 left-2 flex items-center gap-1 glass px-1.5 py-0.5 rounded text-[8px] text-white">
                <i class="fas fa-heart text-red-400"></i> 24
              </div>
            </div>
            <div class="p-2">
              <h3 class="text-[11px] font-bold text-gray-800 line-clamp-1">周末缙云山徒步攻略 🏔️</h3>
              <p class="text-[9px] text-gray-400 mt-1">2小时前 · 重庆</p>
            </div>
          </div>
          <div class="flex-shrink-0 w-44 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100" @click="goToPage('post-detail')">
            <div class="h-28 relative">
              <img alt="Camping" class="w-full h-full object-cover" src="https://modao.cc/agent-py/media/generated_images/2026-05-30/f723d6f3e3964a07917ff03eb28da52d.jpg"/>
              <div class="absolute bottom-2 left-2 flex items-center gap-1 glass px-1.5 py-0.5 rounded text-[8px] text-white">
                <i class="fas fa-heart text-red-400"></i> 56
              </div>
            </div>
            <div class="p-2">
              <h3 class="text-[11px] font-bold text-gray-800 line-clamp-1">仙女山露营全指南 ⛺</h3>
              <p class="text-[9px] text-gray-400 mt-1">昨天 · 重庆</p>
            </div>
          </div>
          <div class="flex-shrink-0 w-44 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100" @click="goToPage('post-detail')">
            <div class="h-28 relative">
              <img alt="Biking" class="w-full h-full object-cover" src="https://modao.cc/agent-py/media/generated_images/2026-05-30/177982f670344e1b8855addb0aa9c575.jpg"/>
              <div class="absolute bottom-2 left-2 flex items-center gap-1 glass px-1.5 py-0.5 rounded text-[8px] text-white">
                <i class="fas fa-heart text-red-400"></i> 31
              </div>
            </div>
            <div class="p-2">
              <h3 class="text-[11px] font-bold text-gray-800 line-clamp-1">重庆周边最美骑行路线 🚴</h3>
              <p class="text-[9px] text-gray-400 mt-1">3天前 · 重庆</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. 我的活动 (功能网格) -->
      <div class="mt-4 px-5">
        <h2 class="text-base font-bold text-gray-800 mb-4">我的活动</h2>
        <div class="grid grid-cols-4 gap-4">
          <button class="flex flex-col items-center gap-2 active:scale-95 transition-transform" @click="goToPage('my-favorites')">
            <div class="w-12 h-12 rounded-2xl bg-[#FF6B9D] flex items-center justify-center text-white shadow-sm">
              <i class="fas fa-heart"></i>
            </div>
            <span class="text-[10px] text-gray-600 font-medium">我的收藏</span>
          </button>
          <button class="flex flex-col items-center gap-2 active:scale-95 transition-transform" @click="goToPage('my-activities')">
            <div class="w-12 h-12 rounded-2xl bg-[#FF9F43] flex items-center justify-center text-white shadow-sm">
              <i class="fas fa-flag"></i>
            </div>
            <span class="text-[10px] text-gray-600 font-medium">我的活动</span>
          </button>
          <button class="flex flex-col items-center gap-2 active:scale-95 transition-transform" @click="goToPage('team-applications')">
            <div class="w-12 h-12 rounded-2xl bg-[#A855F7] flex items-center justify-center text-white shadow-sm">
              <i class="fas fa-paper-plane"></i>
            </div>
            <span class="text-[10px] text-gray-600 font-medium">我的申请</span>
          </button>
          <button class="flex flex-col items-center gap-2 active:scale-95 transition-transform" @click="goToPage('team')">
            <div class="w-12 h-12 rounded-2xl bg-[#6366F1] flex items-center justify-center text-white shadow-sm">
              <i class="fas fa-campground"></i>
            </div>
            <span class="text-[10px] text-gray-600 font-medium">我的队伍</span>
          </button>
        </div>
      </div>

      <!-- 6. 我的社区 -->
      <div class="mt-8 px-5">
        <h2 class="text-base font-bold text-gray-800 mb-4">我的社区</h2>
        <div class="grid grid-cols-4 gap-4">
          <button class="flex flex-col items-center gap-2 active:scale-95 transition-transform" @click="goToPage('my-posts')">
            <div class="w-12 h-12 rounded-2xl bg-[#3B82F6] flex items-center justify-center text-white shadow-sm">
              <i class="fas fa-pen"></i>
            </div>
            <span class="text-[10px] text-gray-600 font-medium">我的帖子</span>
          </button>
          <button class="flex flex-col items-center gap-2 active:scale-95 transition-transform" @click="goToPage('my-guides')">
            <div class="w-12 h-12 rounded-2xl bg-[#10B981] flex items-center justify-center text-white shadow-sm">
              <i class="fas fa-book-open"></i>
            </div>
            <span class="text-[10px] text-gray-600 font-medium">我的攻略</span>
          </button>
          <button class="flex flex-col items-center gap-2 active:scale-95 transition-transform" @click="goToPage('my-comments')">
            <div class="w-12 h-12 rounded-2xl bg-[#EC4899] flex items-center justify-center text-white shadow-sm">
              <i class="fas fa-comment"></i>
            </div>
            <span class="text-[10px] text-gray-600 font-medium">我的评论</span>
          </button>
          <button class="flex flex-col items-center gap-2 active:scale-95 transition-transform" @click="goToPage('my-bookmarks')">
            <div class="w-12 h-12 rounded-2xl bg-[#06B6D4] flex items-center justify-center text-white shadow-sm">
              <i class="fas fa-bookmark"></i>
            </div>
            <span class="text-[10px] text-gray-600 font-medium">我的书签</span>
          </button>
        </div>
      </div>

      <!-- 7. 其他功能列表 -->
      <div class="mt-8 px-5 mb-4">
        <div class="bg-white rounded-2xl overflow-hidden">
          <button
            v-for="(item, index) in otherMenus"
            :key="item.title"
            @click="goToPage(item.route)"
            class="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors"
            :class="{ 'border-t border-gray-100': index > 0 }"
          >
            <div class="flex items-center">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                :style="{ backgroundColor: item.bgColor }"
              >
                <i :class="[item.icon, 'text-white text-sm']"></i>
              </div>
              <span class="text-gray-800 text-sm">{{ item.title }}</span>
            </div>
            <div class="flex items-center">
              <span v-if="item.badge" class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full mr-2">
                {{ item.badge }}
              </span>
              <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
            </div>
          </button>
        </div>
      </div>
            <!-- 3. 勋章墙 -->
      <div class="mt-6 px-5">
        <div class="flex justify-between items-end mb-4">
          <div>
            <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
              🎖️ 我的勋章
            </h2>
            <p class="text-[10px] text-gray-400 mt-0.5">记录每一次登顶的荣耀</p>
          </div>
          <a class="text-[10px] text-[#2D6A4F] font-medium flex items-center gap-0.5" href="#">
            查看全部 <i class="fas fa-chevron-right"></i>
          </a>
        </div>
        <div class="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          <div class="flex-shrink-0 flex flex-col items-center gap-2">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-md">
              <span class="text-2xl">🏔️</span>
            </div>
            <span class="text-[10px] font-medium text-gray-600">山巅行者</span>
          </div>
          <div class="flex-shrink-0 flex flex-col items-center gap-2">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-green-300 to-green-600 flex items-center justify-center shadow-md">
              <span class="text-2xl">🌲</span>
            </div>
            <span class="text-[10px] font-medium text-gray-600">森林探秘</span>
          </div>
          <div class="flex-shrink-0 flex flex-col items-center gap-2">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 flex items-center justify-center shadow-md">
              <span class="text-2xl">⛺</span>
            </div>
            <span class="text-[10px] font-medium text-gray-600">露营达人</span>
          </div>
          <div class="flex-shrink-0 flex flex-col items-center gap-2 opacity-50 grayscale">
            <div class="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400">
              <span class="text-2xl">🚩</span>
            </div>
            <span class="text-[10px] font-medium text-gray-400">徒步新秀</span>
          </div>
          <div class="flex-shrink-0 flex flex-col items-center gap-2 opacity-50 grayscale">
            <div class="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400">
              <span class="text-2xl">🧭</span>
            </div>
            <span class="text-[10px] font-medium text-gray-400">定向大师</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 背景图选择弹窗 -->
    <div v-if="showBgModal" class="fixed inset-0 bg-black/50 z-50 flex items-end" @click="showBgModal = false">
      <div class="w-full bg-white rounded-t-2xl p-4" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800">更换背景图</h3>
          <button class="text-gray-400" @click="showBgModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- 从相册选择 -->
        <div 
          class="w-full h-24 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 mb-4 cursor-pointer active:scale-95 transition-transform"
          @click="selectFromAlbum"
        >
          <i class="fas fa-camera text-gray-400 text-xl"></i>
          <span class="text-sm text-gray-600">从相册选择</span>
        </div>
        
        <!-- 默认背景图列表 -->
        <div class="mb-4">
          <h4 class="text-sm text-gray-600 mb-2">推荐背景</h4>
          <div class="grid grid-cols-3 gap-2">
            <div 
              v-for="(img, index) in defaultBgImages" 
              :key="index"
              class="relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all"
              :class="currentBgImage === img ? 'border-[#2D6A4F]' : 'border-transparent'"
              @click="selectBgImage(img)"
            >
              <img :src="img" alt="背景图" class="w-full h-full object-cover" loading="lazy">
              <div 
                v-if="currentBgImage === img" 
                class="absolute inset-0 bg-black/30 flex items-center justify-center"
              >
                <i class="fas fa-check text-white text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const scrollOffset = ref(0)

// 头像相关
const currentAvatar = ref('')

// 背景图相关
const defaultBgImages = [
  'https://modao.cc/agent-py/media/generated_images/2026-05-30/e05fd7e4b81a4d8ebae8c6067a035c9f.jpg',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
]

const currentBgImage = ref(defaultBgImages[0])
const showBgModal = ref(false)

const goToPage = (routeName) => {
  router.push({ name: routeName })
}

const handleScroll = () => {
  const contentArea = document.querySelector('.overflow-y-auto')
  if (contentArea) {
    scrollOffset.value = contentArea.scrollTop
  }
}

const otherMenus = ref([
  { title: '实名认证', icon: 'fas fa-id-card', route: 'verification', badge: '未认证', bgColor: '#3B82F6' },
  { title: '紧急联系人', icon: 'fas fa-phone', route: 'emergency-contacts', badge: '', bgColor: '#EF4444' },
  { title: '安全设置', icon: 'fas fa-shield-alt', route: 'security', badge: '', bgColor: '#10B981' },
  { title: '消息通知', icon: 'fas fa-bell', route: 'notifications', badge: '3', bgColor: '#F59E0B' },
  { title: '帮助中心', icon: 'fas fa-question-circle', route: 'help', badge: '', bgColor: '#6366F1' },
  { title: '关于我们', icon: 'fas fa-info-circle', route: 'about', badge: '', bgColor: '#8B5CF6' }
])

// 更换头像
const changeAvatar = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target.result
        currentAvatar.value = imageUrl
        localStorage.setItem('profileAvatar', imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

// 选择背景图
const selectBgImage = (imageUrl) => {
  currentBgImage.value = imageUrl
  showBgModal.value = false
  localStorage.setItem('profileBgImage', imageUrl)
}

// 从相册选择图片
const selectFromAlbum = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target.result
        currentBgImage.value = imageUrl
        showBgModal.value = false
        localStorage.setItem('profileBgImage', imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

onMounted(() => {
  const contentArea = document.querySelector('.overflow-y-auto')
  if (contentArea) {
    contentArea.addEventListener('scroll', handleScroll)
  }
  // 初始化时读取保存的背景图
  const savedBg = localStorage.getItem('profileBgImage')
  if (savedBg) {
    currentBgImage.value = savedBg
  }
  // 初始化时读取保存的头像
  const savedAvatar = localStorage.getItem('profileAvatar')
  if (savedAvatar) {
    currentAvatar.value = savedAvatar
  }
})

onUnmounted(() => {
  const contentArea = document.querySelector('.overflow-y-auto')
  if (contentArea) {
    contentArea.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.bg-\[\#F0F7F4\] {
  background-color: #F0F7F4;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}



.text-\[\#2D6A4F\] {
  color: #2D6A4F;
}

.bg-\[\#FF6B9D\] {
  background-color: #FF6B9D;
}

.bg-\[\#FF9F43\] {
  background-color: #FF9F43;
}

.bg-\[\#A855F7\] {
  background-color: #A855F7;
}

.bg-\[\#6366F1\] {
  background-color: #6366F1;
}

.bg-\[\#3B82F6\] {
  background-color: #3B82F6;
}

.bg-\[\#10B981\] {
  background-color: #10B981;
}

.bg-\[\#EC4899\] {
  background-color: #EC4899;
}

.bg-\[\#06B6D4\] {
  background-color: #06B6D4;
}
</style>
