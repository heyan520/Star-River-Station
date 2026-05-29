<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <div class="bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
      <div class="flex items-center space-x-3">
        <button @click="goBack" class="text-gray-600">
          <i class="fas fa-arrow-left text-lg"></i>
        </button>
        <div class="flex items-center flex-1">
          <img :src="chatUser.avatar" :alt="chatUser.name" class="w-8 h-8 rounded-full object-cover mr-3">
          <div>
            <h1 class="text-lg font-semibold text-gray-800">{{ chatUser.name }}</h1>
            <div class="flex items-center">
              <div :class="['w-2 h-2 rounded-full mr-2', chatUser.isOnline ? 'bg-green-500' : 'bg-gray-300']"></div>
              <span class="text-xs text-gray-500">{{ chatUser.isOnline ? '在线' : '离线' }}</span>
            </div>
          </div>
        </div>
        <button class="text-gray-600">
          <i class="fas fa-ellipsis-v text-lg"></i>
        </button>
      </div>
    </div>

    <!-- 聊天消息区域 -->
    <div class="flex-1 p-4 overflow-y-auto" ref="chatContainer">
      <div class="space-y-4">
        <!-- 系统消息 -->
        <div class="flex justify-center">
          <span class="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">今天 14:30</span>
        </div>

        <!-- 聊天消息 -->
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          v-show="message"
          :class="['flex items-end space-x-3', message.isMine ? 'justify-end' : '']"
        >
          <!-- 对方头像 -->
          <img 
            v-if="!message.isMine" 
            :src="chatUser.avatar" 
            :alt="chatUser.name" 
            class="w-8 h-8 rounded-full object-cover"
          >
          
          <!-- 消息内容 -->
          <div class="max-w-[70%]">
            <div 
              :class="[
                'rounded-lg p-3 shadow-sm',
                message.isMine 
                  ? 'bg-primary-500 text-white rounded-tr-none' 
                  : 'bg-white rounded-tl-none'
              ]"
            >
              <p :class="message.isMine ? '' : 'text-gray-800'">{{ message.content }}</p>
            </div>
            <span 
              :class="[
                'text-xs text-gray-400',
                message.isMine ? 'mr-2' : 'ml-2'
              ]"
            >{{ message.time }}</span>
          </div>
          
          <!-- 我的头像 -->
          <img 
            v-if="message.isMine" 
            src="/src/assets/头像.png" 
            alt="我的头像" 
            class="w-8 h-8 rounded-full object-cover"
          >
        </div>
      </div>
    </div>

    <!-- 消息输入区域 -->
    <div class="bg-white border-t p-4">
      <div class="flex items-center space-x-3">
        <button class="text-gray-500">
          <i class="fas fa-smile text-xl"></i>
        </button>
        <button class="text-gray-500">
          <i class="fas fa-paperclip text-xl"></i>
        </button>
        <div class="flex-1 relative">
          <input 
            type="text" 
            v-model="messageInput" 
            placeholder="输入消息..." 
            class="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            @keyup.enter="sendMessage"
          >
        </div>
        <button 
          class="bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
          @click="sendMessage"
        >
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 聊天容器引用
const chatContainer = ref(null)

// 消息输入
const messageInput = ref('')

// 聊天用户信息（实际项目中应该从路由参数或状态管理中获取）
const chatUser = ref({
  id: 1,
  name: '户外达人小王',
  avatar: 'https://picsum.photos/seed/user1/200/200',
  isOnline: true
})

// 模拟聊天消息数据
const messages = ref([
  {
    id: 1,
    content: '你好！我在仙女山露营，看到你也在附近。',
    time: '14:30',
    isMine: false
  },
  {
    id: 2,
    content: '是的，我在仙女山国家森林公园，你在哪里？',
    time: '14:31',
    isMine: true
  },
  {
    id: 3,
    content: '我在天生三桥景区附近，你需要什么装备吗？我有多的帐篷。',
    time: '14:32',
    isMine: false
  },
  {
    id: 4,
    content: '太好了！我正需要一个备用帐篷，我们可以交换一些东西吗？',
    time: '14:33',
    isMine: true
  }
])

// 导航返回
const goBack = () => {
  router.back()
}

// 发送消息
const sendMessage = () => {
  if (messageInput.value.trim()) {
    const newMessage = {
      id: Date.now(),
      content: messageInput.value.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    }
    
    messages.value.push(newMessage)
    messageInput.value = ''
    
    // 滚动到底部
    setTimeout(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    }, 100)
    
    // 模拟对方回复
    setTimeout(() => {
      const replyMessage = {
        id: Date.now() + 1,
        content: '收到你的消息！',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isMine: false
      }
      messages.value.push(replyMessage)
      
      // 滚动到底部
      setTimeout(() => {
        if (chatContainer.value) {
          chatContainer.value.scrollTop = chatContainer.value.scrollHeight
        }
      }, 100)
    }, 1000)
  }
}

// 组件挂载时滚动到底部
onMounted(() => {
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }, 100)
})
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>