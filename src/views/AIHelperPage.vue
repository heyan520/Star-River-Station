<template>
  <div class="p-5 h-full overflow-y-auto relative" id="appContainer">
    <!-- 首页模式 -->
    <div v-if="currentMode === 'home'" class="flex flex-col gap-5 animate-fadeIn">
      <div class="text-center mt-2">
        <div class="flex justify-center items-center gap-2 mb-1">
          <i class="fas fa-mountain-sun text-emerald-500 text-2xl"></i>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-500 bg-clip-text text-transparent">重庆户外攻略</h1>
        </div>
        <p class="text-gray-500 text-xs tracking-wide">快速规划你的户外行程，两种模式任选</p>
      </div>
      
      <!-- AI小助手头部 -->
      <div class="relative">
        <div class="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center gap-4">
            <img src="d:\桌面\星河驿站\AI小助手.png" alt="AI助手" class="w-16 h-16 object-contain">
            <div>
              <h3 class="font-bold text-lg">户外小助手</h3>
              <p class="text-sm text-white/80">为你提供个性化的户外行程规划</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4 mt-2">
        <button id="assistantBtn" class="bg-gradient-to-br from-emerald-400 to-teal-500 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all btn-tap" @click="startAssistant">
          <div class="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
            <i class="fas fa-robot text-white text-2xl"></i>
          </div>
          <div class="text-white font-bold text-base">需要小助手</div>
          <p class="text-white/80 text-[11px] mt-1">一步一步引导，快速生成专属攻略</p>
        </button>
        <button id="selfBtn" class="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all btn-tap" @click="goToTeam">
          <div class="w-12 h-12 mx-auto mb-2 rounded-full bg-emerald-50 flex items-center justify-center">
            <i class="fas fa-users text-emerald-600 text-2xl"></i>
          </div>
          <div class="text-gray-800 font-bold text-base">不需要助手</div>
          <p class="text-gray-500 text-[11px] mt-1">直接前往社交组队</p>
        </button>
      </div>
      <div class="mt-2">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-gray-700"><i class="fas fa-fire-flame-curved text-orange-400 mr-1"></i>热门推荐路线</span>
          <span class="text-xs text-emerald-500">查看更多 <i class="fas fa-chevron-right text-[10px]"></i></span>
        </div>
        <div class="flex flex-col gap-3">
          <div v-for="guide in hotGuides" :key="guide.id" class="bg-white rounded-xl shadow-sm overflow-hidden flex border border-gray-100 card-hover cursor-pointer" @click="showGuideDetail(guide)">
            <img :src="guide.img" class="w-20 h-20 object-cover" alt="thumbnail">
            <div class="flex-1 p-2">
              <h4 class="font-bold text-sm text-gray-800">{{ guide.name }}</h4>
              <p class="text-emerald-600 text-[10px] flex items-center gap-1"><i class="fas fa-location-dot"></i>{{ guide.route }}</p>
              <p class="text-gray-500 text-[10px] mt-0.5">✨ {{ guide.highlight }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 小助手模式 -->
    <div v-else-if="currentMode === 'assistant'">
      <!-- 生成结果 -->
      <div v-if="generatedGuide" class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <button id="backToHome" class="text-gray-500 text-sm flex items-center gap-1" @click="backToHome"><i class="fas fa-arrow-left"></i> 返回首页</button>
          <button id="switchSelf" class="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-sm font-medium btn-tap" @click="switchToSelf"><i class="fas fa-exchange-alt mr-1"></i> 自主模式</button>
        </div>
        <div class="bg-white rounded-3xl p-5 shadow-xl border border-emerald-100 animate-result">
          <div class="flex items-center gap-3 border-b border-emerald-100 pb-3 mb-4">
            <div class="bg-emerald-100 w-10 h-10 rounded-full flex items-center justify-center"><i class="fas fa-hand-sparkles text-emerald-500 text-xl"></i></div>
            <div><h3 class="font-bold text-gray-800 text-lg">你的专属攻略</h3><p class="text-xs text-gray-400">基于你的需求量身定制</p></div>
          </div>
          <div class="space-y-4 text-sm">
            <div class="flex gap-2"><i class="fas fa-location-dot text-emerald-500 mt-1"></i><div><span class="font-semibold">推荐目的地：</span>{{ generatedGuide.dest }}<span class="text-gray-500 text-xs ml-1">✨ {{ generatedGuide.highlight }}</span></div></div>
            <div class="flex gap-2"><i class="fas fa-road text-emerald-500 mt-1"></i><div><span class="font-semibold">适配路线：</span>{{ generatedGuide.route }}</div></div>
            <div class="flex gap-2"><i class="fas fa-backpack text-emerald-500 mt-1"></i><div><span class="font-semibold">必备装备：</span>{{ generatedGuide.equip }}</div></div>
            <div class="flex gap-2"><i class="fas fa-store text-emerald-500 mt-1"></i><div><span class="font-semibold">周边补给：</span>{{ generatedGuide.supply }}</div></div>
            <div class="flex gap-2"><i class="fas fa-triangle-exclamation text-emerald-500 mt-1"></i><div><span class="font-semibold">注意事项：</span>{{ generatedGuide.tips }}</div></div>
          </div>
          <div class="grid grid-cols-2 gap-3 mt-6">
            <button id="improveGuide" class="bg-emerald-50 text-emerald-700 py-2.5 rounded-xl font-medium btn-tap" @click="improveGuide"><i class="fas fa-pen"></i> 完善攻略</button>
            <button id="teamUpBtn" class="bg-blue-50 text-blue-700 py-2.5 rounded-xl font-medium btn-tap" @click="teamUp"><i class="fas fa-users"></i> 一键组队</button>
            <button id="saveGuideBtn" class="bg-gray-50 text-gray-700 py-2.5 rounded-xl btn-tap" @click="saveGuide"><i class="fas fa-bookmark"></i> 保存攻略</button>
            <button id="shareGuideBtn" class="bg-purple-50 text-purple-700 py-2.5 rounded-xl btn-tap" @click="shareGuide"><i class="fas fa-share-alt"></i> 分享攻略</button>
          </div>
        </div>
      </div>

      <!-- 步骤引导 -->
      <div v-else>
        <div class="flex justify-between items-center mb-3">
          <button id="exitAssistant" class="text-gray-500 text-sm flex items-center gap-1" @click="backToHome"><i class="fas fa-times-circle"></i> 退出</button>
          <button id="toSelfFromAsst" class="text-emerald-600 text-sm font-medium bg-emerald-50 px-3 py-1.5 rounded-full" @click="switchToSelf"><i class="fas fa-hand-peace"></i> 自主模式</button>
        </div>
        <div class="step-indicator">
          <div v-for="(step, index) in steps" :key="index" class="step-dot" :class="{ active: index === assistantStep }"></div>
        </div>
        <div class="bg-white rounded-3xl p-5 shadow-lg border border-emerald-100 mb-6">
          <div class="flex flex-col">
            <p class="text-gray-800 font-semibold text-base mb-2">{{ currentStep.title }}</p>
            <p v-if="currentStep.hint" class="text-gray-400 text-xs mb-3">{{ currentStep.hint }}</p>
            <span v-if="currentStep.optional" class="inline-block text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 mb-3">可选</span>
            <div id="stepInputArea">
              <!-- 选项类型 -->
              <div v-if="currentStep.type === 'options'" class="flex flex-wrap gap-2 mb-3">
                <button 
                  v-for="opt in currentStep.options" 
                  :key="opt" 
                  :data-opt="opt" 
                  class="choice-option text-sm" 
                  :class="{ selected: assistantAnswers[currentStep.key] === opt }"
                  @click="selectOption(opt)"
                >
                  {{ opt }}
                </button>
              </div>
              <!-- 自定义目的地输入 -->
              <input 
                v-if="currentStep.custom && currentStep.key === 'destination'" 
                id="customDest" 
                type="text" 
                placeholder="或输入具体地点名称" 
                class="modern-input text-sm mb-3"
                v-model="customDestination"
                @input="updateCustomDestination"
              >
              <!-- 日期类型 -->
              <div v-if="currentStep.type === 'date'" class="flex gap-3 mb-3">
                <div class="flex-1">
                  <label class="text-xs text-gray-500">出发日期</label>
                  <input 
                    type="date" 
                    id="startDate" 
                    class="modern-input text-sm"
                    v-model="assistantAnswers.dateRange.start"
                  >
                </div>
                <div class="flex-1">
                  <label class="text-xs text-gray-500">返程日期</label>
                  <input 
                    type="date" 
                    id="endDate" 
                    class="modern-input text-sm"
                    v-model="assistantAnswers.dateRange.end"
                  >
                </div>
              </div>
              <p v-if="currentStep.type === 'date'" class="text-xs text-gray-400 mb-3">{{ currentStep.hint }}</p>
              <!-- 文本区域类型 -->
              <textarea 
                v-if="currentStep.type === 'textarea'" 
                id="specialReq" 
                rows="3" 
                :placeholder="currentStep.placeholder" 
                class="modern-input rounded-2xl mb-3"
                v-model="assistantAnswers.special"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center mt-2">
          <button 
            v-if="assistantStep > 0" 
            id="prevStep" 
            class="text-gray-500 bg-gray-100 px-5 py-2.5 rounded-full text-sm font-medium btn-tap"
            @click="prevStep"
          >
            <i class="fas fa-chevron-left mr-1"></i> 上一步
          </button>
          <div v-else></div>
          <button 
            id="nextStep" 
            class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-full shadow-md btn-tap font-medium"
            @click="nextStep"
          >
            {{ isLastStep ? '✨ 生成攻略基本点' : '下一步 →' }}
          </button>
        </div>
        <p class="text-center text-[11px] text-gray-400 mt-6"><i class="fas fa-memory"></i> 小助手会记忆常用选项，让规划更轻松</p>
      </div>
    </div>

    <!-- 自主模式 -->
    <div v-else-if="currentMode === 'self'">
      <div class="flex justify-between items-center mb-3">
        <h2 class="font-bold text-gray-800"><i class="fas fa-compass text-emerald-500 mr-1"></i>自主操作</h2>
        <button id="callAssistant" class="bg-emerald-100 px-3 py-1.5 rounded-full text-emerald-700 text-xs font-medium btn-tap" @click="startAssistant"><i class="fas fa-robot"></i> 呼叫小助手</button>
      </div>
      <div class="flex border-b border-gray-200 gap-4 mb-3">
        <button 
          id="tabSpots" 
          class="pb-2 text-sm font-medium"
          :class="{ 'text-emerald-600 border-b-2 border-emerald-500': activeTab === 'spots' }"
          @click="switchTab('spots')"
        >
          📍 查找地点
        </button>
        <button 
          id="tabTeams" 
          class="pb-2 text-sm"
          :class="{ 'text-emerald-600 border-b-2 border-emerald-500': activeTab === 'teams' }"
          @click="switchTab('teams')"
        >
          👥 查找队伍
        </button>
        <button 
          id="tabPublish" 
          class="pb-2 text-sm"
          :class="{ 'text-emerald-600 border-b-2 border-emerald-500': activeTab === 'publish' }"
          @click="switchTab('publish')"
        >
          ✏️ 发布攻略
        </button>
      </div>
      
      <!-- 查找地点 -->
      <div v-if="activeTab === 'spots'" class="min-h-[500px]">
        <div class="bg-white rounded-xl p-3 shadow-sm mb-3 flex flex-wrap gap-2 items-center">
          <select id="regionFilter" class="border rounded-full px-3 py-1 text-sm bg-gray-50" v-model="regionFilter">
            <option value="">全部区域</option>
            <option>武隆</option>
            <option>南川</option>
            <option>巴南</option>
            <option>綦江</option>
          </select>
          <select id="typeFilter" class="border rounded-full px-3 py-1 text-sm bg-gray-50" v-model="typeFilter">
            <option value="">全部类型</option>
            <option>亲子露营</option>
            <option>自驾游摄影</option>
            <option>朋友社交</option>
            <option>企业团建</option>
          </select>
          <select id="diffFilter" class="border rounded-full px-3 py-1 text-sm bg-gray-50" v-model="diffFilter">
            <option value="">难度</option>
            <option>简单</option>
            <option>中等</option>
          </select>
          <input id="searchInput" placeholder="搜索地点..." class="flex-1 border rounded-full px-3 py-1 text-sm min-w-[120px]" v-model="searchKeyword">
        </div>
        <div id="spotsList" class="space-y-3">
          <div v-if="filteredSpots.length === 0" class="text-center text-gray-400 py-6">暂无匹配地点</div>
          <div 
            v-for="spot in filteredSpots" 
            :key="spot.id" 
            class="bg-gray-50 rounded-xl p-3 flex gap-3 shadow-sm card-hover cursor-pointer"
            @click="showSpotDetail(spot)"
          >
            <img :src="spot.img" class="w-16 h-16 rounded-lg object-cover" />
            <div class="flex-1">
              <h4 class="font-bold">{{ spot.name }}</h4>
              <div class="flex text-[11px] text-gray-500 gap-2 mt-1">
                <span>{{ spot.region }}</span>
                <span>⭐ {{ spot.difficulty }}</span>
                <span v-if="spot.has3d" class="text-purple-500"><i class="fas fa-cube"></i> 3D全景</span>
              </div>
              <p class="text-xs mt-1">{{ spot.desc.slice(0, 40) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 查找队伍 -->
      <div v-else-if="activeTab === 'teams'" class="space-y-3">
        <div v-for="team in teamsData" :key="team.id" class="bg-white rounded-xl p-3 shadow-sm flex justify-between items-center">
          <div>
            <div class="font-bold">{{ team.dest }}</div>
            <div class="text-xs text-gray-500">队长: {{ team.leader }} · {{ team.date }} · {{ team.members }}/{{ team.total }}人 · {{ team.type }}</div>
          </div>
          <button class="applyTeamBtn bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs" @click="applyTeam(team)">申请加入</button>
        </div>
      </div>

      <!-- 发布攻略 -->
      <div v-else-if="activeTab === 'publish'">
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <div class="font-bold mb-3">📝 发布你的攻略</div>
          <input id="pubTitle" placeholder="标题" class="border rounded-xl p-2 w-full mb-2 text-sm" v-model="pubTitle" />
          <input id="pubDest" placeholder="目的地" class="border rounded-xl p-2 w-full mb-2 text-sm" v-model="pubDest" />
          <textarea id="pubContent" placeholder="详细行程/装备建议/注意事项..." rows="4" class="border rounded-xl p-2 w-full text-sm" v-model="pubContent"></textarea>
          <div class="flex gap-2 mt-3">
            <button id="submitPublish" class="bg-emerald-500 text-white py-2 px-5 rounded-full text-sm" @click="submitPublish">发布攻略</button>
            <select id="pubVisible" class="border rounded-full px-3 text-sm" v-model="pubVisible">
              <option>公开</option>
              <option>仅好友</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 全局状态
const currentMode = ref('home')
const assistantStep = ref(0)
const customDestination = ref('')
const activeTab = ref('spots')

// 表单数据
const regionFilter = ref('')
const typeFilter = ref('')
const diffFilter = ref('')
const searchKeyword = ref('')
const pubTitle = ref('')
const pubDest = ref('')
const pubContent = ref('')
const pubVisible = ref('公开')

// 助手答案
const assistantAnswers = ref({
  destination: '',
  people: '',
  dateRange: { start: '', end: '' },
  travelType: '',
  special: ''
})

const generatedGuide = ref(null)

// MOCK数据
const hotGuides = ref([
  { id: 1, name: '武隆仙女山秘境露营', highlight: '星空草坪·亲子友好', img: '/assets/仙女山-天生三桥环线.png', route: '天生三桥-露营基地' },
  { id: 2, name: '南川山王坪喀斯特自驾', highlight: '绝美水杉·摄影天堂', img: '/assets/南川178环线.png', route: '山王坪-风吹岭' },
  { id: 3, name: '江津四面山瀑布露营', highlight: '清凉瀑布·天然氧吧', img: '/assets/江津四屏镇花小原露营地.png', route: '望乡台-土地岩' },
  { id: 4, name: '彭水阿依河激情漂流', highlight: '漂流+露营·团建首选', img: '/assets/神龟峡环线.png', route: '阿依河-牛角寨' }
])

const spotsData = ref([
  { id: 1, name: '武隆仙女山露营地', region: '武隆', type: '亲子露营', difficulty: '简单', has3d: true, desc: '高山草原，儿童乐园，配套设施完善', img: '/assets/仙女山-天生三桥环线.png', supply: '超市/药店/卫生间', recommend: '最佳拍摄点: 仙女石' },
  { id: 2, name: '南川金佛山自驾路线', region: '南川', type: '自驾游摄影', difficulty: '中等', has3d: true, desc: '云海日出，盘山公路摄影点', img: '/assets/南川金佛山露营基地.png', supply: '补给站/民宿', recommend: '西坡索道' },
  { id: 3, name: '巴南云篆山轻露营', region: '巴南', type: '朋友社交', difficulty: '简单', has3d: false, desc: '城市周边，篝火晚会', img: '/assets/璧山秀湖汽车露营公园.png', supply: '农家乐/卫生间' },
  { id: 4, name: '綦江横山自驾营地', region: '綦江', type: '企业团建', difficulty: '简单', has3d: true, desc: '大型停车场，团建设施', img: '/assets/渝北玉峰山露营基地.png', supply: '装备租赁/超市' }
])

const teamsData = ref([
  { id: 1, leader: '山野领队老罗', dest: '武隆仙女山', date: '2025-05-10', days: 2, members: 4, total: 8, type: '亲子露营', avatar: '/assets/头像.png' },
  { id: 2, leader: '摄友阿杰', dest: '南川金佛山', date: '2025-05-12', days: 1, members: 3, total: 6, type: '自驾游摄影', avatar: '/assets/头像.png' },
  { id: 3, leader: '团建策划师', dest: '江津四面山', date: '2025-05-18', days: 2, members: 9, total: 15, type: '企业团建', avatar: '/assets/头像.png' }
])

// 步骤定义
const steps = ref([
  { key: 'destination', title: '你想去重庆哪个区域露营/自驾呀？', hint: '武隆山水亲子，南川摄影天堂', type: 'options', options: ['武隆', '南川', '江津', '彭水', '綦江', '其他地点'], custom: true },
  { key: 'people', title: '本次出行一共几个人？', type: 'options', options: ['1人', '2-3人', '4-6人', '7人及以上'] },
  { key: 'dateRange', title: '计划什么时候出发？停留几天？', type: 'date', hint: '我们会结合天气推荐最佳时段' },
  { key: 'travelType', title: '本次出行属于哪种类型？', type: 'options', options: ['亲子露营', '自驾游摄影', '企业团建', '朋友社交露营', '独自出行'], optional: true },
  { key: 'special', title: '有什么特殊需求吗？', type: 'textarea', placeholder: '例如：亲子设施、摄影点位、团建场地、紧急补给点...', optional: true }
])

// 计算属性
const currentStep = computed(() => steps.value[assistantStep.value])
const isLastStep = computed(() => assistantStep.value === steps.value.length - 1)
const filteredSpots = computed(() => {
  return spotsData.value.filter(s => 
    (!regionFilter.value || s.region === regionFilter.value) && 
    (!typeFilter.value || s.type === typeFilter.value) && 
    (!diffFilter.value || s.difficulty === diffFilter.value) && 
    (!searchKeyword.value || s.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  )
})

// 方法
const startAssistant = () => {
  currentMode.value = 'assistant'
  assistantStep.value = 0
  generatedGuide.value = null
  loadMemory()
}

const switchToSelf = () => {
  currentMode.value = 'self'
  activeTab.value = 'spots'
}

const backToHome = () => {
  currentMode.value = 'home'
}

const selectOption = (opt) => {
  assistantAnswers.value[currentStep.value.key] = opt
  if (currentStep.value.key === 'destination' || currentStep.value.key === 'people') {
    saveMemory()
  }
}

const updateCustomDestination = () => {
  if (customDestination.value) {
    assistantAnswers.value.destination = customDestination.value
    saveMemory()
  }
}

const nextStep = () => {
  if (currentStep.value.key === 'destination' && !assistantAnswers.value.destination) {
    alert('请选择或输入目的地')
    return
  }
  if (currentStep.value.key === 'people' && !assistantAnswers.value.people) {
    alert('请选择出行人数')
    return
  }
  if (currentStep.value.key === 'dateRange' && (!assistantAnswers.value.dateRange.start || !assistantAnswers.value.dateRange.end)) {
    alert('请选择完整的出行日期范围')
    return
  }
  if (isLastStep.value) {
    if (!assistantAnswers.value.destination) assistantAnswers.value.destination = '武隆仙女山'
    if (!assistantAnswers.value.people) assistantAnswers.value.people = '2-3人'
    generatedGuide.value = generateGuidePoints()
  } else {
    assistantStep.value++
  }
}

const prevStep = () => {
  if (assistantStep.value > 0) {
    assistantStep.value--
  }
}

const switchTab = (tab) => {
  activeTab.value = tab
}

const goToTeam = () => {
  router.push({ name: 'team' })
}

const generateGuidePoints = () => {
  const dest = assistantAnswers.value.destination || '武隆仙女山'
  const people = assistantAnswers.value.people || '2-3人'
  const travelType = assistantAnswers.value.travelType || '亲子露营'
  let route = ''
  if (dest.includes('武隆')) route = '天生三桥→仙女山露营基地 (车程30min，难度低)'
  else if (dest.includes('南川')) route = '金佛山北坡→药池坝露营地 (全程15km，耗时1h)'
  else route = `${dest}经典环线 (约25km，风景绝佳)`
  let equip = ''
  if (people.includes('亲子') || travelType === '亲子露营') equip = '儿童帐篷、防潮垫、驱蚊液、急救包'
  else if (travelType === '自驾游摄影') equip = '单反三脚架、车载冰箱、折叠椅'
  else equip = '轻量化帐篷、头灯、户外炉具'
  let supply = '周边超市、药店、公共卫生间'
  let tips = `注意${dest}近期天气晴朗，昼夜温差大，备好保暖衣物；提前查看路况。`
  return { dest, highlight: dest.includes('武隆') ? '山水画卷，亲子设施完善' : (dest.includes('南川')?'摄影绝佳机位众多':'自然秘境'), route, equip, supply, tips }
}

const showGuideDetail = (guide) => {
  alert(`📖 ${guide.name}\n亮点: ${guide.highlight}\n路线: ${guide.route}\n更多详情即将开放`)
}

const showSpotDetail = (spot) => {
  alert(`📍 ${spot.name}\n亮点：${spot.desc}\n配套：${spot.supply}\n${spot.has3d?'点击可查看3D实景（演示）':''}`)
  if (spot.has3d) {
    alert('🌄 3D全景模拟: 沉浸式体验')
  }
}

const applyTeam = (team) => {
  alert(`📨 已申请加入 ${team.dest} 队伍，等待队长 ${team.leader} 审核`)
}

const submitPublish = () => {
  alert('✅ 攻略发布成功！将在平台展示')
}

const improveGuide = () => {
  alert('✏️ 跳转完善页面（可添加每日行程、住宿）')
}

const teamUp = () => {
  alert(`🤝 基于${generatedGuide.value.dest}匹配队友`)
}

const saveGuide = () => {
  alert('✅ 攻略已存入个人中心')
}

const shareGuide = () => {
  alert('📤 分享给好友/平台')
}

// 本地存储
const loadMemory = () => {
  const memory = localStorage.getItem('chongqing_outdoor_memory')
  if (memory) {
    try {
      const data = JSON.parse(memory)
      if (data.destination) assistantAnswers.value.destination = data.destination
      if (data.people) assistantAnswers.value.people = data.people
    } catch (e) {}
  }
}

const saveMemory = () => {
  localStorage.setItem('chongqing_outdoor_memory', JSON.stringify({
    destination: assistantAnswers.value.destination,
    people: assistantAnswers.value.people
  }))
}

// 初始化
onMounted(() => {
  loadMemory()
})
</script>

<style scoped>


/* 隐藏滚动条 */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 胶囊按钮 */
.capsule-btn {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 32px;
  padding: 6px 12px;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

/* 卡片与按钮微交互 */
.card-hover {
  transition: all 0.2s ease;
}
.card-hover:active {
  transform: scale(0.98);
}

.btn-tap {
  transition: transform 0.1s ease, opacity 0.2s;
}

.btn-tap:active {
  transform: scale(0.96);
  opacity: 0.8;
}

/* 渐变背景 */
.gradient-bg {
  background: linear-gradient(145deg, #fafcff 0%, #f0f5fa 100%);
}

/* 用户选项样式 */
.choice-option {
  background: #f1f5f9;
  border-radius: 40px;
  padding: 10px 20px;
  transition: all 0.2s ease;
  font-weight: 500;
  cursor: pointer;
}

.choice-option:hover, .choice-option.selected {
  background: #10b981;
  color: white;
  box-shadow: 0 4px 10px rgba(16,185,129,0.2);
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e1;
  transition: all 0.2s;
}

.step-dot.active {
  background: #10b981;
  width: 24px;
  border-radius: 12px;
}

/* 输入框美化 */
.modern-input {
  border: 1px solid #e2e8f0;
  border-radius: 28px;
  padding: 12px 18px;
  width: 100%;
  transition: all 0.2s;
  background: white;
}

.modern-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
}

/* 生成结果卡片动画 */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-result {
  animation: fadeSlideUp 0.4s ease-out;
}

/* 定制滚动条隐藏但保留滚动 */
.smooth-scroll {
  scroll-behavior: smooth;
}

/* 淡入动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in;
}

/* 卡片样式 */
.card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}
</style>