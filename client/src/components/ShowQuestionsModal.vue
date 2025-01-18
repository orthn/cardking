<template>
  <transition name="fade">
    <div v-if="isVisible" class="modal-backdrop" @click="closeModal">
      <div class="modal" @click.stop>
        <MessageBox :message="message" :type="messageType" />

        <button class="exportbtn" @click="exportQuestions">Export</button>
        <div class="questions-list">
          <ul>
            <li
              v-for="(question, index) in questions"
              :key="index"
              class="question-item"
            >
              <span class="question-text">{{ question.question }}</span>
              <div class="question-meta">
                <span class="question-type">Type: {{ question.type }}</span>
                <button @click="editQuestion(question)" class="btn edit-btn">
                  Edit
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";
import MessageBox from "@/components/MessageBox.vue";

// Props
const props = defineProps({
  isVisible: Boolean,
  categoryName: String,
  questions: Array,
  categoryId: String,
});

// Emit Events
const emit = defineEmits(["edit-question", "close"]);

// Reactive state for MessageBox
const message = ref("");
const messageType = ref("info");

// Methods
const editQuestion = (question) => {
  emit("edit-question", question);
  console.log("Formatted question:", JSON.stringify(question, null, 2));
};

const closeModal = () => {
  emit("close");
};

const exportQuestions = async () => {
  if (!props.categoryId) {
    message.value = "Category ID is required for export.";
    messageType.value = "error";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/cards/export?categoryId=${props.categoryId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    const responseText = await response.text();
    const data = JSON.parse(responseText);
    const categoryName = data.category || "cards";

    const blob = new Blob([responseText], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `export_${categoryName}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    message.value = "Questions exported successfully!";
    messageType.value = "success";
  } catch (error) {
    console.error("Error exporting questions:", error);
    message.value = "Error exporting questions.";
    messageType.value = "error";
  }
};
</script>

<style scoped>
.exportbtn {
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
  font-family: var(--font-family-default);
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
  grid-template-rows: auto auto;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  padding: 1rem;
  background-color: var(--card-bg-color, #333);
  border: 1px solid var(--input-border-color, #444);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
.question-text {
  grid-column: span 2;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}
.question-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-column: span 2;
}
.question-type {
  font-size: 0.9rem;
  color: var(--muted-text-color, #a5a5af);
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
  background-color: var(--highlight-color);
  box-shadow: 0 6px 15px var(--highlight-color);
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
