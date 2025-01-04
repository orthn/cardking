<template>
    <transition name="fade">
      <div v-if="show" class="modal" @click.self="closeModal">
        <div class="modal-content">
          <h3 class="title">Create a New Card</h3>
          <form @submit.prevent="submitForm" class="form">
            <!-- Question -->
            <div class="form-group full-width">
              <label for="question" class="form-label">Question:</label>
              <textarea
                id="question"
                v-model="card.question"
                class="form-input"
                placeholder="Enter the question"
                required
              ></textarea>
            </div>
  
            <!-- Category -->
            <div class="form-group full-width">
              <label for="category" class="form-label">Category:</label>
              <input
                id="category"
                v-model="card.category"
                list="category-list"
                class="form-input"
                placeholder="Enter or select a category"
                required
              />
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
  
            <!-- Answer Cards -->
            <div class="form-group full-width">
              <label class="form-label">Answers:</label>
              <div class="answer-grid">
                <div
                  v-for="(answer, index) in card.answers"
                  :key="index"
                  class="answer-card"
                  :class="{ correct: card.correctAnswer.includes(index) }"
                  @click="toggleAnswer(index)"
                >
                  <input
                    v-model="card.answers[index]"
                    type="text"
                    class="form-input answer-text"
                    :placeholder="`Answer ${index + 1}`"
                    required
                  />
                </div>
              </div>
            </div>
  
            <!-- Actions -->
            <div class="form-actions">
              <button type="submit" class="btn">Save Card</button>
              <button type="button" class="btn close-btn" @click="closeModal">Close</button>
            </div>
          </form>
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
          answers: [],
          correctAnswer: [],
        },
      };
    },
    methods: {
      updateAnswerFields() {
        this.card.answers = [];
        this.card.correctAnswer = [];
        if (this.card.type === "true_false") {
          this.card.answers = ["True", "False"];
          this.card.correctAnswer = [0];
        } else {
          this.card.answers = ["", "", "", ""];
        }
      },
      toggleAnswer(index) {
        if (this.card.type === "single_choice") {
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
            ...this.card,
            correctAnswer:
              this.card.type === "multiple_choice"
                ? this.card.correctAnswer.map((index) => this.card.answers[index])
                : this.card.answers[this.card.correctAnswer[0]],
          };
  
          const response = await fetch("http://localhost:3000/cards/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cardData),
          });
  
          if (!response.ok) {
            alert("Failed to create the card.");
            return;
          }
  
          alert("Card created successfully!");
          this.resetForm();
          this.closeModal();
        } catch (err) {
          alert("Network error: " + err.message);
        }
      },
      resetForm() {
        this.card = {
          question: "",
          category: "",
          type: "true_false",
          answers: [],
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
  
  .btn {
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--button-bg-color, #57BC90);
    color: var(--button-text-color, #fff);
    border: none;
    border-radius: var(--border-radius, 8px);
    font-weight: bold;
    cursor: pointer;
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
  