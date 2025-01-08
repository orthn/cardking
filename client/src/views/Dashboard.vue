<template>
  <div>
    <div class="dashboard">
      <!-- Left Section: Statistics -->
      <div class="dashboard-sidebar">
        <h3>Statistics</h3>
        <Statistics />
      </div>

     <!-- Main Section: Cards and Categories -->
     <div class="dashboard-main">
        <h3>Overview</h3>
        <div>
          <p v-if="categories.length === 0">No Categories</p>
          <div v-else class="category-grid">
            <div
  v-for="category in categories"
  :key="category._id"
  class="category-box"
  :class="{ selected: selectedCategory?.id === category._id }"
  @click="selectCategory(category)"
>
  {{ category.category }}
</div>

          </div>
        </div>
      </div>

      <!-- Right Section: Actions -->
      <div class="dashboard-actions">
        <h3>Actions</h3>
        <button class="btn" :disabled="!selectedCategory" @click="$emit('startQuiz', selectedCategory?.id)">Start Quiz</button>
        <button class="btn" @click="showModal = true">Create Card</button>
      </div>
    </div>

  
    <CreateCardModal
      :show="showModal"
      :categories="categories"
      @close="handleModalClose"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Statistics from './Statistics.vue';
import CreateCardModal from '../components/CreateCardModal.vue';

export default {
  name: 'Dashboard',
  emits: ['startQuiz'],
  components: {
    Statistics,
    CreateCardModal,
  },
  setup() {
    const categories = ref([]);
    const showModal = ref(false);
    const selectedCategory = ref(null); // Speichert die ausgewählte Kategorie

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/dashboard/categories', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch categories');

        categories.value = await response.json();
      } catch (error) {
        console.error(error.message);
      }
    };
    const selectCategory = (category) => {
  if (selectedCategory.value?.id === category._id) {
    selectedCategory.value = null; // Deselektiere, wenn dieselbe Kategorie angeklickt wird
  } else {
    selectedCategory.value = { id: category._id, name: category.category }; // Speichere ID und Name
  }
};


    const handleModalClose = () => {
      showModal.value = false;
      fetchCategories();
    };

    onMounted(() => {
      fetchCategories();
    });

    return {
      selectedCategory,
      categories,
      showModal,
      handleModalClose,
      fetchCategories,
      selectCategory,
    };
  },
};
</script>

<style scoped>
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
  box-shadow: 0 6px 15px var(--highlight-color); /* Hover-Schatten */

}

.category-box.selected {
  background-color: var(--highlight-color, #57bc90); /* Farbe bei Auswahl */
  color: white; /* Textfarbe bei Auswahl */
  border-color: var(--highlight-color, #57bc90);
  box-shadow: 0 6px 15px var(--highlight-color); /* Hover-Schatten */

}

.dashboard {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr; /* Drei Spalten */
  gap: var(--spacing-md, 1rem); /* Abstand zwischen den Bereichen */
  padding: var(--spacing-lg, 2rem); /* Außenabstand */
  font-family: var(--font-family-default); /* Hauptschriftart */
  color: var(--text-color); /* Textfarbe */
}

.dashboard-sidebar,
.dashboard-main,
.dashboard-actions {
  background-color: var(--card-bg-color); /* Kartenhintergrund */
  border-radius: var(--border-radius, 8px); /* Abgerundete Ecken */
  padding: var(--spacing-lg, 1rem); /* Innenabstand */
  box-shadow: 0 6px 8px var(--shadow-color); /* Schatteneffekt */
  width: auto;
}

.dashboard-sidebar h3,
.dashboard-main h3,
.dashboard-actions h3 {
  font-family: var(--font-family-heading); /* Schrift für Überschriften */
  color: var(--text-color); /* Haupttextfarbe */
  margin-bottom: var(--spacing-sm, 0.5rem); /* Abstand unter Überschrift */
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
  background-color: var(--button-bg-color); /* Button-Farbe */
  color: var(--button-text-color); /* Button-Textfarbe */
  border: none;
  border-radius: var(--border-radius, 8px); /* Abgerundete Buttons */
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.btn:hover {
  background-color: var(--highlight-color); /* Hover-Farbe */
  box-shadow: 0 6px 15px var(--highlight-color); /* Hover-Schatten */
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
