<template>
  <div v-if="isVisible" class="modal-backdrop">
    <div class="modal">
      <MessageBox :message="message" :type="messageType" />
      <h3>Edit Question</h3>
      <label style="font-weight: bold;">Question:</label>
      <textarea class="inputquestion" v-model="editableQuestion.question" type="text" />

      <label style="font-weight: bold;">Category:</label>
      <select v-model="editableQuestion.categoryId">
        <option v-for="category in categories" :key="category._id" :value="category._id">
          {{ category.category }}
        </option>
      </select>

      <div v-if="editableQuestion.type === 'multiple_choice'" class="edit-section">
        <label style="font-weight: bold; padding-bottom: 0.5rem;">Multiple Choice</label>
        <div v-for="(answer, index) in editableQuestion.answers" :key="index" class="answer-section">
          <div class="option-row">
            <input v-model="editableQuestion.answers[index]" placeholder="Option text" class="answer-input" />
            <span class="icon-indicator">
              <i :class="editableQuestion.correctAnswer.includes(answer) ? 'fas fa-check' : 'fas fa-times'"
                @click.stop="toggleCorrectAnswer(answer)"></i>
            </span>
          </div>
        </div>
      </div>



      <!-- Single Choice -->
      <div v-else-if="editableQuestion.type === 'single_choice'" class="edit-section">
        <label style="font-weight: bold; padding-bottom: 0.5rem;">Single Choice</label>
        <div v-for="(answer, index) in editableQuestion.answers" :key="index" class="answer-section">
          <div class="option-row">
            <input v-model="editableQuestion.answers[index]" placeholder="Option text" class="answer-input" />
            <span class="icon-indicator">
              <i :class="editableQuestion.correctAnswer === answer ? 'fas fa-check' : 'fas fa-times'"
                @click="setCorrectAnswer(answer)"></i>
            </span>
          </div>
        </div>
      </div>




      <!-- True/False -->
      <div v-else-if="editableQuestion.type === 'true_false'" class="edit-section true-false-section">
        <label style="font-weight: bold;">True/False</label>
        <div class="true-false-options">
          <label class="true-false-label" :class="{ selected: editableQuestion.correctAnswer === 'True' }">
            <input type="radio" value="True" v-model="editableQuestion.correctAnswer" />
            <span>True</span>
          </label>
          <label class="true-false-label" :class="{ selected: editableQuestion.correctAnswer === 'False' }">
            <input type="radio" value="False" v-model="editableQuestion.correctAnswer" />
            <span>False</span>
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button @click="saveChanges" class="btn save-btn">Save</button>
        <button @click="deleteQuestion" class="btn delete-btn">Delete</button>
        <button @click="$emit('close')" class="btn cancel-btn">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import MessageBox from "@/components/MessageBox.vue";

// Props
const props = defineProps({
  isVisible: Boolean,
  question: Object,
});

const emit = defineEmits(["save", "deleted"]);

// Reaktive Daten
const editableQuestion = reactive({ ...props.question });
const categories = ref([]);
const message = ref("");
const messageType = ref("info");

// Methoden
const fetchCategories = async () => {
  try {
    const response = await fetch("http://localhost:3000/dashboard/categories", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    categories.value = await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    message.value = "Failed to load categories.";
    messageType.value = "error";
  }
};

const toggleCorrectAnswer = (answer) => {
  const index = editableQuestion.correctAnswer.indexOf(answer);
  if (index === -1) {
    editableQuestion.correctAnswer.push(answer);
  } else {
    editableQuestion.correctAnswer.splice(index, 1);
  }
};

const setCorrectAnswer = (answer) => {
  editableQuestion.correctAnswer = answer;
};

const saveChanges = () => {
  message.value = "Question saved successfully!";
  messageType.value = "success";
  setTimeout(() => {
    emit("save", editableQuestion);
  }, 1500);
};

const deleteQuestion = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/cards/delete/${editableQuestion._id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete the question");
    }
    message.value = "Question deleted successfully!";
    messageType.value = "success";
    setTimeout(() => {
      emit("deleted");
    }, 1500);
  } catch (error) {
    console.error("Error deleting question:", error);
    message.value = "Failed to delete the question.";
    messageType.value = "error";
  }
};

// Kategorien laden, wenn die Komponente gemountet wird
onMounted(fetchCategories);
</script>


<style scoped>
.true-false-options {
  display: flex;
  justify-content: space-between;
}

.true-false-label {
  flex: 1;
  text-align: center;
  color: var(--text-color);
  padding: var(--spacing-sm);
  border: 1px solid var(--input-border-color);
  border-radius: var(--radius-sm, 6px);
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.true-false-label input {
  display: none;
  /* Versteckt das echte Radio-Input */
}

.true-false-label.selected {
  background-color: var(--highlight-color, #77C9D4);
  border-color: var(--highlight-color, #77C9D4);
  color: var(--button-text-color, #fff);
}

.true-false-label:not(:last-child) {
  margin-right: var(--spacing-sm);
}

select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--input-border-color, #444);
  background: var(--card-bg-color, #333);
  color: var(--text-color, white);
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
}

.option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: var(--spacing-sm);
  border: 1px solid var(--input-border-color, #444);
  border-radius: 4px;
  background: var(--card-bg-color, #333);
  color: var(--text-color, white);
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.answer-input {
  flex-grow: 1;
  background: transparent;
  border: none;
  color: var(--text-color, white);
  font-size: 1rem;
  outline: none;
}

.icon-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: none;
}

.icon-indicator i {
  font-size: 1.2rem;
}

.icon-indicator:hover i {
  transform: scale(1.2);
  /* Vergrößerung beim Hover */
}

.icon-indicator i.fas.fa-check {
  transition: none;
  color: var(--correct-color, #57BC90);
  /* Grün für korrekt */
}

.icon-indicator i.fas.fa-times {
  transition: none;
  color: var(--incorrect-color, #d83129);
  /* Rot für falsch */
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  font-family: var(--font-family-default);
  background-color: var(--card-bg-color, #1e1e1e);
  color: var(--text-color, white);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.modal h3 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
}

.modal label {
  display: block;
  margin-top: 1rem;
}

.inputquestion {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--input-border-color, #444);
  background: var(--card-bg-color, #333);
  color: var(--text-color, white);
  font-size: 1rem;
}

.answer-section {
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.save-btn {
  background-color: var(--save-color);
  color: var(--button-text-color);
}

.delete-btn {
  background-color: var(--delete-color);
  color: var(--button-text-color);
  margin-left: 0.5rem;
}

.cancel-btn {
  background-color: var(--cancel-color);
  color: var(--button-text-color);
  margin-left: 0.5rem;
}

.btn:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
</style>
