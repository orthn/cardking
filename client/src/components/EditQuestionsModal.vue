<template>
  <div v-if="isVisible" class="modal-backdrop">
    <div class="modal">
      <!-- Header -->
      <h3 v-if="!selectedQuestion">Questions in {{ categoryName }}</h3>
      <h3 v-else>Edit Question</h3>

      <div v-if="!selectedQuestion" class="questions-list">
        <ul>
          <li
              v-for="(question, index) in questions"
              :key="index"
              class="question-item"
          >
            <span>{{ question.question }} ({{ question.type }})</span>
            <button @click="selectQuestion(question)" class="btn edit-btn">Edit</button>
          </li>
        </ul>
      </div>

      <div v-else>
        <div v-if="selectedQuestion.type === 'multiple-choice'">
          <h4>Multiple Choice</h4>
          <label>Question:</label>
          <input v-model="selectedQuestion.question" type="text" />
          <label>Options:</label>
          <div v-for="(option, optIndex) in selectedQuestion.options" :key="optIndex">
            <input v-model="selectedQuestion.options[optIndex].text" placeholder="Option text" />
            <input
                type="checkbox"
                v-model="selectedQuestion.options[optIndex].isCorrect"
            />
            <span>Correct</span>
          </div>
          <button @click="addOption">Add Option</button>
        </div>

        <div v-else-if="selectedQuestion.type === 'single-choice'">
          <h4>Single Choice</h4>
          <label>Question:</label>
          <input v-model="selectedQuestion.question" type="text" />
          <label>Options:</label>
          <div v-for="(option, optIndex) in selectedQuestion.options" :key="optIndex">
            <input v-model="selectedQuestion.options[optIndex].text" placeholder="Option text" />
            <input
                type="radio"
                :value="optIndex"
                v-model="selectedQuestion.correctOption"
            />
            <span>Correct</span>
          </div>
          <button @click="addOption">Add Option</button>
        </div>

        <div v-else-if="selectedQuestion.type === 'true-false'">
          <h4>True/False</h4>
          <label>Question:</label>
          <input v-model="selectedQuestion.question" type="text" />
          <label>Answer:</label>
          <input
              type="radio"
              value="true"
              v-model="selectedQuestion.correctAnswer"
          />
          <span>True</span>
          <input
              type="radio"
              value="false"
              v-model="selectedQuestion.correctAnswer"
          />
          <span>False</span>
        </div>

        <!-- Actions -->
        <button @click="saveChanges" class="btn save-btn">Save</button>
        <button @click="cancelEdit" class="btn cancel-btn">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    categoryName: String,
    questions: Array,
  },
  data() {
    return {
      selectedQuestion: null,
    };
  },
  methods: {
    selectQuestion(index) {
      this.selectedQuestion = JSON.parse(JSON.stringify(this.questions[index]));
    },
    cancelEdit() {
      this.selectedQuestion = null; // Reset the selected question
    },
    saveChanges() {
      const updatedIndex = this.questions.findIndex(
          (q) => q._id === this.selectedQuestion._id
      );
      if (updatedIndex !== -1) {
        this.$emit("save", this.selectedQuestion, updatedIndex); // Emit updated question to parent
      }
      this.selectedQuestion = null; // Reset after saving
    },
    addOption() {
      if (
          this.selectedQuestion.type === "multiple-choice" ||
          this.selectedQuestion.type === "single-choice"
      ) {
        this.selectedQuestion.options.push({ text: "", isCorrect: false });
      }
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
}

.modal {
  background: #1e1e1e;
  color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  max-width: 600px;
  width: 90%;
}

.questions-list ul {
  list-style: none;
  padding: 0;
}

.question-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #57bc90;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.save-btn {
  background-color: #57bc90;
}

.cancel-btn {
  background-color: #dc3545;
}
</style>
