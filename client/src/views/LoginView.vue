<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const response = await fetch('http://localhost:6000/users/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email: email.value, password: password.value })
  });

  const data = await response.json();
  if (!response.ok) {
    alert('Fehler beim Login: ' + data.error);
    return;
  }

  console.log('Login erfolgreich:', data);
  // weiterleitung
}


const emit = defineEmits(['goToRegister'])
const goToRegister = () => {
  emit('goToRegister')
}
</script>

<template>
  <div class="container">
    <div class="card">
      <h2 class="title">Welcome future CardKing!</h2>
      <p class="subtitle">Please sign in to continue</p>
      <form @submit.prevent="handleLogin" class="form">
        <div class="form-group">
          <input
            id="email"
            class="form-control"
            type="email"
            v-model="email"
            required
            placeholder="Username"
          />
        </div>
        <div class="form-group">
          <input
            id="password"
            type="password"
            class="form-control"
            v-model="password"
            required
            placeholder="Password"
          />
        </div>
        <div class="actions">
          <button type="submit" class="btn">Login</button>
        </div>
      </form>
      <p class="register-text">
        Don't have an account?
        <a href="#" class="link" @click.prevent="goToRegister">Register</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  background-size: 400% 400%;
  animation: gradient-animation 12s ease infinite;
}

.card {
  font-family: var(--font-family-heading);
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: var(--card-bg-color);
  border-radius: 12px;
  box-shadow: 0 10px 30px var(--shadow-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s, box-shadow 0.3s;
}

/* Titel und Untertitel */
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

/* Formular */
.form-group {
  width: 100%;
  margin-bottom: 1.5rem;
}

.form-control-label {
  font-family: var(--font-family-heading);
  font-size: 0.85rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  display: block;
}

.form-control {
  font-family: var(--font-family-heading);
  width: 100%;
  padding: 0.7rem 1rem;
  background-color: var(--input-bg-color);
  border: 1px solid var(--input-border-color);
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: var(--highlight-color);
  box-shadow: 0 0 6px var(--highlight-color);
}

/* Button */
.btn {
  font-family: var(--font-family-heading);
  width: 100%;
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

.btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px var(--highlight-color);
}

/* Register Text */
.register-text {
  font-size: 0.85rem;
  text-align: center;
  color: var(--muted-text-color);
  margin-top: 1.5rem;
}

.link {
  color: var(--link-color);
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.link:hover {
  color: var(--highlight-color);
}

/* Dynamischer Hintergrundgradient */
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