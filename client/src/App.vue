<script setup>
import { ref, onMounted } from 'vue';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';
import ResetPasswordRequestView from './views/ResetPasswordRequestView.vue';
import ResetPasswordView from './views/ResetPasswordView.vue';

const currentView = ref('login'); // 'login', 'register', 'resetRequest', 'resetPassword'
const resetToken = ref(null);

const currentTheme = ref('light');

const setTheme = (theme) => {
  currentTheme.value = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
});

const changeView = (view, token = null) => {
  currentView.value = view;
  resetToken.value = token;
};
</script>

<template>
  <div class="bg">
    <div class="view-container">
      <transition name="slide-left">
        <LoginView
          v-if="currentView === 'login'"
          class="auth-view"
          @goToRegister="changeView('register')"
          @goToResetRequest="changeView('resetRequest')"
        />
      </transition>
      <transition name="slide-right">
        <RegisterView
          v-if="currentView === 'register'"
          class="auth-view"
          @goToLogin="changeView('login')"
        />
      </transition>
      <transition name="slide-left">
        <ResetPasswordRequestView
          v-if="currentView === 'resetRequest'"
          class="auth-view"
          @goToLogin="changeView('login')"
        />
      </transition>
      <transition name="slide-right">
        <ResetPasswordView
          v-if="currentView === 'resetPassword'"
          class="auth-view"
          :token="resetToken"
          @goToLogin="changeView('login')"
        />
      </transition>
    </div>
    <button
      @click="setTheme(currentTheme === 'light' ? 'dark' : 'light')"
      class="theme-switch-btn"
    >
      Switch to {{ currentTheme === 'light' ? 'Dark' : 'Light' }} Mode
    </button>
  </div>
</template>

<style scoped>
.bg {
  font-family: var(--font-family-heading);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  background-size: 300% 300%;
  animation: gradient-animation 12s ease infinite;
}

.theme-switch-btn {
  font-family: var(--font-family-heading);
  position: fixed;
  top: 10px;
  left: 10px;
  padding: 10px 20px;
  font-size: 14px;
  color: white;
  background-color: var(--button-bg-color);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.view-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-view {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transform: translateX(0);
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transform: translateX(0);
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
