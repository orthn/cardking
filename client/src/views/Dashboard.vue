<template>
  <div>
    <div class="dashboard">
      <!-- Linker Bereich: Statistiken -->
      <div class="dashboard-sidebar">
        <h3>Statistiken</h3>
        <Statistics />
      </div>

      <!-- Hauptbereich: Lernkarten und Kategorien -->
      <div class="dashboard-main">
        <h3>Übersicht</h3>
        <div>
          <p>Hier könnten Kartenübersichten oder Kategorien angezeigt werden.</p>
        </div>
      </div>

      <!-- Rechter Bereich: Aktionen -->
      <div class="dashboard-actions">
        <h3>Aktionen</h3>
        <button class="btn">Quiz starten</button>
        <button class="btn">Kategorie erstellen</button>
      </div>
    </div>
  </div>
</template>

<script>
import Statistics from './Statistics.vue';

export default {
  name: 'Dashboard',
  components: {
    Statistics,
  },
};
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* Drei Spalten */
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
  padding: var(--spacing-md, 1rem); /* Innenabstand */
  box-shadow: 0 6px 8px var(--shadow-color); /* Schatteneffekt */
}

.dashboard-sidebar h3,
.dashboard-main h3,
.dashboard-actions h3 {
  font-family: var(--font-family-heading); /* Schrift für Überschriften */
  color: var(--text-color); /* Haupttextfarbe */
  margin-bottom: var(--spacing-sm, 0.5rem); /* Abstand unter Überschrift */
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
</style>
