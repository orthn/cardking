<template>
  <transition name="fade">
    <div v-if="show" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <MessageBox :message="message" :type="messageType" />
        <h3 class="title">Create a New Category</h3>
        <form @submit.prevent="submitForm" class="form">

          <div class="form-group full-width">
            <label for="category" class="form-label">Category Name:</label>
            <input
                id="category"
                v-model="categoryName"
                type="text"
                class="form-input"
                placeholder="Enter the category name"
                required
            />
          </div>

          <button type="submit" class="btn">Create Category</button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import MessageBox from '../components/MessageBox.vue';


const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const categoryName = ref('');
const message = ref('');
const messageType = ref('info');


const emit = defineEmits(['close']);


const submitForm = async () => {
  if (!categoryName.value.trim()) {
    message.value = 'Category name cannot be empty.';
    messageType.value = 'error';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/cards/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: categoryName.value }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      message.value = errorData?.message || 'Error creating category.';
      messageType.value = 'error';
      return;
    }

    message.value = 'Category created successfully!';
    messageType.value = 'success';
    categoryName.value = '';
    setTimeout(() => closeModal(), 1500);
  } catch (error) {
    message.value = `Error creating category: ${error.message}`;
    messageType.value = 'error';
  }
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal {
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

.modal-content {
  background: var(--card-bg-color);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius, 12px);
  box-shadow: 0 10px 30px var(--shadow-color, rgba(0, 0, 0, 0.2));
  width: 90%;
  max-width: 400px;
  animation: fadeIn 0.3s ease-out;
  font-family: var(--font-family-default);
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

.form-input {
  font-size: 1rem;
  padding: var(--spacing-sm);
  border: 1px solid var(--input-border-color);
  border-radius: var(--border-radius, 8px);
  background-color: var(--input-bg-color);
  color: var(--text-color);
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-input:focus {
  border-color: var(--highlight-color);
  box-shadow: 0 0 5px var(--highlight-color);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--button-bg-color, #57BC90);
  color: var(--button-text-color, #fff);
  border: none;
  border-radius: var(--border-radius, 8px);
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.btn:hover {
  background-color: var(--highlight-color, #77C9D4);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
