<script setup>
import { ref } from 'vue'
import MessageBox from "@/components/MessageBox.vue";

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const message = ref('')
const messageType = ref('info')

const emit = defineEmits(['goToLogin'])

const handleRegister = async () => {
  message.value = ''
  if (password.value !== confirmPassword.value) {
    message.value = 'Passwords do not match!'
    messageType.value = 'error'
    return
  }

  try {
    const response = await fetch('http://localhost:3000/users/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: name.value,
        email: email.value,
        password: password.value,
        goal: undefined
      })
    });

    const data = await response.json();
    if (!response.ok) {
      message.value = data.error || 'Error during Registration'
      messageType.value = 'error'
      return;
    }

    message.value = 'Registration successful!'
    messageType.value = 'success'

    // Nach 2 Sekunden zum Login weiterleiten
    setTimeout(() => {
      emit('goToLogin')
    }, 1500)
  } catch (err) {
    message.value = 'Network error: ' + err.message
    messageType.value = 'error'
  }
}

const goToLogin = () => {
  emit('goToLogin')
}
</script>

<template>
  <div class="container">
    <div class="card">
      <h2 class="title">Create Account</h2>

      <!-- MessageBox zeigt die Nachricht an -->
      <MessageBox :message="message" :type="messageType" />

      <form @submit.prevent="handleRegister" class="form">
        <div class="form-group">
          <label for="name">Username</label>
          <input
              id="name"
              class="form-control"
              type="text"
              v-model="name"
              required
              placeholder="Your Username"
          />
        </div>
        <div class="form-group">
          <label for="email">E-Mail</label>
          <input
              id="email"
              class="form-control"
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
              class="form-control"
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
              class="form-control"
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
/* Container */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
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
}

/* Titel und Untertitel */
.title {
  font-family: var(--font-family-heading);
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 1.2rem;
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
  color: var(--text-color);
  margin-bottom: 1.5rem;
  position: relative; /* Ermöglicht die Positionierung für dekorative Elemente */
}

.form-group label {
  font-family: var(--font-family-heading);
  font-size: 0.85rem;
  color: var(--text-color);
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
  text-transform: uppercase; /* Labels in Großbuchstaben für bessere Lesbarkeit */
  letter-spacing: 0.05em; /* Etwas Abstand zwischen Buchstaben */
  transition: color 0.3s;
}

.form-group label::after {
  content: "";
  display: block;
  width: 50px;
  height: 2px;
  background: var(--highlight-color); /* Farbiger Akzent */
  margin-top: 0.2rem;
  transition: width 0.3s;
}

.form-group:hover label::after {
  width: 100%; /* Vergrößert den Akzent bei Hover */
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
}

.btn:hover {
  background-color: var(--highlight-color);
  box-shadow: 0 6px 15px var(--highlight-color);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px var(--highlight-color);
}

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
</style>