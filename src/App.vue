<script setup>
// 导入并提供全局状态管理
import { provideDataStore } from './composables/useDataStore.js';
import useDataStore from './composables/useDataStore.js';

// 提供数据存储
provideDataStore();

// 初始化收藏状态
const dataStore = useDataStore();
dataStore.initFavorites();
</script>

<template>
  <router-view />
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
