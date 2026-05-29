<template>
  <div class="min-h-screen bg-gray-50">
     <!-- 顶部导航  -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <button @click="goToPage('team')" class="text-gray-600">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">申请入队</h1>
      <button class="text-primary-600 font-medium">提交</button>
    </div>

     <!-- 活动信息  -->
    <div class="bg-white mx-4 mt-4 rounded-lg p-4">
      <div class="flex items-start space-x-3">
        <img src="https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
             alt="活动图片" class="w-15 h-15 rounded-lg object-cover">
        <div class="flex-1">
          <h3 class="font-semibold text-gray-800 mb-1">武隆天坑探险之旅</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <div><i class="fas fa-calendar mr-1"></i>3月25日-26日</div>
            <div><i class="fas fa-users mr-1"></i>还需3人 (6人团)</div>
            <div><i class="fas fa-yen-sign mr-1"></i>人均¥380</div>
          </div>
        </div>
      </div>
    </div>

     <!-- 申请表单  -->
    <div class="px-4 py-4 space-y-4">
       <!-- 个人信息  -->
      <div class="bg-white rounded-lg p-4">
        <h3 class="font-medium text-gray-800 mb-3">个人信息</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-600 mb-1">真实姓名</label>
            <input v-model="application.name" type="text" placeholder="请输入真实姓名" 
                   class="w-full p-3 border border-gray-200 rounded-lg">
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">联系电话</label>
            <input v-model="application.phone" type="tel" placeholder="请输入手机号码" 
                   class="w-full p-3 border border-gray-200 rounded-lg">
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">年龄</label>
            <input v-model="application.age" type="number" placeholder="请输入年龄" 
                   class="w-full p-3 border border-gray-200 rounded-lg">
          </div>
        </div>
      </div>
<!-- 
       户外经验  -->
      <div class="bg-white rounded-lg p-4">
        <h3 class="font-medium text-gray-800 mb-3">户外经验</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-600 mb-2">经验等级</label>
            <div class="grid grid-cols-3 gap-2">
              <button v-for="level in experienceLevels" :key="level" 
                      :class="['p-2 rounded-lg border text-sm', 
                               application.experience === level ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-200']"
                      @click="application.experience = level">
                {{ level }}
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">相关经历</label>
            <textarea v-model="application.experienceDescription" 
                      placeholder="简单介绍你的户外活动经历..." 
                      class="w-full p-3 border border-gray-200 rounded-lg h-24 text-sm"></textarea>
          </div>
        </div>
      </div>

       <!-- 装备情况  -->
      <div class="bg-white rounded-lg p-4">
        <h3 class="font-medium text-gray-800 mb-3">装备情况</h3>
        <div class="space-y-2">
          <label v-for="equipment in equipmentList" :key="equipment" class="flex items-center">
            <input v-model="application.equipment" :value="equipment" type="checkbox" class="mr-2">
            <span class="text-sm">{{ equipment }}</span>
          </label>
        </div>
        <div class="mt-3">
          <label class="block text-sm text-gray-600 mb-1">其他装备</label>
          <input v-model="application.otherEquipment" type="text" placeholder="其他装备说明" 
                 class="w-full p-3 border border-gray-200 rounded-lg">
        </div>
      </div>

       <!-- 申请理由  -->
      <div class="bg-white rounded-lg p-4">
        <h3 class="font-medium text-gray-800 mb-3">申请理由</h3>
        <textarea v-model="application.reason" 
                  placeholder="说说你为什么想参加这次活动..." 
                  class="w-full p-3 border border-gray-200 rounded-lg h-24 text-sm"></textarea>
      </div>

       <!-- 紧急联系人  -->
      <div class="bg-white rounded-lg p-4">
        <h3 class="font-medium text-gray-800 mb-3">紧急联系人</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-600 mb-1">联系人姓名</label>
            <input v-model="application.emergencyContact.name" type="text" placeholder="紧急联系人姓名" 
                   class="w-full p-3 border border-gray-200 rounded-lg">
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">联系人电话</label>
            <input v-model="application.emergencyContact.phone" type="tel" placeholder="紧急联系人电话" 
                   class="w-full p-3 border border-gray-200 rounded-lg">
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">关系</label>
            <select v-model="application.emergencyContact.relationship" 
                    class="w-full p-3 border border-gray-200 rounded-lg">
              <option value="">请选择关系</option>
              <option value="父母">父母</option>
              <option value="配偶">配偶</option>
              <option value="兄弟姐妹">兄弟姐妹</option>
              <option value="朋友">朋友</option>
              <option value="其他">其他</option>
            </select>
          </div>
        </div>
      </div>

       <!-- 免责声明  -->
      <div class="bg-white rounded-lg p-4">
        <label class="flex items-start">
          <input v-model="application.agreement" type="checkbox" class="mr-2 mt-1">
          <span class="text-sm text-gray-700">
            我已阅读并同意《户外活动免责声明》和《活动安全须知》，
            愿意承担相应的风险和责任。
          </span>
        </label>
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

const experienceLevels = ref(['新手', '有经验', '资深'])
const equipmentList = ref(['登山包', '登山鞋', '冲锋衣', '头灯', '睡袋', '帐篷'])

const application = ref({
  name: '',
  phone: '',
  age: '',
  experience: '',
  experienceDescription: '',
  equipment: [],
  otherEquipment: '',
  reason: '',
  emergencyContact: {
    name: '',
    phone: '',
    relationship: ''
  },
  agreement: false
})
</script>