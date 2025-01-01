<script setup>
import { ref, onMounted } from 'vue';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';
import ResetPasswordRequestView from './views/ResetPasswordRequestView.vue';
import ResetPasswordView from './views/ResetPasswordView.vue';
import DashboardView from './views/Dashboard.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';

const currentView = ref('login');
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
          @loggedIn="changeView('dashboard')"
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
      <transition name="slide-right">
        <DashboardView
            v-if="currentView === 'dashboard'"
            class="auth-view"
        />
      </transition>
    </div>
    <button
  @click="setTheme(currentTheme === 'light' ? 'dark' : 'light')"
  class="theme-switch-btn"
>
  <i v-if="currentTheme === 'light'" class="fas fa-moon"></i>
  <i v-else class="fas fa-sun"></i>
</button>

        <!-- Profile and Settings Buttons -->
        <div v-if="currentView === 'dashboard'" class="top-right-buttons">
      <button class="icon-btn">
        <i class="fas fa-user-circle"></i>
      </button>
      <button class="icon-btn">
        <i class="fas fa-cog"></i>
      </button>
    </div>
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
  width: 50px; /* Einheitliche Breite für runde Buttons */
  height: 50px; /* Einheitliche Höhe */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem; /* Schriftgröße oder Icon-Größe */
  color: var(--button-text-color); /* Konsistente Textfarbe */
  background-color: var(--button-bg-color); /* Hintergrundfarbe */
  border: none;
  border-radius: 50%; /* Runde Form */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.theme-switch-btn:hover {
  background-color: var(--highlight-color); /* Hover-Farbe */
  transform: scale(1.1); /* Leichte Vergrößerung beim Hover */
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
  display: flex;
  justify-content: center;
  align-items: center;
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
/* Top-right buttons for profile and settings */
.top-right-buttons {
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  gap: var(--spacing-sm); /* Abstand zwischen Buttons */
}

.icon-btn {
  background: var(--button-bg-color); /* Hintergrundfarbe */
  color: var(--button-text-color); /* Textfarbe */
  border: none;
  border-radius: 50%; /* Runde Buttons */
  width: 50px; /* Größe */
  height: 50px; /* Größe */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem; /* Icon-Größe */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.icon-btn:hover {
  background-color: var(--highlight-color); /* Hover-Farbe */
  transform: scale(1.1); /* Leichtes Vergrößern beim Hover */
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
