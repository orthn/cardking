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
          <label for="email">E-Mail</label>
          <input
              id="email"
              type="email"
              v-model="email"
              required
              placeholder="max.mustermann@mail.com"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
              id="password"
              type="password"
              v-model="password"
              required
              placeholder="**********"
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
/* reseten von styles für selbe baseline */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* BG*/
body {
  background: #f4f4f4;
  font-family: Arial, sans-serif;
}

/* login container */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}


.card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 350px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
}


.title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.subtitle {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
}


.form {
  text-align: left;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #666;
  outline: none;
}


.actions {
  margin-top: 1.5rem;
}

.btn {
  width: 100%;
  padding: 0.7rem;
  border: none;
  border-radius: 4px;
  background: #333;
  color: #fff;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn:hover {
  background: #555;
}


.register-text {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #666;
}

.link {
  color: #1a73e8;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}


@media (min-width: 600px) {
  .card {
    padding: 2.5rem;
  }
}
</style>
