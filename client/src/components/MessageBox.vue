<template>
  <transition name="fade">
    <div v-if="message" class="message-box" :class="typeClass">
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'info' }
});

const typeClass = computed(() => `message-box--${props.type}`);
</script>

<style scoped>
.message-box {
  font-family: var(--font-family-heading);
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 6px 15px var(--shadow-color);
}

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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
