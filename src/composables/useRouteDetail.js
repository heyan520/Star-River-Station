// src/composables/useRouteDetail.js
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { apiService } from '../services/apiService.js';
import { injectDataStore } from './useDataStore.js';

export const useRouteDetail = () => {
  const route = useRoute();
  const store = injectDataStore();
  const routeDetail = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  // 计算是否已收藏
  const isFavorited = computed(() => {
    return store.state.favorites.routes.has(String(route.query.id));
  });
  
  // 加载路线数据
  const loadRoute = async () => {
    const id = route.query.id;
    if (!id) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      const data = await apiService.getRouteDetail(id);
      routeDetail.value = data;
      store.setSelectedRoute(id);
    } catch (err) {
      error.value = '加载路线信息失败';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  
  // 切换收藏状态
  const toggleFavorite = async () => {
    if (!routeDetail.value) return;
    
    // 确保使用字符串类型的id，与isFavorited计算属性保持一致
    const idStr = String(routeDetail.value.id);
    
    // 先获取当前收藏状态
    const currentFavorited = isFavorited.value;
    // 切换收藏状态
    store.toggleRouteFavorite(idStr);
    
    try {
      // 使用切换后的收藏状态调用API
      await apiService.updateFavorite('route', idStr, !currentFavorited);
    } catch (err) {
      // API调用失败，恢复原状态
      store.toggleRouteFavorite(idStr);
      console.error('更新收藏状态失败', err);
    }
  };
  
  // 监听路由参数变化
  watch(() => route.query.id, loadRoute, { immediate: true });
  
  return {
    routeDetail,
    loading,
    error,
    isFavorited,
    toggleFavorite,
    loadRoute
  };
};