<template>
  <top/>
  <div class="vr-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>加载VR全景中...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error || !vrSrc" class="error-message">
      <p v-if="error">{{ error }}</p>
      <p v-else>未找到该位置的VR全景</p>
      <button @click="loadVRPanorama" class="retry-button">重试</button>
      <button @click="$router.back()" class="back-button">返回</button>
    </div>
    
    <!-- VR内容 -->
    <iframe 
      v-if="vrSrc && !error" 
      :src="vrSrc" 
      frameborder="0" 
      allowfullscreen
      class="vr-iframe"
      @error="handleIframeError"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation"
    ></iframe>
    
    <!-- 浏览器兼容性提示 -->
    <div v-if="showCompatibilityNotice" class="compatibility-notice">
      <p>您的浏览器可能限制了VR功能的某些特性。</p>
      <p>全景图仍可正常浏览，但部分高级VR功能可能无法使用。</p>
      <button @click="closeCompatibilityNotice" class="close-button">我知道了</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useVRPanorama } from '../composables/useVRPanorama.js';
import top from '../components/Top.vue';

// 使用VR全景 composable
const { vrSrc, loading, error, loadVRPanorama } = useVRPanorama();

// 浏览器兼容性提示状态
const showCompatibilityNotice = ref(false);

// 处理iframe加载错误
const handleIframeError = (event) => {
  console.warn('VR全景iframe加载时发生错误:', event);
  // 我们不直接设置error，因为这可能是跨域资源的正常警告
  // 但可以显示兼容性提示
  showCompatibilityNotice.value = true;
};

// 关闭兼容性提示
const closeCompatibilityNotice = () => {
  showCompatibilityNotice.value = false;
};

// 全局错误处理 - 捕获XR权限相关错误
const handleGlobalError = (event) => {
  if (event.error && event.error.message && 
      (event.error.message.includes('XRSystem') || 
       event.error.message.includes('isSessionSupported') || 
       event.error.message.includes('xr'))) {
    console.warn('检测到XR权限限制:', event.error.message);
    // 显示兼容性提示但不中断正常浏览
    showCompatibilityNotice.value = true;
    // 阻止错误冒泡到控制台显示
    event.preventDefault();
  }
};

// 设置全局错误监听器
onMounted(() => {
  window.addEventListener('error', handleGlobalError);
  
  // 检查本地存储，避免重复显示提示
  const hasShownNotice = localStorage.getItem('vrCompatibilityNoticeShown');
  if (!hasShownNotice) {
    // 延迟显示提示，让用户先看到内容
    setTimeout(() => {
      showCompatibilityNotice.value = true;
      localStorage.setItem('vrCompatibilityNoticeShown', 'true');
    }, 3000);
  }
});

// 清理监听器
onUnmounted(() => {
  window.removeEventListener('error', handleGlobalError);
});
</script>

<style scoped>
.vr-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  padding-top: 50px; /* 为顶部导航栏留出空间 */
}

.vr-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* 加载状态样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  color: white;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态样式 */
.error-message {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  color: #e53e3e;
}

.retry-button,
.back-button {
  margin-top: 16px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.retry-button {
  background-color: #4caf50;
  color: white;
}

.retry-button:hover {
  background-color: #45a049;
}

.back-button {
  background-color: #2196f3;
  color: white;
  margin-left: 12px;
}

.back-button:hover {
  background-color: #1976d2;
}

/* 浏览器兼容性提示样式 */
.compatibility-notice {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #ff9800;
  border-radius: 8px;
  padding: 16px 20px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 20;
}

.compatibility-notice p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}

.close-button {
  margin-top: 12px;
  padding: 6px 16px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.close-button:hover {
  background-color: #f57c00;
}
</style>