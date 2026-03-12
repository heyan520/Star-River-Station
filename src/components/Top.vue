<template>
  <header class="top-nav">
    <button class="nav-btn left-btn" @click="goBack">
      <span>返回</span>
    </button>
    <h1 class="nav-title">VR全景体验</h1>
    <div class="nav-placeholder"></div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.top-nav {
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.nav-btn {
  position: absolute;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: 15px;
  color: #333;
  padding: 6px 10px;
  border-radius: 15px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.left-btn {
  left: 16px;
}

.nav-placeholder {
  width: 80px;
  position: absolute;
  right: 16px;
}
</style>