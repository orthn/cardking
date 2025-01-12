<template>
  <transition name="fade">
    <div v-if="show" class="modal" @click.self="closeModal">
      <div class="modal-content">
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

<script>
export default {
  name: "CreateCardModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      card: {
        question: "",
        category: "",
        type: "true_false",
        answers: ["True", "False"],
        correctAnswer: [],
      },
      message: "",
    };
  },
  methods: {
    handleFileSelect(event) {
      const files = event.target.files;
      if (files && files.length > 0) {
        this.selectedFile = files[0];
      }
    },
    async importCards() {
      if (!this.selectedFile) {
        this.message = "Please select a file to import.";
        return;
      }

      const formData = new FormData();
      formData.append("file", this.selectedFile);

      try {
        const response = await fetch("http://localhost:3000/cards/import", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to import cards: ${response.statusText}`);
        }

        const data = await response.json();
        this.message = "Cards imported successfully!";
        console.log("Imported cards:", data);
      } catch (error) {
        this.message = `Error importing cards: ${error.message}`;
        console.error(error);
      } finally {
        this.selectedFile = null;
        if (this.$refs.importFile) {
          this.$refs.importFile.value = ""; // Reset file input
        }
      }
    },
    updateAnswerFields() {
      this.card.correctAnswer = [];
      if (this.card.type === "true_false") {
        this.card.answers = ["True", "False"];
      } else {
        this.card.answers = ["", "", "", ""];
      }
    },
    toggleAnswer(index) {
      if (this.card.type === "single_choice" || this.card.type === "true_false") {
        this.card.correctAnswer = [index];
      } else if (this.card.type === "multiple_choice") {
        if (this.card.correctAnswer.includes(index)) {
          this.card.correctAnswer = this.card.correctAnswer.filter((i) => i !== index);
        } else {
          this.card.correctAnswer.push(index);
        }
      }
    },
    async submitForm() {
      try {
        const cardData = {
          question: this.card.question,
          category: this.card.category,
          type: this.card.type,
          answers: this.card.answers,
          correctAnswer:
            this.card.type === "multiple_choice"
              ? this.card.correctAnswer.map((index) => this.card.answers[index])
              : this.card.type === "single_choice"
                ? this.card.answers[this.card.correctAnswer[0]]
                : this.card.correctAnswer[0],
        };

        const response = await fetch("http://localhost:3000/cards/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cardData),
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to create card");

        this.resetForm();
        this.closeModal();
      } catch (err) {
        this.message = "Error creating card: " + err.message;
        console.error(err);
      }
    },
    resetForm() {
      this.card = {
        question: "",
        category: "",
        type: "true_false",
        answers: ["True", "False"],
        correctAnswer: [],
      };
    },
    closeModal() {
      this.$emit("close");
    },
  },
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