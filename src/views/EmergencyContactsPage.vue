<template>
  <div class="min-h-screen bg-gray-50">
     <!-- 顶部导航  -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <button @click="goToPage('profile')" class="text-gray-600">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">紧急联系人</h1>
      <button @click="showAddForm = true" class="text-primary-600">
        <i class="fas fa-plus text-lg"></i>
      </button>
    </div>

     <!-- 说明信息  -->
    <div class="px-4 py-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div class="flex items-start">
          <i class="fas fa-info-circle text-blue-600 mr-3 mt-0.5"></i>
          <div class="text-sm text-blue-800">
            <p class="font-medium mb-1">为什么需要紧急联系人？</p>
            <p>在户外活动中，如遇紧急情况，我们将第一时间联系您的紧急联系人，确保您的安全。建议添加2-3位联系人。</p>
          </div>
        </div>
      </div>
    </div>

     <!-- 联系人列表  -->
    <div class="px-4 space-y-3">
      <div v-for="contact in contacts" :key="contact.id" 
           class="bg-white rounded-lg p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-primary-600"></i>
            </div>
            <div>
              <h3 class="font-medium text-gray-800">{{ contact.name }}</h3>
              <div class="text-sm text-gray-600 space-y-1">
                <div><i class="fas fa-phone mr-1"></i>{{ contact.phone }}</div>
                <div><i class="fas fa-heart mr-1"></i>{{ contact.relationship }}</div>
              </div>
            </div>
          </div>
          <div class="flex space-x-2">
            <button @click="editContact(contact)" class="text-gray-600 p-2">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteContact(contact.id)" class="text-red-600 p-2">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
<!--         
         主要联系人标识  -->
        <div v-if="contact.isPrimary" class="mt-3 pt-3 border-t border-gray-100">
          <span class="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs">
            <i class="fas fa-star mr-1"></i>主要联系人
          </span>
        </div>
      </div>

       <!-- 空状态  -->
      <div v-if="contacts.length === 0" class="text-center py-12">
        <i class="fas fa-address-book text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-600 mb-2">还没有紧急联系人</h3>
        <p class="text-gray-500 mb-4">添加紧急联系人，让户外活动更安全</p>
        <button @click="showAddForm = true" 
                class="bg-primary-500 text-white px-6 py-2 rounded-lg">
          添加联系人
        </button>
      </div>
    </div>
<!-- 添加/编辑联系人表单  -->
    <div v-if="showAddForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div class="container bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-800">
            {{ editingContact ? '编辑联系人' : '添加联系人' }}
          </h2>
          <button @click="closeForm" class="text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">姓名</label>
            <input v-model="formData.name" type="text" placeholder="请输入联系人姓名" 
                   class="w-full p-3 border border-gray-200 rounded-lg">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">手机号码</label>
            <input v-model="formData.phone" type="tel" placeholder="请输入手机号码" 
                   class="w-full p-3 border border-gray-200 rounded-lg">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">关系</label>
            <select v-model="formData.relationship" 
                    class="w-full p-3 border border-gray-200 rounded-lg">
              <option value="">请选择关系</option>
              <option value="父亲">父亲</option>
              <option value="母亲">母亲</option>
              <option value="配偶">配偶</option>
              <option value="兄弟">兄弟</option>
              <option value="姐妹">姐妹</option>
              <option value="朋友">朋友</option>
              <option value="同事">同事</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div>
            <label class="flex items-center">
              <input v-model="formData.isPrimary" type="checkbox" class="mr-2">
              <span class="text-sm text-gray-700">设为主要联系人</span>
            </label>
            <p class="text-xs text-gray-500 mt-1">主要联系人将优先被通知</p>
          </div>

          <div class="flex space-x-3 pt-4">
            <button @click="closeForm" 
                    class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium">
              取消
            </button>
            <button @click="saveContact" 
                    :disabled="!canSave"
                    :class="['flex-1 py-3 rounded-lg font-medium',
                             canSave ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-500']">
              {{ editingContact ? '保存' : '添加' }}
            </button>
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

const goToPage = (routeName) => {
  router.push({ name: routeName })
}

const showAddForm = ref(false)
const editingContact = ref(null)

const formData = ref({
  name: '',
  phone: '',
  relationship: '',
  isPrimary: false
})

const contacts = ref([
  {
    id: 1,
    name: '张三',
    phone: '138****1234',
    relationship: '父亲',
    isPrimary: true
  },
  {
    id: 2,
    name: '李四',
    phone: '139****5678',
    relationship: '朋友',
    isPrimary: false
  }
])

const canSave = computed(() => {
  return formData.value.name && formData.value.phone && formData.value.relationship
})

const editContact = (contact) => {
  editingContact.value = contact
  formData.value = { ...contact }
  showAddForm.value = true
}

const deleteContact = (id) => {
  if (confirm('确定要删除这个联系人吗？')) {
    contacts.value = contacts.value.filter(c => c.id !== id)
  }
}

const closeForm = () => {
  showAddForm.value = false
  editingContact.value = null
  formData.value = {
    name: '',
    phone: '',
    relationship: '',
    isPrimary: false
  }
}

const saveContact = () => {
  if (!canSave.value) return

  if (editingContact.value) {
    // 编辑现有联系人
    const index = contacts.value.findIndex(c => c.id === editingContact.value.id)
    if (index !== -1) {
      contacts.value[index] = { ...formData.value, id: editingContact.value.id }
    }
  } else {
    // 添加新联系人
    const newContact = {
      ...formData.value,
      id: Date.now()
    }
    contacts.value.push(newContact)
  }

  // 如果设置为主要联系人，取消其他联系人的主要状态
  if (formData.value.isPrimary) {
    contacts.value.forEach(contact => {
      if (contact.id !== (editingContact.value?.id || Date.now())) {
        contact.isPrimary = false
      }
    })
  }

  closeForm()
}
</script>
<style scoped> 
.container {
  margin-bottom: 39px;
}
</style>