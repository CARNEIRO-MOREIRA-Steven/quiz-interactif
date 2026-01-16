// quiz.js
import {
  getElement,
  showElement,
  hideElement,
  setText,
  createAnswerButton,
  updateScoreDisplay,
  lockAnswers,
  markCorrectAnswer,
} from "./dom.js";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  startTimer,
} from "./utils.js";
import {
  questions as allQuestions,
} from "./questions.js";

console.log("Quiz JS loaded...");


let currentQuestionIndex = 0;
let score = 0;
let bestScore = loadFromLocalStorage("bestScore", 0);
let timerId = null;
let infiniteModeEnabled = false;
let flashcardModeEnabled = false;
let timeAttackEnabled = false;
let timeAttackTimerId = null;
let totalQuestionsAsked = 0;
let currentQuestions = [];
let isDarkMode = false;

// DOM Elements
const introScreen = getElement("#intro-screen");
const questionScreen = getElement("#question-screen");
const resultScreen = getElement("#result-screen");

const bestScoreValue = getElement("#best-score-value");
const bestScoreEnd = getElement("#best-score-end");
const infiniteModeToggle = getElement("#infinite-mode-toggle");
const flashcardModeToggle = getElement("#flashcard-mode-toggle")
const timeAttackToggle = getElement("#time-attack-toggle");
const timeAttackDurationSelect = getElement("#time-attack-duration");
const themeSelect = getElement("#theme-select");
const hintBtn = getElement("#hint-btn");
const hintText = getElement("#hint-text");

const questionText = getElement("#question-text");
const answersDiv = getElement("#answers");
const nextBtn = getElement("#next-btn");
const startBtn = getElement("#start-btn");
const restartBtn = getElement("#restart-btn");
const themeToggleBtn = getElement("#theme-toggle");

const scoreText = getElement("#score-text");
const timeLeftSpan = getElement("#time-left");
const timerDiv = getElement('#timer-div')
const timeAttackDiv = getElement("#time-attack-div");
const timeAttackLeftSpan = getElement("#time-attack-left");

const currentQuestionIndexSpan = getElement("#current-question-index");
const totalQuestionsSpan = getElement("#total-questions");

const THEME_STORAGE_KEY = "quizTheme";

// Init
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);
if (hintBtn) {
  hintBtn.addEventListener("click", () => {
    revealHint();
  });
}
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", toggleTheme);
}

const refreshBestScoreDisplays = () => {
  setText(bestScoreValue, bestScore);
  setText(bestScoreEnd, bestScore);
};

refreshBestScoreDisplays();
initializeTheme();

const populateThemeOptions = () => {
  if (!themeSelect) {
    return;
  }

  const themes = Array.from(
    new Set(allQuestions.map((question) => question.theme))
  ).sort();

  themeSelect.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Tous les thèmes";
  themeSelect.appendChild(allOption);

  themes.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme;
    option.textContent = theme;
    themeSelect.appendChild(option);
  });
};

populateThemeOptions();

function startQuiz() {
  hideElement(introScreen);
  showElement(questionScreen);
  currentQuestionIndex = 0;
  score = 0;
  totalQuestionsAsked = 0;

  infiniteModeEnabled = Boolean(infiniteModeToggle && infiniteModeToggle.checked);
  flashcardModeEnabled = Boolean(flashcardModeToggle && flashcardModeToggle.checked);
  timeAttackEnabled = Boolean(timeAttackToggle && timeAttackToggle.checked);

  const selectedTheme = themeSelect ? themeSelect.value : "all";
  currentQuestions =
    selectedTheme === "all"
      ? [...allQuestions]
      : allQuestions.filter((question) => question.theme === selectedTheme);

  if (!currentQuestions.length) {
    setText(totalQuestionsSpan, 0);
    setText(questionText, "Aucune question disponible pour ce thème.");
    answersDiv.innerHTML = "";
    nextBtn.classList.add("hidden");
    setText(timeLeftSpan, "-");
    if (hintBtn) {
      hintBtn.classList.add("hidden");
    }
    if (hintText) {
      hintText.classList.add("hidden");
      setText(hintText, "");
    }
    clearInterval(timeAttackTimerId);
    if (timeAttackDiv) {
      timeAttackDiv.classList.add("hidden");
    }
    return;
  }

setText(totalQuestionsSpan,flashcardModeEnabled || infiniteModeEnabled || timeAttackEnabled ? "∞": currentQuestions.length);

  currentQuestions.sort(() => Math.random() - 0.5);

  clearInterval(timeAttackTimerId);
  if (timeAttackEnabled) {
    const timeAttackDuration = timeAttackDurationSelect ? Number(timeAttackDurationSelect.value) : 0;
    if (timeAttackDiv) {
      timeAttackDiv.classList.remove("hidden");
    }
    if (timeAttackLeftSpan) {
      setText(timeAttackLeftSpan, timeAttackDuration);
    }
    timeAttackTimerId = startTimer(
      timeAttackDuration,
      (timeLeft) => {
        if (timeAttackLeftSpan) {
          setText(timeAttackLeftSpan, timeLeft);
        }
      },
      () => {
        endQuiz();
      }
    );
  } else {
    if (timeAttackDiv) {
      timeAttackDiv.classList.add("hidden");
    }
  }

  showQuestion();
}

function showQuestion() {
  clearInterval(timerId);

  const q = currentQuestions[currentQuestionIndex];
  setText(questionText, q.text);
  totalQuestionsAsked += 1;
  setText(currentQuestionIndexSpan, totalQuestionsAsked);

  if (hintBtn) {
    if (q.hint) {
      hintBtn.classList.remove("hidden");
      hintBtn.disabled = false;
    } else {
      hintBtn.classList.add("hidden");
    }
  }
  if (hintText) {
    hintText.classList.add("hidden");
    setText(hintText, q.hint ? q.hint : "");
  }

  answersDiv.innerHTML = "";
  q.answers.forEach((answer, index) => {
    const btn = createAnswerButton(answer, () => selectAnswer(index, btn));
    answersDiv.appendChild(btn);
  });

  nextBtn.classList.add("hidden");

  if (timeAttackDiv) {
    timeAttackDiv.classList.toggle("hidden", !timeAttackEnabled);
  }

  if (flashcardModeEnabled || timeAttackEnabled) {
    setText(timeLeftSpan, flashcardModeEnabled ? "∞" : "-");
    timerDiv.classList.add('no-timer')
  } else {
    timerDiv.classList.remove('no-timer')
    setText(timeLeftSpan, q.timeLimit);
    timerId = startTimer(
      q.timeLimit,
      (timeLeft) => setText(timeLeftSpan, timeLeft),
      () => {
        lockAnswers(answersDiv);
        nextBtn.classList.remove("hidden");
      }
    );
  }
}

function selectAnswer(index, btn) {
  clearInterval(timerId);

  const q = currentQuestions[currentQuestionIndex];
  if (index === q.correct) {
    score++;
    btn.classList.add("correct");
    if (score > bestScore) {
      bestScore = score;
      saveToLocalStorage("bestScore", bestScore);
      refreshBestScoreDisplays();
    }
  } else {
    btn.classList.add("wrong");
  }

  markCorrectAnswer(answersDiv, q.correct);
  lockAnswers(answersDiv);
  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  currentQuestionIndex++;

  if (flashcardModeEnabled) {
    if (currentQuestionIndex >= currentQuestions.length) {
      currentQuestionIndex = 0;
      currentQuestions.sort(() => Math.random() - 0.5);
    }
    showQuestion();
    return;
  }

  if (timeAttackEnabled) {
    if (currentQuestionIndex >= currentQuestions.length) {
      currentQuestionIndex = 0;
      currentQuestions.sort(() => Math.random() - 0.5);
    }
    showQuestion();
    return;
  }

  if (currentQuestionIndex < currentQuestions.length) {
    showQuestion();
    return;
  }

  if (infiniteModeEnabled) {
    currentQuestionIndex = 0;
    currentQuestions.sort(() => Math.random() - 0.5);
    showQuestion();
    return;
  }

  endQuiz();
}

function endQuiz() {
  clearInterval(timerId);
  clearInterval(timeAttackTimerId);
  hideElement(questionScreen);
  showElement(resultScreen);

  updateScoreDisplay(
    scoreText,
    score,
    flashcardModeEnabled || infiniteModeEnabled || timeAttackEnabled ? totalQuestionsAsked : currentQuestions.length
  );

  if (score > bestScore) {
    bestScore = score;
    saveToLocalStorage("bestScore", bestScore);
  }
  setText(bestScoreEnd, bestScore);
}

function restartQuiz() {
  hideElement(resultScreen);
  showElement(introScreen);

  refreshBestScoreDisplays();
}

function revealHint() {
  if (!hintBtn || !hintText) {
    return;
  }
  hintBtn.disabled = true;
  hintBtn.classList.add("hidden");
  hintText.classList.remove("hidden");
}

function initializeTheme() {
  const storedTheme = loadFromLocalStorage(THEME_STORAGE_KEY, "light");
  applyTheme(storedTheme === "dark" ? "dark" : "light");
}

function toggleTheme() {
  const nextTheme = isDarkMode ? "light" : "dark";
  applyTheme(nextTheme);
  saveToLocalStorage(THEME_STORAGE_KEY, nextTheme);
}

function applyTheme(theme) {
  isDarkMode = theme === "dark";
  document.body.classList.toggle("dark-mode", isDarkMode);
  if (themeToggleBtn) {
    themeToggleBtn.textContent = isDarkMode ? "Mode clair" : "Mode sombre";
  }
}
