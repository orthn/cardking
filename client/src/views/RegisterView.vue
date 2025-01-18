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

    const data = await response.json();

    if (!response.ok) {
      message.value = data.error || 'Failed to reset password.';
      messageType.value = 'error';
      return;
    }

    message.value = 'Password reset successfully!';
    messageType.value = 'success';
    setTimeout(() => {
      window.location.href = window.location.origin;
    }, 1500);
  } catch (err) {
    message.value = 'Network error: ' + err.message;
    messageType.value = 'error';
  }
};
</script>
<template>
  <MessageBox :message="message" :type="messageType" />
  <div class="container">
    <div class="card">
      <h2 class="title">Reset Password</h2>
      <form @submit.prevent="resetPassword" class="form">
        <div class="form-group">
          <label for="password">New Password</label>
          <input id="password" class="form-control" type="password" v-model="password" required
            placeholder="**********" />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" class="form-control" type="password" v-model="confirmPassword" required
            placeholder="**********" />
        </div>
        <div class="actions">
          <button type="submit" class="btn">Reset Password</button>
        </div>
      </form>
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

/* Formular */
.form-group {
  width: 100%;
  color: var(--text-color);
  margin-bottom: 1.5rem;
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
</style>
