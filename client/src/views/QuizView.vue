<template>
  <div class="quiz-container">
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <!-- Quiz -->
    <transition name="fade">
    <div v-if="quizData.length > 0 && !isQuizComplete" class="quiz-card" :key="currentIndex">
      <div class="question-container">
        
        <div class="progress-bar-container" v-if="quizData.length > 0 && !isQuizComplete">
      <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
    </div>
        <p><strong>Question {{ currentIndex + 1 }}</strong></p>
          <p>{{ quizData[currentIndex].question }}</p>
      </div>

      <div
        class="answers-container"
      >
        <button
          v-for="(answer, i) in quizData[currentIndex].answers"
          :key="i"
          class="answer-btn"
          :class="{ selected: selectedAnswers.includes(answer) && quizData[currentIndex].type === 'multiple_choice' }"
          @click="submitAnswer(answer)"
        >
          {{ answer }}
        </button>
      </div>

      <!-- Button für Multiple Choice abschließen -->
      <button
        v-if="quizData[currentIndex].type === 'multiple_choice'"
        class="finalize-btn"
        @click="finalizeMultipleChoice"
      >
        Submit Answers
      </button>
    </div>
    <!-- Quiz-Ergebnis mit Navigation -->
    <div v-else-if="userAnswers.length > 0" class="results-container">
      <h2 class="padding">Quiz Results</h2>
      <p class="padding"><strong>Total Correct:</strong> {{ correctCount }} / {{ quizData.length }}</p>
      <div class="result-item">
        <p><strong>Question {{ resultIndex + 1 }}:</strong> {{ userAnswers[resultIndex].question }}</p>
        <p>
          Your Answer: 
          <span :class="{ correct: userAnswers[resultIndex].isCorrect, incorrect: !userAnswers[resultIndex].isCorrect }">
            {{ Array.isArray(userAnswers[resultIndex].selectedAnswer) ? userAnswers[resultIndex].selectedAnswer.join(', ') : userAnswers[resultIndex].selectedAnswer }}
          </span>
        </p>
        <p>Correct Answer: {{ Array.isArray(userAnswers[resultIndex].correctAnswer) ? userAnswers[resultIndex].correctAnswer.join(', ') : userAnswers[resultIndex].correctAnswer }}</p>
      </div>

      <div class="navigation-buttons">
        <i
          class="fas fa-arrow-left nav-arrow"
          :class="{ disabled: resultIndex === 0 }"
          @click="previousResult"
        ></i>
        <button class="home-btn" @click="$emit('backToDashboard')">
          <i class="fas fa-home"></i>
        </button>
        <i
          class="fas fa-arrow-right nav-arrow"
          :class="{ disabled: resultIndex === userAnswers.length - 1 }"
          @click="nextResult"
        ></i>
      </div>
    </div>
  </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch} from 'vue';

const quizData = ref([]);
const errorMessage = ref('');
const currentIndex = ref(0);
const userAnswers = ref([]);
const isQuizComplete = ref(false);
const resultIndex = ref(0);
const correctCount = ref(0);

const props = defineProps({
  category: String,
});

const progressPercentage = computed(() => {
  if (quizData.value.length === 0) return 0;
  return ((currentIndex.value + 1) / quizData.value.length) * 100;
});

const fetchQuiz = async () => {
  try {
    const response = await fetch(`http://localhost:3000/quiz/startQuiz?category=${props.category}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      quizData.value = data.selectedCards;
    } else if (response.status === 204) {
      errorMessage.value = 'No cards available for the selected category.';
    } else {
      const error = await response.json();
      errorMessage.value = error.message || 'Failed to start quiz.';
    }
  } catch (error) {
    errorMessage.value = 'An error occurred while fetching the quiz.';
  }
};

let startTime; // Stores the start time for a question

const startTimer = () => {
  startTime = Date.now();
};

// Call this function to calculate quality based on time and correctness
const calculateQuality = (isCorrect, elapsedTime) => {
  if (isCorrect) {
    if (elapsedTime <= 3) return 5; // Perfect response
    if (elapsedTime <= 7) return 4; // Correct after hesitation
    return 3; // Correct with serious difficulty
  } else {
    if (elapsedTime <= 3) return 2; // Incorrect, but easy to recall
    if (elapsedTime <= 7) return 1; // Incorrect, remembered correct answer
    return 0; // Complete blackout
  }
};

const selectedAnswers = ref([]); // Für Multiple Choice Antworten

const submitAnswer = (answer) => {
  const currentCard = quizData.value[currentIndex.value];
  const endTime = Date.now();
  const elapsedTime = (endTime - startTime) / 1000; // Time in seconds

  if (currentCard.type === 'multiple_choice') {
    if (selectedAnswers.value.includes(answer)) {
      selectedAnswers.value = selectedAnswers.value.filter((a) => a !== answer);
    } else {
      selectedAnswers.value.push(answer);
    }
  } else {
    const isCorrect = Array.isArray(currentCard.correctAnswer)
      ? currentCard.correctAnswer.includes(answer)
      : answer === currentCard.correctAnswer;

    if (isCorrect) correctCount.value++;

    const quality = calculateQuality(isCorrect, elapsedTime);

    userAnswers.value.push({
      cardId: currentCard._id,
      question: currentCard.question,
      selectedAnswer: answer,
      correctAnswer: currentCard.correctAnswer,
      isCorrect,
      quality
    });

    if (currentIndex.value < quizData.value.length - 1) {
      currentIndex.value++;
    } else {
      isQuizComplete.value = true;
      submitAnswers();
    }
  }
};

const finalizeMultipleChoice = () => {
  const currentCard = quizData.value[currentIndex.value];
  const endTime = Date.now();
  const elapsedTime = (endTime - startTime) / 1000; // Time in seconds

  const isCorrect =
    JSON.stringify([...selectedAnswers.value].sort()) === JSON.stringify(currentCard.correctAnswer.sort());

  if (isCorrect) correctCount.value++;

  const quality = calculateQuality(isCorrect, elapsedTime);

  userAnswers.value.push({
    cardId: currentCard._id,
    question: currentCard.question,
    selectedAnswer: [...selectedAnswers.value],
    correctAnswer: currentCard.correctAnswer,
    isCorrect,
    quality
  });

  selectedAnswers.value = [];

  if (currentIndex.value < quizData.value.length - 1) {
    currentIndex.value++;
  } else {
    isQuizComplete.value = true;
    submitAnswers();
  }
};

const nextResult = () => {
  if (resultIndex.value < userAnswers.value.length - 1) {
    resultIndex.value++;
  }
};

const previousResult = () => {
  if (resultIndex.value > 0) {
    resultIndex.value--;
  }
};

const submitAnswers = async () => {
  try {
    const response = await fetch(`http://localhost:3000/quiz/submitAnswers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        cards: userAnswers.value,
        correctCount: correctCount.value
      })
    });
  } catch (error) {
    errorMessage.value = 'An error occurred while submitting the answers.'
  }
};

// Watch for changes to currentIndex and reset the timer
watch(currentIndex, (newIndex, oldIndex) => {
  if (newIndex !== oldIndex) {
    startTimer();
  }
});

onMounted(() => {
  fetchQuiz();
});
</script>



<style scoped>
.progress-bar-container {
  position: relative;
  max-width: 900px;
  width: 100%;
  background-color: rgb(red, green, blue,0); /* Hintergrundfarbe */
  height: 20px; /* Erhöhte Höhe für bessere Sichtbarkeit */
  border-radius: 8px; /* Abgerundete Ecken */
  border: 2px solid var(--text-color); /* Rand um die Fortschrittsleiste */
  overflow: hidden; /* Begrenzung der Fortschrittsleiste */
}

.progress-bar {
  height: 100%; /* Füllt die gesamte Höhe */
  background-color: var(--text-color); /* Fortschrittsfarbe */
}



/* Transition mit Bewegung */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1); 
}

.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.question-container{
  margin-bottom: 2rem;
  padding: var(--spacing-lg);
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: var(--text-color);
  background-color: var(--card-bg-color);
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-shadow: 0 6px 8px var(--shadow-color);
}
.answer-btn.selected {
  background-color: var(--highlight-color);
}

.finalize-btn {
  margin-top: 1.5rem;
  padding: var(--spacing-md);
  font-size: clamp(0.8rem, 2.5vw, 1.3rem);
  color: var(--button-text-color);
  background-color: var(--button-bg-color);
  border: none;
  width: 80%;
  border-radius: var(--border-radius);
  cursor: pointer;
  box-shadow: 0 3px 4px var(--shadow-color);

}

.finalize-btn:hover {
  background-color: var(--highlight-color);
  transform: scale(1.05);
}
.padding{
  padding-bottom: var(--spacing-md);  
}
/* Quizkarten */
.quiz-card {
  position: absolute;
  font-family: var(--font-family-default);
  display: flex;
  background: rgba(255, 255, 255, 0.3); /* Halbtransparenter Hintergrund */
  backdrop-filter: blur(10px); /* Blur-Effekt für den Hintergrund */
  -webkit-backdrop-filter: blur(10px); /* Für Safari */
  border: 1px solid rgba(255, 255, 255, 0.2); /* Leichter Rand für den Glaseffekt */
  border-radius: var(--border-radius); /* Abgerundete Ecken */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 600px;
  max-width: 900px;
  width: 100%;
  padding: 2rem;
}


/* Antworten-Container */
.answers-container {
  width: 100%;
  display: grid;
  font-size: clamp(0.8rem, 2.5vw, 1.3rem);
  font-weight: 400;
  gap: 1.5rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  grid-template-columns: repeat(2, 1fr);
  font-weight: 500;
}

.answer-btn {
  padding: var(--spacing-lg);
  font-size: auto;
  color: var(--button-text-color);
  background-color: var(--button-bg-color);
  border-radius: var(--border-radius);
  box-shadow: 0 3px 4px var(--shadow-color);
  cursor: pointer;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: center;
  white-space: normal;
  
}

.answer-btn:hover {
  background-color: var(--highlight-color);
  transform: scale(1.05);
}

.answer-btn:disabled {
  background-color: var(--disabled-bg-color);
  cursor: not-allowed;
}

/* Ergebnis-Container */
.results-container {
  font-family: var(--font-family-default);
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  justify-content: center;
  font-size: clamp(1rem, 3vw, 1.5rem);
  max-width: 900px;
  width: 100%;
  padding: 2rem;
  background-color: var(--card-bg-color);
  border-radius: var(--border-radius);
  box-shadow: 0 6px 8px var(--shadow-color);
  color: var(--text-color);
}

/* Ergebnisse */
.result-item {
  font-size: clamp(0.8rem, 2.5vw, 1.3rem);
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--input-border-color);
  border-radius: var(--border-radius);
  background-color: var(--card-bg-color);
  box-shadow: 0 3px 6px var(--shadow-color);
  margin-bottom: var(--spacing-md);
}

.result-item p {
  margin: var(--spacing-sm) 0;
  color: var(--text-color);
  word-wrap: break-word; 
  overflow-wrap: break-word;
  padding: var(--spacing-xs);
}

.correct {
  color: var(--correct-color);
  font-weight: bold;
}

.incorrect {
  color: var(--incorrect-color);
  font-weight: bold;
}

/* Navigation-Pfeile */
.navigation-buttons {
  display: flex;
  padding: var(--spacing-sm);
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: var(--spacing-md);
}

.nav-arrow {
  font-size: 3rem;
  color: var(--button-bg-color);
  cursor: pointer;
}

.nav-arrow:hover {
  color: var(--highlight-color);
  transform: scale(1.1);
}

.nav-arrow.disabled {
  color: var(--card-bg-color);
}

/* Home-Button */
.home-btn {
  background: var(--button-bg-color);
  color: var(--button-text-color);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  cursor: pointer;
}

.home-btn:hover {
  background-color: var(--highlight-color);
  transform: scale(1.1);
}


</style>
