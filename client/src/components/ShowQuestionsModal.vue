<template>
  <div v-if="isVisible" class="modal-backdrop"  @click="closeModal">
    <div class="modal" @click.stop>
      <button class="exportbtn"  @click="exportQuestions">Export</button>
     <!-- <h3>Questions in {{ categoryName }}</h3>-->
      <div class="questions-list">
        <ul>
          <li
              v-for="(question, index) in questions"
              :key="index"
              class="question-item"
          >
          <span class="question-text">{{ question.question }}</span>
            <div class="question-meta">
              <span class="question-type">Typ: {{ question.type }}</span>
              <button @click="editQuestion(question)" class="btn edit-btn">
                Edit
              </button>
            </div>
          </li>
        </ul>
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
    categoryId: String,
  },
  methods: {
    editQuestion(question) {
      this.$emit("edit-question", question);
      console.log("Formatted question: ", JSON.stringify(question, null, 2));
    },
    closeModal() {
      this.$emit("close");
    },
    async exportQuestions() {
      if (!this.categoryId) {
        console.error("Category ID is required for export.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/cards/export?categoryId=${this.categoryId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Export failed: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `export_${this.categoryName || "cards"}.json`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error exporting questions:", error);
      }
    },
  },
};

</script>

<style scoped>
.exportbtn{
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--cancel-color);
  color: var(--button-text-color, #fff);
  border: none;
  border-radius: var(--border-radius, 8px);
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 1rem;
}
.exportbtn:hover {
  background-color: var(--highlight-color, #77C9D4);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  max-height: 90%;
  overflow: auto;
  animation: fadeIn 0.3s ease-out;

}

.questions-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.question-item {
  display: grid;
  grid-template-rows: auto auto; /* Zwei Zeilen: Frage und Meta */
  grid-template-columns: 1fr auto; /* Zwei Spalten in der Meta-Zeile */
  gap: 0.5rem; /* Abstand zwischen den Zeilen und Spalten */
  padding: 1rem;
  background-color: var(--card-bg-color, #333);
  border: 1px solid var(--input-border-color, #444);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.question-text {
  grid-column: span 2; /* Frage nimmt beide Spalten ein */
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal; /* Mehrzeilige Darstellung erlauben */
}

.question-meta {
  display: flex;
  justify-content: space-between; /* Typ links, Button rechts */
  align-items: center;
  grid-column: span 2; /* Meta-Daten nehmen beide Spalten ein */
}

.question-type {
  font-size: 0.9rem;
  color: var(--muted-text-color, #a5a5af); /* Dezenter Text für den Typ */
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
}

.edit-btn {
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
}

.btn:hover {
  background-color: var(--highlight-color); /* Hover-Farbe */
  box-shadow: 0 6px 15px var(--highlight-color); /* Hover-Schatten */
}
</style>
