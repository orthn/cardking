<template>
  <div v-if="isVisible" class="modal-backdrop">
    <div class="modal">
      <h3>Questions in {{ categoryName }}</h3>
      <br>

      <div class="questions-list">
        <ul>
          <li
              v-for="(question, index) in questions"
              :key="index"
              class="question-item"
          >
            <span>{{ question.question }} ({{ question.type }})</span>
            <button @click="editQuestion(question)" class="btn edit-btn">Edit</button>
          </li>
        </ul>
      </div>

      <div class="actions">
        <button @click="$emit('close')" class="btn cancel-btn">Cancel</button>
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
  methods: {
    editQuestion(question) {
      this.$emit("edit-question", question);
      console.log("Formatted question: ", JSON.stringify(question, null, 2));
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
  background-color: var(--card-bg-color, #1e1e1e);
  color: var(--text-color, white);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  max-width: 600px;
  width: 90%;
  display: flex;
  flex-direction: column;
}

.questions-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.question-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--card-bg-color, #333);
  border: 1px solid var(--input-border-color, #444);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.edit-btn {
  background-color: var(--highlight-color, #57bc90);
  color: var(--button-text-color, white);
}

.cancel-btn {
  background-color: var(--danger-color, #dc3545);
  color: var(--button-text-color, white);
}

.btn:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
</style>
