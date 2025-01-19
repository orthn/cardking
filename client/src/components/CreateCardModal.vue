<template>
  <transition name="fade">
    <div v-if="show" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <MessageBox :message="message" :type="messageType" />
        <h3 class="title">Create a New Card</h3>
        <form @submit.prevent="submitForm" class="form">
          <!-- Question -->
          <div class="form-group full-width">
            <label for="question" class="form-label">Question:</label>
            <textarea id="question" v-model="card.question" class="form-input" placeholder="Enter the question"
              required></textarea>
          </div>

          <!-- Category -->
          <div class="form-group full-width">
            <label for="category" class="form-label">Category:</label>
            <input id="category" v-model="card.category" list="category-list" class="form-input"
              placeholder="Enter or select a category" required />
            <datalist id="category-list">
              <option v-for="category in categories" :key="category._id" :value="category.category">
                {{ category.category }}
              </option>
            </datalist>
          </div>

          <!-- Card Type -->
          <div class="form-group full-width">
            <label for="type" class="form-label">Card Type:</label>
            <select id="type" v-model="card.type" class="form-input" required @change="updateAnswerFields">
              <option value="true_false">True/False</option>
              <option value="single_choice">Single Choice</option>
              <option value="multiple_choice">Multiple Choice</option>
            </select>
          </div>

          <!-- True/False Selection -->
          <div v-if="card.type === 'true_false'" class="true-false-container">
            <div class="true-false-box" :class="{ selected: card.correctAnswer[0] === 'True' }"
              @click="toggleAnswer('True')">
              True
            </div>
            <div class="true-false-box" :class="{ selected: card.correctAnswer[0] === 'False' }"
              @click="toggleAnswer('False')">
              False
            </div>
          </div>

          <!-- Single Choice -->
          <div v-else-if="card.type === 'single_choice'" class="form-group full-width">
            <label class="form-label">Answers:</label>
            <div v-for="(answer, index) in card.answers" :key="index" class="option-row">
              <input type="text" v-model="card.answers[index]" class="answer-text"
                :placeholder="`Answer ${index + 1}`" />
              <i :class="card.correctAnswer[0] === index ? 'fas fa-check' : 'fas fa-times'" class="icon-indicator"
                @click.stop="toggleAnswer(index)"></i>
            </div>
          </div>

          <!-- Multiple Choice -->
          <div v-else-if="card.type === 'multiple_choice'" class="form-group full-width">
            <label class="form-label">Answers:</label>
            <div v-for="(answer, index) in card.answers" :key="index" class="option-row">
              <input type="text" v-model="card.answers[index]" class="answer-text"
                :placeholder="`Answer ${index + 1}`" />
              <i :class="card.correctAnswer.includes(index) ? 'fas fa-check' : 'fas fa-times'" class="icon-indicator"
                @click.stop="toggleAnswer(index)"></i>
            </div>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn">Create Card</button>
        </form>
        <div class="imp">
          <input type="file" ref="importFile" class="import-input" @change="handleFileSelect" />
          <button class="importbtn" @click.prevent="importCards">Import</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import MessageBox from '../components/MessageBox.vue';

// Props
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  categoryId: String,
});

// Reactive states
// Initialisierung des Card-Objekts
const card = ref({
  question: '',
  category: props.categoryId
    ? props.categories.find((category) => category._id === props.categoryId)?.category || ''
    : '',
  type: 'true_false',
  answers: ['True', 'False'],
  correctAnswer: [],
});

watch(
  () => props.categoryId,
  (newCategoryId) => {
    if (newCategoryId) {
      const matchedCategory = props.categories.find((category) => category._id === newCategoryId);
      card.value.category = matchedCategory ? matchedCategory.category : '';
    } else {
      card.value.category = '';
    }
  },
  { immediate: true }
);


const message = ref('');
const messageType = ref('info');
const selectedFile = ref(null);

// Methods
const handleFileSelect = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    selectedFile.value = files[0];
  }
};

const importCards = async () => {
  if (!selectedFile.value) {
    message.value = 'Please select a file to import.';
    messageType.value = 'error';
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    const response = await fetch('http://localhost:3000/cards/import', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      message.value = errorData?.error || 'Failed to import cards.';
      messageType.value = 'error';
      return;
    }

    message.value = 'Cards imported successfully!';
    messageType.value = 'success';
    selectedFile.value = null;
  } catch (error) {
    message.value = `Error importing cards: ${error.message}`;
    messageType.value = 'error';
  }
};

const updateAnswerFields = () => {
  card.value.correctAnswer = [];
  if (card.value.type === 'true_false') {
    card.value.answers = ['True', 'False'];
  } else {
    card.value.answers = ['', '', '', ''];
  }
};

const toggleAnswer = (index) => {
  if (card.value.type === 'single_choice' || card.value.type === 'true_false') {
    card.value.correctAnswer = [index];
  } else if (card.value.type === 'multiple_choice') {
    if (card.value.correctAnswer.includes(index)) {
      card.value.correctAnswer = card.value.correctAnswer.filter((i) => i !== index);
    } else {
      card.value.correctAnswer.push(index);
    }
  }
};

const submitForm = async () => {
  try {
    const cardData = {
      question: card.value.question,
      category: card.value.category,
      type: card.value.type,
      answers: card.value.answers,
      correctAnswer:
        card.value.type === 'multiple_choice'
          ? card.value.correctAnswer.map((index) => card.value.answers[index])
          : card.value.type === 'single_choice'
          ? card.value.answers[card.value.correctAnswer[0]]
          : card.value.correctAnswer[0],
    };

    const response = await fetch('http://localhost:3000/cards/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      message.value = errorData?.error || 'Error creating card.';
      messageType.value = 'error';
      return;
    }

    setTimeout(() => {
      message.value = 'Card created successfully!';
      messageType.value = 'success';
    }, 100);
    resetForm();
  } catch (err) {
    message.value = `Error creating card: ${err.message}`;
    messageType.value = 'error';
  }
};

const resetForm = () => {
  card.value = {
    question: '',
    category: '',
    type: 'true_false',
    answers: ['True', 'False'],
    correctAnswer: [],
  };
};
const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>


<style scoped>
.imp{
  display:flex;
  justify-content: center;
  padding-top: 1rem;
}

.true-false-container {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-sm);
}

.true-false-box {
  flex: 1;
  text-align: center;
  color: var(--text-color);
  padding: var(--spacing-sm);
  border: 1px solid var(--input-border-color);
  border-radius: var(--radius-sm, 6px);
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.true-false-box:not(:last-child) {
  margin-right: var(--spacing-sm);
}

.true-false-box.selected {
  background-color: var(--highlight-color, #77C9D4);
  border-color: var(--highlight-color, #77C9D4);
  color: var(--button-text-color, #fff);
}


/* Single and Multiple Choice */
.option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  padding: var(--spacing-sm);
  border: 1px solid var(--input-border-color);
  border-radius: var(--border-radius, 8px);
  background-color: var(--input-bg-color);
  color: var(--text-color);
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.import-input {
  display: block;
  width: 100%;
  margin-right: 2rem;
  padding: var(--spacing-sm);
  font-size: 1rem;
  color: var(--text-color, #333);
  background-color: var(--input-bg-color, #f9f9f9);
  border: 1px solid var(--input-border-color, #ccc);
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.import-input:hover {
  border-color: var(--highlight-color, #77C9D4);
}

.import-input:focus {
  outline: none;
  border-color: var(--highlight-color, #77C9D4);
  box-shadow: 0 0 5px var(--highlight-color, #77C9D4);
}

.answer-text {
  flex-grow: 1;
  border: 1px solid var(--input-border-color);
  border-radius: var(--radius-sm, 6px);
  background: var(--input-bg-color);
  color: var(--text-color);
}

.icon-indicator {
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s, transform 0.2s;
}

.icon-indicator.fas.fa-check {
  color: var(--correct-color, #57BC90);
}

.icon-indicator.fas.fa-times {
  color: var(--incorrect-color, #d83129);
}

.icon-indicator:hover {
  transform: scale(1.2);
}

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
  font-family: var(--font-family-default);

}

.modal-content {
  background: var(--card-bg-color);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius, 12px);
  box-shadow: 0 10px 30px var(--shadow-color, rgba(0, 0, 0, 0.2));
  width: 90%;
  max-width: 600px;
  animation: fadeIn 0.3s ease-out;
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

.answer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(45%, 1fr));
  gap: var(--spacing-sm);
}

.answer-card {
  padding: var(--spacing-sm);
  border: 1px solid var(--input-border-color);
  border-radius: var(--radius-sm, 6px);
  background-color: var(--input-bg-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.answer-card.correct {
  background-color: var(--button-bg-color, #57BC90);
  color: var(--button-text-color, #fff);
  border-color: var(--button-bg-color, #57BC90);
}

.answer-card:hover {
  background-color: var(--highlight-color, #77C9D4);
}

.answer-text {
  width: 100%;
  border: none;
  outline: none;
  background: none;
  color: inherit;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-sm);
}
.importbtn {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--cancel-color);
  color: var(--button-text-color, #fff);
  border: none;
  border-radius: var(--border-radius, 8px);
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
.importbtn:hover {
  background-color: var(--highlight-color, #77C9D4);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

.close-btn {
  background-color: var(--danger-color, #dc3545);
  color: #fff;
}

.close-btn:hover {
  background-color: var(--highlight-color, #d83129);
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