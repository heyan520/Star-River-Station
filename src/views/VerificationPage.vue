<template>
  <div class="min-h-screen bg-gray-50">
     <!-- 顶部导航  -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <button @click="goToPage('profile')" class="text-gray-600">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">实名认证</h1>
      <div></div>
    </div>

     <!-- 认证状态  -->
    <div class="px-4 py-6">
      <div class="bg-white rounded-lg p-6 text-center">
        <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-id-card text-2xl text-orange-600"></i>
        </div>
        <h2 class="text-xl font-semibold text-gray-800 mb-2">身份认证</h2>
        <p class="text-gray-600 text-sm mb-4">
          为了您的账户安全和更好的服务体验，请完成实名认证
        </p>
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <div class="flex items-center text-orange-700 text-sm">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span>未认证用户将无法参与部分户外活动</span>
          </div>
        </div>
      </div>
    </div>

     <!-- 认证表单  -->
    <div class="px-4 space-y-4">
       基本信息 
      <div class="bg-white rounded-lg p-4">
        <h3 class="font-medium text-gray-800 mb-4">基本信息</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-2">真实姓名</label>
            <input v-model="form.realName" type="text" placeholder="请输入身份证上的真实姓名" 
                   class="w-full p-3 border border-gray-200 rounded-lg">
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-2">身份证号码</label>
            <input v-model="form.idNumber" type="text" placeholder="请输入18位身份证号码" 
                   class="w-full p-3 border border-gray-200 rounded-lg">
          </div>
        </div>
      </div>

       <!-- 身份证照片上传  -->
      <div class="bg-white rounded-lg p-4">
        <h3 class="font-medium text-gray-800 mb-4">身份证照片</h3>
        <div class="space-y-4">
           <!-- 身份证正面  -->
          <div>
            <label class="block text-sm text-gray-600 mb-2">身份证正面</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div v-if="!form.idCardFront" class="text-gray-500">
                <i class="fas fa-camera text-3xl mb-2"></i>
                <p class="text-sm">点击上传身份证正面照片</p>
                <p class="text-xs text-gray-400 mt-1">请确保照片清晰，四角完整</p>
              </div>
              <div v-else class="relative">
                <img :src="form.idCardFront" alt="身份证正面" class="max-h-32 mx-auto rounded">
                <button @click="form.idCardFront = null" 
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  ×
                </button>
              </div>
            </div>
          </div>

           <!-- 身份证反面  -->
          <div>
            <label class="block text-sm text-gray-600 mb-2">身份证反面</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div v-if="!form.idCardBack" class="text-gray-500">
                <i class="fas fa-camera text-3xl mb-2"></i>
                <p class="text-sm">点击上传身份证反面照片</p>
                <p class="text-xs text-gray-400 mt-1">请确保照片清晰，四角完整</p>
              </div>
              <div v-else class="relative">
                <img :src="form.idCardBack" alt="身份证反面" class="max-h-32 mx-auto rounded">
                <button @click="form.idCardBack = null" 
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

       <!-- 手持身份证照片  -->
      <div class="bg-white rounded-lg p-4">
        <h3 class="font-medium text-gray-800 mb-2">手持身份证照片</h3>
        <p class="text-sm text-gray-600 mb-4">请手持身份证正面与本人合影</p>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div v-if="!form.selfieWithId" class="text-gray-500">
            <i class="fas fa-user text-3xl mb-2"></i>
            <p class="text-sm">点击上传手持身份证照片</p>
            <p class="text-xs text-gray-400 mt-1">请确保人脸和身份证信息清晰可见</p>
          </div>
          <div v-else class="relative">
            <img :src="form.selfieWithId" alt="手持身份证" class="max-h-32 mx-auto rounded">
            <button @click="form.selfieWithId = null" 
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              ×
            </button>
          </div>
        </div>
      </div>

       <!-- 认证须知  -->
      <div class="bg-white rounded-lg p-4">
        <h3 class="font-medium text-gray-800 mb-3">认证须知</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex items-start">
            <i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i>
            <span>认证信息仅用于身份验证，我们将严格保护您的隐私</span>
          </div>
          <div class="flex items-start">
            <i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i>
            <span>认证通过后，您可以参与所有户外活动</span>
          </div>
          <div class="flex items-start">
            <i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i>
            <span>认证审核时间为1-3个工作日</span>
          </div>
          <div class="flex items-start">
            <i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i>
            <span>如有疑问，请联系客服：400-123-4567</span>
          </div>
        </div>
      </div>

       <!-- 同意条款  -->
      <div class="bg-white rounded-lg p-4">
        <label class="flex items-start">
          <input v-model="form.agreement" type="checkbox" class="mr-2 mt-1">
          <span class="text-sm text-gray-700">
            我已阅读并同意《实名认证服务协议》和《隐私政策》，
            确认提供的信息真实有效，愿意承担因信息虚假产生的法律责任。
          </span>
        </label>
      </div>

       <!-- 提交按钮  -->
      <div class="pb-6">
        <button :disabled="!canSubmit" 
                :class="['w-full py-3 rounded-lg font-medium',
                         canSubmit ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-500']">
          <!-- 提交认证申请 -->
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToPage = (routeName) => {
  router.push({ name: routeName })
}

const form = ref({
  realName: '',
  idNumber: '',
  idCardFront: null,
  idCardBack: null,
  selfieWithId: null,
  agreement: false
})

const canSubmit = computed(() => {
  return form.value.realName && 
         form.value.idNumber && 
         form.value.idCardFront && 
         form.value.idCardBack && 
         form.value.selfieWithId && 
         form.value.agreement
})
</script>