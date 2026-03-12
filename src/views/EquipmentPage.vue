<template>
  <div class="container min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <button @click="goToPage('home')" class="text-gray-600 hover:text-gray-900 transition-colors">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">装备采购</h1>
      <button class="text-gray-600 hover:text-gray-900 transition-colors relative" @click="goToorders()">
        <i class="fas fa-shopping-cart text-lg"></i>
        <!-- 购物车数量提示 -->
        <span v-if="cartItems.length > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {{ cartItems.length }}
        </span>
      </button>
    </div>

    <!-- 搜索栏（支持模糊查询+清除功能） -->
    <div class="px-4 py-3 bg-white">
      <div class="relative">
        <input 
          type="text" 
          placeholder="搜索装备（如：防水帐篷、登山鞋）..." 
          class="w-full pl-10 pr-10 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          v-model="searchQuery"
          @input="handleSearch"
        >
        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <!-- 清除搜索按钮 -->
        <button 
          v-if="searchQuery" 
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          @click="clearSearch"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- 分类标签（扩展细分品类+激活状态切换） -->
    <div class="px-4 py-3 bg-white border-b">
      <div class="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          v-for="category in categories" 
          :key="category" 
          :class="[
            'px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all', 
            currentCategory === category 
              ? 'bg-primary-500 text-white shadow-sm' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
          @click="switchCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- 搜索结果提示 -->
    <div v-if="searchQuery" class="px-4 py-2 text-sm text-gray-500 bg-white">
      搜索 "<span class="font-medium text-primary-600">{{ searchQuery }}</span>"，在「{{ currentCategory }}」中找到 {{ filteredEquipment.length }} 件装备
    </div>

    <!-- 装备网格（支持分类+搜索筛选） -->
    <div class="container px-4 py-4">
      <!-- 无结果提示 -->
      <div v-if="filteredEquipment.length === 0" class="py-16 text-center bg-white rounded-xl shadow-sm">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-3">
          <i class="fas fa-search text-gray-400 text-2xl"></i>
        </div>
        <p class="text-gray-500">没有找到匹配的装备</p>
        <button 
          class="mt-3 text-primary-600 text-sm hover:text-primary-700 transition-colors"
          @click="clearSearchAndCategory"
        >
          查看全部装备
        </button>
      </div>

      <!-- 装备列表 -->
      <div class="grid grid-cols-2 gap-4" v-else>
        <div 
          v-for="item in filteredEquipment" 
          :key="item.id" 
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="relative">
            <!-- 商品图片（替换为真实户外装备图） -->
            <img :src="item.image" :alt="item.name" class="w-full h-32 object-cover">
            <!-- 折扣标签（有折扣才显示） -->
            <div v-if="item.discount" 
                 class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              {{ item.discount }}
            </div>
            <!-- 新品标签（示例） -->
            <div v-if="item.isNew" 
                 class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              新品
            </div>
          </div>
          <div class="p-3">
            <!-- 商品名称（关键词高亮） -->
            <h3 class="font-medium text-gray-800 text-sm mb-1 line-clamp-2" v-html="highlightMatch(item.name)"></h3>
            <!-- 评分与评价数 -->
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <div class="flex text-yellow-400">
                  <i v-for="n in 5" :key="n" 
                     :class="['fas fa-star text-xs', n <= item.rating ? '' : 'text-gray-300']"></i>
                </div>
                <span class="text-xs text-gray-600 ml-1">({{ item.reviews }})</span>
              </div>
              <!-- 库存状态 -->
              <span class="text-xs" :class="item.stock > 0 ? 'text-green-600' : 'text-red-600'">
                {{ item.stock > 0 ? `库存${item.stock}件` : '缺货' }}
              </span>
            </div>
            <!-- 价格与加购按钮 -->
            <div class="flex items-center justify-between">
              <div>
                <span class="text-primary-600 font-semibold">¥{{ item.price }}</span>
                <span v-if="item.originalPrice" class="text-gray-400 text-xs line-through ml-1">
                  ¥{{ item.originalPrice }}
                </span>
              </div>
              <button 
                class="bg-primary-500 text-white px-3 py-1 rounded-full text-xs hover:bg-primary-600 transition-colors"
                :disabled="item.stock === 0"
                @click="addToCart(item)"
              >
                {{ item.stock > 0 ? '加购物车' : '已缺货' }}
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

const goToorders = () => {
  router.push('/orders')
}

// 1. 扩展分类标签（细分户外装备品类）
const categories = ref([
  '全部', '帐篷', '睡袋', '背包', '炊具', '照明', '服装', 
  '鞋靴', '防潮垫', '炉具', '水壶', '登山杖'
])
// 当前选中分类
const currentCategory = ref('全部')
// 搜索关键词
const searchQuery = ref('')
// 购物车商品列表
const cartItems = ref([])
// 生成订单的全局ID
let orderIdCounter = 6 // 从6开始，避免与现有订单冲突

// 2. 丰富商品数据（每个分类对应真实装备，补充库存、分类属性）
const equipment = ref([
  // 帐篷类
  {
    id: 1,
    name: '户外双人帐篷 防风防雨四季通用 自动搭建',
    category: '帐篷',
    image: 'https://picsum.photos/seed/tent1/300/200',
    price: 299,
    originalPrice: 399,
    discount: '25%OFF',
    rating: 4.8,
    reviews: 1234,
    stock: 45,
    isNew: false
  },
  {
    id: 2,
    name: '单人轻量化帐篷 徒步露营便携防暴雨',
    category: '帐篷',
    image: 'https://picsum.photos/seed/tent2/300/200',
    price: 199,
    originalPrice: 269,
    discount: '26%OFF',
    rating: 4.7,
    reviews: 876,
    stock: 28,
    isNew: true
  },
  // 睡袋类
  {
    id: 3,
    name: '户外睡袋 保暖轻便 零下10度防寒',
    category: '睡袋',
    image: 'https://picsum.photos/seed/sleeping1/300/200',
    price: 188,
    originalPrice: 228,
    discount: '18%OFF',
    rating: 4.6,
    reviews: 642,
    stock: 36,
    isNew: false
  },
  {
    id: 4,
    name: '双人睡袋 可拆分 春秋季透气',
    category: '睡袋',
    image: 'https://picsum.photos/seed/sleeping2/300/200',
    price: 259,
    originalPrice: 329,
    discount: '21%OFF',
    rating: 4.8,
    reviews: 512,
    stock: 19,
    isNew: false
  },
  // 背包类
  {
    id: 5,
    name: '专业登山背包 60L大容量防水 背负系统',
    category: '背包',
    image: 'https://picsum.photos/seed/backpack1/300/200',
    price: 458,
    originalPrice: 598,
    discount: '23%OFF',
    rating: 4.7,
    reviews: 856,
    stock: 22,
    isNew: false
  },
  {
    id: 6,
    name: '日常徒步背包 25L 轻便透气 带水袋仓',
    category: '背包',
    image: 'https://picsum.photos/seed/backpack2/300/200',
    price: 159,
    originalPrice: 199,
    discount: '20%OFF',
    rating: 4.9,
    reviews: 923,
    stock: 51,
    isNew: true
  },
  // 炊具类
  {
    id: 7,
    name: '户外炊具套装 锅碗瓢盆 便携收纳',
    category: '炊具',
    image: 'https://picsum.photos/seed/cookware1/300/200',
    price: 129,
    originalPrice: 169,
    discount: '24%OFF',
    rating: 4.6,
    reviews: 432,
    stock: 33,
    isNew: false
  },
  // 照明类
  {
    id: 8,
    name: 'LED头灯 强光充电 续航12小时 防水',
    category: '照明',
    image: 'https://picsum.photos/seed/headlamp1/300/200',
    price: 89,
    originalPrice: 119,
    discount: '25%OFF',
    rating: 4.9,
    reviews: 2156,
    stock: 67,
    isNew: false
  },
  // 服装类
  {
    id: 9,
    name: '户外冲锋衣 防风防水 透气 三合一',
    category: '服装',
    image: 'https://picsum.photos/seed/clothes1/300/200',
    price: 399,
    originalPrice: 599,
    discount: '33%OFF',
    rating: 4.7,
    reviews: 789,
    stock: 18,
    isNew: true
  },
  // 鞋靴类
  {
    id: 10,
    name: '登山鞋 防水防滑 高帮保护脚踝',
    category: '鞋靴',
    image: 'https://picsum.photos/seed/shoes1/300/200',
    price: 299,
    originalPrice: 399,
    discount: '25%OFF',
    rating: 4.8,
    reviews: 1024,
    stock: 29,
    isNew: false
  },
  // 防潮垫类
  {
    id: 11,
    name: '自动充气防潮垫 加厚 便携 隔温',
    category: '防潮垫',
    image: 'https://picsum.photos/seed/mat1/300/200',
    price: 99,
    originalPrice: 129,
    discount: '23%OFF',
    rating: 4.7,
    reviews: 567,
    stock: 41,
    isNew: false
  },
  // 炉具类
  {
    id: 12,
    name: '户外卡式炉 便携 防风 配气罐',
    category: '炉具',
    image: 'https://picsum.photos/seed/stove1/300/200',
    price: 199,
    originalPrice: 259,
    discount: '23%OFF',
    rating: 4.6,
    reviews: 389,
    stock: 15,
    isNew: true
  },
  // 水壶类
  {
    id: 13,
    name: '不锈钢保温杯 1L大容量 户外便携',
    category: '水壶',
    image: 'https://picsum.photos/seed/bottle1/300/200',
    price: 69,
    originalPrice: 89,
    discount: '22%OFF',
    rating: 4.8,
    reviews: 1203,
    stock: 72,
    isNew: false
  },
  // 登山杖类
  {
    id: 14,
    name: '碳纤维登山杖 可伸缩 轻量化 一对装',
    category: '登山杖',
    image: 'https://picsum.photos/seed/stick1/300/200',
    price: 159,
    originalPrice: 199,
    discount: '20%OFF',
    rating: 4.7,
    reviews: 456,
    stock: 27,
    isNew: false
  }
])

// 3. 核心：分类+模糊搜索联动筛选
const filteredEquipment = computed(() => {
  return equipment.value.filter(item => {
    // 分类筛选：选中“全部”则不限制分类，否则匹配对应分类
    const matchCategory = currentCategory.value === '全部' 
      ? true 
      : item.category === currentCategory.value;
    
    // 模糊搜索：不区分大小写，匹配商品名称
    const matchSearch = searchQuery.value.trim() === ''
      ? true
      : item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // 同时满足分类和搜索条件
    return matchCategory && matchSearch;
  });
});

// 切换分类
const switchCategory = (category) => {
  currentCategory.value = category;
};

// 搜索处理（实时触发，无需额外按钮）
const handleSearch = () => {
  // 空函数，仅触发computed更新（因v-model已绑定searchQuery）
};

// 清除搜索关键词
const clearSearch = () => {
  searchQuery.value = '';
};

// 重置：清除搜索+回到"全部"分类
const clearSearchAndCategory = () => {
  searchQuery.value = '';
  currentCategory.value = '全部';
};

// 添加到购物车
const addToCart = (item) => {
  if (item.stock <= 0) return;
  
  // 添加到购物车
  cartItems.value.push({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    category: item.category
  });
  
  // 模拟生成订单
  generateOrder(item);
  
  // 显示提示
  alert(`"${item.name}" 已加入购物车！`);
};

// 生成订单
const generateOrder = (item) => {
  // 创建订单对象
  const newOrder = {
    id: orderIdCounter++,
    orderNumber: `OD${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(orderIdCounter - 1).padStart(4, '0')}`,
    title: item.name,
    date: new Date().toISOString().split('T')[0],
    participants: 1,
    location: '线上购买',
    amount: item.price,
    paymentMethod: '微信支付',
    status: '待付款',
    image: item.image
  };
  
  // 获取全局订单数据（这里使用localStorage模拟全局状态）
  let globalOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  // 如果是首次添加，从OrderManagementPage初始化数据
  if (globalOrders.length === 0) {
    globalOrders = [
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
    ];
  }
  
  // 添加新订单
  globalOrders.push(newOrder);
  
  // 保存到localStorage
  localStorage.setItem('orders', JSON.stringify(globalOrders));
};

// 页面跳转
const goToPage = (routeName) => {
  router.push({ name: routeName });
};

// 高亮搜索匹配的关键词
const highlightMatch = (text) => {
  if (!searchQuery.value.trim()) return text;
  // 正则匹配关键词（不区分大小写），用黄色背景高亮
  const regex = new RegExp(`(${searchQuery.value})`, 'gi');
  return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
};
</script>

<style scoped>
/* 隐藏滚动条（优化分类标签横向滚动体验） */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 按钮禁用样式 */
button:disabled {
  background-color: #94a3b8 !important;
  cursor: not-allowed;
}
.container {
  margin-bottom: 40px;
}

</style>