<template>
  <div>
    <div class="welcome-box">
      Willkommen <span>{{ username }}</span> im Dashboard!
    </div>
    <div class="dashboard">
      <!-- Left Section: Statistics -->
      <div class="dashboard-sidebar">
        <h3>Statistics</h3>
        <Statistics />
      </div>

     <!-- Main Section: Cards and Categories -->
     <div class="dashboard-main">
        <h3>Categories</h3>
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
        <h3>Actions</h3>
        <button class="btn" @click="$emit('startQuiz', selectedCategory)" :disabled="!selectedCategory">
          Start Quiz
        </button>

        <button class="btn" @click="showModal = true">Create Card</button>
        <button class="btn" @click="openShowQuestionsModal" :disabled="!selectedCategory">
          Show Questions
        </button>
      </div>
    </div>


    <CreateCardModal :show="showModal" :categories="categories" @close="handleModalClose" />

    <ShowQuestionsModal v-if="isShowQuestionsModalVisible" :isVisible="isShowQuestionsModalVisible"
      :categoryName="selectedCategory" :categoryId="selectedCategory"  :questions="selectedCategoryQuestions" @edit-question="openEditQuestionModal"
      @close="isShowQuestionsModalVisible = false" />


    <EditQuestionModal v-if="isEditQuestionModalVisible" :isVisible="isEditQuestionModalVisible"
      :question="currentEditingQuestion" @save="updateQuestion" @deleted="handleQuestionDeleted"
      @close="closeEditQuestionModal" />

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Statistics from './Statistics.vue';
import CreateCardModal from '../components/CreateCardModal.vue';
import ShowQuestionsModal from '../components/ShowQuestionsModal.vue';
import EditQuestionModal from "@/components/EditQuestionModal.vue";
export default {
  name: 'Dashboard',
  components: {
    Statistics,
    CreateCardModal,
    ShowQuestionsModal,
    EditQuestionModal
  },
  setup() {
    const categories = ref([]);
    const showModal = ref(false);
    const selectedCategory = ref(null);
    const selectedCategoryQuestions = ref([]);
    const isShowQuestionsModalVisible = ref(false);
    const isEditQuestionModalVisible = ref(false);
    const currentEditingQuestion = ref(null);
    const username = ref('Gast');

    const selectCategory = (category) => {
      if (selectedCategory.value === category._id) {
        selectedCategory.value = null; // Deselect
      } else {
        selectedCategory.value = category._id; // Speichere nur die ID
      }
    };

    const fetchUserData = async () => {
    try {
        const response = await fetch('http://localhost:3000/users/data', {
            method: 'GET',
            credentials: 'include', // Wichtig, um das Session-Cookie zu senden
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error:', error);
            throw new Error(error.message || 'Failed to fetch user data');
        }

        const userData = await response.json();
        username.value = userData.user.username;
    } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error.message);
    }
};

    const updateQuestion = async (updatedQuestion) => {
      try {
        const response = await fetch(`http://localhost:3000/cards/update/${updatedQuestion._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: updatedQuestion.question,
            type: updatedQuestion.type,
            answers: updatedQuestion.answers,
            correctAnswer: updatedQuestion.correctAnswer,
            category: updatedQuestion.categoryId,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update question");
        }

        const updatedCard = await response.json();
        console.log("Question updated successfully:", updatedCard);

        const index = selectedCategoryQuestions.value.findIndex(
          (question) => question._id === updatedQuestion._id
        );

        if (index !== -1) {
          selectedCategoryQuestions.value[index] = updatedCard.updatedCard;
        }

        closeEditQuestionModal();
      } catch (error) {
        console.error("Error updating question:", error.message);
        alert("An error occurred while updating the question: " + error.message);
      }
    };


    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/dashboard/categories', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch categories');

        categories.value = await response.json(); // Hier kommen Kategorien mit IDs rein
        console.log('Fetched categories:', categories.value);
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchCategoryQuestions = async (categoryId) => {
      try {
        const response = await fetch(`http://localhost:3000/cards/category?category=${categoryId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Category not found");
          }
          throw new Error("Failed to fetch questions");
        }

        selectedCategoryQuestions.value = await response.json();
        console.log("Fetched questions:", selectedCategoryQuestions.value);
      } catch (error) {
        console.error("Error fetching questions:", error.message);
      }
    };


    const openShowQuestionsModal = async () => {
      if (!selectedCategory.value) return;
      await fetchCategoryQuestions(selectedCategory.value);
      isShowQuestionsModalVisible.value = true;
    };
    const openEditQuestionModal = (question) => {
      currentEditingQuestion.value = question;
      isEditQuestionModalVisible.value = true;
    };

    const closeEditQuestionModal = () => {
      currentEditingQuestion.value = null;
      isEditQuestionModalVisible.value = false;
      return;
    };

    const handleQuestionDeleted = async () => {
      try {
        closeEditQuestionModal();
        await fetchCategoryQuestions(selectedCategory.value);
        isShowQuestionsModalVisible.value = true;
        console.log('Questions reloaded and modal updated after deletion.');
        return;
      } catch (error) {
        console.error('Error handling question deletion:', error.message);
        return;
      }
    };





    const handleModalClose = () => {
      showModal.value = false;
      fetchCategories();
    };

    onMounted(() => {
      fetchCategories();
      fetchUserData();
    });

    return {
      username,
      selectedCategory,
      categories,
      showModal,
      handleModalClose,
      fetchCategories,
      selectCategory,
      isShowQuestionsModalVisible,
      openShowQuestionsModal,
      selectedCategoryQuestions,
      isEditQuestionModalVisible,
      openEditQuestionModal,
      closeEditQuestionModal,
      currentEditingQuestion,
      updateQuestion,
      handleQuestionDeleted,
    };
  },
};
</script>

<style scoped>
.welcome-box {
  position: absolute;
  top: -340px;
  margin: 1rem auto;
  padding: 1rem 2rem;
  background: var(--card-bg-color, #57bc90); /* Passende Farbe */
  color: var(--text-color); /* Weißer Text für Kontrast */
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.welcome-box span {
  color: var(--highlight-color); /* Helle Akzentfarbe für den Namen */
  text-transform: uppercase;

}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.1);
  }
  60% {
    transform: scale(1.05);
  }
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, max-content));
  gap: 1rem;
  justify-content: center;
}

.category-box {
  padding: 0.5rem 1rem;
  background-color: var(--card-bg-color, #f9f9f9);
  border: 1px solid var(--input-border-color, #ddd);
  border-radius: var(--radius-sm, 4px);
  text-align: center;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
  cursor: pointer;
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

.dashboard {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  /* Drei Spalten */
  gap: var(--spacing-md, 1rem);
  /* Abstand zwischen den Bereichen */
  padding: var(--spacing-lg, 2rem);
  /* Außenabstand */
  font-family: var(--font-family-default);
  /* Hauptschriftart */
  color: var(--text-color);
  /* Textfarbe */
}

.dashboard-sidebar,
.dashboard-main,
.dashboard-actions {
  background-color: var(--card-bg-color);
  /* Kartenhintergrund */
  border-radius: var(--border-radius, 8px);
  /* Abgerundete Ecken */
  padding: var(--spacing-lg, 1rem);
  /* Innenabstand */
  box-shadow: 0 6px 8px var(--shadow-color);
  /* Schatteneffekt */
  width: auto;
}

.dashboard-sidebar h3,
.dashboard-main h3,
.dashboard-actions h3 {
  font-family: var(--font-family-heading);
  /* Schrift für Überschriften */
  color: var(--text-color);
  /* Haupttextfarbe */
  margin-bottom: var(--spacing-sm, 0.5rem);
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
  margin: var(--spacing-sm, 0.5rem) 0;
  padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
  background-color: var(--button-bg-color);
  /* Button-Farbe */
  color: var(--button-text-color);
  /* Button-Textfarbe */
  border: none;
  border-radius: var(--border-radius, 8px);
  /* Abgerundete Buttons */
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.btn:hover {
  background-color: var(--highlight-color);
  /* Hover-Farbe */
  box-shadow: 0 6px 15px var(--highlight-color);
  /* Hover-Schatten */
}

.message {
  margin-top: 1rem;
  font-size: 0.875rem;
  text-align: center;
}

.message.success {
  color: var(--button-text-color, #57BC90);
}

.message.error {
  color: var(--danger-color, #dc3545);
}
</style>