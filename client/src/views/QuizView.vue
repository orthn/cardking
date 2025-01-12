<template>
  <div class="quiz-container">
    <p v-if="errorMessage">{{ errorMessage }}</p>

    <!-- Quiz -->
    <div v-else-if="quizData.length > 0 && !isQuizComplete" class="quiz-card">
      <div class="question-container">
        <p><strong>Question {{ currentIndex + 1 }}:</strong> {{ quizData[currentIndex].question }}</p>
      </div>

      <div
        class="answers-container"
        :class="{ 'grid-two': quizData[currentIndex].type !== 'true_false' }"
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

    <!-- Ladeanzeige -->
    <p v-else>Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch} from 'vue';

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
.answer-btn.selected {
  background-color: var(--highlight-color);
  color: var(--button-text-color);
}

.finalize-btn {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-md);
  color: var(--button-text-color);
  background-color: var(--button-bg-color);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.finalize-btn:hover {
  background-color: var(--highlight-color);
  box-shadow: 0 6px 15px var(--highlight-color);
}
.padding{
  padding: var(--spacing-xs);  
}
/* Quizkarten */
.quiz-card {
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-lg);
  width: 100%;
  max-width: 600px;
  padding: var(--spacing-lg);
  background-color: var(--card-bg-color);
  box-shadow: 0 6px 8px var(--shadow-color);
  animation: fadeIn 0.3s ease-in-out;
  word-wrap: break-word; 
  overflow-wrap: break-word;
}

.quiz-card p {
  font-size: var(--font-size-lg);
  color: var(--text-color);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

/* Antworten-Container */
.answers-container {
  display: grid;
  gap: var(--spacing-sm);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.answers-container.grid-two {
  grid-template-columns: repeat(2, 1fr);
}

.answer-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-md);
  color: var(--button-text-color);
  background-color: var(--button-bg-color);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: center;
  white-space: normal;
}

.answer-btn:hover {
  background-color: var(--highlight-color);
  box-shadow: 0 6px 15px var(--highlight-color);
}

.answer-btn:disabled {
  background-color: var(--disabled-bg-color);
  cursor: not-allowed;
}

/* Ergebnis-Container */
.results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  padding: var(--spacing-lg);
  background-color: var(--card-bg-color);
  border: 1px solid var(--input-border-color);
  border-radius: var(--border-radius);
  box-shadow: 0 6px 8px var(--shadow-color);
  animation: fadeIn 0.3s ease-in-out;
  color: var(--text-color);
}

/* Ergebnisse */
.result-item {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--input-border-color);
  border-radius: var(--border-radius);
  background-color: var(--card-bg-color);
  box-shadow: 0 3px 6px var(--shadow-color);
  margin-bottom: var(--spacing-md);
}

.result-item p {
  margin: var(--spacing-xs) 0;
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
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: var(--spacing-md);
}

.nav-arrow {
  font-size: 2rem;
  color: var(--button-bg-color);
  cursor: pointer;
  transition: color 0.3s, transform 0.2s;
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
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.home-btn:hover {
  background-color: var(--highlight-color);
  transform: scale(1.1);
}
/* Animation für Karten */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

</style>
