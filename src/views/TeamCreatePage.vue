<template>
  <div class="min-h-screen bg-gray-50">
     <!-- 顶部导航  -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <button @click="goToPage('team')" class="text-gray-600">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">创建队伍</h1>
      <button class="text-primary-600 font-medium">发布</button>
    </div>
    
     <!-- 表单内容  -->
    <div class="px-4 py-4 space-y-6">
       <!-- 活动标题  -->
      <div class="bg-white rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">活动标题</label>
        <input v-model="form.title" type="text" placeholder="给你的活动起个响亮的名字" 
               class="w-full p-3 border border-gray-200 rounded-lg">
      </div>

       <!-- 活动类型  -->
      <div class="bg-white rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-3">活动类型</label>
        <div class="grid grid-cols-3 gap-3">
          <button v-for="type in activityTypes" :key="type" 
                  :class="['p-3 rounded-lg border text-sm', 
                           form.type === type ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-200']"
                  @click="form.type = type">
            {{ type }}
          </button>
        </div>
      </div>

       <!-- 目的地  -->
      <div class="bg-white rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">目的地</label>
        <div class="flex items-center p-3 border border-gray-200 rounded-lg">
          <i class="fas fa-location-dot text-gray-400 mr-3"></i>
          <input v-model="form.destination" type="text" placeholder="选择目的地" class="flex-1">
          <i class="fas fa-chevron-right text-gray-400"></i>
        </div>
      </div>

       <!-- 时间安排  -->
      <div class="bg-white rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-3">时间安排</label>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">出发时间</span>
            <input v-model="form.startDate" type="datetime-local" 
                   class="text-sm border border-gray-200 rounded px-2 py-1">
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">结束时间</span>
            <input v-model="form.endDate" type="datetime-local" 
                   class="text-sm border border-gray-200 rounded px-2 py-1">
          </div>
        </div>
      </div>

       <!-- 人数限制  -->
      <div class="bg-white rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-3">人数限制</label>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">最多招募</span>
          <div class="flex items-center space-x-3">
            <button @click="decreaseLimit" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <i class="fas fa-minus text-sm"></i>
            </button>
            <span class="font-medium">{{ form.maxMembers }}</span>
            <button @click="increaseLimit" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <i class="fas fa-plus text-sm"></i>
            </button>
          </div>
        </div>
      </div>

       <!-- 费用说明  -->
      <div class="bg-white rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">费用说明</label>
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-600">人均费用</span>
          <div class="flex items-center">
            <span class="text-sm text-gray-400 mr-1">¥</span>
            <input v-model="form.cost" type="number" placeholder="0" 
                   class="w-20 text-right border border-gray-200 rounded px-2 py-1">
          </div>
        </div>
        <textarea v-model="form.costDescription" placeholder="详细说明费用包含内容..." 
                  class="w-full p-3 border border-gray-200 rounded-lg h-20 text-sm"></textarea>
      </div>

       <!-- 活动描述  -->
      <div class="bg-white rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">活动描述</label>
        <textarea v-model="form.description" placeholder="详细介绍你的活动安排、注意事项等..." 
                  class="w-full p-3 border border-gray-200 rounded-lg h-32 text-sm"></textarea>
      </div>

       <!-- 要求设置  -->
      <div class="bg-white rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-3">参与要求</label>
        <div class="space-y-3">
          <label class="flex items-center">
            <input v-model="form.requirements.experience" type="checkbox" class="mr-2">
            <span class="text-sm">需要户外经验</span>
          </label>
          <label class="flex items-center">
            <input v-model="form.requirements.equipment" type="checkbox" class="mr-2">
            <span class="text-sm">需要自备装备</span>
          </label>
          <label class="flex items-center">
            <input v-model="form.requirements.fitness" type="checkbox" class="mr-2">
            <span class="text-sm">需要良好体能</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToPage = (routeName) => {
  router.push({ name: routeName })
}

const activityTypes = ref(['自驾游', '徒步', '露营', '登山', '骑行', '摄影'])

const form = ref({
  title: '',
  type: '',
  destination: '',
  startDate: '',
  endDate: '',
  maxMembers: 6,
  cost: '',
  costDescription: '',
  description: '',
  requirements: {
    experience: false,
    equipment: false,
    fitness: false
  }
})

const decreaseLimit = () => {
  if (form.value.maxMembers > 2) {
    form.value.maxMembers--
  }
}

const increaseLimit = () => {
  if (form.value.maxMembers < 20) {
    form.value.maxMembers++
  }
}
</script>