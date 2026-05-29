// src/composables/useDataStore.js
import { reactive, provide, inject } from 'vue';
import { campsiteService, routeService } from '../services/dataService.js';

// 全局状态存储
const state = reactive({
  favorites: {
    campsites: new Set(),
    routes: new Set()
  },
  selectedCampsite: null,
  selectedRoute: null,
  teams: []
});

// 状态管理函数
const dataStore = {
  state,
  
  // 初始化收藏状态
  initFavorites() {
    // 从本地存储恢复收藏状态
    const savedFavorites = localStorage.getItem('outdoor-favorites');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        state.favorites.campsites = new Set(parsed.campsites || []);
        state.favorites.routes = new Set(parsed.routes || []);
      } catch (error) {
        console.error('Failed to parse saved favorites:', error);
      }
    }
  },
  
  // 保存收藏状态到本地存储
  saveFavorites() {
    localStorage.setItem('outdoor-favorites', JSON.stringify({
      campsites: Array.from(state.favorites.campsites),
      routes: Array.from(state.favorites.routes)
    }));
  },
  
  // 切换露营地收藏状态
  toggleCampsiteFavorite(id) {
    if (state.favorites.campsites.has(id)) {
      state.favorites.campsites.delete(id);
    } else {
      state.favorites.campsites.add(id);
    }
    this.saveFavorites();
    campsiteService.updateFavorite(id, state.favorites.campsites.has(id));
  },
  
  // 切换路线收藏状态
  toggleRouteFavorite(id) {
    // 统一使用字符串类型处理route id，确保与MyFavoritesPage.vue中的检查方式一致
    const stringId = String(id);
    if (state.favorites.routes.has(stringId)) {
      state.favorites.routes.delete(stringId);
    } else {
      state.favorites.routes.add(stringId);
    }
    this.saveFavorites();
    // 在调用服务时使用原始id，因为服务内部会转换为数字
    routeService.updateFavorite(id, state.favorites.routes.has(stringId));
  },
  
  // 设置当前选中的露营地
  setSelectedCampsite(id) {
    state.selectedCampsite = campsiteService.getById(id);
  },
  
  // 设置当前选中的路线
  setSelectedRoute(id) {
    state.selectedRoute = routeService.getById(id);
  },
  
  // 初始化组队信息
  initTeams() {
    // 从本地存储恢复组队信息
    const savedTeams = localStorage.getItem('outdoor-teams');
    if (savedTeams) {
      try {
        state.teams = JSON.parse(savedTeams);
      } catch (error) {
        console.error('Failed to parse saved teams:', error);
      }
    }
  },
  
  // 保存组队信息到本地存储
  saveTeams() {
    localStorage.setItem('outdoor-teams', JSON.stringify(state.teams));
  },
  
  // 添加新的组队信息
  addTeam(teamInfo) {
    const newTeam = {
      id: Date.now(),
      title: `${teamInfo.destination}${teamInfo.tripType}之旅`,
      destination: teamInfo.destination,
      date: teamInfo.startDate,
      duration: `${teamInfo.startDate} 至 ${teamInfo.endDate}`,
      cost: 0,
      currentMembers: 1,
      maxMembers: teamInfo.groupSize,
      tags: teamInfo.activities,
      description: `计划前往${teamInfo.destination}进行${teamInfo.tripType}，${teamInfo.activities.join('、')}等活动`,
      organizer: {
        name: '我',
        level: '初级领队',
        avatar: '/src/assets/头像.png'
      },
      members: [
        {
          id: 1,
          name: '我',
          avatar: '/src/assets/头像.png'
        }
      ],
      ...teamInfo
    };
    
    state.teams.unshift(newTeam);
    this.saveTeams();
    return newTeam;
  },
  
  // 获取所有组队信息
  getTeams() {
    return state.teams;
  }
};

// 提供状态管理
const useDataStore = () => {
  return dataStore;
};

// 全局提供状态
export const provideDataStore = () => {
  provide('dataStore', dataStore);
};

// 在组件中注入状态
export const injectDataStore = () => {
  const store = inject('dataStore');
  if (!store) {
    throw new Error('dataStore not provided');
  }
  return store;
};

export default useDataStore;