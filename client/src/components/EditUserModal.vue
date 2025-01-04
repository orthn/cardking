<template>
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal">
        <h3>Benutzerdaten bearbeiten</h3>
        <form @submit.prevent="submitForm" class="modal-form">
          <div class="modal-grid">
            <!-- Aktuelle Daten anzeigen -->
            <div class="current-data">
              <p><strong>Benutzername:</strong> {{ currentUser.username }}</p>
              <p><strong>E-Mail:</strong> {{ currentUser.email }}</p>
            </div>
  
            <!-- Eingabefelder -->
            <div class="edit-fields">
              <label>
                Neuer Benutzername:
                <input type="text" v-model="username" placeholder="Benutzername ändern" />
              </label>
              <label>
                Neue E-Mail:
                <input type="email" v-model="email" placeholder="E-Mail ändern" />
              </label>
              <label>
                Neues Passwort:
                <input type="password" v-model="password" placeholder="Passwort ändern" />
              </label>
            </div>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn">Speichern</button>
            <button type="button" class="btn btn-cancel" @click="$emit('close')">Abbrechen</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Beispiel-Daten für aktuelle Benutzerinformationen
  const currentUser = ref({
    username: 'aktuellerBenutzer',
    email: 'aktuellerBenutzer@example.com',
  });
  
  const username = ref('');
  const email = ref('');
  const password = ref('');
  
  const submitForm = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'USER_ID_PLACEHOLDER', // Dynamisch aus Datenquelle
          username: username.value || currentUser.value.username,
          email: email.value || currentUser.value.email,
          password: password.value,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Daten erfolgreich aktualisiert!');
        username.value = '';
        email.value = '';
        password.value = '';
        $emit('close');
      } else {
        alert(result.error || 'Fehler beim Aktualisieren.');
      }
    } catch (error) {
      console.error('Fehler:', error);
      alert('Ein Fehler ist aufgetreten.');
    }
  };
  </script>
  
  <style scoped>
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
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 10px var(--shadow-color, rgba(0, 0, 0, 0.1));
    width: 600px;
    max-width: 90%;
  }
  
  .modal h3 {
    margin-bottom: 1rem;
    color: var(--text-color, #015249);
    text-align: center;
  }
  
  .modal-form {
    display: flex;
    flex-direction: column;
  }
  
  .modal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .current-data p {
    margin: 0.5rem 0;
    color: var(--text-color, #015249);
  }
  
  .edit-fields label {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    color: var(--text-color, #015249);
  }
  
  .edit-fields input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--input-border-color, #77C9D4);
    border-radius: 0.25rem;
    background: var(--input-bg-color, #ffffff);
    color: var(--text-color, #015249);
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    background: var(--button-bg-color, #57BC90);
    color: var(--button-text-color, #ffffff);
    cursor: pointer;
  }
  
  .btn-cancel {
    background: var(--highlight-color, #77C9D4);
  }
  
  .btn:hover {
    opacity: 0.9;
  }
  </style>
  