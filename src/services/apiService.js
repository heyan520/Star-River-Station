// src/services/apiService.js
import { campsiteService, routeService } from './dataService.js';

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟API调用
export const apiService = {
  // 获取所有露营地
  async getCampsites() {
    await delay(300); // 模拟网络延迟
    return campsiteService.getAll();
  },
  
  // 获取露营地详情
  async getCampsiteDetail(id) {
    await delay(200);
    return campsiteService.getById(id);
  },
  
  // 获取所有路线
  async getRoutes() {
    await delay(300);
    return routeService.getAll();
  },
  
  // 获取路线详情
  async getRouteDetail(id) {
    await delay(200);
    return routeService.getById(id);
  },
  
  // 更新收藏状态
  async updateFavorite(type, id, isFavorite) {
    await delay(100);
    if (type === 'campsite') {
      return campsiteService.updateFavorite(id, isFavorite);
    } else {
      return routeService.updateFavorite(id, isFavorite);
    }
  },
  
  // 获取VR全景链接 - 优化为直接从源数据查找
  // 现在优先使用直接导入数据源的方式，避免服务层可能的问题
  async getVRPanoramaLink({ id, type, panoramaId, ...params }) {
    try {
      console.log(`尝试获取VR全景链接，参数:`, { id, type, panoramaId });
      await delay(100);
      
      // 参数验证
      if (!id) {
        console.error('缺少必要的ID参数');
        return null;
      }
      
      const idNum = Number(id);
      if (isNaN(idNum)) {
        console.error('无效的ID参数，必须是数字:', id);
        return null;
      }
      
      // 支持类型自动检测或指定
      let item = null;
      
      if (type === 'campsite' || type === 'route') {
        // 如果指定了类型，严格从对应数据源查找，不再回退到自动检测
        console.log(`严格按照指定类型${type}查找数据`);
        const { campsitesData } = await import('../data/campsitesData.js');
        const { routesData } = await import('../data/routeData.js');
        
        if (type === 'campsite') {
          item = campsitesData.find(c => c.id === idNum);
          console.log(`在campsitesData中查找ID=${idNum}，结果: ${item ? '找到' : '未找到'}`);
        } else if (type === 'route') {
          item = routesData.find(r => r.id === idNum);
          console.log(`在routesData中查找ID=${idNum}，结果: ${item ? '找到' : '未找到'}`);
        }
        
        // 重要：不再回退到自动检测，确保严格按照指定类型查找
      } else {
        // 如果未指定类型或类型无效，进行自动检测
        console.log('未指定有效类型或类型无效，进行自动检测');
        const { campsitesData } = await import('../data/campsitesData.js');
        const { routesData } = await import('../data/routeData.js');
        
        // 首先检查露营地数据
        item = campsitesData.find(c => c.id === idNum);
        if (!item) {
          // 然后检查路线数据
          item = routesData.find(r => r.id === idNum);
        }
      }
      
      if (!item) {
        console.error(`未找到ID为${idNum}的数据`);
        return null;
      }
      
      console.log(`成功获取数据:`, item.title || item.name);
      
      // 返回VR全景链接
      if (item.vrPanorama) {
        console.log(`获取到VR全景链接:`, item.vrPanorama);
        return item.vrPanorama;
      } else {
        console.log(`未找到VR全景链接`);
        return null;
      }
    } catch (error) {
      console.error('获取VR全景链接时发生错误:', error);
      return null;
    }
  },
  
  // 增强版的VR全景链接获取函数，返回更详细的信息
  async getVRPanoramaInfo({ id, type, panoramaId }) {
    try {
      await delay(100);
      const { campsitesData } = await import('../data/campsitesData.js');
      const { routesData } = await import('../data/routeData.js');
      
      const idNum = Number(id);
      
      // 自动检测类型并获取完整项目数据
      let item = null;
      let dataType = null;
      let dataSource = null;
      
      // 先检查露营地
      item = campsitesData.find(c => c.id === idNum);
      if (item) {
        dataType = 'campsite';
        dataSource = 'campsitesData';
      }
      
      // 再检查路线
      if (!item) {
        item = routesData.find(r => r.id === idNum);
        if (item) {
          dataType = 'route';
          dataSource = 'routesData';
        }
      }
      
      if (!item) {
        return {
          success: false,
          error: `未找到ID为${idNum}的数据`,
          type: null,
          source: null,
          item: null,
          vrLink: null
        };
      }
      
      return {
        success: true,
        error: null,
        type: dataType,
        source: dataSource,
        item: item,
        vrLink: item.vrPanorama || null
      };
    } catch (error) {
      console.error('获取VR全景信息时发生错误:', error);
      return {
        success: false,
        error: '获取数据时发生错误',
        type: null,
        source: null,
        item: null,
        vrLink: null
      };
    }
  },
  
  // 清除缓存，确保获取最新数据
  async clearCache() {
    // 重置缓存Map
    import('../services/dataService.js').then(({ cache }) => {
      if (cache && typeof cache.clear === 'function') {
        cache.clear();
        console.log('缓存已清除');
      }
    }).catch(err => {
      console.error('清除缓存失败:', err);
    });
  }
};