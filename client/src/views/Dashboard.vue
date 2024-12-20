<script setup>
import { ref, onMounted } from 'vue';

const currentTheme = ref(localStorage.getItem('theme') || 'light');

const setTheme = (theme) => {
  currentTheme.value = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

onMounted(() => {
  setTheme(currentTheme.value);
});
</script>

<template>
  <div class="container">
    <div class="card">
      <h2 class="title">Welcome to the Dashboard!</h2>
      <p class="subtitle">Du bist erfolgreich eingeloggt!</p>
      <button
          @click="setTheme(currentTheme === 'light' ? 'dark' : 'light')"
          class="btn"
      >
        Switch to {{ currentTheme === 'light' ? 'Dark' : 'Light' }} Mode
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.card {
  font-family: var(--font-family-heading);
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: var(--card-bg-color);
  border-radius: 20px;
  box-shadow: 0 10px 30px var(--shadow-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.title {
  font-family: var(--font-family-heading);
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  font-family: var(--font-family-heading);
  font-size: 1rem;
  color: var(--subtitle-color);
  text-align: center;
  margin-bottom: 1.5rem;
}

.btn {
  font-family: var(--font-family-heading);
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.btn:hover {
  background-color: var(--highlight-color);
  box-shadow: 0 6px 15px var(--highlight-color);
}
</style>
