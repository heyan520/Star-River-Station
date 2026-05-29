<template>
  <div class="ai-assistant-container">
    <!-- 顶部控制区域 -->
    <div class="top-controls">
      <button class="control-button" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        <span>返回</span>
      </button>
      <h1 class="page-title">智能助手</h1>
      <button class="control-button" @click="switchToAutonomousMode">
        <i class="fas fa-user"></i>
        <span>自主模式</span>
      </button>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 欢迎界面 -->
      <div v-if="currentStep === 0" class="welcome-section">
        <div class="welcome-header">
          <h2 class="app-name">重庆户外攻略</h2>
          <p class="app-description">快速规划你的户外行程，两种模式任选</p>
        </div>
        
        <div class="mode-selection">
          <button class="mode-button assistant-mode" @click="startAssistantMode">
            <div class="mode-icon">
              <img src="/AI小助手.png" alt="AI助手" class="assistant-image">
            </div>
            <h3>需要小助手</h3>
            <p>一步一步引导，快速生成专属攻略</p>
          </button>
          <button class="mode-button autonomous-mode" @click="switchToAutonomousMode">
            <div class="mode-icon">
              <i class="fas fa-user"></i>
            </div>
            <h3>不需要助手</h3>
            <p>自由查找、组队、发布攻略</p>
          </button>
        </div>
        
        <!-- 热门推荐路线 -->
        <div class="popular-routes">
          <div class="section-header">
            <h3><i class="fas fa-fire"></i> 热门推荐路线</h3>
            <a href="#" class="see-more">查看更多 ></a>
          </div>
          <div class="routes-list">
            <div class="route-card" v-for="route in popularRoutes" :key="route.id">
              <div class="route-image" :style="{ backgroundImage: `url(${route.image})` }"></div>
              <div class="route-content">
                <h4>{{ route.title }}</h4>
                <div class="route-features">
                  <span v-for="feature in route.features" :key="feature" class="feature">
                    <i class="fas fa-map-marker-alt"></i> {{ feature }}
                  </span>
                </div>
                <div class="route-tags">
                  <span v-for="tag in route.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 智能助手模式 - 步骤引导 -->
      <div v-else-if="currentStep > 0 && currentStep < 6" class="assistant-mode-content">
        <!-- 步骤指示器 -->
        <div class="step-indicator">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="step-dot"
            :class="{ active: index < currentStep }"
          ></div>
        </div>

        <!-- 对话气泡 -->
        <div class="conversation-container">
          <div class="assistant-message">
            <div class="assistant-avatar">
              <img src="/AI小助手.png" alt="AI助手" class="avatar-image">
            </div>
            <div class="message-bubble">
              <p class="message-text">{{ currentQuestion }}</p>
              
              <!-- 选项区域 -->
              <div v-if="currentStep === 1" class="options-container">
                <button 
                  v-for="destination in popularDestinations" 
                  :key="destination"
                  class="option-button"
                  @click="selectDestination(destination)"
                >
                  {{ destination }}
                </button>
                <div class="custom-input">
                  <input 
                    type="text" 
                    v-model="customDestination"
                    placeholder="输入其他目的地"
                    class="input-field"
                  >
                  <button class="confirm-button" @click="confirmCustomDestination">
                    确认
                  </button>
                </div>
              </div>

              <div v-else-if="currentStep === 2" class="options-container">
                <button 
                  v-for="number in groupSizes" 
                  :key="number"
                  class="option-button"
                  @click="selectGroupSize(number)"
                >
                  {{ number }}
                </button>
              </div>

              <div v-else-if="currentStep === 3" class="date-selection">
                <div class="date-input">
                  <label>出发日期</label>
                  <input type="date" v-model="startDate" class="input-field">
                </div>
                <div class="date-input">
                  <label>返程日期</label>
                  <input type="date" v-model="endDate" class="input-field">
                </div>
              </div>

              <div v-else-if="currentStep === 4" class="options-container">
                <button 
                  v-for="type in tripTypes" 
                  :key="type"
                  class="option-button"
                  @click="selectTripType(type)"
                >
                  {{ type }}
                </button>
              </div>

              <div v-else-if="currentStep === 5" class="special-needs">
                <div class="need-item">
                  <label>
                    <input type="checkbox" v-model="needs.equipment">
                    需要租赁装备
                  </label>
                </div>
                <div class="need-item">
                  <label>
                    <input type="checkbox" v-model="needs.facilities">
                    需要特定设施（热水、电源等）
                  </label>
                </div>
                <div class="need-item">
                  <label>活动偏好：</label>
                  <div class="activity-options">
                    <button 
                      v-for="activity in activities" 
                      :key="activity"
                      class="activity-button"
                      :class="{ selected: selectedActivities.includes(activity) }"
                      @click="toggleActivity(activity)"
                    >
                      {{ activity }}
                    </button>
                  </div>
                </div>
                <div class="need-item">
                  <label>其他特殊需求：</label>
                  <textarea 
                    v-model="needs.other"
                    placeholder="请输入其他特殊需求"
                    class="textarea-field"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="action-buttons">
          <button 
            v-if="currentStep > 1" 
            class="action-button back-button"
            @click="previousStep"
          >
            上一步
          </button>
          <button 
            class="action-button next-button"
            @click="nextStep"
          >
            {{ currentStep === 5 ? '生成攻略' : '下一步' }}
          </button>
        </div>
      </div>

      <!-- 攻略结果页 -->
      <div v-else-if="currentStep === 6" class="guide-result">
        <div class="result-header">
          <h2>你的专属攻略</h2>
        </div>
        <div class="guide-card">
          <div class="guide-section">
            <h3>推荐目的地</h3>
            <p>{{ destination }}</p>
          </div>
          <div class="guide-section">
            <h3>适配路线</h3>
            <p>{{ generatedRoute }}</p>
          </div>
          <div class="guide-section">
            <h3>必备装备</h3>
            <p>{{ generatedEquipment }}</p>
          </div>
          <div class="guide-section">
            <h3>周边补给</h3>
            <p>{{ generatedSupplies }}</p>
          </div>
          <div class="guide-section">
            <h3>注意事项</h3>
            <p>{{ generatedNotes }}</p>
          </div>
        </div>
        <div class="result-actions">
          <button class="result-button">完善<br>攻略</button>
          <button class="result-button" @click="handleOneClickTeam">一键<br>组队</button>
          <button class="result-button">保存<br>攻略</button>
          <button class="result-button">分享<br>攻略</button>
        </div>
      </div>

      <!-- 自主模式 -->
      <div v-else-if="autonomousMode" class="autonomous-mode-content">
        <div class="autonomous-header">
          <h2>自主操作</h2>
          <button class="call-assistant-button" @click="startAssistantMode">
            <i class="fas fa-robot"></i>
            <span>呼叫小助手</span>
          </button>
        </div>
        <div class="tab-navigation">
          <button 
            v-for="tab in autonomousTabs" 
            :key="tab"
            class="tab-button"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>
        <div class="tab-content">
          <!-- 查找地点 -->
          <div v-if="activeTab === '查找地点'" class="search-locations">
            <div class="filters">
              <select class="filter-select">
                <option>区域</option>
                <option>武隆</option>
                <option>南川</option>
                <option>江津</option>
              </select>
              <select class="filter-select">
                <option>类型</option>
                <option>露营地</option>
                <option>徒步路线</option>
                <option>自驾路线</option>
              </select>
              <select class="filter-select">
                <option>难度</option>
                <option>休闲</option>
                <option>中等</option>
                <option>挑战</option>
              </select>
            </div>
            <div class="search-input">
              <input type="text" placeholder="搜索地点" class="input-field">
              <button class="search-button">
                <i class="fas fa-search"></i>
              </button>
            </div>
            <div class="location-list">
              <!-- 地点列表项 -->
              <div class="location-item" v-for="i in 3" :key="i">
                <div class="location-image"></div>
                <div class="location-info">
                  <h4>地点名称 {{ i }}</h4>
                  <p>区域：武隆区</p>
                  <p>难度：中等</p>
                  <p>描述：这是一个美丽的户外地点，适合露营和徒步。</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 查找队伍 -->
          <div v-if="activeTab === '查找队伍'" class="search-teams">
            <div class="team-list">
              <!-- 队伍列表项 -->
              <div class="team-item" v-for="i in 3" :key="i">
                <div class="team-info">
                  <h4>队伍名称 {{ i }}</h4>
                  <p>目的地：武隆仙女山</p>
                  <p>队长：用户{{ i }}</p>
                  <p>日期：2026-04-10 至 2026-04-12</p>
                  <p>人数：4-6人</p>
                  <p>类型：朋友社交露营</p>
                </div>
                <button class="join-button">申请加入</button>
              </div>
            </div>
          </div>

          <!-- 发布攻略 -->
          <div v-if="activeTab === '发布攻略'" class="post-guide">
            <input type="text" placeholder="标题" class="input-field">
            <input type="text" placeholder="目的地" class="input-field">
            <textarea placeholder="内容" class="textarea-field"></textarea>
            <div class="visibility-select">
              <label>
                <input type="radio" name="visibility" value="public">
                公开
              </label>
              <label>
                <input type="radio" name="visibility" value="private">
                私密
              </label>
            </div>
            <button class="post-button">发布攻略</button>
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
const currentStep = ref(0)
const autonomousMode = ref(false)
const activeTab = ref('查找地点')

// 步骤定义
const steps = ['欢迎', '目的地', '出行人数', '出行日期', '出行类型', '特殊需求']

// 数据
const popularDestinations = ['武隆仙女山', '南川金佛山', '江津四面山', '渝北玉峰山', '璧山秀湖']
const groupSizes = ['1人', '2-3人', '4-6人', '7人及以上']
const tripTypes = ['亲子露营', '自驾游摄影', '企业团建', '朋友社交露营', '独自出行']
const activities = ['徒步', '摄影', '烧烤', '观星', '钓鱼']
const autonomousTabs = ['查找地点', '查找队伍', '发布攻略']

// 用户输入
const destination = ref('')
const customDestination = ref('')
const groupSize = ref('')
const startDate = ref('')
const endDate = ref('')
const tripType = ref('')
const needs = ref({
  equipment: false,
  facilities: false,
  other: ''
})
const selectedActivities = ref([])

// 生成的攻略
const generatedRoute = ref('重庆市区 → 渝湘高速 → 仙女山，全程约2.5小时，沿途有多个服务区。')
const generatedEquipment = ref('帐篷、睡袋、防潮垫、登山鞋、背包、水壶、手电筒、急救包')
const generatedSupplies = ref('仙女山镇有超市和餐厅，可补充物资。')
const generatedNotes = ref('注意天气变化，携带雨具；山区温差大，带足保暖衣物；遵守景区规定，爱护环境。')

// 热门推荐路线
const popularRoutes = ref([
  {
    id: 1,
    title: '武隆仙女山秘境露营',
    image: '/src/assets/仙女山-天生三桥环线.png',
    features: ['天生三桥', '露营基地'],
    tags: ['星空草坪', '亲子友好']
  },
  {
    id: 2,
    title: '南川山王坪喀斯特自驾',
    image: '/src/assets/南川178环线.png',
    features: ['山王坪', '风吹岭'],
    tags: ['绝美水杉', '摄影天堂']
  },
  {
    id: 3,
    title: '江津四面山瀑布露营',
    image: '/src/assets/濯水古镇-蒲花暗河环线.png',
    features: ['望乡台', '土地岩'],
    tags: ['清凉瀑布', '天然氧吧']
  }
])

// 计算当前问题
const currentQuestion = computed(() => {
  switch (currentStep.value) {
    case 1:
      return '你想去哪里露营或徒步？'
    case 2:
      return '你们一共有多少人出行？'
    case 3:
      return '计划什么时候出发和返程？'
    case 4:
      return '这次出行的类型是什么？'
    case 5:
      return '有什么特殊需求吗？'
    default:
      return ''
  }
})

// 方法
const goBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  } else {
    router.push({ name: 'home' })
  }
}

const switchToAutonomousMode = () => {
  autonomousMode.value = true
  currentStep.value = 0
}

const startAssistantMode = () => {
  autonomousMode.value = false
  currentStep.value = 1
}

const nextStep = () => {
  if (currentStep.value < 5) {
    currentStep.value++
  } else if (currentStep.value === 5) {
    currentStep.value = 6
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const selectDestination = (dest) => {
  destination.value = dest
  nextStep()
}

const confirmCustomDestination = () => {
  if (customDestination.value) {
    destination.value = customDestination.value
    nextStep()
  }
}

const selectGroupSize = (size) => {
  groupSize.value = size
  nextStep()
}

const selectTripType = (type) => {
  tripType.value = type
  nextStep()
}

const toggleActivity = (activity) => {
  const index = selectedActivities.value.indexOf(activity)
  if (index > -1) {
    selectedActivities.value.splice(index, 1)
  } else {
    selectedActivities.value.push(activity)
  }
}

// 一键组队功能
const handleOneClickTeam = () => {
  // 导入dataStore
  import('../composables/useDataStore.js').then(({ default: useDataStore }) => {
    const dataStore = useDataStore()
    
    // 准备组队信息
    const teamInfo = {
      destination: destination.value,
      groupSize: groupSize.value,
      startDate: startDate.value,
      endDate: endDate.value,
      tripType: tripType.value,
      activities: selectedActivities.value,
      needs: needs.value
    }
    
    // 添加组队信息到全局存储
    dataStore.addTeam(teamInfo)
    console.log('发布用户组队信息成功:', teamInfo)
    
    // 跳转到组队大厅
    router.push({ name: 'team' })
  })
}
</script>

<style scoped>
.ai-assistant-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.top-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.control-button {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #4CAF50;
  font-size: 14px;
  cursor: pointer;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}



/* 欢迎界面 */
.welcome-section {
  text-align: center;
}

.welcome-header {
  margin-bottom: 40px;
}

.app-name {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(90deg, #4CAF50, #2196F3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.app-description {
  font-size: 16px;
  color: #666;
}

.mode-selection {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 0 20px;
  flex-wrap: nowrap;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.mode-button {
  flex: 1;
  min-width: 160px;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  box-sizing: border-box;
  height: 200px;
  justify-content: center;
}

.mode-button h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  word-break: keep-all;
}

.mode-button p {
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
  opacity: 0.9;
  word-break: keep-all;
}

.assistant-mode {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.autonomous-mode {
  background: white;
  color: #333;
  border: 1px solid #ddd;
}

.mode-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assistant-image {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.mode-icon i {
  font-size: 30px;
}

.mode-button h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.mode-button p {
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
  opacity: 0.9;
}

/* 热门推荐路线 */
.popular-routes {
  margin-top: 30px;
  padding: 0 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-header h3 i {
  color: #ff9800;
}

.see-more {
  font-size: 12px;
  color: #4CAF50;
  text-decoration: none;
  transition: color 0.2s ease;
}

.see-more:hover {
  color: #45a049;
}

.routes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.route-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  transition: transform 0.2s ease;
}

.route-card:hover {
  transform: translateY(-2px);
}

.route-image {
  height: 100px;
  background-size: cover;
  background-position: center;
}

.route-content {
  padding: 12px;
}

.route-content h4 {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.route-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.feature {
  font-size: 10px;
  color: #3b82f6;
  display: flex;
  align-items: center;
  gap: 3px;
  background: #f0f9ff;
  padding: 1px 6px;
  border-radius: 6px;
}

.route-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 10px;
  color: #22c55e;
  background: #f0fdf4;
  padding: 1px 6px;
  border-radius: 6px;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
  transition: all 0.3s ease;
}

.step-dot.active {
  width: 24px;
  border-radius: 4px;
  background: #4CAF50;
}

/* 对话气泡 */
.conversation-container {
  margin: 30px 0;
}

.assistant-message {
  display: flex;
  align-items: flex-start;
}

.assistant-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.message-bubble {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.message-text {
  font-size: 16px;
  margin-bottom: 16px;
  color: #333;
}

/* 选项容器 */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-button {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-button:hover {
  background: #f5f5f5;
}

/* 自定义输入 */
.custom-input {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.input-field {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.confirm-button {
  padding: 0 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* 日期选择 */
.date-selection {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.date-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-input label {
  font-size: 14px;
  color: #666;
}

/* 特殊需求 */
.special-needs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.need-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.need-item label {
  font-size: 14px;
  color: #333;
}

.activity-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.activity-button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 16px;
  background: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.activity-button.selected {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.textarea-field {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  min-height: 80px;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.action-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button {
  background: #f0f0f0;
  color: #333;
}

.next-button {
  background: #4CAF50;
  color: white;
}

/* 攻略结果 */
.guide-result {
  margin-top: 20px;
}

.result-header {
  text-align: center;
  margin-bottom: 20px;
}

.result-header h2 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.guide-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.guide-section {
  margin-bottom: 16px;
}

.guide-section h3 {
  font-size: 16px;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 8px;
}

.guide-section p {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}

.result-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.result-button {
  padding: 12px 8px;
  border: 1px solid #4CAF50;
  border-radius: 8px;
  background: white;
  color: #4CAF50;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  word-break: keep-all;
  text-align: center;
  line-height: 1.4;
}

.result-button:hover {
  background: #4CAF50;
  color: white;
}

/* 自主模式 */
.autonomous-mode-content {
  margin-top: 20px;
}

.autonomous-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.autonomous-header h2 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.call-assistant-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.tab-navigation {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

.tab-button {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.tab-button.active {
  color: #4CAF50;
  font-weight: 500;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #4CAF50;
}

/* 查找地点 */
.search-locations {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filters {
  display: flex;
  gap: 10px;
}

.filter-select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.search-input {
  display: flex;
  gap: 10px;
}

.search-button {
  padding: 0 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.location-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.location-item {
  display: flex;
  gap: 12px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.location-image {
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  border-radius: 8px;
  flex-shrink: 0;
}

.location-info {
  flex: 1;
}

.location-info h4 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.location-info p {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

/* 查找队伍 */
.search-teams {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.team-info h4 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.team-info p {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.join-button {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  flex-shrink: 0;
}

/* 发布攻略 */
.post-guide {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.visibility-select {
  display: flex;
  gap: 20px;
}

.visibility-select label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #333;
}

.post-button {
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mode-selection {
    align-items: center;
  }
  
  .mode-button {
    min-width: 140px;
    max-width: 200px;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .result-actions {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>