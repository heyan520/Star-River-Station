<template>
  <div class="min-h-screen bg-gray-50">
     <!-- 顶部导航  -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <button @click="goToPage('profile')" class="text-gray-600">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">我的活动</h1>
      <button class="text-gray-600">
        <i class="fas fa-search text-lg"></i>
      </button>
    </div>

     <!-- 活动状态标签  -->
    <div class="px-4 py-3 bg-white border-b sticky top-0 z-10">
      <div class="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        <button v-for="status in activityStatuses" :key="status.name" 
                :class="['flex items-center px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200', 
                         status.active ? 'bg-primary-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
                @click="switchStatus(status.name)">
          {{ status.name }}
          <span v-if="status.count > 0" class="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            {{ status.count }}
          </span>
        </button>
      </div>
    </div>

     <!-- 活动列表  -->
    <div class="px-4 py-4 space-y-4">
      <div v-for="activity in filteredActivities" :key="activity.id" 
           class="bg-white rounded-lg shadow-sm overflow-hidden transform transition-all duration-200 hover:shadow-md hover:-translate-y-1">
         <!-- 活动头部  -->
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-sm text-gray-600">活动编号: {{ activity.activityCode }}</span>
          </div>
          <span :class="['text-sm font-medium px-2 py-1 rounded-full', getStatusBadgeClass(activity.status)]">
            {{ activity.status }}
          </span>
        </div>

         <!-- 活动内容  -->
        <div class="p-4">
          <div class="flex items-start space-x-3">
            <img :src="activity.image" :alt="activity.title" class="w-16 h-16 rounded-lg object-cover">
            <div class="flex-1">
              <h3 class="font-medium text-gray-800 mb-1">{{ activity.title }}</h3>
              <div class="text-sm text-gray-600 space-y-1">
                <div><i class="fas fa-calendar mr-1"></i>{{ activity.date }}</div>
                <div><i class="fas fa-users mr-1"></i>{{ activity.participants }}人参加</div>
                <div><i class="fas fa-location-dot mr-1"></i>{{ activity.location }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-semibold text-gray-800">{{ activity.isOrganizer ? '组织者' : '参与者' }}</div>
              <div class="text-sm text-gray-500">¥{{ activity.cost }}/人</div>
            </div>
          </div>
        </div>

         <!-- 活动操作  -->
        <div class="px-4 py-3 border-t border-gray-100 flex justify-end space-x-2">
          <button v-for="action in getActivityActions(activity.status, activity.isOrganizer)" :key="action.text"
                  :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200', action.class]"
                  @click="handleActivityAction(activity, action.text)">
            {{ action.text }}
          </button>
        </div>
      </div>
    </div>

     <!-- 空状态  -->
    <div v-if="filteredActivities.length === 0" class="flex flex-col items-center justify-center py-16">
      <i class="fas fa-users text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-600 mb-2">暂无{{ currentStatus === '全部' ? '' : currentStatus }}活动</h3>
      <p class="text-gray-500 text-center">您还没有任何{{ currentStatus === '全部' ? '' : currentStatus }}活动记录</p>
      <button @click="goToPage('team')" 
              class="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:bg-primary-600">
        去组队
      </button>
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

const currentStatus = ref('全部')

const switchStatus = (statusName) => {
  currentStatus.value = statusName
  activityStatuses.value.forEach(status => {
    status.active = status.name === statusName
  })
  // 更新各状态的活动数量
  updateActivityCounts()
}

const updateActivityCounts = () => {
  // 统计每个状态的活动数量
  const statusCount = {}
  activities.value.forEach(activity => {
    statusCount[activity.status] = (statusCount[activity.status] || 0) + 1
  })
  
  // 更新activityStatuses中的count属性
  activityStatuses.value.forEach(status => {
    if (status.name !== '全部') {
      status.count = statusCount[status.name] || 0
    } else {
      status.count = activities.value.length
    }
  })
}

const handleActivityAction = (activity, action) => {
  // 根据不同的操作执行不同的逻辑
  switch(action) {
    case '取消报名':
      console.log('取消报名:', activity.activityCode)
      // 模拟取消报名
      setTimeout(() => {
        const activityIndex = activities.value.findIndex(a => a.id === activity.id)
        if (activityIndex !== -1) {
          activities.value[activityIndex].status = '已取消'
          updateActivityCounts()
        }
      }, 1000)
      break
    case '查看详情':
      console.log('查看详情:', activity.activityCode)
      // 可以跳转到活动详情页
      break
    case '发起退款':
      console.log('发起退款:', activity.activityCode)
      // 模拟发起退款
      setTimeout(() => {
        const activityIndex = activities.value.findIndex(a => a.id === activity.id)
        if (activityIndex !== -1) {
          activities.value[activityIndex].status = '退款中'
          updateActivityCounts()
        }
      }, 1000)
      break
    case '评价活动':
      console.log('评价活动:', activity.activityCode)
      // 模拟评价活动
      break
    case '联系队员':
      console.log('联系队员:', activity.activityCode)
      // 可以跳转到队员列表或聊天页面
      break
    case '管理报名':
      console.log('管理报名:', activity.activityCode)
      // 可以跳转到报名管理页面
      break
    case '发布公告':
      console.log('发布公告:', activity.activityCode)
      // 可以打开发布公告的模态框
      break
    case '取消活动':
      console.log('取消活动:', activity.activityCode)
      // 模拟取消活动
      setTimeout(() => {
        const activityIndex = activities.value.findIndex(a => a.id === activity.id)
        if (activityIndex !== -1) {
          activities.value[activityIndex].status = '已取消'
          updateActivityCounts()
        }
      }, 1000)
      break
    default:
      console.log(`执行操作: ${action} 活动编号: ${activity.activityCode}`)
  }
}

const activityStatuses = ref([
  { name: '全部', active: true, count: 0 },
  { name: '待确认', active: false, count: 0 },
  { name: '进行中', active: false, count: 0 },
  { name: '待出行', active: false, count: 0 },
  { name: '已完成', active: false, count: 0 },
  { name: '已取消', active: false, count: 0 },
  { name: '退款中', active: false, count: 0 }
])

const activities = ref([
  {
    id: 1,
    activityCode: 'ACT202403250001',
    title: '武隆天坑探险之旅',
    date: '2024-03-25 至 2024-03-26',
    participants: 6,
    location: '重庆武隆天生三桥',
    cost: 380,
    status: '待出行',
    isOrganizer: false,
    image: '/placeholder.svg?height=80&width=80'
  },
  {
    id: 2,
    activityCode: 'ACT202404010002',
    title: '仙女山草原露营',
    date: '2024-04-01 至 2024-04-02',
    participants: 8,
    location: '重庆武隆仙女山',
    cost: 220,
    status: '进行中',
    isOrganizer: true,
    image: '/placeholder.svg?height=80&width=80'
  },
  {
    id: 3,
    activityCode: 'ACT202403150003',
    title: '芙蓉洞地下探秘',
    date: '2024-03-15',
    participants: 8,
    location: '重庆武隆芙蓉洞',
    cost: 150,
    status: '已完成',
    isOrganizer: false,
    image: '/placeholder.svg?height=80&width=80'
  },
  {
    id: 4,
    activityCode: 'ACT202404150004',
    title: '金佛山徒步穿越',
    date: '2024-04-15 至 2024-04-16',
    participants: 10,
    location: '重庆南川金佛山',
    cost: 280,
    status: '待确认',
    isOrganizer: true,
    image: '/placeholder.svg?height=80&width=80'
  },
  {
    id: 5,
    activityCode: 'ACT202403100005',
    title: '长江三峡游船',
    date: '2024-03-10 至 2024-03-12',
    participants: 20,
    location: '重庆三峡',
    cost: 880,
    status: '已取消',
    isOrganizer: false,
    image: '/placeholder.svg?height=80&width=80'
  },
  {
    id: 6,
    activityCode: 'ACT202403050006',
    title: '缙云山骑行',
    date: '2024-03-05',
    participants: 12,
    location: '重庆北碚缙云山',
    cost: 80,
    status: '退款中',
    isOrganizer: false,
    image: '/placeholder.svg?height=80&width=80'
  }
])

// 根据当前选中的状态筛选活动
const filteredActivities = computed(() => {
  if (currentStatus.value === '全部') {
    return activities.value
  }
  return activities.value.filter(activity => activity.status === currentStatus.value)
})

// 获取状态标签的样式类，包括背景色和文字颜色
const getStatusBadgeClass = (status) => {
  const classes = {
    '待确认': 'bg-purple-100 text-purple-600',
    '进行中': 'bg-blue-100 text-blue-600',
    '待出行': 'bg-orange-100 text-orange-600',
    '已完成': 'bg-green-100 text-green-600',
    '已取消': 'bg-gray-100 text-gray-600',
    '退款中': 'bg-yellow-100 text-yellow-600'
  }
  return classes[status] || 'bg-gray-100 text-gray-600'
}

const getActivityActions = (status, isOrganizer) => {
  // 如果是组织者，返回组织者相关的操作
  if (isOrganizer) {
    const organizerActions = {
      '待确认': [
        { text: '管理报名', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
        { text: '发布公告', class: 'bg-primary-500 text-white hover:bg-primary-600' },
        { text: '取消活动', class: 'border border-red-300 text-red-600 hover:bg-red-50' }
      ],
      '进行中': [
        { text: '联系队员', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
        { text: '发布公告', class: 'bg-primary-500 text-white hover:bg-primary-600' }
      ],
      '待出行': [
        { text: '联系队员', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
        { text: '发布公告', class: 'bg-primary-500 text-white hover:bg-primary-600' },
        { text: '取消活动', class: 'border border-red-300 text-red-600 hover:bg-red-50' }
      ],
      '已完成': [
        { text: '查看详情', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
        { text: '发布新活动', class: 'bg-primary-500 text-white hover:bg-primary-600' }
      ],
      '已取消': [
        { text: '查看详情', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
        { text: '发布新活动', class: 'bg-primary-500 text-white hover:bg-primary-600' }
      ],
      '退款中': [
        { text: '查看详情', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
        { text: '处理退款', class: 'bg-primary-500 text-white hover:bg-primary-600' }
      ]
    }
    return organizerActions[status] || []
  }
  
  // 普通参与者的操作
  const participantActions = {
    '待确认': [
      { text: '取消报名', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
      { text: '查看详情', class: 'bg-primary-500 text-white hover:bg-primary-600' }
    ],
    '进行中': [
      { text: '联系组织者', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
      { text: '查看详情', class: 'bg-primary-500 text-white hover:bg-primary-600' }
    ],
    '待出行': [
      { text: '取消报名', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
      { text: '查看详情', class: 'bg-primary-500 text-white hover:bg-primary-600' }
    ],
    '已完成': [
      { text: '查看详情', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
      { text: '评价活动', class: 'bg-primary-500 text-white hover:bg-primary-600' },
      { text: '分享活动', class: 'border border-blue-300 text-blue-600 hover:bg-blue-50' }
    ],
    '已取消': [
      { text: '查看详情', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
      { text: '申请退款', class: 'bg-primary-500 text-white hover:bg-primary-600' }
    ],
    '退款中': [
      { text: '查看详情', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
      { text: '联系客服', class: 'bg-primary-500 text-white hover:bg-primary-600' }
    ]
  }
  return participantActions[status] || []
}

// 组件挂载时初始化活动数量
onMounted(() => {
  updateActivityCounts()
})
</script>