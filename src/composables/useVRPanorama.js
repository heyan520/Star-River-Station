// src/composables/useVRPanorama.js
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { apiService } from '../services/apiService.js';

export const useVRPanorama = () => {
  const route = useRoute();
  const vrSrc = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  // 从路由参数中获取ID、类型和景点ID，确保ID格式正确
  const id = computed(() => {
    const idValue = route.query.id;
    console.log('原始ID参数:', idValue, '类型:', typeof idValue);
    return idValue;
  });
  
  // 不再默认设置为'route'，而是检查参数是否有效
  const type = computed(() => {
    const typeValue = route.query.type;
    console.log('原始类型参数:', typeValue, '类型:', typeof typeValue);
    // 只接受'campsite'或'route'作为有效类型
    if (typeValue === 'campsite' || typeValue === 'route') {
      console.log('接受的类型参数:', typeValue);
      return typeValue;
    }
    console.warn('无效的类型参数:', typeValue, '，将尝试从数据中识别');
    return null; // 不设置默认值，稍后在加载逻辑中处理
  });
  
  // 根据传入参数确定最终类型
  const finalType = computed(() => {
    // 如果传入了有效的type参数，直接使用
    if (type.value && (type.value === 'campsite' || type.value === 'route')) {
      console.log(`[类型确定] 使用传入的type参数: ${type.value}`);
      return type.value;
    }
    
    // 否则返回null，稍后会自动检测
    console.log(`[类型确定] 未传入有效type参数，type.value=${type.value}，将进行自动检测`);
    return null;
  });
  
  const panoramaId = computed(() => route.query.panoramaId);
  
  // 自动检测类型的辅助函数 - 直接从数据源检测，避免服务层可能的问题
  const detectItemType = async (itemId) => {
    const idNum = Number(itemId);
    console.log('尝试自动检测项目类型，ID:', itemId, '(转换为数字:', idNum, ')');
    
    // 直接从数据源检测，避免经过服务层可能出现的问题
    try {
      // 先检查露营地数据源
      const { campsitesData } = await import('../data/campsitesData.js');
      const campsite = campsitesData.find(c => c.id === idNum);
      if (campsite) {
        console.log('直接从数据源检测到项目为露营地:', campsite.title);
        return { type: 'campsite', item: campsite, source: 'campsitesData' };
      }
      
      // 再检查路线数据源
      const { routesData } = await import('../data/routeData.js');
      const route = routesData.find(r => r.id === idNum);
      if (route) {
        console.log('直接从数据源检测到项目为路线:', route.title);
        return { type: 'route', item: route, source: 'routesData' };
      }
    } catch (err) {
      console.error('自动检测类型时发生错误:', err);
    }
    
    console.log('未找到ID为', idNum, '的数据');
    return { type: null, item: null, source: null };
  };

  // 加载VR全景数据的方法
  const loadVRPanorama = async () => {
    if (!id.value) {
      error.value = '未提供有效的ID';
      return;
    }
    
    // 确保ID是数字类型
    const idNum = Number(id.value);
    console.log(`[开始] 加载VR全景 - ID=${id.value} (原始值), ID=${idNum} (数字值), type=${type.value} (原始type参数)`);
    
    loading.value = true;
    error.value = null;
    vrSrc.value = null;
    
    // 关键修改：当提供了类型参数时，使用detectedType变量存储，不再依赖finalType.value
    let detectedType = null;
    let item = null;
    
    // 优先使用传入的type参数
    if (type.value === 'campsite' || type.value === 'route') {
      detectedType = type.value;
      console.log(`[关键] 使用明确传入的类型参数: ${detectedType}`);
      
      // 严格按照指定类型查找，不进行其他类型的回退
      if (detectedType === 'route') {
        console.log(`[严格查找] 尝试从routesData查找ID=${idNum}的路线`);
        const { routesData } = await import('../data/routeData.js');
        item = routesData.find(r => r.id === idNum);
        if (item) {
          console.log(`[找到] 从routesData找到路线项目: ${item.name}, vrPanorama=${item.vrPanorama}`);
        } else {
          console.log(`[未找到] 在routesData中未找到ID=${idNum}的路线`);
        }
      } else if (detectedType === 'campsite') {
        console.log(`[严格查找] 尝试从campsitesData查找ID=${idNum}的露营地`);
        const { campsitesData } = await import('../data/campsitesData.js');
        item = campsitesData.find(c => c.id === idNum);
        if (item) {
          console.log(`[找到] 从campsitesData找到露营地项目: ${item.title}, vrPanorama=${item.vrPanorama}`);
        } else {
          console.log(`[未找到] 在campsitesData中未找到ID=${idNum}的露营地`);
        }
      }
    } else {
      // 没有提供有效的类型参数，才进行自动检测
      console.log('没有提供有效的类型参数，执行自动检测');
      const detectionResult = await detectItemType(id.value);
      detectedType = detectionResult.type;
      item = detectionResult.item;
      console.log(`自动检测结果: type=${detectedType}, item=${item ? '找到' : '未找到'}`);
    }
    
    // 改进的缓存清除逻辑
    if (typeof apiService.clearCache === 'function') {
      try {
        await apiService.clearCache();
        console.log('缓存已成功清除');
      } catch (clearErr) {
        console.warn('缓存清除失败，但继续加载数据:', clearErr);
      }
    }
    
    try {
      console.log(`最终确定的类型: ${detectedType}, 找到的项目: ${item ? '是' : '否'}`);
      
      // 确保检测到类型
      if (!detectedType) {
        error.value = `无法确定ID为${id.value}的数据类型`;
        console.error(`[错误] 未检测到有效的数据类型`);
        return;
      }
      
      // 优先使用已找到的item中的VR链接
      if (item && item.vrPanorama) {
        console.log(`[优先] 使用${detectedType === 'campsite' ? '露营地' : '路线'}数据中的VR链接，来源: ${detectedType === 'campsite' ? 'campsitesData' : 'routesData'}, VR链接: ${item.vrPanorama}`);
        vrSrc.value = item.vrPanorama;
        error.value = null;
        return;
      } else if (item) {
        console.log(`[无VR链接] 找到项目但没有VR链接: ${item.name || item.title}`);
      }
      
      // 否则尝试通过API服务获取
      console.log(`[API] 尝试加载${detectedType} ID: ${id.value}的VR全景，使用API服务`);
      const link = await apiService.getVRPanoramaLink({
        id: id.value,
        type: detectedType,
        panoramaId: panoramaId.value
      });
      
      // 详细的链接有效性检查
      if (!link) {
        console.log(`[API空] API返回空链接，开始从数据源直接查找`);
        
        // 重要：如果明确指定了type参数，严格按照该类型查找，不再进行其他类型的查找
        if (type.value === 'campsite' || type.value === 'route') {
          console.log(`[严格查找] 严格按照指定类型${type.value}查找数据，不进行跨类型查找`);
          let sourceItem = null;
          
          if (type.value === 'route') {
            // 从路线详情页进入时，只从routeData查找
            console.log(`[路线查找] 指定type=route，从routesData查找ID=${idNum}`);
            const { routesData } = await import('../data/routeData.js');
            sourceItem = routesData.find(r => r.id === idNum);
            
            if (sourceItem) {
              console.log(`[找到] 成功从routesData找到路线项目: ${sourceItem.name}, vrPanorama=${sourceItem.vrPanorama}`);
              if (sourceItem.vrPanorama) {
                vrSrc.value = sourceItem.vrPanorama;
                error.value = null;
                console.log(`[使用链接] 使用routesData中的VR链接: ${sourceItem.vrPanorama}`);
                return;
              } else {
                error.value = '该路线存在但未配置VR全景链接';
                vrSrc.value = null;
                console.log('[无链接] 路线存在但无VR链接');
                return;
              }
            } else {
              error.value = `在routesData中未找到ID为${idNum}的路线`;
              vrSrc.value = null;
              console.log(`[未找到] 未找到指定路线`);
              return;
            }
          } else if (type.value === 'campsite') {
            // 严格从campsitesData查找
            console.log(`[露营地查找] 指定type=campsite，从campsitesData查找ID=${idNum}`);
            const { campsitesData } = await import('../data/campsitesData.js');
            sourceItem = campsitesData.find(c => c.id === idNum);
            
            if (sourceItem) {
              console.log(`[找到] 成功从campsitesData找到露营地项目: ${sourceItem.title}, vrPanorama=${sourceItem.vrPanorama}`);
              if (sourceItem.vrPanorama) {
                vrSrc.value = sourceItem.vrPanorama;
                error.value = null;
                return;
              } else {
                error.value = '该露营地存在但未配置VR全景链接';
                vrSrc.value = null;
                return;
              }
            } else {
              error.value = `在campsitesData中未找到ID为${idNum}的露营地`;
              vrSrc.value = null;
              return;
            }
          }
        } else {
          // 如果未指定类型，才进行全面扫描
          console.log('[全面扫描] 未指定类型，进行全面数据源扫描...');
          const { campsitesData } = await import('../data/campsitesData.js');
          const { routesData } = await import('../data/routeData.js');
          
          const allSourcesItem = 
            campsitesData.find(c => c.id === idNum) ||
            routesData.find(r => r.id === idNum);
          
          if (allSourcesItem) {
            const sourceName = allSourcesItem.id <= campsitesData.length ? 'campsitesData' : 'routesData';
            console.log(`[最终找到] 最终从${sourceName}找到项目`);
            if (allSourcesItem.vrPanorama) {
              vrSrc.value = allSourcesItem.vrPanorama;
              error.value = null;
            } else {
              error.value = '该项目存在但未配置VR全景链接';
              vrSrc.value = null;
            }
          } else {
            error.value = `未找到ID为${id.value}的数据`;
            vrSrc.value = null;
          }
        }
      } else if (typeof link !== 'string') {
        error.value = '获取到的VR链接格式错误';
        vrSrc.value = null;
        console.error(`[格式错误] 获取到的VR链接不是字符串格式`);
      } else if (!link.trim()) {
        error.value = '该项目未配置VR全景链接';
        vrSrc.value = null;
        console.log(`[空链接] 获取到的VR链接为空`);
      } else {
        console.log(`[成功] 成功加载${detectedType}的VR全景: ${link}`);
        vrSrc.value = link;
      }
    } catch (err) {
      console.error('VR全景加载错误:', err);
      error.value = `加载VR全景时发生错误: ${err.message || '未知错误'}`;
      vrSrc.value = null;
    } finally {
      loading.value = false;
    }
  };
  
  // 监听路由参数变化
  watch([id, type, panoramaId], () => {
    if (id.value) {
      console.log('路由参数变化，重新加载VR全景');
      loadVRPanorama();
    }
  }, { immediate: true });
  
  return {
    vrSrc,
    loading,
    error,
    id,
    type,
    panoramaId
  };
};