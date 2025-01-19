<template>
  <div>
    <div class="dashboard">
      <div class="welcome-box">
        <div class="crown-wrapper">
          <transition>
            <div class="crown-icon">
              <svg v-if="successRate < 50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 293.47 197.17">
                <g>
                  <path
                    d="M97.36,15.95c3.19,1.73,3.99,1.73,7.31,0,4.92-2.79,5.84-10.77,1.33-13.82-1.59-1.2-3.85-2.13-5.05-2.13s-3.45.93-5.05,2.13c-4.52,3.05-3.59,11.02,1.46,13.82Z" />
                  <path
                    d="M126.99,81.73c-.4,12.89-1.59,26.44-2.79,31.76-1.59,7.44-1.73,9.57-.4,11.57.93,1.19,4.52,5.71,7.84,9.97,3.32,4.38,8.1,11.56,10.5,16.21l4.39,8.37,5.18-9.44c2.79-5.32,8.37-13.69,12.36-18.87l7.31-9.3v-10.37c0-34.69-13.95-63.93-39.2-81.73-10.23-7.17-17.28-10.9-16.21-8.5,10.63,24.45,11.96,31.89,11.03,60.33Z" />
                  <path
                    d="M113.3,172.5l28.84.26v-3.19c0-9.57-19.53-38.81-33.49-50.24-19.67-16.08-47.71-24.19-66.31-19.14-7.31,1.99-12.62,5.59-19.67,13.69-5.85,6.52-6.91,9.17-3.06,7.71,12.36-4.79,26.05-3.46,36.55,3.46,10.23,6.77,21.26,23.52,26.18,39.73l2.13,7.31,28.84.4Z" />
                  <path
                    d="M261.35,105.39c-10.23-6.78-22.99-8.51-38.8-5.05-23.12,5.05-45.71,21.93-60.87,45.32-4.92,7.44-11.56,22.86-11.56,26.44,0,.4,13.03.66,28.97.66h29.1l1.6-5.72c.93-3.06,3.99-10.37,6.77-16.35,11.96-24.85,31.1-36.28,51.16-30.57,4.12,1.33,7.84,1.99,8.11,1.73,1.33-1.33-8.64-12.49-14.49-16.48Z" />
                  <path
                    d="M1.27,130.1c-2.26,4.26-1.46,7.97,1.99,10.24,6.91,4.52,14.75-4.12,9.3-10.1-3.06-3.46-9.43-3.46-11.3-.14Z" />
                  <path
                    d="M291.65,130.24c-3.06-3.46-9.43-3.46-11.3-.14-2.26,4.26-1.46,7.97,1.99,10.24,6.91,4.52,14.75-4.12,9.3-10.1Z" />
                  <rect x="83.76" y="181.04" width="125.94" height="15.66"
                    transform="translate(-1.42 1.11) rotate(-.43)" />
                </g>
              </svg>
              <svg v-else-if="successRate < 85" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 205.57 147.61">
                <g>
                  <path
                    d="M205.57,62.1l-2.91,62.03c0,.14-.07.29-.17.38-.31-.05-.62-.07-.93-.07H4.01c-.31,0-.62.02-.93.07-.1-.1-.17-.24-.17-.38L0,62.1c-.05-.86,1.22-1,1.36-.14,5.02,27.63,14.66,45.57,26.56,45.57,13.78,0,24.96-54.86,24.96-71.56,0,32.89,11.15,71.56,24.96,71.56S102.77,70.51,102.77,0c0,70.51,11.18,107.53,24.96,107.53s24.96-38.67,24.96-71.56c0,16.69,11.18,71.56,24.96,71.56,11.89,0,21.54-17.94,26.56-45.57.14-.86,1.41-.72,1.36.14Z" />
                  <rect x="3.94" y="131.95" width="197.69" height="15.66" />
                </g>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 223.57 168.54">
                <g>
                  <path
                    d="M197.45,61.82l10.76,13.9c.29,7.51-2.62,20.88-19.36,39.69-13.73-18.89-14.38-32.2-12.84-39.64l13.1-13.95-20.39-34.79-24.26,34.79,11.55,13.95c.66,6.97-1.17,19.09-14.41,36.13-16.96-22.76-18.51-38.99-17.1-48.25l15.8-18.05L111.79,0l-28.5,45.6,15.8,18.05c1.41,9.25-.15,25.48-17.1,48.25-13.24-17.03-15.07-29.15-14.41-36.13l11.55-13.95-24.26-34.79-20.39,34.79,13.1,13.95c1.53,7.45.88,20.75-12.84,39.64-16.74-18.81-19.65-32.18-19.36-39.69l10.76-13.9L0,27.03l4.56,41.72,2,18.34,4.39,40.21h0s2.01,18.38,2.01,18.38h197.65l2.01-18.38h0s4.39-40.21,4.39-40.21l2-18.34,4.56-41.72-26.12,34.79Z" />
                  <rect x="13.63" y="152.89" width="197.69" height="15.66" />
                </g>
              </svg>
            </div>
          </transition>
        </div>
        <div class="welcome-text">
          Welcome <span>{{ userData.username }}</span> to the Dashboard!
        </div>

      </div>
      <div class="dashboard-content">
        <!-- Left Section: Statistics -->
        <div class="dashboard-sidebar">
          <h2>Statistics</h2>
          <Statistics @updateSuccessRate="$emit('updateSuccessRate', $event)" />
        </div>

        <!-- Main Section: Cards and Categories -->
        <div class="dashboard-main">
          <h2>Categories</h2>
          <div>
            <p v-if="categories.length === 0">Loading categories...</p>
            <div v-else class="category-grid">
              <div v-for="category in categories" :key="category._id" class="category-box"
                :class="{ selected: selectedCategory === category._id }" @click="selectCategory(category)">
                {{ category.category }}
              </div>

            </div>
          </div>
        </div>

        <!-- Right Section: Actions -->
        <div class="dashboard-actions">
          <h2>Actions</h2>
          <button class="btn" @click="$emit('startQuiz', selectedCategory)"
            :disabled="!selectedCategory || !isCategoryValid">
            Start Quiz
          </button>

          <button class="btn" @click="showModal = true">Create Card</button>
          <button class="btn" @click="showCreateCategoryModal = true">
            Create Category
          </button>

          <button
              class="btn"
              @click="openShowQuestionsModal"
              :disabled="!selectedCategoryQuestions.length"
          >
            Show Questions
          </button>

        </div>
      </div>
    </div>


    <CreateCardModal :show="showModal" :categories="categories" @close="handleModalClose" />

    <CreateCategoryModal v-if="showCreateCategoryModal" :show="showCreateCategoryModal"
                         @close="handleCreateCategoryModalClose" />

    <ShowQuestionsModal v-if="isShowQuestionsModalVisible" :isVisible="isShowQuestionsModalVisible"
      :categoryName="selectedCategory" :categoryId="selectedCategory" :questions="selectedCategoryQuestions"
      @edit-question="openEditQuestionModal" @close="isShowQuestionsModalVisible = false" />


    <EditQuestionModal v-if="isEditQuestionModalVisible" :isVisible="isEditQuestionModalVisible"
      :question="currentEditingQuestion" @save="updateQuestion" @deleted="handleQuestionDeleted"
      @close="closeEditQuestionModal" />

  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import Statistics from './Statistics.vue';
import CreateCardModal from '../components/CreateCardModal.vue';
import CreateCategoryModal from "@/components/CreateCategoryModal.vue";
import ShowQuestionsModal from '../components/ShowQuestionsModal.vue';
import EditQuestionModal from "@/components/EditQuestionModal.vue";

export default {
  name: 'Dashboard',
  props: {
    userData: Object,
    successRate: Number,
  },
  components: {
    Statistics,
    CreateCardModal,
    CreateCategoryModal,
    ShowQuestionsModal,
    EditQuestionModal
  },
  setup() {
    const categories = ref([]); // Kategorien-Liste
    const showModal = ref(false); // Modal für Karten erstellen
    const selectedCategory = ref(null); // Aktuell ausgewählte Kategorie
    const selectedCategoryQuestions = ref([]); // Fragen der ausgewählten Kategorie
    const isShowQuestionsModalVisible = ref(false); // ShowQuestions Modal anzeigen
    const isEditQuestionModalVisible = ref(false); // EditQuestion Modal anzeigen
    const currentEditingQuestion = ref(null); // Aktuelle Frage zum Bearbeiten

    const isCategoryValid = computed(() => selectedCategoryQuestions.value.length >= 10); // Validierung der Kategorie

    // Kategorie auswählen und Fragen laden
    const selectCategory = async (category) => {
      if (selectedCategory.value === category._id) {
        selectedCategory.value = null; // Deselektieren
        selectedCategoryQuestions.value = [];
      } else {
        selectedCategory.value = category._id; // Kategorie auswählen
        await fetchCategoryQuestions(category._id); // Fragen laden
      }
    };

    // Fragen für eine Kategorie laden
    const fetchCategoryQuestions = async (categoryId) => {
      try {
        const response = await fetch(
          `http://localhost:3000/cards/category?category=${categoryId}`,
          { method: "GET", credentials: "include" }
        );

        if (!response.ok) throw new Error("Failed to fetch questions");

        const questions = await response.json();
        selectedCategoryQuestions.value = questions; // Fragen speichern
      } catch (error) {
        console.error("Error fetching questions:", error.message);
        selectedCategoryQuestions.value = []; // Leeren bei Fehler
      }
    };

    // ShowQuestions Modal öffnen
    const openShowQuestionsModal = () => {
      if (selectedCategoryQuestions.value.length) {
        isShowQuestionsModalVisible.value = true;
      } else {
        alert("Keine Fragen für die ausgewählte Kategorie verfügbar.");
      }
    };

    // EditQuestion Modal öffnen
    const openEditQuestionModal = (question) => {
      currentEditingQuestion.value = question;
      isEditQuestionModalVisible.value = true;
    };

    // EditQuestion Modal schließen
    const closeEditQuestionModal = () => {
      currentEditingQuestion.value = null;
      isEditQuestionModalVisible.value = false;
    };

    // Frage löschen und aktualisieren
    const handleQuestionDeleted = async () => {
      if (selectedCategory.value) {
        await fetchCategoryQuestions(selectedCategory.value); // Fragen neu laden
      }
      isShowQuestionsModalVisible.value = false;
      isEditQuestionModalVisible.value = false;
    };

    // Kategorien laden
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/dashboard/categories', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch categories');

        categories.value = await response.json(); // Kategorien speichern
      } catch (error) {
        console.error(error.message);
      }
    };

    // Modal schließen
    const handleModalClose = async () => {
      showModal.value = false;
      fetchCategories();
      if (selectedCategory.value) {
        await fetchCategoryQuestions(selectedCategory.value); // Fragen neu laden
      }
    };

    const showCreateCategoryModal = ref(false);

    const handleCreateCategoryModalClose = async () => {
      showCreateCategoryModal.value = false;
      await fetchCategories(); // Kategorien neu laden
    };

    // Initial Kategorien laden
    onMounted(() => {
      fetchCategories();
    });

    return {
      selectedCategory,
      categories,
      showModal,
      handleModalClose,
      selectCategory,
      isShowQuestionsModalVisible,
      openShowQuestionsModal,
      selectedCategoryQuestions,
      isEditQuestionModalVisible,
      openEditQuestionModal,
      closeEditQuestionModal,
      currentEditingQuestion,
      handleQuestionDeleted,
      isCategoryValid,
      showCreateCategoryModal,
      handleCreateCategoryModalClose,
    };
  },
};
</script>


<style scoped>
.welcome-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-column: 1 / -1;
  margin-bottom: 1rem;
  font-family: var(--font-family-heading);
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: bold;
}

.welcome-text {
  color: var(--text-color);
  background: var(--card-bg-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  width: auto;
}

.crown-icon {
  width: 150px;
  height: auto;
  margin-bottom: 0.8rem;
  fill: var(--highlight-color);
  stroke: var(--text-color);
  stroke-width: 3px;
  filter: drop-shadow(0 0 8px var(--highlight-color)) brightness(1.42);
}

/* Bounce-Animation */
@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
    /* Ausgangspunkt */
  }

  50% {
    transform: translateY(-20px);
    /* Hoch bewegen */
  }
}

.crown-icon:hover {
  animation: bounce 2s infinite;
  /* Bounce-Animation anwenden */
}


.welcome-box span {
  color: var(--highlight-color);
  text-transform: uppercase;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, max-content));
  gap: 1rem;
  justify-content: center;
}

.category-box {
  font-weight: 500;
  padding: 0.5rem 1rem;
  background-color: var(--card-bg-color, #f9f9f9);
  border: 1.5px solid var(--input-border-color, #ddd);
  border-radius: var(--radius-sm, 4px);
  text-align: center;
  align-content: center;
  color: var(--text-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.category-box:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px var(--highlight-color);
  /* Hover-Schatten */

}

.category-box.selected {
  background-color: var(--highlight-color, #57bc90);
  /* Farbe bei Auswahl */
  color: white;
  /* Textfarbe bei Auswahl */
  border-color: var(--highlight-color, #57bc90);
  box-shadow: 0 6px 15px var(--highlight-color);
  /* Hover-Schatten */

}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  /* Drei Spalten in der zweiten Zeile */
  gap: var(--spacing-md, 1rem);
  /* Abstand zwischen Spalten */
}

.dashboard {
  position: relative;
  top: -30px;
  display: grid;
  justify-content: center;
  text-align: center;
  font-family: var(--font-family-default);
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  gap: var(--spacing-md, 1rem);
  padding: var(--spacing-lg, 2rem);
}

.dashboard-sidebar,
.dashboard-main,
.dashboard-actions {
  text-align: center;
  justify-content: center;
  background-color: var(--card-bg-color);
  border-radius: var(--border-radius, 8px);
  padding: var(--spacing-lg, 1rem);
  box-shadow: 0 6px 8px var(--shadow-color);
  width: auto;
}

.dashboard-sidebar h2,
.dashboard-main h2,
.dashboard-actions h2 {

  font-family: var(--font-family-heading);
  /* Schrift für Überschriften */
  color: var(--text-color);
  /* Haupttextfarbe */
  margin-bottom: var(--spacing-md, 0.5rem);
  /* Abstand unter Überschrift */
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  padding: 0.5rem;
  background-color: var(--card-bg-color, #f9f9f9);
  border: 1px solid var(--input-border-color, #ddd);
  margin-bottom: 0.5rem;
  border-radius: var(--radius-sm, 4px);
}

.category-item:hover {
  background-color: var(--highlight-color, #eef);
  cursor: pointer;
}

.btn {
  display: block;
  font-weight: 500;
  width: 100%;
  margin: var(--spacing-md, 0.5rem) 0;
  padding: var(--spacing-md, 0.5rem) var(--spacing-md, 1rem);
  background-color: var(--button-bg-color);
  /* Button-Farbe */
  color: var(--button-text-color);
  /* Button-Textfarbe */
  border: none;
  border-radius: var(--border-radius, 8px);
  /* Abgerundete Buttons */
  cursor: pointer;
  text-align: center;
}

.btn:hover {
  background-color: var(--highlight-color);
  /* Hover-Farbe */
  box-shadow: 0 6px 15px var(--highlight-color);
  /* Hover-Schatten */
}


.btn:disabled {
  background-color: var(--disabled-bg-color, #ccc);
  color: var(--disabled-text-color, #666);
  cursor: not-allowed;
  box-shadow: none;
}
</style>