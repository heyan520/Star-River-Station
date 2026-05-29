<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <!-- 顶部搜索栏 -->
    <div class="bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
      <div class="flex items-center space-x-3">
        <button @click="goToPage('home')" class="text-gray-600">
          <i class="fas fa-arrow-left text-lg"></i>
        </button>
        <div class="flex-1 relative">
          <input 
            type="text" 
            placeholder="搜索附近的地点..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            v-model="searchQuery"
            @input="handleSearch"
          >
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <button class="text-gray-600" @click="showNearbyUsers">
          <span class="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">附近</span>
        </button>
        <button class="text-gray-600 relative" @click="openChat">
          <i class="fas fa-message-circle text-lg"></i>
          <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
        </button>
      </div>
    </div>

    <!-- 地图区域 -->
    <div class="h-64 relative"> 
      <div id="mapContainer" class="w-full h-full"></div>
      <!-- 定位按钮 -->
      <button class="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
        <i class="fas fa-location-arrow text-red-500"></i>
      </button>
      
      <div class="absolute top-5 right-4">
          <div class="sos-btn" style="width:40px;height:40px;background:red;border-radius:99px;display:flex;align-items:center;justify-content:center;cursor:pointer;" @click="showSosConfirm">
              <span class="text-white text-lg font-bold">SOS</span>
          </div>
      </div>
    </div>
                    <!-- 紧急求助按钮 -->
    <!-- 分类标签 -->
    <div class="px-4 py-3 bg-white border-b">
      <div class="flex space-x-2 overflow-x-auto pb-2">
        <button 
          v-for="category in categories" 
          :key="category.id" 
          :class="['flex items-center px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all', 
                   category.active ? 'bg-primary-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
          @click="switchCategory(category.id)"
        >
          <i :class="[category.icon, 'mr-2']"></i>
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- 搜索结果提示 -->
    <div v-if="searchQuery" class="px-4 py-2 text-sm text-gray-500 bg-white">
      搜索 "<span class="font-medium text-gray-800">{{ searchQuery }}</span>"，找到 {{ filteredPlaces.length }} 个结果
    </div>

    <!-- 附近地点列表 -->
    <div class="container px-4 py-2">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-gray-800">
          {{ currentCategory.name }}
        </h3>
        <span class="text-sm text-gray-600">共找到{{ filteredPlaces.length }}个地点</span>
      </div>
      
      <!-- 无结果提示 -->
      <div v-if="filteredPlaces.length === 0" class="py-10 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-3">
          <i class="fas fa-search text-gray-400 text-2xl"></i>
        </div>
        <p class="text-gray-500">没有找到匹配的地点</p>
        <button 
          class="mt-2 text-primary-500 text-sm hover:text-primary-600"
          @click="clearSearch"
        >
          清除搜索条件
        </button>
      </div>
      
      <div class="space-y-3 pb-20">
        <div 
          v-for="place in filteredPlaces" 
          :key="place.id" 
          class="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow"
          @click="showPlaceOnMap(place)"
        >
          <div class="flex items-start space-x-3">
            <img :src="place.image" :alt="place.name" class="w-16 h-16 rounded-lg object-cover">
            <div class="flex-1">
              <div class="flex items-start justify-between mb-1">
                <h4 class="font-medium text-gray-800">
                  <!-- 搜索关键词高亮 -->
                  <span v-html="highlightMatch(place.name)"></span>
                </h4>
                <div class="flex items-center">
                  <i class="fas fa-star text-yellow-400 text-xs mr-1"></i>
                  <span class="text-sm text-gray-600">{{ place.rating }}</span>
                </div>
              </div>
              <div class="flex items-center text-gray-600 text-sm mb-2">
                <i class="fas fa-location-dot mr-1"></i>
                <span v-html="highlightMatch(place.address)"></span>
              </div>
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in place.tags" :key="tag" 
                        class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {{ tag }}
                  </span>
                </div>
                <div class="flex space-x-2">
                  <button class="text-primary-600 text-sm hover:text-primary-700">
                    <i class="fas fa-directions mr-1"></i>导航
                  </button>
                  <button class="text-gray-600 text-sm hover:text-gray-800">
                    <i class="fas fa-phone mr-1"></i>电话
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SOS确认弹窗 -->
    <div v-if="showSosModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="closeSosModal">
      <div class="bg-white rounded-2xl w-full max-w-sm p-6 animate-slide-up">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-red-500 text-3xl font-bold">SOS</span>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">紧急求助</h3>
          <p class="text-gray-600 mb-6">确定向附近<span class="text-red-500 font-bold">5公里</span>范围内的用户发起求助吗？</p>
          <div class="flex gap-3">
            <button 
              class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
              @click="closeSosModal"
            >
              取消
            </button>
            <button 
              class="flex-1 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
              @click="confirmSos"
            >
              确认求助
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 求助类型选择弹窗 -->
    <div v-if="showSosTypeModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="closeSosTypeModal" @touchmove.prevent>
      <div class="bg-white rounded-2xl w-full max-w-md p-4 animate-slide-up max-h-[70vh] overflow-y-auto" @touchmove.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800">选择求助类型</h3>
          <button @click="closeSosTypeModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
        <p class="text-gray-500 text-sm mb-3">请选择您需要的求助类型</p>
        <div class="space-y-2">
          <button 
            v-for="type in sosTypes" 
            :key="type.id"
            class="w-full p-3 bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-300 rounded-xl flex items-center transition-all"
            @click="selectSosType(type)"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3" :style="{ backgroundColor: type.bgColor }">
              <i :class="[type.icon, 'text-lg']" :style="{ color: type.color }"></i>
            </div>
            <div class="text-left flex-1">
              <h4 class="font-medium text-gray-800 text-sm">{{ type.name }}</h4>
              <p class="text-xs text-gray-500">{{ type.description }}</p>
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- SOS求助已发送提示 -->
    <div v-if="showSosSuccess" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-sm p-6 text-center animate-slide-up">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-check text-green-500 text-3xl"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">求助已发送</h3>
        <p class="text-gray-600 mb-6">您的求助信息已发送给附近5公里范围内的用户，请保持手机畅通，等待救援。</p>
        <button 
          class="w-full py-3 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors"
          @click="closeSosSuccess"
        >
          我知道了
        </button>
      </div>
    </div>

    <!-- 聊天列表弹窗 -->
    <div v-if="showChatList" class="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div class="bg-white rounded-t-3xl w-full max-h-[80vh] animate-slide-up flex flex-col">
        <!-- 聊天列表头部 -->
        <div class="flex items-center justify-between px-4 py-4 border-b">
          <h3 class="text-lg font-bold text-gray-800">消息</h3>
          <button @click="closeChatList" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
        
        <!-- 聊天列表内容 -->
        <div class="flex-1 overflow-y-auto">
          <div 
            v-for="chat in chatList" 
            :key="chat.id" 
            class="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
            @click="openChatWindow(chat)"
          >
            <img :src="chat.avatar" :alt="chat.name" class="w-12 h-12 rounded-full object-cover">
            <div class="flex-1 ml-3">
              <div class="flex items-center justify-between">
                <h4 class="font-medium text-gray-800">{{ chat.name }}</h4>
                <span class="text-xs text-gray-400">{{ chat.time }}</span>
              </div>
              <p class="text-sm text-gray-500 truncate">{{ chat.lastMessage }}</p>
            </div>
            <div v-if="chat.unread > 0" class="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {{ chat.unread }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天窗口 -->
    <div v-if="showChatWindow" class="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div class="bg-white rounded-t-3xl w-full max-h-[85vh] animate-slide-up flex flex-col">
        <!-- 聊天窗口头部 -->
        <div class="flex items-center px-4 py-4 border-b">
          <button @click="closeChatWindow" class="text-gray-600 mr-3">
            <i class="fas fa-arrow-left"></i>
          </button>
          <img :src="currentChat?.avatar" :alt="currentChat?.name" class="w-10 h-10 rounded-full object-cover">
          <div class="ml-2">
            <h4 class="font-medium text-gray-800">{{ currentChat?.name }}</h4>
            <p class="text-xs text-green-500 flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>在线
            </p>
          </div>
          <div class="flex-1"></div>
          <button class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-phone"></i>
          </button>
        </div>
        
        <!-- 聊天消息内容 -->
        <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4" ref="chatMessages">
          <div 
            v-for="(message, index) in currentMessages" 
            :key="index"
            :class="['flex', message.isMe ? 'justify-end' : 'justify-start']"
          >
            <div 
              :class="[
                'max-w-[75%] px-4 py-2 rounded-2xl',
                message.isMe ? 'bg-primary-500 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              ]"
            >
              <p class="text-sm">{{ message.content }}</p>
              <p :class="['text-xs mt-1', message.isMe ? 'text-white/70' : 'text-gray-400']">{{ message.time }}</p>
            </div>
          </div>
        </div>
        
        <!-- 输入框 -->
        <div class="px-4 py-3 border-t">
          <div class="flex items-center space-x-3">
            <button class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-smile"></i>
            </button>
            <input 
              type="text" 
              v-model="newMessage" 
              placeholder="输入消息..." 
              class="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              @keyup.enter="sendMessage"
            >
            <button 
              class="bg-primary-500 text-white px-4 py-2 rounded-full hover:bg-primary-600 transition-colors"
              @click="sendMessage"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
let map = null
let markers = []

// SOS弹窗控制
const showSosModal = ref(false)
const showSosTypeModal = ref(false)
const showSosSuccess = ref(false)
const selectedSosType = ref(null)

// SOS求助类型
const sosTypes = [
  { 
    id: 1, 
    name: '身体伤病求助', 
    icon: 'fas fa-first-aid text-red-500', 
    color: '#ef4444',
    bgColor: '#fef2f2',
    description: '需要医疗救援或身体不适'
  },
  { 
    id: 2, 
    name: '路线迷路求助', 
    icon: 'fas fa-map-marked-alt text-blue-500', 
    color: '#3b82f6',
    bgColor: '#eff6ff',
    description: '迷路或无法确定方向'
  },
  { 
    id: 3, 
    name: '物资装备求助', 
    icon: 'fas fa-toolbox text-orange-500', 
    color: '#f97316',
    bgColor: '#fff7ed',
    description: '缺少装备或补给物资'
  },
  { 
    id: 4, 
    name: '自然天气险情', 
    icon: 'fas fa-bolt text-yellow-500', 
    color: '#eab308',
    bgColor: '#fefce8',
    description: '遭遇暴雨、雷电等恶劣天气'
  },
  { 
    id: 5, 
    name: '户外突发危险', 
    icon: 'fas fa-exclamation-triangle text-purple-500', 
    color: '#a855f7',
    bgColor: '#faf5ff',
    description: '遇到野生动物或其他突发危险'
  }
]

// 显示SOS确认弹窗
const showSosConfirm = () => {
  showSosModal.value = true
}

// 关闭SOS确认弹窗
const closeSosModal = () => {
  showSosModal.value = false
}

// 确认SOS求助
const confirmSos = () => {
  showSosModal.value = false
  showSosTypeModal.value = true
}

// 关闭求助类型选择弹窗
const closeSosTypeModal = () => {
  showSosTypeModal.value = false
}

// 选择求助类型并发送
const selectSosType = (type) => {
  selectedSosType.value = type
  showSosTypeModal.value = false
  
  // 这里可以添加实际的发送求助逻辑
  console.log('发送求助:', {
    type: type.name,
    location: '当前GPS位置',
    timestamp: new Date().toISOString()
  })
  
  // 显示求助已发送提示
  showSosSuccess.value = true
}

// 关闭求助成功弹窗
const closeSosSuccess = () => {
  showSosSuccess.value = false
  selectedSosType.value = null
}

// 搜索关键词
const searchQuery = ref('')

// 导航到指定页面
const goToPage = (routeName) => {
  router.push({ name: routeName })
}

// 显示附近的用户
const showNearbyUsers = () => {
  // 跳转到附近用户页面
  router.push({ name: 'nearby-users' })
}

// 跳转到社区页面
const goToPostPage = () => {
  router.push({ name: 'community' })
}

// 聊天相关状态
const showChatList = ref(false)
const showChatWindow = ref(false)
const currentChat = ref(null)
const currentMessages = ref([])
const newMessage = ref('')
const chatMessages = ref(null)

// 聊天列表数据
const chatList = ref([
  {
    id: 1,
    name: '户外爱好者小王',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    lastMessage: '你也在仙女山吗？一起爬山啊！',
    time: '10:30',
    unread: 2
  },
  {
    id: 2,
    name: '露营达人小李',
    avatar: 'https://picsum.photos/seed/user2/100/100',
    lastMessage: '今天天气不错，适合露营',
    time: '09:15',
    unread: 1
  },
  {
    id: 3,
    name: '驴友小张',
    avatar: 'https://picsum.photos/seed/user3/100/100',
    lastMessage: '天生三桥景区人多吗？',
    time: '昨天',
    unread: 0
  }
])

// 模拟消息数据
const messageData = {
  1: [
    { id: 1, content: '你好！', isMe: false, time: '10:20' },
    { id: 2, content: '你好！有什么事吗？', isMe: true, time: '10:22' },
    { id: 3, content: '我看到你也在仙女山附近，想问问这边有什么好玩的', isMe: false, time: '10:25' },
    { id: 4, content: '天生三桥景区值得一去，风景特别好', isMe: true, time: '10:28' },
    { id: 5, content: '你也在仙女山吗？一起爬山啊！', isMe: false, time: '10:30' }
  ],
  2: [
    { id: 1, content: '今天天气真好！', isMe: false, time: '09:00' },
    { id: 2, content: '是啊，适合户外活动', isMe: true, time: '09:05' },
    { id: 3, content: '今天天气不错，适合露营', isMe: false, time: '09:15' }
  ],
  3: [
    { id: 1, content: '你去过天生三桥吗？', isMe: false, time: '昨天 14:00' },
    { id: 2, content: '去过，挺不错的', isMe: true, time: '昨天 14:10' },
    { id: 3, content: '天生三桥景区人多吗？', isMe: false, time: '昨天 15:30' }
  ]
}

// 打开聊天列表
const openChat = () => {
  showChatList.value = true
}

// 关闭聊天列表
const closeChatList = () => {
  showChatList.value = false
}

// 打开聊天窗口
const openChatWindow = (chat) => {
  currentChat.value = chat
  currentMessages.value = messageData[chat.id] || []
  showChatList.value = false
  showChatWindow.value = true
  
  // 清除未读消息
  const chatItem = chatList.value.find(c => c.id === chat.id)
  if (chatItem) {
    chatItem.unread = 0
  }
}

// 关闭聊天窗口
const closeChatWindow = () => {
  showChatWindow.value = false
  currentChat.value = null
  currentMessages.value = []
}

// 发送消息
const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  const message = {
    id: currentMessages.value.length + 1,
    content: newMessage.value.trim(),
    isMe: true,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  currentMessages.value.push(message)
  newMessage.value = ''
  
  // 模拟对方回复
  setTimeout(() => {
    const replies = ['好的，知道了！', '没问题！', '一起加油！', '太棒了！']
    const reply = {
      id: currentMessages.value.length + 1,
      content: replies[Math.floor(Math.random() * replies.length)],
      isMe: false,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    currentMessages.value.push(reply)
  }, 1000)
}

// 分类数据
const categories = ref([
  { id: 'attractions', name: '景点', icon: 'fas fa-mountain', active: true },
  { id: 'restaurants', name: '餐厅', icon: 'fas fa-utensils', active: false },
  { id: 'hotels', name: '住宿', icon: 'fas fa-bed', active: false },
  { id: 'gas', name: '加油站', icon: 'fas fa-gas-pump', active: false },
  { id: 'hospitals', name: '医院', icon: 'fas fa-hospital', active: false },
  { id: 'stores', name: '商店', icon: 'fas fa-shopping-bag', active: false },
  { id: 'banks', name: '银行', icon: 'fas fa-building-columns', active: false }
])

// 当前选中的分类
const currentCategory = ref(categories.value[0])

// 所有地点数据
const allPlaces = ref([
  // 景点
  {
    id: 1,
    category: 'attractions',
    name: '天生三桥景区',
    address: '武隆区仙女山镇',
    distance: '2.3km',
    rating: 4.8,
    image: '/src/assets/天生三桥景区.png',
    tags: ['5A景区', '自然奇观'],
    location: [107.75, 29.32] // 经纬度
  },
  {
    id: 2,
    category: 'attractions',
    name: '龙水峡地缝',
    address: '武隆区仙女山镇',
    distance: '3.1km',
    rating: 4.6,
    image: 'https://picsum.photos/seed/attraction2/200/200',
    tags: ['峡谷', '探险'],
    location: [107.76, 29.33]
  },
  {
    id: 3,
    category: 'attractions',
    name: '仙女山国家森林公园',
    address: '武隆区仙女山镇',
    distance: '1.8km',
    rating: 4.7,
    image: 'https://picsum.photos/seed/attraction3/200/200',
    tags: ['森林公园', '草原'],
    location: [107.74, 29.31]
  },
  
  // 餐厅
  {
    id: 101,
    category: 'restaurants',
    name: '仙山风味餐厅',
    address: '武隆区仙女山街道',
    distance: '0.8km',
    rating: 4.5,
    image: 'https://picsum.photos/seed/restaurant1/200/200',
    tags: ['川菜', '家常菜'],
    location: [107.73, 29.30]
  },
  {
    id: 102,
    category: 'restaurants',
    name: '峡谷人家',
    address: '武隆区天生三桥景区附近',
    distance: '2.5km',
    rating: 4.3,
    image: 'https://picsum.photos/seed/restaurant2/200/200',
    tags: ['江湖菜', '特色菜'],
    location: [107.76, 29.32]
  },
  
  // 住宿
  {
    id: 201,
    category: 'hotels',
    name: '仙女山假日酒店',
    address: '武隆区仙女山大道',
    distance: '1.2km',
    rating: 4.7,
    image: 'https://picsum.photos/seed/hotel1/200/200',
    tags: ['四星', '免费停车'],
    location: [107.72, 29.33]
  },
  {
    id: 202,
    category: 'hotels',
    name: '峡谷民宿',
    address: '武隆区仙女山镇',
    distance: '3.0km',
    rating: 4.6,
    image: 'https://picsum.photos/seed/hotel2/200/200',
    tags: ['民宿', '景观房'],
    location: [107.77, 29.34]
  },
  
  // 加油站
  {
    id: 301,
    category: 'gas',
    name: '中石油仙女山加油站',
    address: '武隆区仙女山大道',
    distance: '0.6km',
    rating: 4.2,
    image: 'https://picsum.photos/seed/gas1/200/200',
    tags: ['92#', '95#', '24小时'],
    location: [107.71, 29.32]
  },
  
  // 医院
  {
    id: 401,
    category: 'hospitals',
    name: '武隆区人民医院',
    address: '武隆区芙蓉中路',
    distance: '5.2km',
    rating: 4.4,
    image: 'https://picsum.photos/seed/hospital1/200/200',
    tags: ['综合医院', '医保定点'],
    location: [107.78, 29.30]
  },
  
  // 商店
  {
    id: 501,
    category: 'stores',
    name: '便民超市',
    address: '武隆区仙女山街道',
    distance: '0.5km',
    rating: 4.1,
    image: 'https://picsum.photos/seed/store1/200/200',
    tags: ['日用品', '零食'],
    location: [107.73, 29.31]
  },
  
  // 银行
  {
    id: 601,
    category: 'banks',
    name: '重庆银行武隆支行',
    address: '武隆区芙蓉江路',
    distance: '4.8km',
    rating: 4.3,
    image: 'https://picsum.photos/seed/bank1/200/200',
    tags: ['ATM', '对公业务'],
    location: [107.79, 29.29]
  }
])

// 切换分类
const switchCategory = (categoryId) => {
  // 更新分类激活状态
  categories.value = categories.value.map(cat => ({
    ...cat,
    active: cat.id === categoryId
  }))
  
  // 更新当前分类
  currentCategory.value = categories.value.find(cat => cat.id === categoryId)
}

// 根据当前分类和搜索关键词筛选地点
const filteredPlaces = computed(() => {
  return allPlaces.value.filter(place => {
    // 分类筛选
    const matchesCategory = place.category === currentCategory.value.id
    
    // 搜索筛选
    const matchesSearch = searchQuery.value
      ? place.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        place.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
      : true
      
    return matchesCategory && matchesSearch
  })
})

// 处理搜索
const handleSearch = () => {
  updateMapMarkers()
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  updateMapMarkers()
}

// 高亮匹配的文本
const highlightMatch = (text) => {
  if (!searchQuery.value) return text
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<span class="bg-yellow-200">$1</span>')
}

// 在地图上显示选中的地点
const showPlaceOnMap = (place) => {
  if (map) {
    // 移动地图到该地点
    map.setCenter(place.location)
    map.setZoom(15)
    
    // 高亮显示该地点标记
    markers.forEach(marker => {
      if (marker.getExtData().id === place.id) {
        marker.setLabel({
          content: `<div style="background-color: #42b983; color: white; padding: 2px 6px; border-radius: 3px;">${place.name}</div>`,
          offset: new AMap.Pixel(0, -30)
        })
      } else {
        marker.setLabel(null)
      }
    })
  }
}

// 更新地图标记
const updateMapMarkers = () => {
  // 清除现有标记
  if (markers.length > 0) {
    map.remove(markers)
    markers = []
  }
  
  // 添加筛选后的地点标记
  filteredPlaces.value.forEach(place => {
    const marker = new AMap.Marker({
      position: place.location,
      title: place.name,
      icon: new AMap.Icon({
        size: new AMap.Size(32, 32),
        image: getCategoryIcon(place.category),
        imageSize: new AMap.Size(32, 32)
      })
    })
    
    // 存储额外数据
    marker.setExtData({ id: place.id })
    
    // 添加点击事件
    marker.on('click', () => {
      showPlaceOnMap(place)
    })
    
    markers.push(marker)
  })
  
  // 将标记添加到地图
  if (map) {
    map.add(markers)
    
    // 调整地图视野以显示所有标记
    if (markers.length > 0) {
      map.setFitView(markers)
    }
  }
}

// 获取分类对应的图标
const getCategoryIcon = (category) => {
  const icons = {
    'attractions': 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
    'restaurants': 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-restaurant.png',
    'hotels': 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-hotel.png',
    'gas': 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-gas.png',
    'hospitals': 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-hospital.png',
    'stores': 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-shopping.png',
    'banks': 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-bank.png'
  }
  
  return icons[category] || icons['attractions']
}

// 初始化地图
const initMap = () => {
  // 检查AMap是否加载完成
  if (window.AMap) {
    map = new AMap.Map('mapContainer', {
      zoom: 13,
      center: [107.75, 29.32], // 武隆区中心坐标
      resizeEnable: true,
      showLogo: false,
      showCopyright: false
    })
    
    // 添加地图控件
    map.addControl(new AMap.ToolBar({
      position: 'RB'
    }))
    
    // 显示当前分类的标记
    updateMapMarkers()
    
    // 尝试获取用户位置
    AMap.plugin('AMap.Geolocation', function() {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 高精度定位
        timeout: 10000, // 超时时间
        buttonPosition: 'RB'
      })
      
      map.addControl(geolocation)
      geolocation.getCurrentPosition()
      
      // 定位成功回调
      AMap.event.addListener(geolocation, 'complete', (data) => {
        map.setCenter([data.position.lng, data.position.lat])
      })
    })
  } else {
    // 如果AMap未加载完成，延迟重试
    setTimeout(initMap, 100)
  }
}

// 监听分类和搜索词变化，更新地图标记
watch([currentCategory, searchQuery], updateMapMarkers)

// 组件挂载时初始化地图
onMounted(() => {
  // 动态加载高德地图API
  const script = document.createElement('script')
  script.src = 'https://webapi.amap.com/maps?v=2.0&key=dfd36d667109b8826702b8b69ca42af3'
  script.onload = initMap
  document.head.appendChild(script)
})
</script>

<style scoped>
/* 解决滚动条问题 */
.container {
  min-height: 100vh;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

/* SOS弹窗动画 */
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<style>
/* 全局移除高德地图logo和版权信息 */
.amap-logo,
.amap-copyright {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}
</style>
