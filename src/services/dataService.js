// src/services/dataService.js
import { campsitesData } from '../data/campsitesData.js';
import { routesData } from '../data/routeData.js';

// 数据缓存 - 导出以便清除
export const cache = new Map();

// 露营地服务 - 支持从数据源直接查找和自动类型检测
export const campsiteService = {
  // 获取所有露营地
  getAll: () => {
    const key = 'campsites_all';
    if (cache.has(key)) {
      console.log('从缓存获取所有露营地');
      return cache.get(key);
    }
    
    console.log('获取所有露营地');
    const result = campsitesData;
    cache.set(key, result);
    return result;
  },
  
  // 根据ID获取露营地
  getById: (id) => {
    const idNum = Number(id);
    const key = `campsite-${idNum}`;
    
    // 总是从原始数据查找，确保获取最新数据
    const result = campsitesData.find(item => item.id === idNum);
    
    if (result) {
      // 如果找到，更新缓存
      cache.set(key, result);
      console.log(`找到ID为${idNum}的露营地:`, result.title);
      return result;
    } else {
      // 如果未找到，删除可能存在的错误缓存
      if (cache.has(key)) {
        cache.delete(key);
        console.log(`删除不存在的露营地缓存: ${key}`);
      }
      console.error(`未找到ID为${idNum}的露营地数据`);
      return null;
    }
  },
  
  updateFavorite: (id, isFavorite) => {
    const idNum = Number(id);
    const campsite = campsitesData.find(c => c.id === idNum);
    if (campsite) {
      campsite.isCollected = isFavorite;
      // 清除缓存
      cache.delete(`campsite-${idNum}`);
      console.log(`更新露营地收藏状态: ID=${idNum}, 收藏=${isFavorite}`);
    }
    return campsite;
  }
};

// 路线服务 - 支持从数据源直接查找和自动类型检测
export const routeService = {
  // 获取所有路线
  getAll: () => {
    const key = 'routes_all';
    if (cache.has(key)) {
      console.log('从缓存获取所有路线');
      return cache.get(key);
    }
    
    console.log('获取所有路线');
    const result = routesData;
    cache.set(key, result);
    return result;
  },
  
  // 根据ID获取路线
  getById: (id) => {
    const idNum = Number(id);
    const key = `route-${idNum}`;
    
    // 总是从原始数据查找，确保获取最新数据
    const result = routesData.find(item => item.id === idNum);
    
    if (result) {
      // 如果找到，更新缓存
      cache.set(key, result);
      console.log(`找到ID为${idNum}的路线:`, result.name);
      return result;
    } else {
      // 如果未找到，删除可能存在的错误缓存
      if (cache.has(key)) {
        cache.delete(key);
        console.log(`删除不存在的路线缓存: ${key}`);
      }
      console.error(`未找到ID为${idNum}的路线数据`);
      return null;
    }
  },
  
  updateFavorite: (id, isFavorite) => {
    const idNum = Number(id);
    const route = routesData.find(r => r.id === idNum);
    if (route) {
      route.isCollected = isFavorite;
      // 清除缓存
      cache.delete(`route-${idNum}`);
      console.log(`更新路线收藏状态: ID=${idNum}, 收藏=${isFavorite}`);
    }
    return route;
  }
};

// 添加通用数据查找服务 - 自动检测数据类型
export const dataLookupService = {
  // 根据ID自动查找数据，无论类型
  findById: (id) => {
    const idNum = Number(id);
    const key = `data-auto-${idNum}`;
    
    // 先检查缓存中是否已有自动检测结果
    if (cache.has(key)) {
      console.log('从缓存获取自动检测的结果');
      return cache.get(key);
    }
    
    // 先检查露营地
    let result = campsitesData.find(item => item.id === idNum);
    let type = null;
    
    if (result) {
      type = 'campsite';
      console.log(`自动检测 - 找到ID为${idNum}的露营地:`, result.title);
    } else {
      // 再检查路线
      result = routesData.find(item => item.id === idNum);
      if (result) {
        type = 'route';
        console.log(`自动检测 - 找到ID为${idNum}的路线:`, result.name);
      }
    }
    
    // 缓存结果
    const resultObj = result ? { type, data: result } : null;
    cache.set(key, resultObj);
    
    if (!result) {
      console.error(`自动检测 - 未找到ID为${idNum}的任何数据`);
    }
    
    return resultObj;
  },
  
  // 清除特定ID的自动检测缓存
  clearIdCache: (id) => {
    const idNum = Number(id);
    const key = `data-auto-${idNum}`;
    
    if (cache.has(key)) {
      cache.delete(key);
      console.log(`清除ID为${idNum}的自动检测缓存`);
      return true;
    }
    return false;
  }
};