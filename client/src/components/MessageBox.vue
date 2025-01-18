<template>
  <transition name="fade">
    <div v-if="internalMessage" class="message-box" :class="typeClass">
      <p>{{ internalMessage }}</p>
    </div>
  </transition>
</template>

<script setup>
import { computed, watch, ref } from 'vue';

// Props für Nachricht, Typ und Dauer
const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'info' },
  duration: { type: Number, default: 2000 }
});

// Reaktive Variable zur Steuerung der Nachricht
const internalMessage = ref('');
const typeClass = computed(() => `message-box--${props.type}`);

let timer;
watch(() => props.message, (newMessage) => {
  if (newMessage) {
    // Reset der Nachricht, um Wiederholungen zu ermöglichen
    internalMessage.value = ''; // Nachricht kurz leeren
    clearTimeout(timer);
    setTimeout(() => {
      internalMessage.value = newMessage; // Neue Nachricht setzen
      timer = setTimeout(() => {
        internalMessage.value = ''; // Nachricht nach der Dauer entfernen
      }, props.duration);
    }, 100); // Kleine Verzögerung, um Vue die Änderung erkennen zu lassen
  }
});

</script>

<style scoped>
/* Nachricht zentrieren */
.message-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-family-heading);
  padding: 2rem;
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 6px 15px var(--shadow-color);
  z-index: 1000;
}

/* Nachrichtentypen */
.message-box--success {
  background-color: var(--highlight-color);
  color: #fff;
}

.message-box--error {
  background-color: #e74c3c;
  color: #fff;
}

.message-box--info {
  background-color: var(--button-bg-color);
  color: #fff;
}

/* Transition-Effekte */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
