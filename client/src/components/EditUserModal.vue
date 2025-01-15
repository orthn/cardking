<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <transition name="fade">
        <MessageBox v-if="message" :message="message" :type="messageType" />
      </transition>
      <div class="modal-content">
        <h2 class="title">Profile of <span>{{ username }}</span></h2>
        <!-- Left Column -->
        <div class="modal-column">
          <!-- Form for Email -->
          <form @submit.prevent="updateEmail" class="modal-form">
            <div class="form-group">
              <label>New Email</label>
              <input class="form-control" type="email" v-model="email" :placeholder="originalEmail" required />
            </div>
            <div class="form-group">
              <label>Current Password</label>
              <input class="form-control" type="password" v-model="currentPasswordEmail"
                placeholder="Enter current password" required />
            </div>
            <button type="submit" class="btn" style="margin-bottom: 1rem;">Update Email</button>
          </form>

          <!-- Form for Goal -->
          <form @submit.prevent="updateGoal" class="modal-form">
            <div class="form-group">
              <label>Goal</label>
              <select v-model="goal" class="form-control">
                <option value="no_goal">No Goal</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <button type="submit" class="btn">Update Goal</button>
          </form>
        </div>

        <!-- Right Column -->
        <div class="modal-column">
          <!-- Form for Password -->
          <form @submit.prevent="updatePassword" class="modal-form">
            <div class="form-group">
              <label>Current Password</label>
              <input class="form-control" type="password" v-model="currentPassword" placeholder="Enter current password"
                required />
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input class="form-control" type="password" v-model="newPassword" placeholder="Enter new password"
                required />
            </div>
            <div class="form-group">
              <label>Confirm New Password</label>
              <input class="form-control" type="password" v-model="confirmPassword" placeholder="Confirm new password"
                required />
            </div>
            <button type="submit" class="btn">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MessageBox from "@/components/MessageBox.vue";

// State variables für Nachrichten
const message = ref('');
const messageType = ref('info');

// State variables
const username = ref('');
const email = ref('');
const originalEmail = ref('');
const goal = ref('');
const currentPassword = ref('');
const currentPasswordEmail = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isDataFetched = ref(false); // Kontrolliert, ob die Daten bereits geladen wurden

// Funktion zum Anzeigen einer Nachricht mit Timeout
const showMessage = (msg, type = 'info', duration = 2000) => {
  message.value = msg;
  messageType.value = type;

  // Nachricht nach Ablauf der Dauer zurücksetzen
  setTimeout(() => {
    message.value = '';
    messageType.value = 'info';
  }, duration);
};

// Funktionen für Updates
const updateEmail = async () => {
  try {
    const response = await fetch('http://localhost:3000/users/data', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value, currentPasswordEmail: currentPasswordEmail.value }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'Failed to update email');
    }
    showMessage('Email updated successfully!', 'success');
  } catch (error) {
    console.error('Error updating email:', error.message);
    showMessage(error.message, 'error');
  }
};

const updateGoal = async () => {
  try {
    const response = await fetch('http://localhost:3000/users/data', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ goal: goal.value }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'Failed to update goal');
    }

    showMessage('Goal updated successfully!', 'success');
  } catch (error) {
    console.error('Error updating goal:', error.message);
    showMessage(error.message, 'error');
  }
};

const updatePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    showMessage('Passwords do not match!', 'error');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/users/data', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword: currentPassword.value, newPassword: newPassword.value }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'Failed to update password');
    }

    showMessage('Password updated successfully!', 'success');
  } catch (error) {
    console.error('Error updating password:', error.message);
    showMessage(error.message, 'error');
  }
};

// Fetch-Funktion für Benutzerdaten
const fetchUserData = async () => {
  if (isDataFetched.value) return; // Fetch nur einmal ausführen

  try {
    const response = await fetch('http://localhost:3000/users/data', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch user data');

    const data = await response.json();
    username.value = data.user.username;
    email.value = data.user.email;
    originalEmail.value = data.user.email;
    goal.value = data.user.goal || 'no_goal'; // Fallback auf 'no_goal', wenn kein Ziel gesetzt ist
    isDataFetched.value = true; // Markiere Daten als geladen
  } catch (error) {
    showMessage('Could not fetch user data.', 'error');
  }
};

// Fetch-Daten bei Modal-Öffnung abrufen
onMounted(fetchUserData);
</script>


<style scoped>
.title span {
  color: var(--highlight-color);
  text-transform: uppercase;

}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: var(--card-bg-color, #ffffff);
  padding: 2.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px var(--shadow-color, rgba(0, 0, 0, 0.1));
  width: 100%;
  max-width: 600px;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg, 1rem);
  font-family: var(--font-family-default);
  color: var(--text-color);
  align-items: center;
  width: auto;
}

.title {
  grid-column: span 2;
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  font-weight: 600;
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
  position: relative;
  /* Ermöglicht die Positionierung für dekorative Elemente */
}

.form-group label {
  font-family: var(--font-family-heading);
  font-size: 0.85rem;
  color: var(--text-color);
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
  text-transform: uppercase;
  /* Labels in Großbuchstaben für bessere Lesbarkeit */
  letter-spacing: 0.05em;
  /* Etwas Abstand zwischen Buchstaben */
  transition: color 0.3s;
}

.form-group label::after {
  content: "";
  display: block;
  width: 50px;
  height: 2px;
  background: var(--highlight-color);
  /* Farbiger Akzent */
  margin-top: 0.2rem;
  transition: width 0.3s;
}

.form-group:hover label::after {
  width: 100%;
  /* Vergrößert den Akzent bei Hover */
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

.message-box {
  position: absolute;
  top: 24%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: auto;
  max-width: 90%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>