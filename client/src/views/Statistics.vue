<template>
  <div class="statistics-section">
    <div class="statistics-container">
      <div class="statistics-box" @click="openModal('completedQuizzes')"title="Click to view the leaderboard">
        <div class="box-content">
          <h4>Completed Quizzes</h4>
          <p class="value">{{ statistics.completedQuizzes }}</p>
          
        </div>
      </div>
      <div class="statistics-box" @click="openModal('successRate')"title="Click to view the leaderboard">
        <div class="box-content">
          <h4>Success Rate</h4>
          <p class="value">{{ statistics.successRate.toFixed(2) }}%</p>
        </div>
      </div>
      <div class="statistics-box" @click="openModal('streak')"title="Click to view the leaderboard">
        <div class="box-content">
          <h4>Streak</h4>
          <p class="value">{{ statistics.streak }}  <i class="fas fa-fire"></i></p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <transition name="fade">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
  <div class="modal-content">
    <h3>{{ modalTitle }}</h3>
    <div class="user-list">
      <div class="user-box" v-for="(user, index) in topUsers" :key="user.userId">
        <div class="user-rank">{{ index + 1 }}</div>
        <div class="user-name">{{ user.username || "Unknown User" }}</div>
        <div class="user-value">
          {{ modalStatKey === "successRate"
            ? user[modalStatKey].toFixed(2) + "%"
            : user[modalStatKey] }}
        </div>
      </div>
    </div>
  </div>
</div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted,defineEmits  } from "vue";

export default {
  name: "Statistics",
  emits: ["updateSuccessRate"],
  setup(_, { emit }) {
    const statistics = ref({
      userId: null,
      completedQuizzes: 0,
      successRate: 0,
      streak: 0,
    });
    const showModal = ref(false);
    const modalTitle = ref("");
    const modalStatKey = ref("");
    const topUsers = ref([]);

    // Ruft die Statistiken des aktuellen Benutzers ab
    const fetchStatistics = async () => {
      try {
        const response = await fetch("http://localhost:3000/dashboard/statistics", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data = await response.json();
        statistics.value = {
          userId: data[0].userId || null,
          completedQuizzes: data[0].completedQuizzes || 0,
          successRate: data[0].successRate || 0,
          streak: data[0].streak || 0,
        };

        emit("updateSuccessRate", data[0]?.successRate || 0);
      } catch (error) {
        console.error("Fehler beim Laden der Statistiken:", error);
      }
    };


    // Öffnet das Modal für das Leaderboard
    const openModal = async (statKey) => {
      const statKeyMapping = {
    completedQuizzes: "Completed Quizzes",
    successRate: "Success Rate",
    streak: "Longest Streak",
  };

  modalStatKey.value = statKey;
  modalTitle.value = `Top 10 Users by ${statKeyMapping[statKey] || statKey}`;
  showModal.value = true;

  try {
    // Abrufen der Statistikdaten
    const response = await fetch("http://localhost:3000/dashboard/statistics?all=true", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch top users");
    }
    const data = await response.json();

    // Sortiere und schneide die Top 10 Statistiken aus
    const topStats = data
      .sort((a, b) => b[statKey] - a[statKey])
      .slice(0, 10);

    // Extrahiere die User-IDs
    const userIds = topStats.map((stat) => stat.userId);

    // Abrufen der Benutzernamen basierend auf den User-IDs
    const usersResponse = await fetch("http://localhost:3000/users/", {
      method: "POST", // Verwende POST, um die IDs zu senden
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIds }), // Sende die IDs als JSON
    });

    if (!usersResponse.ok) {
      throw new Error("Failed to fetch user names");
    }

    const users = await usersResponse.json();

    // Kombiniere die Benutzernamen mit den Statistiken
    topUsers.value = topStats.map((stat) => ({
      ...stat,
      username: users.find((user) => user._id === stat.userId)?.username || "Anonym",
    }));
  } catch (error) {
    console.error("Fehler beim Laden der Bestenliste:", error);
  }
};


    const closeModal = () => {
      showModal.value = false;
      topUsers.value = [];
    };

    onMounted(fetchStatistics);

    return {
      statistics,
      showModal,
      modalTitle,
      modalStatKey,
      topUsers,
      fetchStatistics,
      openModal,
      closeModal,
    };
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
/* Container für die Statistik-Boxen */
.statistics-section {
  padding: var(--spacing-lg);
}

.statistics-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* Styling der Statistik-Boxen */
.statistics-box {
  background: var(--card-bg-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
border: 1.5px solid var(--highlight-color);
display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.statistics-box:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px var(--highlight-color);
}

.box-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: var(--spacing-sm);
}
.box-content h4{
  color: var(--text-color);
}
.box-content p{
  color: var(--text-color);
}
.value {
  font-size: 1.5rem;
  font-weight: bold;

}

i {
  font-size: 1.5rem;
  color: var(--highlight-color);
  cursor: pointer;
}

/* Modal-Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: var(--card-bg-color);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px var(--shadow-color);
  position: relative;
}


h3 {
  text-align: center;
  margin-bottom: var(--spacing-md);
  font-size: 1.25rem;
  color: var(--text-color);
}

/* User-Liste Styling */
.user-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.user-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card-bg-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  border: 1.5px solid var(--highlight-color);
}

.user-rank {
  font-weight: bold;
  font-size: 1.25rem;
  color: var(--highlight-color);
  width: 10%; /* Platz für die Rangnummer */
  text-align: center;
}

.user-name {
  flex: 1; /* Füllt den restlichen Platz */
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  color: var(--text-color);
}

.user-value {
  font-weight: bold;
  font-size: 1rem;
  color: var(--text-color);
  width: 20%; /* Platz für den Wert */
  text-align: right;
}

</style>
