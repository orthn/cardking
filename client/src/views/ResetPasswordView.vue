<script setup>
import { ref, onMounted } from 'vue';

const password = ref('');
const message = ref('');
const messageType = ref('info');
const token = ref(null);

onMounted(() => {
  // Token direkt aus der URL auslesen
  const url = new URL(window.location.href);
  if (url.pathname.startsWith('/reset-password/')) {
    token.value = url.pathname.split('/reset-password/')[1]; // Token extrahieren
  } else {
    message.value = 'Ungültiger Link.';
    messageType.value = 'error';
  }
});

const resetPassword = async () => {
  message.value = '';
  try {
    const response = await fetch(`http://localhost:3000/users/reset-password/${token.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword: password.value }),
    });

    // Status überprüfen
    if (!response.ok) { 
      // Versuchen, die Antwort als JSON zu parsen
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        // Falls JSON-Parsing fehlschlägt, eine generische Fehlermeldung setzen
        message.value = 'Fehler beim Zurücksetzen des Passworts.';
        messageType.value = 'error';
        return;
      }

      // Fehlernachricht aus JSON verwenden
      message.value = errorData.error || 'Fehler beim Zurücksetzen des Passworts.';
      messageType.value = 'error';
      return;
    }

    // Erfolgreiche Antwort (falls keine JSON-Daten vorhanden sind, Erfolgsmeldung setzen)
    message.value = 'Password reset successfully.';
    messageType.value = 'success';
    setTimeout(() => {
      window.location.href = window.location.origin;
    }, 2000);
  } catch (error) {
    // Netzwerk- oder andere Fehler
    message.value = 'Netzwerkfehler: ' + error.message;
    messageType.value = 'error';
  }
};
</script>

<template>
  <div class="container">
    <div class="card">
      <h2 class="title">Reset Password</h2>
      <p class="subtitle">Type in your new Password</p>
      <form @submit.prevent="resetPassword" class="form">
        <input
          type="password"
          v-model="password"
          id="password"
          class="form-input"
          placeholder="Neues Passwort"
          required
        />
        <button type="submit" class="btn">Reset Password</button>
      </form>
      <p v-if="message" :class="`message ${messageType}`">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Container für die gesamte Ansicht */
.container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  background: var(--card-bg-color, #ffffff);
  box-shadow: 0 2px 10px var(--shadow-color, rgba(0, 0, 0, 0.1));
  border-radius: var(--radius-md, 8px);
}

/* Styling der Karte */
.card {
  padding: 1.5rem;
}

/* Titelüberschrift */
.title {
  font-family: var(--font-family-heading, 'Inter', sans-serif);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color, #015249);
  margin-bottom: 1rem;
  text-align: center;
}

/* Untertitel */
.subtitle {
  font-family: var(--font-family-default, 'Inter', sans-serif);
  font-size: 1rem;
  color: var(--muted-text-color, #a5a5af);
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Formular-Styling */
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-label {
  font-size: 0.875rem;
  color: var(--text-color);
  font-weight: 500;
}

.form-input {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--input-border-color);
  border-radius: var(--radius-sm, 4px);
  background-color: var(--input-bg-color);
  color: var(--text-color, #015249);
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: var(--highlight-color);
  box-shadow: 0 0 5px var(--highlight-color);
}

/* Button-Styling */
.btn {
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-md, 8px);
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
  cursor: pointer;
  text-align: center;
}

.btn:hover {
  background-color: var(--highlight-color);
  transform: scale(1.05);
}

.btn:disabled {
  background-color: var(--muted-text-color);
  cursor: not-allowed;
}

/* Nachrichtentypen */
.message {
  margin-top: 1rem;
  font-size: 0.875rem;
  padding: 0.5rem;
  text-align: center;
  border-radius: var(--radius-sm, 4px);
}

.message.success {
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
}

.message.error {
  background-color: var(--danger-color);
  color: #ffffff;
}
</style>
