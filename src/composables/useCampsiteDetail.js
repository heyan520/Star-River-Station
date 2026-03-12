// src/composables/useCampsiteDetail.js
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { apiService } from '../services/apiService.js';
import { injectDataStore } from './useDataStore.js';

export const useCampsiteDetail = () => {
  const route = useRoute();
  const store = injectDataStore();
  const campsite = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  // 计算是否已收藏
  const isFavorited = computed(() => {
    return store.state.favorites.campsites.has(String(route.query.id));
  });
  
  // 加载露营地数据
  const loadCampsite = async () => {
    const id = route.query.id;
    if (!id) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      const data = await apiService.getCampsiteDetail(id);
      campsite.value = data;
      store.setSelectedCampsite(id);
    } catch (err) {
      error.value = '加载露营地信息失败';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  
  // 切换收藏状态
  const toggleFavorite = async () => {
    if (!campsite.value) return;
    
    // 确保使用字符串类型的id，与isFavorited计算属性保持一致
    const idStr = String(campsite.value.id);
    
    // 先获取当前收藏状态
    const currentFavorited = isFavorited.value;
    // 切换收藏状态
    store.toggleCampsiteFavorite(idStr);
    
    try {
      // 使用切换后的收藏状态调用API
      await apiService.updateFavorite('campsite', idStr, !currentFavorited);
    } catch (err) {
      // API调用失败，恢复原状态
      store.toggleCampsiteFavorite(idStr);
      console.error('更新收藏状态失败', err);
    }
  };
  
  // 监听路由参数变化
  watch(() => route.query.id, loadCampsite, { immediate: true });
  
  return {
    campsite,
    loading,
    error,
    isFavorited,
    toggleFavorite,
    loadCampsite
  };
};