<script setup>
import { ref } from 'vue';

const email = ref('');
const message = ref('');

const sendPasswordReset = async () => {
  message.value = '';
  try {
    const response = await fetch('http://localhost:3000/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    });

    if (!response.ok) {
      const data = await response.json();
      message.value = data.error || 'Fehler beim Senden der E-Mail.';
      return;
    }

    message.value = 'Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet.';
  } catch (error) {
    message.value = 'Netzwerkfehler: ' + error.message;
  }
};
const emit = defineEmits(['goToLogin'])
const goToLogin = () => {
  emit('goToLogin')
}
</script>

<template>
  <div class="container">
    <div class="card">
      <h2 class="title">Reset Password</h2>
      <p class="subtitle">Enter your email address to receive a link to reset your password.</p>
      <form @submit.prevent="sendPasswordReset" class="form">
        <div class="form-group">
          <input
            id="email"
            class="form-control"
            type="email"
            v-model="email"
            required
            placeholder="E-Mail"
          />
        </div>
        <div class="actions">
          <button type="submit" class="btn">Send</button>
        </div>
      </form>
      <p class="register-text">
        Back to 
        <a href="#" class="link" @click.prevent="goToLogin">Login</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
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

.form-group {
  width: 100%;
  color: var(--text-color);
  margin-bottom: 1.5rem;
}
.register-text {
  font-size: 0.85rem;
  text-align: center;
  color: var(--muted-text-color);
  margin-top: 1.5rem;
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

.message-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: center;
  color: var(--muted-text-color);
}

.back-to-login-text {
  margin-top: 1rem;
  font-size: 0.85rem;
  text-align: center;
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