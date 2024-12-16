<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwörter stimmen nicht überein!');
    return;
  }

  const response = await fetch('http://localhost:3000/users/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      username: name.value,
      email: email.value,
      password: password.value,
    })
  });

  const data = await response.json();
  if (!response.ok) {
    alert('Fehler bei der Registrierung: ' + data.error);
    return;
  }

  console.log('Registrierung erfolgreich:', data);
  // Eventuell automatisch zum Login wechseln
  // emit('goToLogin') oder Router-Navigation
}

const emit = defineEmits(['goToLogin'])
const goToLogin = () => {
  emit('goToLogin')
}
</script>

<template>
  <div class="container">
    <div class="card">
      <h2 class="title">Create Account</h2>
      <form @submit.prevent="handleRegister" class="form">
        <div class="form-group">
          <label for="name">Name</label>
          <input
              id="name"
              type="text"
              v-model="name"
              required
              placeholder="Your Name"
          />
        </div>
        <div class="form-group">
          <label for="email">E-Mail</label>
          <input
              id="email"
              type="email"
              v-model="email"
              required
              placeholder="example@mail.com"
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
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
              id="confirmPassword"
              type="password"
              v-model="confirmPassword"
              required
              placeholder="**********"
          />
        </div>
        <div class="actions">
          <button type="submit" class="btn">Register</button>
        </div>
      </form>
      <p class="register-text">
        Already have an account?
        <a href="#" class="link" @click.prevent="goToLogin">Login</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #f4f4f4;
  font-family: Arial, sans-serif;
}

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
</style>