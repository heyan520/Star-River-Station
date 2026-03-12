<template>
  <div class="min-h-screen bg-gray-50">
     <!-- 顶部导航  -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <button @click="goToPage('profile')" class="text-gray-600">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">订单管理</h1>
      <button class="text-gray-600">
        <i class="fas fa-search text-lg"></i>
      </button>
    </div>

     <!-- 订单状态标签  -->
    <div class="px-4 py-3 bg-white border-b sticky top-0 z-10">
      <div class="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        <button v-for="status in orderStatuses" :key="status.name" 
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

     <!-- 订单列表  -->
    <div class="px-4 py-4 space-y-4">
      <div v-for="order in filteredOrders" :key="order.id" 
           class="bg-white rounded-lg shadow-sm overflow-hidden transform transition-all duration-200 hover:shadow-md hover:-translate-y-1">
         <!-- 订单头部  -->
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-sm text-gray-600">订单号: {{ order.orderNumber }}</span>
          </div>
          <span :class="['text-sm font-medium px-2 py-1 rounded-full', getStatusBadgeClass(order.status)]">
            {{ order.status }}
          </span>
        </div>

         <!-- 订单内容  -->
        <div class="p-4">
          <div class="flex items-start space-x-3">
            <img :src="order.image" :alt="order.title" class="w-16 h-16 rounded-lg object-cover">
            <div class="flex-1">
              <h3 class="font-medium text-gray-800 mb-1">{{ order.title }}</h3>
              <div class="text-sm text-gray-600 space-y-1">
                <div><i class="fas fa-calendar mr-1"></i>{{ order.date }}</div>
                <div><i class="fas fa-users mr-1"></i>{{ order.participants }}人</div>
                <div><i class="fas fa-location-dot mr-1"></i>{{ order.location }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-semibold text-gray-800">¥{{ order.amount }}</div>
              <div class="text-sm text-gray-500">{{ order.paymentMethod }}</div>
            </div>
          </div>
        </div>

         <!-- 订单操作  -->
        <div class="px-4 py-3 border-t border-gray-100 flex justify-end space-x-2">
          <button v-for="action in getOrderActions(order.status)" :key="action.text"
                  :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200', action.class]"
                  @click="handleOrderAction(order, action.text)">
            {{ action.text }}
          </button>
        </div>
      </div>
    </div>

     <!-- 空状态  -->
    <div v-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-16">
      <i class="fas fa-receipt text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-600 mb-2">暂无{{ currentStatus === '全部' ? '' : currentStatus }}订单</h3>
      <p class="text-gray-500 text-center">您还没有任何{{ currentStatus === '全部' ? '' : currentStatus }}订单记录</p>
      <button @click="goToPage('home')" 
              class="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:bg-primary-600">
        去探索
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
const orders = ref([])

const switchStatus = (statusName) => {
  currentStatus.value = statusName
  orderStatuses.value.forEach(status => {
    status.active = status.name === statusName
  })
  // 更新各状态的订单数量
  updateOrderCounts()
}

const updateOrderCounts = () => {
  // 统计每个状态的订单数量
  const statusCount = {}
  orders.value.forEach(order => {
    statusCount[order.status] = (statusCount[order.status] || 0) + 1
  })
  
  // 更新orderStatuses中的count属性
  orderStatuses.value.forEach(status => {
    if (status.name !== '全部') {
      status.count = statusCount[status.name] || 0
    } else {
      status.count = orders.value.length
    }
  })
}

const handleOrderAction = (order, action) => {
  // 根据不同的操作执行不同的逻辑
  switch(action) {
    case '立即支付':
      console.log('支付订单:', order.orderNumber)
      // 模拟支付成功，更新订单状态
      setTimeout(() => {
        const orderIndex = orders.value.findIndex(o => o.id === order.id)
        if (orderIndex !== -1) {
          orders.value[orderIndex].status = '待发货'
          updateOrderCounts()
          // 保存到localStorage
          localStorage.setItem('orders', JSON.stringify(orders.value))
        }
      }, 1000)
      break
    case '取消订单':
      console.log('取消订单:', order.orderNumber)
      // 模拟取消订单
      setTimeout(() => {
        const orderIndex = orders.value.findIndex(o => o.id === order.id)
        if (orderIndex !== -1) {
          orders.value[orderIndex].status = '已取消'
          updateOrderCounts()
          // 保存到localStorage
          localStorage.setItem('orders', JSON.stringify(orders.value))
        }
      }, 1000)
      break
    case '确认收货':
      console.log('确认收货:', order.orderNumber)
      // 模拟确认收货
      setTimeout(() => {
        const orderIndex = orders.value.findIndex(o => o.id === order.id)
        if (orderIndex !== -1) {
          orders.value[orderIndex].status = '已完成'
          updateOrderCounts()
          // 保存到localStorage
          localStorage.setItem('orders', JSON.stringify(orders.value))
        }
      }, 1000)
      break
    case '删除订单':
      console.log('删除订单:', order.orderNumber)
      // 模拟删除订单
      const orderIndex = orders.value.findIndex(o => o.id === order.id)
      if (orderIndex !== -1) {
        orders.value.splice(orderIndex, 1)
        updateOrderCounts()
        // 保存到localStorage
        localStorage.setItem('orders', JSON.stringify(orders.value))
      }
      break
    default:
      console.log(`执行操作: ${action} 订单号: ${order.orderNumber}`)
  }
}

const orderStatuses = ref([
  { name: '全部', active: true, count: 0 },
  { name: '待付款', active: false, count: 0 },
  { name: '待发货', active: false, count: 0 },
  { name: '待收货', active: false, count: 0 },
  { name: '待出行', active: false, count: 0 },
  { name: '已完成', active: false, count: 0 },
  { name: '已取消', active: false, count: 0 }
])

// 从localStorage加载订单数据
const loadOrdersFromStorage = () => {
  try {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    if (storedOrders.length > 0) {
      orders.value = storedOrders
    } else {
      // 如果localStorage中没有数据，使用默认数据
      orders.value = [
        {
          id: 1,
          orderNumber: 'OD202403250001',
          title: '武隆天生三桥自驾游',
          date: '2024-03-25 至 2024-03-26',
          participants: 2,
          location: '重庆武隆',
          amount: 760,
          paymentMethod: '微信支付',
          status: '待付款',
          image: '/placeholder.svg?height=80&width=80'
        },
        {
          id: 2,
          orderNumber: 'OD202403200002',
          title: '仙女山露营基地',
          date: '2024-04-01 至 2024-04-02',
          participants: 1,
          location: '重庆武隆仙女山',
          amount: 288,
          paymentMethod: '支付宝',
          status: '待出行',
          image: '/placeholder.svg?height=80&width=80'
        },
        {
          id: 3,
          orderNumber: 'OD202403150003',
          title: '户外装备套装',
          date: '2024-03-15',
          participants: 1,
          location: '线上购买',
          amount: 1299,
          paymentMethod: '微信支付',
          status: '已完成',
          image: '/placeholder.svg?height=80&width=80'
        },
        {
          id: 4,
          orderNumber: 'OD202403100004',
          title: '防水登山鞋',
          date: '2024-03-10',
          participants: 1,
          location: '线上购买',
          amount: 399,
          paymentMethod: '支付宝',
          status: '待发货',
          image: '/placeholder.svg?height=80&width=80'
        },
        {
          id: 5,
          orderNumber: 'OD202403050005',
          title: '专业露营睡袋',
          date: '2024-03-05',
          participants: 1,
          location: '线上购买',
          amount: 499,
          paymentMethod: '微信支付',
          status: '待收货',
          image: '/placeholder.svg?height=80&width=80'
        }
      ]
      // 保存默认数据到localStorage
      localStorage.setItem('orders', JSON.stringify(orders.value))
    }
  } catch (error) {
    console.error('加载订单数据失败:', error)
    // 出错时使用默认数据
    orders.value = [
      {
        id: 1,
        orderNumber: 'OD202403250001',
        title: '武隆天生三桥自驾游',
        date: '2024-03-25 至 2024-03-26',
        participants: 2,
        location: '重庆武隆',
        amount: 760,
        paymentMethod: '微信支付',
        status: '待付款',
        image: '/placeholder.svg?height=80&width=80'
      }
    ]
  }
}

// 根据当前选中的状态筛选订单
const filteredOrders = computed(() => {
  if (currentStatus.value === '全部') {
    return orders.value
  }
  return orders.value.filter(order => order.status === currentStatus.value)
})

// 获取状态标签的样式类，包括背景色和文字颜色
const getStatusBadgeClass = (status) => {
  const classes = {
    '待付款': 'bg-orange-100 text-orange-600',
    '待发货': 'bg-blue-100 text-blue-600',
    '待收货': 'bg-yellow-100 text-yellow-600',
    '待出行': 'bg-indigo-100 text-indigo-600',
    '已完成': 'bg-green-100 text-green-600',
    '已取消': 'bg-gray-100 text-gray-600'
  }
  return classes[status] || 'bg-gray-100 text-gray-600'
}

const getOrderActions = (status) => {
  const actions = {
    '待付款': [
      { text: '取消订单', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
      { text: '立即支付', class: 'bg-primary-500 text-white hover:bg-primary-600' }
    ],
    '待发货': [
      { text: '提醒发货', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
      { text: '申请退款', class: 'bg-primary-500 text-white hover:bg-primary-600' }
    ],
    '待收货': [
      { text: '查看物流', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
      { text: '确认收货', class: 'bg-primary-500 text-white hover:bg-primary-600' }
    ],
    '待出行': [
      { text: '申请退款', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
      { text: '查看详情', class: 'bg-primary-500 text-white hover:bg-primary-600' }
    ],
    '已完成': [
      { text: '再次购买', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
      { text: '评价', class: 'bg-primary-500 text-white hover:bg-primary-600' }
    ],
    '已取消': [
      { text: '删除订单', class: 'border border-gray-300 text-gray-600 hover:bg-gray-50' },
      { text: '重新下单', class: 'bg-primary-500 text-white hover:bg-primary-600' }
    ]
  }
  return actions[status] || []
}

// 组件挂载时初始化订单数据
onMounted(() => {
  loadOrdersFromStorage()
  updateOrderCounts()
})</script>