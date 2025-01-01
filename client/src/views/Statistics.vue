<template>
    <div class="statistics">
      <div class="stat">
        <i class="icon fas fa-layer-group"></i>
        <span>Anzahl Lernkarten:</span>
        <strong>{{ cardCount }}</strong>
      </div>
      <div class="stat">
        <i class="icon fas fa-clipboard-check"></i>
        <span>Abgeschlossene Quiz:</span>
        <strong>{{ completedQuizzes }}</strong>
      </div>
      <div class="stat">
        <i class="icon fas fa-chart-line"></i>
        <span>Erfolgsquote:</span>
        <strong>{{ successRate }}%</strong>
      </div>
    </div>
  </template>
  
  
  <script>
  export default {
    data() {
      return {
        // Dummydaten
        cardCount: 25,
        completedQuizzes: 5,
        successRate: 80,
      };
    },
  };
  </script>
  
  <style scoped>
.statistics {
  padding: var(--spacing-lg); /* Größere Innenabstände */
  background-color: var(--card-bg-color); /* Hintergrundfarbe */
  border-radius: var(--border-radius); /* Abgerundete Kanten */
}

.stat {
  display: flex;
  align-items: center; /* Zentriert Text und Icon vertikal */
  justify-content: space-between;
  margin-bottom: var(--spacing-md); /* Abstand zwischen Zeilen */
  font-family: var(--font-family-default); /* Einheitliche Schriftart */
  color: var(--text-color); /* Textfarbe */
  border-bottom: 1px solid var(--input-border-color); /* Linie zwischen Statistiken */
  padding-bottom: var(--spacing-sm); /* Abstand zum Trenner */
  gap: var(--spacing-sm); /* Abstand zwischen den Elementen */
}

.stat:last-child {
  border-bottom: none; /* Letztes Element ohne Linie */
}

.stat strong {
  font-weight: 700; /* Fettgedruckt */
  color: var(--highlight-color); /* Akzentfarbe für Zahlen */
  font-size: 1.2rem; /* Größerer Text für Zahlen */
}

.icon {
  margin-right: var(--spacing-sm); /* Abstand zwischen Icon und Text */
  font-size: 1.5rem; /* Größe des Icons */
  color: var(--highlight-color); /* Gleiche Akzentfarbe */
}
</style>
