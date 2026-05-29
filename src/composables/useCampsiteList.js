import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { injectDataStore } from './useDataStore.js';
import { campsiteService } from '../services/dataService.js';

export function useCampsiteList() {
  const router = useRouter();
  const dataStore = injectDataStore();
  
  // 状态管理
  const loading = ref(false);
  const error = ref(null);
  const campsites = ref([]);
  const map = ref(null); // 移除mapLoading状态，与路线列表保持一致
  
  // 筛选条件
  const selectedType = ref('');
  const selectedArea = ref('');
  const selectedLevel = ref('');
  
  // 下拉框状态
  const showTypeDropdown = ref(false);
  const showAreaDropdown = ref(false);
  const showLevelDropdown = ref(false);
  
  // 计算属性：过滤后的露营地列表
  const filteredCampsites = computed(() => {
    let filtered = campsites.value;
    
    if (selectedType.value && selectedType.value !== '全部') {
      filtered = filtered.filter(campsite => campsite.type === selectedType.value);
    }
    
    if (selectedArea.value && selectedArea.value !== '全部') {
      filtered = filtered.filter(campsite => campsite.area === selectedArea.value);
    }
    
    if (selectedLevel.value && selectedLevel.value !== '全部') {
      filtered = filtered.filter(campsite => campsite.level === selectedLevel.value);
    }
    
    return filtered;
  });

  // 后续会实现updateMapMarkers函数
  
  // 加载露营地数据
  const loadCampsites = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await campsiteService.getAll();
      campsites.value = data;
      // 数据加载完成后，地图会在初始化完成时自动更新标记
      // 不需要在这里调用updateMapMarkers，避免在地图初始化前调用
    } catch (err) {
      console.error('加载露营地数据失败:', err);
      error.value = '加载数据失败，请稍后重试';
    } finally {
      loading.value = false;
    }
  };

  // 移除模拟地图功能，仅使用高德地图

  // 已移除模拟地图功能

  // 加载高德地图API - 与路线列表保持完全一致
  function loadAmapScript() {
    return new Promise((resolve, reject) => {
      if (window.AMap) {
        resolve(window.AMap);
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://webapi.amap.com/maps?v=2.0&key=dfd36d667109b8826702b8b69ca42af3';
      script.onerror = reject;
      script.onload = () => resolve(window.AMap);
      document.head.appendChild(script);
    });
  }

  // 初始化地图 - 与路线列表保持一致的实现
  const initMap = () => {
    // 检查是否已有地图实例
    if (map.value) {
      console.log('地图实例已存在，无需重新初始化');
      return;
    }

    const mapContainer = document.getElementById('campsite-map-container');
    if (!mapContainer) {
      console.error('地图容器不存在');
      return;
    }

    try {
      // 调试信息
      console.log('开始初始化地图，容器尺寸:', mapContainer.offsetWidth, 'x', mapContainer.offsetHeight);
      
      // 创建地图实例，使用与路线列表相似的配置
      map.value = new window.AMap.Map(mapContainer, {
        zoom: 2.5,
        center: [110.0, 37.0],
        resizeEnable: true,
        features: ['road', 'point']
      });
      
      console.log('地图实例创建成功:', map.value);

      // 添加地图控件，与路线列表保持一致
      window.AMap.plugin(
        [
          "AMap.ToolBar",
          "AMap.Geolocation"
        ],
        () => {
          console.log('地图插件加载成功');
          
          map.value.addControl(new window.AMap.ToolBar({
            position: 'RT'
          }));

          map.value.addControl(new window.AMap.Geolocation({
            position: 'RB',
            showButton: true,
            panToLocation: true
          }));
        }
      );

      // 延迟更新地图标记，确保地图完全初始化
      setTimeout(() => {
        console.log('开始更新地图标记，过滤后的露营地数量:', filteredCampsites.value.length);
        updateMapMarkers();
        
        // 强制地图重新渲染
        if (map.value) {
          map.value.setZoom(map.value.getZoom());
          console.log('地图已刷新');
        }
      }, 300);
    } catch (err) {
      console.error('高德地图初始化失败:', err);
      if (map.value) {
        try {
          map.value.destroy();
        } catch (destroyError) {
          console.warn('销毁地图实例时出错:', destroyError);
        }
        map.value = null;
      }
    }
  };

  // 更新地图标记 - 使用position字段替代coordinates
  const updateMapMarkers = () => {
    if (!map.value) {
      console.log('地图实例不存在，无法更新标记');
      return;
    }

    // 移除现有的标记
    const existingMarkers = map.value.getAllOverlays('marker');
    console.log('移除现有标记数量:', existingMarkers.length);
    map.value.remove(existingMarkers);

    // 为每个露营地创建标记 - 确保position是有效的坐标数组
    console.log('当前过滤后的露营地数据:', filteredCampsites.value);
    
    const validCampsites = filteredCampsites.value.filter(campsite => {
      const isValid = campsite.position && Array.isArray(campsite.position) && campsite.position.length >= 2;
      if (!isValid) {
        console.log('无效的露营地位置数据:', campsite);
      }
      return isValid;
    });
    
    console.log('有效位置的露营地数量:', validCampsites.length);
    
    const markers = validCampsites.map(campsite => {
      console.log('为露营地创建标记:', campsite.title, '坐标:', campsite.position);
      return new window.AMap.Marker({
        position: campsite.position,
        title: campsite.title || campsite.name,
        content: `<div style="width:25px;height:25px;border-radius:50%;background-color:#4285f4;color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;">${(campsite.title || campsite.name) ? (campsite.title || campsite.name).charAt(0) : '?'}</div>`
      });
    });

    // 添加标记到地图
    if (markers.length > 0) {
      console.log('添加标记到地图，标记数量:', markers.length);
      map.value.add(markers);
      // 调整地图视野以显示所有标记
      map.value.setFitView(markers, true, [20, 20, 20, 20]);
      console.log('地图视野已调整');
    } else {
      console.log('没有创建任何标记');
      // 如果没有标记，重置地图中心和缩放级别
      map.value.setZoomAndCenter(2.5, [110.0, 37.0]);
    }
  };

  // 移除更新地图标记功能

  // 状态管理中移除userMarker相关内容
  // 移除了缩放控制和定位功能，只保留地图基本展示

  // 切换类型筛选下拉框
  const toggleTypeFilter = () => {
    showTypeDropdown.value = !showTypeDropdown.value;
    showAreaDropdown.value = false;
    showLevelDropdown.value = false;
  };
  
  const toggleAreaFilter = () => {
    showAreaDropdown.value = !showAreaDropdown.value;
    showTypeDropdown.value = false;
    showLevelDropdown.value = false;
  };
  
  const toggleLevelFilter = () => {
    showLevelDropdown.value = !showLevelDropdown.value;
    showTypeDropdown.value = false;
    showAreaDropdown.value = false;
  };
  
  const selectType = (type) => {
    selectedType.value = type;
    closeAllDropdowns();
    // 筛选条件变化时更新地图标记
    updateMapMarkers();
  };
  
  const selectArea = (area) => {
    selectedArea.value = area;
    closeAllDropdowns();
    // 筛选条件变化时更新地图标记
    updateMapMarkers();
  };
  
  const selectLevel = (level) => {
    selectedLevel.value = level;
    closeAllDropdowns();
    // 筛选条件变化时更新地图标记
    updateMapMarkers();
  };
  
  const closeAllDropdowns = () => {
    showTypeDropdown.value = false;
    showAreaDropdown.value = false;
    showLevelDropdown.value = false;
  };

  // 搜索功能
  const handleSearch = (query) => {
    console.log('搜索:', query);
  };

  // 清除所有筛选条件
  const clearFilters = () => {
    selectedType.value = '';
    selectedArea.value = '';
    selectedLevel.value = '';
    // 筛选条件清除时更新地图标记
    updateMapMarkers();
  };
  
  // 返回上一页
  const goBack = () => {
    router.back();
  };
  
  // 查看露营地详情
  const viewCampsiteDetail = (campsite) => {
    dataStore.setSelectedCampsite(campsite.id);
    router.push({ name: 'campsite-detail', query: { id: campsite.id } });
  };

  // 设置监听器
  const setupWatchers = () => {
    // 可以在这里添加其他监听器
  };

  // 生命周期钩子
  onMounted(() => {
    // 滚动到页面顶部
    window.scrollTo(0, 0);
    
    // 设置监听
    setupWatchers();
    
    // 数据加载应由组件控制，避免重复加载
    // 地图初始化应由组件通过loadAmapScript后调用initMap，避免重复初始化
  });
  
  onUnmounted(() => {
    // 清理地图实例
    if (map.value) {
      try {
        if (typeof map.value.destroy === 'function') {
          map.value.destroy();
        }
      } catch (err) {
        console.warn('清理地图实例时出错:', err);
      } finally {
        map.value = null;
      }
    }
    
    // 清理数据引用
    campsites.value = [];
  });
  
  return {
    // 状态
    loading,
    error,
    campsites,
    map,
    filteredCampsites,
    
    // 筛选状态
    selectedType,
    selectedArea,
    selectedLevel,
    showTypeDropdown,
    showAreaDropdown,
    showLevelDropdown,
    
    // 方法
    loadCampsites,
    toggleTypeFilter,
    toggleAreaFilter,
    toggleLevelFilter,
    selectType,
    selectArea,
    selectLevel,
    closeAllDropdowns,
    clearFilters,
    viewCampsiteDetail,
    handleSearch,
    goBack,
    // 地图相关方法
    initMap,
    updateMapMarkers,
    loadAmapScript
  };
}