<script setup>
import { ref, onMounted } from 'vue';
import MessageBox from "@/components/MessageBox.vue";

const password = ref('');
const confirmPassword = ref('');
const message = ref('');
const messageType = ref('info');
const token = ref(null);

onMounted(() => {
  // Token direkt aus der URL auslesen
  const url = new URL(window.location.href);
  if (url.pathname.startsWith('/reset-password/')) {
    token.value = url.pathname.split('/reset-password/')[1]; // Token extrahieren
  } else {
    message.value = 'Invalid link.';
    messageType.value = 'error';
  }
});

const resetPassword = async () => {
  message.value = '';

  if (password.value !== confirmPassword.value) {
    message.value = 'Passwords do not match!';
    messageType.value = 'error';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/users/reset-password/${token.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword: password.value }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      message.value = errorData?.error || 'Failed to reset password.';
      messageType.value = 'error';
      return;
    }

    message.value = 'Password reset successfully.';
    messageType.value = 'success';
    setTimeout(() => {
      window.location.href = window.location.origin;
    }, 2000);
  } catch (error) {
    message.value = 'Network error: ' + error.message;
    messageType.value = 'error';
  }
};
</script>
<template>
  <MessageBox :message="message" :type="messageType" />
  <div class="container">
    <div class="card">
      <h2 class="title">Reset Password</h2>
      <p class="subtitle">Type in your new Password</p>
      <form @submit.prevent="resetPassword" class="form">
        <div class="form-group">
          <label for="password" class="form-label">New Password</label>
          <input
            type="password"
            v-model="password"
            id="password"
            class="form-input"
            placeholder="New Password"
            required
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            type="password"
            v-model="confirmPassword"
            id="confirmPassword"
            class="form-input"
            placeholder="Confirm Password"
            required
          />
        </div>
        <button type="submit" class="btn">Reset Password</button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background: var(--card-bg-color);
  box-shadow: 0 10px 30px var(--shadow-color);
  border-radius: var(--border-radius);
}

.card {
  font-family: var(--font-family-default);
  padding: 2rem;
  text-align: center;
}

.title {
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.subtitle {
  font-family: var(--font-family-default);
  font-size: 1rem;
  color: var(--muted-text-color);
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Formular */
.form-group {
  width: 100%;
  color: var(--text-color);
  margin-bottom: 1rem;
  position: relative;
}

.form-group label {
  font-family: var(--font-family-heading);
  font-size: 0.85rem;
  color: var(--text-color);
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s;
}

.form-group label::after {
  content: "";
  display: block;
  width: 50px;
  height: 2px;
  background: var(--highlight-color);
  margin-top: 0.2rem;
  transition: width 0.3s;
}

.form-group:hover label::after {
  width: 100%;
}
.form-group {
  width: 100%;
  text-align: left;
}

.form-input {
  font-family: var(--font-family-heading);
  width: 100%;
  padding: 0.7rem 1rem;
  background-color: var(--input-bg-color);
  border: 1px solid var(--input-border-color);
  border-radius: 6px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--highlight-color);
  box-shadow: 0 0 6px var(--highlight-color);
}

.btn {
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  background-color: var(--highlight-color);
  transform: scale(1.05);
}

.btn:disabled {
  background-color: var(--muted-text-color);
  cursor: not-allowed;
}
</style>
