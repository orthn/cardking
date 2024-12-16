<script setup>
import { ref } from 'vue'
import LoginView  from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'

const isLogin = ref(true)

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
  </div>
</template>

<style scoped>
</style>
