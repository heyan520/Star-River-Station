<template>
  <div class="create-content-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <button class="nav-btn left-btn" @click="goBack">
        <span>取消</span>
      </button>
      <h1 class="nav-title">发布内容</h1>
      <button class="nav-btn right-btn" @click="submitForm" :disabled="!isFormValid">
        <span>发布</span>
      </button>
    </div>

    <!-- 内容类型选择 -->
    <div class="content-type-selector">
      <button 
        class="type-button" 
        :class="{ active: contentType === 'guide' }"
        @click="contentType = 'guide'"
      >
        <i class="fas fa-map-signs"></i>
        <span>发布攻略</span>
      </button>
      <button 
        class="type-button" 
        :class="{ active: contentType === 'forum' }"
        @click="contentType = 'forum'"
      >
        <i class="fas fa-comments"></i>
        <span>发布论坛</span>
      </button>
    </div>

    <!-- 发布表单 -->
    <div class="create-form">
      <!-- 标题输入 -->
      <div class="form-group">
        <input 
          type="text" 
          v-model="form.title" 
          placeholder="请输入标题" 
          class="form-input"
        >
      </div>

      <!-- 描述输入 -->
      <div class="form-group">
        <textarea 
          v-model="form.description" 
          placeholder="请输入内容描述" 
          class="form-textarea"
          rows="4"
        ></textarea>
      </div>

      <!-- 攻略特有字段 -->
      <div v-if="contentType === 'guide'" class="guide-specific">
        <div class="form-row">
          <div class="form-group half">
            <input 
              type="text" 
              v-model="form.guideInfo.destination" 
              placeholder="目的地" 
              class="form-input"
            >
          </div>
          <div class="form-group half">
            <input 
              type="text" 
              v-model="form.guideInfo.duration" 
              placeholder="时长" 
              class="form-input"
            >
          </div>
        </div>
      </div>

      <!-- 图片上传 -->
      <div class="form-group">
        <div class="upload-section">
          <h3 class="upload-title">上传图片</h3>
          <div class="upload-area" @click="triggerFileInput">
            <input 
              type="file" 
              ref="fileInput" 
              style="display: none" 
              multiple 
              accept="image/*"
              @change="handleFileUpload"
            >
            <div v-if="form.images.length === 0" class="upload-placeholder">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>点击上传图片</p>
            </div>
            <div v-else class="image-preview-container">
              <div 
                v-for="(image, index) in form.images" 
                :key="index"
                class="image-preview"
              >
                <img :src="image" alt="预览图片">
                <button class="remove-image" @click.stop="removeImage(index)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="add-more-images" @click="triggerFileInput">
                <i class="fas fa-plus"></i>
              </div>
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

// 状态管理
const contentType = ref('guide')
const fileInput = ref(null)

// 表单数据
const form = ref({
  title: '',
  description: '',
  images: [],
  guideInfo: {
    destination: '',
    duration: ''
  }
})

// 表单验证
const isFormValid = computed(() => {
  return form.value.title.trim() && form.value.description.trim()
})

// 触发文件输入
const triggerFileInput = () => {
  fileInput.value.click()
}

// 处理文件上传
const handleFileUpload = (event) => {
  const files = event.target.files
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = (e) => {
        form.value.images.push(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
}

// 移除图片
const removeImage = (index) => {
  form.value.images.splice(index, 1)
}

// 提交表单
const submitForm = () => {
  if (!isFormValid.value) return

  // 模拟提交数据
  console.log('提交内容:', {
    type: contentType.value,
    ...form.value
  })

  // 显示成功提示
  alert('发布成功！')

  // 跳转回社区页面
  router.push({ name: 'community' })
}

// 返回上一页
const goBack = () => {
  router.push({ name: 'community' })
}
</script>

<style scoped>
.create-content-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f5f7fa, #e4f1fe);
}

.top-nav {
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.nav-btn {
  position: absolute;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: 15px;
  color: #333;
  padding: 6px 10px;
  border-radius: 15px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.left-btn {
  left: 16px;
}

.right-btn {
  right: 16px;
  background-color: #4CAF50;
  color: white;
}

.content-type-selector {
  display: flex;
  background: white;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.type-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 4px;
}

.type-button i {
  font-size: 18px;
}

.type-button.active {
  background: #4CAF50;
  color: white;
}

.create-form {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  width: 100%;
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-group.half {
  flex: 1;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  min-height: 100px;
}

.upload-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.upload-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-area:hover {
  border-color: #4CAF50;
  background-color: #f8fff8;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #999;
}

.upload-placeholder i {
  font-size: 24px;
}

.upload-placeholder p {
  margin: 0;
  font-size: 14px;
}

.image-preview-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.image-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  color: #ff4757;
}

.add-more-images {
  width: 100px;
  height: 100px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  transition: all 0.2s ease;
}

.add-more-images:hover {
  border-color: #4CAF50;
  color: #4CAF50;
}

.add-more-images i {
  font-size: 24px;
}

.guide-specific {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>