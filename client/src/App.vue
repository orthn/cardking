<script setup>
import { ref, onMounted } from 'vue';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';
import ResetPasswordRequestView from './views/ResetPasswordRequestView.vue';
import ResetPasswordView from './views/ResetPasswordView.vue';
import DashboardView from './views/Dashboard.vue';
import QuizView from './views/QuizView.vue'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import EditUserModal from './components/EditUserModal.vue';

const currentView = ref('null');
const resetToken = ref(null);
const showEditModal = ref(false);
const currentTheme = ref('light');
const message = ref('');
const messageType = ref('info'); // 'success' oder 'error'
const selectedCategory = ref(null);

const handleStartQuiz = (category) => {
  selectedCategory.value = category;
  changeView('quiz');
};

const setTheme = (theme) => {
  currentTheme.value = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

const checkSession = async () => {
  try {
    const response = await fetch('http://localhost:3000/users/me', {
      method: 'GET',
      credentials: 'include', // Session-Cookie senden
    });

    if (response.ok) {
      // Benutzer ist eingeloggt, Dashboard anzeigen
      currentView.value = 'dashboard';
    } else {
      // Benutzer nicht eingeloggt, Login anzeigen
      currentView.value = 'login';
    }
  } catch (error) {
    console.error('Fehler beim Überprüfen der Session:', error);
    currentView.value = 'login'; // Fallback zur Login-Seite
  }
};

onMounted(() => {
  // Aktuelle URL analysieren
  const url = new URL(window.location.href);

  // Prüfen, ob die URL das Muster "/reset-password/:token" enthält
  if (url.pathname.startsWith('/reset-password/')) {
    currentView.value = 'resetPassword';
    resetToken.value = url.pathname.split('/reset-password/')[1]; // Token extrahieren
  } else {
    checkSession(); // Session-Check ausführen
  }

  // Theme aus dem lokalen Speicher laden
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
});

const changeView = (view, token = null) => {
  currentView.value = view;
  resetToken.value = token;
};

const openEditModal = () => {
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const handleLogout = async () => {
  try {
    const response = await fetch('http://localhost:3000/users/logout', {
      method: 'POST',
      credentials: 'include', // Wichtig für Cookies
    });
    if (response.ok) {
      // Zurück zur Login-Seite navigieren
      window.location.href = window.location.origin;
    }
  } catch (error) {
    console.error('Fehler beim Logout:', error);
  }
};
</script>

<template>
  <div class="bg">
    <div class="view-container">
      <div v-if="currentView === 'resetPassword'">
        <ResetPasswordView :token="resetToken" />
      </div>
      <template v-else>
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
          <DashboardView
            v-if="currentView === 'dashboard'"
            class="auth-view"
            @startQuiz="handleStartQuiz"
          />
        </transition>
        <transition name="slide-left">
          <QuizView
            v-if="currentView === 'quiz'"
            class="auth-view"
            :category="selectedCategory"
            @backToDashboard="changeView('dashboard')"
          />
        </transition>
      </template>
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
      <button class="icon-btn" @click="openEditModal">
        <i class="fas fa-user-circle"></i>
      </button>
      <EditUserModal v-if="showEditModal" @close="closeEditModal" />
      <button class="icon-btn logout-btn" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
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
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: var(--button-text-color);
  background-color: var(--button-bg-color);
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.theme-switch-btn:hover {
  background-color: var(--highlight-color);
  transform: scale(1.1);
}

.view-container {
  position: relative;
  width: 100%;
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

.top-right-buttons {
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  gap: var(--spacing-sm);
}

.icon-btn {
  background: var(--button-bg-color);
  color: var(--button-text-color);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  cursor: pointer;
}

.icon-btn:hover {
  background-color: var(--highlight-color);
  transform: scale(1.1);
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
