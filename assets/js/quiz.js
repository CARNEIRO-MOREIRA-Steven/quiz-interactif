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
let totalQuestionsAsked = 0;
let currentQuestions = [];

// DOM Elements
const introScreen = getElement("#intro-screen");
const questionScreen = getElement("#question-screen");
const resultScreen = getElement("#result-screen");

const bestScoreValue = getElement("#best-score-value");
const bestScoreEnd = getElement("#best-score-end");
const infiniteModeToggle = getElement("#infinite-mode-toggle");
const themeSelect = getElement("#theme-select");
const hintBtn = getElement("#hint-btn");
const hintText = getElement("#hint-text");

const questionText = getElement("#question-text");
const answersDiv = getElement("#answers");
const nextBtn = getElement("#next-btn");
const startBtn = getElement("#start-btn");
const restartBtn = getElement("#restart-btn");

const scoreText = getElement("#score-text");
const timeLeftSpan = getElement("#time-left");

const currentQuestionIndexSpan = getElement("#current-question-index");
const totalQuestionsSpan = getElement("#total-questions");

// Init
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);
if (hintBtn) {
  hintBtn.addEventListener("click", () => {
    revealHint();
  });
}

const refreshBestScoreDisplays = () => {
  setText(bestScoreValue, bestScore);
  setText(bestScoreEnd, bestScore);
};

refreshBestScoreDisplays();

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
    return;
  }

  setText(totalQuestionsSpan, infiniteModeEnabled ? "∞" : currentQuestions.length);

  currentQuestions.sort(() => Math.random() - 0.5);

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

  timeLeftSpan.textContent = q.timeLimit;
  timerId = startTimer(
    q.timeLimit,
    (timeLeft) => setText(timeLeftSpan, timeLeft),
    () => {
      lockAnswers(answersDiv);
      nextBtn.classList.remove("hidden");
    }
  );
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
  hideElement(questionScreen);
  showElement(resultScreen);

  updateScoreDisplay(scoreText, score, currentQuestions.length);

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
