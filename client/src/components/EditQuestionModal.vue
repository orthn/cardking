<template>
  <div v-if="isVisible" class="modal-backdrop">
    <div class="modal">
      <h3>Edit Question</h3>
      <label>Question:</label>
      <input v-model="editableQuestion.question" type="text" />

      <!-- Multiple Choice -->
      <div v-if="editableQuestion.type === 'multiple_choice'" class="edit-section">
        <h4>Multiple Choice</h4>
        <div
            v-for="(answer, index) in editableQuestion.answers"
            :key="index"
            class="answer-section"
        >
          <label>Option {{ index + 1 }}:</label>
          <div class="option-row">
            <input
                v-model="editableQuestion.answers[index]"
                placeholder="Option text"
            />
            <input
                type="checkbox"
                :value="answer"
                :checked="editableQuestion.correctAnswer.includes(answer)"
                @change="toggleCorrectAnswer(answer)"
            />
          </div>
        </div>
      </div>

      <!-- Single Choice -->
      <div v-else-if="editableQuestion.type === 'single_choice'" class="edit-section">
        <h4>Single Choice</h4>
        <div
            v-for="(answer, index) in editableQuestion.answers"
            :key="index"
            class="answer-section"
        >
          <label>Option {{ index + 1 }}:</label>
          <input
              v-model="editableQuestion.answers[index]"
              placeholder="Option text"
          />
          <input
              type="radio"
              :value="answer"
              v-model="editableQuestion.correctAnswer"
          />
        </div>
      </div>

      <!-- True/False -->
      <div v-else-if="editableQuestion.type === 'true_false'" class="edit-section">
        <h4>True/False</h4>
        <label>Correct Answer:</label>
        <select v-model="editableQuestion.correctAnswer">
          <option value="True">True</option>
          <option value="False">False</option>
        </select>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button @click="saveChanges" class="btn save-btn">Save</button>
        <button @click="$emit('close')" class="btn cancel-btn">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    question: Object,
  },
  data() {
    return {
      editableQuestion: JSON.parse(JSON.stringify(this.question)),
    };
  },
  methods: {
    toggleCorrectAnswer(answer) {
      const index = this.editableQuestion.correctAnswer.indexOf(answer);
      if (index === -1) {
        this.editableQuestion.correctAnswer.push(answer);
      } else {
        this.editableQuestion.correctAnswer.splice(index, 1);
      }
    },
    saveChanges() {
      this.$emit("save", this.editableQuestion);
    },
  },
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
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
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
  font-weight: bold;
}

.modal input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--input-border-color, #444);
  background: var(--card-bg-color, #333);
  color: var(--text-color, white);
  font-size: 1rem;
}

.edit-section {
  margin-top: 1rem;
}

.answer-section {
  margin-bottom: 1rem;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
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
  transition: background-color 0.3s, box-shadow 0.3s;
}

.save-btn {
  background-color: var(--highlight-color, #57bc90);
  color: var(--button-text-color, white);
}

.cancel-btn {
  background-color: var(--danger-color, #dc3545);
  color: var(--button-text-color, white);
  margin-left: 0.5rem;
}

.btn:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
</style>
