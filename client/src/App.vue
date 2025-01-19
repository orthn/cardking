<script setup>
import { ref, reactive, onMounted } from 'vue';
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
const messageType = ref('info');
const selectedCategory = ref(null);

const userData = reactive({
  username: '',
  email: '',
  goal: '',
});

const successRate = ref(0);

const updateSuccessRate = (rate) => {
  successRate.value = rate;
};



const handleLogin = async () => {
  currentView.value = 'dashboard';
  await fetchUserData();
};


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
      await fetchUserData();
    } else {
      // Benutzer nicht eingeloggt, Login anzeigen
      currentView.value = 'login';
    }
  } catch (error) {
    console.error('Fehler beim Überprüfen der Session:', error);
    currentView.value = 'login'; // Fallback zur Login-Seite
  }
};
const fetchUserData = async () => {
  try {
    const response = await fetch('http://localhost:3000/users/data', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch user data');

    const data = await response.json();
    userData.username = data.user.username;
    userData.email = data.user.email;
    userData.goal = data.user.goal || 'no_goal';
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzerdaten:', error.message);
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
  
    <svg id="visual" viewBox="0 0 900 600" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
    <defs>
      <!-- Gradient nutzt CSS-Variablen -->
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: var(--gradient-start);" />
        <stop offset="100%" style="stop-color: var(--gradient-end);" />
      </linearGradient>
      <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0" /> <!--Gradient vom Rand mit stdDevation einstellbar!-->
    </filter>
    </defs>
    <rect width="100%" height="100%" fill="var(--gradient-start)"></rect>
    <g>
      <circle class="circle-1" cx="25%" cy="25%" filter="url(#blur)" fill="url(#gradient)" r="30vh"></circle>
      <circle class="circle-2" cx="25%" cy="75%" filter="url(#blur)" fill="url(#gradient)" r="38vh"></circle>
      <circle class="circle-3" cx="50%" cy="33%" filter="url(#blur)" fill="url(#gradient)" r="32vh"></circle>
      <circle class="circle-4" cx="50%" cy="67%" filter="url(#blur)" fill="url(#gradient)" r="34vh"></circle>
      <circle class="circle-5" cx="75%" cy="25%" filter="url(#blur)" fill="url(#gradient)" r="36vh"></circle>
      <circle class="circle-6" cx="75%" cy="75%" filter="url(#blur)" fill="url(#gradient)" r="40vh"></circle>
      <circle class="circle-4" cx="90%" cy="90%" filter="url(#blur)" fill="url(#gradient)" r="36vh"></circle>
    </g>
  </svg>
    <div class="view-container">
      <div v-if="currentView === 'resetPassword'">
        <ResetPasswordView :token="resetToken" />
      </div>
      <template v-else>
        <transition name="slide-left">
          <LoginView v-if="currentView === 'login'" class="auth-view" @goToRegister="changeView('register')"
            @goToResetRequest="changeView('resetRequest')" @loggedIn="handleLogin" />
        </transition>
        <transition name="slide-right">
          <RegisterView v-if="currentView === 'register'" class="auth-view" @goToLogin="changeView('login')" />
        </transition>
        <transition name="slide-left">
          <ResetPasswordRequestView v-if="currentView === 'resetRequest'" class="auth-view"
            @goToLogin="changeView('login')" />
        </transition>
        <transition name="slide-right">
          <DashboardView v-if="currentView === 'dashboard'" class="auth-view" :userData="userData" :successRate="successRate"
                         @updateSuccessRate="updateSuccessRate" @startQuiz="handleStartQuiz"  />
        </transition>
        <transition name="slide-left">
          <QuizView v-if="currentView === 'quiz'" class="auth-view" :category="selectedCategory"
            @backToDashboard="changeView('dashboard')" />
        </transition>
      </template>
    </div>
    <button @click="setTheme(currentTheme === 'light' ? 'dark' : 'light')" class="theme-switch-btn">
      <i v-if="currentTheme === 'light'" class="fas fa-moon"></i>
      <i v-else class="fas fa-sun"></i>
    </button>

    <!-- Profile and Settings Buttons -->
    <div v-if="currentView === 'dashboard'" class="top-right-buttons">
      <button class="icon-btn" @click="openEditModal">
        <i class="fas fa-user-circle"></i>
      </button>
      <EditUserModal v-if="showEditModal" :userData="userData" @close="closeEditModal" />
      <button class="icon-btn logout-btn" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.bg {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

#visual {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}
  .circle-1 {
    animation: move1 10s ease-in-out infinite alternate;
  }

  .circle-2 {
    animation: move2 12s ease-in-out infinite alternate;
  }

  .circle-3 {
    animation: move3 8s ease-in-out infinite alternate;
  }

  .circle-4 {
    animation: move4 14s ease-in-out infinite alternate;
  }

  .circle-5 {
    animation: move5 9s ease-in-out infinite alternate;
  }

  .circle-6 {
    animation: move6 11s ease-in-out infinite alternate;
  }

  /* Keyframes für Bewegung */
  @keyframes move1 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-20px, -30px);
    }
  }

  @keyframes move2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-40px, 50px);
    }
  }

  @keyframes move3 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(30px, -20px);
    }
  }

  @keyframes move4 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-30px, 40px);
    }
  }

  @keyframes move5 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(50px, -50px);
    }
  }

  @keyframes move6 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-20px, 20px);
    }
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

</style>
