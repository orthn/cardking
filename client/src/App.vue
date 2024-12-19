<script setup>
import { ref, onMounted  } from 'vue'
import LoginView  from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'

const isLogin = ref(true)
const currentTheme = ref('light')

const setTheme = (theme) => {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme);
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  setTheme(savedTheme)
})

// zwischen login und register wechseln
const showLogin = () => {
  isLogin.value = true
}
const showRegister = () => {
  isLogin.value = false
}

</script>
<template>
  <div>
    <LoginView v-if="isLogin" @goToRegister="showRegister" />
    <RegisterView v-else @goToLogin="showLogin" />
    <button
@click="setTheme(currentTheme === 'light' ? 'dark' : 'light')"
class="theme-switch-btn">
Switch to {{ currentTheme === 'light' ? 'Dark' : 'Light' }} Mode
</button>
  </div>
</template>

<!--
<button
@click="setTheme(currentTheme === 'light' ? 'dark' : 'light')"
class="theme-switch-btn">
Switch to {{ currentTheme === 'light' ? 'Dark' : 'Light' }} Mode
</button>
-->

<style scoped>
</style>
