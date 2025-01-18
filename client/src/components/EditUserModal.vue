<template>
  <transition name="fade">
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal">
        <MessageBox :message="message" :type="messageType" />
        <div class="modal-content">
          <h2 class="title">Profile of <span>{{ userData.username }}</span></h2>
          <!-- Left Column -->
          <div class="modal-column">
            <!-- Form for Email -->
            <form @submit.prevent="updateEmail" class="modal-form">
              <div class="form-group">
                <label>New Email</label>
                <input class="form-control" type="email" v-model="localMail" :placeholder="localMail" required />
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
                <select v-model="localGoal" class="form-control">
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
                <input class="form-control" type="password" v-model="currentPassword"
                  placeholder="Enter current password" required />
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
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MessageBox from "@/components/MessageBox.vue";
const message = ref('');
const messageType = ref('info');

const props = defineProps({
  userData: Object,
});

const localGoal = ref(props.userData.goal);
const localMail = ref(props.userData.email);

const currentPassword = ref('');
const currentPasswordEmail = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// Funktionen für Updates
const updateEmail = async () => {
  try {
    const response = await fetch('http://localhost:3000/users/data', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: localMail.value, currentPasswordEmail: currentPasswordEmail.value }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'Failed to update email');
    }
    props.userData.email = localMail.value;
    message.value = 'Email updated successfully!';
    messageType.value = 'success';
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
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
      body: JSON.stringify({ goal: localGoal.value }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'Failed to update goal');
    }
    props.userData.goal = localGoal.value;
    message.value = 'Goal updated successfully!';
    messageType.value = 'success';
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
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

    message.value = 'Password updated successfully!';
    messageType.value = 'success';
    } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
};

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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>