<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <button @click="goBack" class="text-gray-600">
        <i class="fas fa-arrow-left text-lg"></i>
      </button>
      <h2 class="text-lg font-medium text-gray-800">发布帖子</h2>
      <button @click="submitPost" class="text-primary-500 font-medium">发布</button>
    </div>

    <!-- 发贴表单 -->
    <div class="bg-white px-4 py-6">
      <!-- 选择分类 -->
      <div class="mb-6">
        <h3 class="text-sm font-medium text-gray-700 mb-3">选择分类</h3>
        <div class="grid grid-cols-4 gap-2">
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['flex flex-col items-center justify-center py-3 rounded-lg transition-all', 
                     selectedCategory === category.id ? 'bg-primary-50 border-2 border-primary-500 text-primary-500' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100']"
            @click="selectCategory(category.id)"
          >
            <i :class="[category.icon, 'text-xl mb-1']"></i>
            <span class="text-xs">{{ category.name }}</span>
          </button>
        </div>
      </div>

      <!-- 标题输入 -->
      <div class="mb-6">
        <input 
          type="text" 
          placeholder="请输入帖子标题..." 
          v-model="post.title"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        >
      </div>

      <!-- 内容输入 -->
      <div class="mb-6">
        <textarea 
          placeholder="分享你的户外经历、经验或问题..." 
          v-model="post.content"
          rows="6"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
        ></textarea>
      </div>

      <!-- 添加图片 -->
      <div class="mb-6">
        <h3 class="text-sm font-medium text-gray-700 mb-3">添加图片</h3>
        <div class="flex space-x-3">
          <div 
            v-for="(image, index) in post.images" 
            :key="index"
            class="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200"
          >
            <img :src="image" alt="Post Image" class="w-full h-full object-cover">
            <button 
              class="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center"
              @click="removeImage(index)"
            >
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>
          <div 
            v-if="post.images.length < 9"
            class="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-all"
            @click="triggerImageInput"
          >
            <i class="fas fa-plus text-gray-400 text-xl mb-1"></i>
            <span class="text-xs text-gray-500">添加图片</span>
            <input 
              type="file" 
              ref="imageInput"
              accept="image/*"
              multiple
              class="hidden"
              @change="handleImageUpload"
            >
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">最多可添加9张图片</p>
      </div>

      <!-- 添加位置 -->
      <div class="mb-6">
        <button 
          class="flex items-center justify-between w-full px-4 py-3 border border-gray-200 rounded-lg transition-all hover:border-primary-500"
          @click="showLocationPicker"
        >
          <div class="flex items-center">
            <i class="fas fa-map-marker-alt text-primary-500 mr-2"></i>
            <span class="text-gray-600">{{ post.location ? post.location.name : '添加位置 (可选)' }}</span>
          </div>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </button>
      </div>

      <!-- 标签输入 -->
      <div class="mb-6">
        <h3 class="text-sm font-medium text-gray-700 mb-3">添加标签</h3>
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="tag in post.tags" 
            :key="tag"
            class="flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
          >
            <span>{{ tag }}</span>
            <button 
              class="ml-2 text-gray-400 hover:text-gray-600"
              @click="removeTag(tag)"
            >
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>
          <input 
            type="text" 
            v-model="newTag"
            placeholder="添加标签..."
            class="px-3 py-1 border border-gray-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
            @keyup.enter="addTag"
          >
        </div>
      </div>

      <!-- 隐私设置 -->
      <div class="mb-6">
        <h3 class="text-sm font-medium text-gray-700 mb-3">隐私设置</h3>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <i class="fas fa-eye text-gray-500 mr-2"></i>
            <span class="text-gray-600">{{ privacySettings.public ? '公开' : '私密' }}</span>
          </div>
          <button 
            :class="['relative inline-block w-12 h-6 rounded-full transition-colors', privacySettings.public ? 'bg-primary-500' : 'bg-gray-300']"
            @click="togglePrivacy"
          >
            <div 
              :class="['absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform', 
                       privacySettings.public ? 'transform translate-x-6' : '']"
            ></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostPage',
  data() {
    return {
      post: {
        title: '',
        content: '',
        categoryId: null,
        images: [],
        location: null,
        tags: []
      },
      selectedCategory: null,
      newTag: '',
      categories: [
        { id: 1, name: '徒步', icon: 'fas fa-hiking' },
        { id: 2, name: '露营', icon: 'fas fa-campground' },
        { id: 3, name: '旅行', icon: 'fas fa-plane' },
        { id: 4, name: '摄影', icon: 'fas fa-camera' },
        { id: 5, name: '亲子', icon: 'fas fa-users' },
        { id: 6, name: '装备', icon: 'fas fa-backpack' },
        { id: 7, name: '问答', icon: 'fas fa-question-circle' },
        { id: 8, name: '其他', icon: 'fas fa-ellipsis-h' }
      ],
      privacySettings: {
        public: true
      }
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
      this.post.categoryId = categoryId;
    },
    triggerImageInput() {
      this.$refs.imageInput.click();
    },
    handleImageUpload(event) {
      const files = event.target.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          if (this.post.images.length < 9) {
            const reader = new FileReader();
            reader.onload = (e) => {
              this.post.images.push(e.target.result);
            };
            reader.readAsDataURL(files[i]);
          }
        }
      }
      // 清空文件输入，以便可以重新选择相同的文件
      event.target.value = '';
    },
    removeImage(index) {
      this.post.images.splice(index, 1);
    },
    showLocationPicker() {
      // 这里可以实现地图位置选择功能
      alert('位置选择功能待实现');
    },
    addTag() {
      if (this.newTag && this.newTag.trim() && this.post.tags.length < 5 && !this.post.tags.includes(this.newTag.trim())) {
        this.post.tags.push(this.newTag.trim());
        this.newTag = '';
      }
    },
    removeTag(tag) {
      const index = this.post.tags.indexOf(tag);
      if (index !== -1) {
        this.post.tags.splice(index, 1);
      }
    },
    togglePrivacy() {
      this.privacySettings.public = !this.privacySettings.public;
    },
    submitPost() {
      // 验证表单
      if (!this.post.title || !this.post.content || !this.post.categoryId) {
        alert('请填写完整的帖子信息');
        return;
      }

      // 模拟提交帖子
      console.log('提交的帖子信息:', this.post);
      console.log('隐私设置:', this.privacySettings);

      // 提交成功后跳转到首页或帖子列表页
      alert('帖子发布成功！');
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
/* 自定义样式可以在这里添加 */
</style>
