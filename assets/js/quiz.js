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
let totalQuestionsAsked = 0;
let currentQuestions = [];
let isDarkMode = false;
let answerHistory = [];
let currentAnswerRecord = null;
let questionAnswered = false;

// DOM Elements
const introScreen = getElement("#intro-screen");
const questionScreen = getElement("#question-screen");
const resultScreen = getElement("#result-screen");

const bestScoreValue = getElement("#best-score-value");
const bestScoreEnd = getElement("#best-score-end");
const infiniteModeToggle = getElement("#infinite-mode-toggle");
const flashcardModeToggle = getElement("#flashcard-mode-toggle")
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
const recapContainer = getElement("#recap-container");
const recapList = getElement("#recap-list");

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
  answerHistory = [];
  currentAnswerRecord = null;
  questionAnswered = false;

  if (recapList) {
    recapList.innerHTML = "";
  }
  if (recapContainer) {
    recapContainer.classList.add("hidden");
  }

  infiniteModeEnabled = Boolean(infiniteModeToggle && infiniteModeToggle.checked);
  flashcardModeEnabled = Boolean(flashcardModeToggle && flashcardModeToggle.checked);

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

  setText(totalQuestionsSpan, flashcardModeEnabled || infiniteModeEnabled ? "∞" : currentQuestions.length);

  currentQuestions.sort(() => Math.random() - 0.5);

  showQuestion();
}

function showQuestion() {
  clearInterval(timerId);

  const q = currentQuestions[currentQuestionIndex];
  currentAnswerRecord = {
    questionText: q.text,
    answers: q.answers.slice(),
    correctIndex: q.correct,
    selectedIndex: null,
    isCorrect: false,
  };
  questionAnswered = false;
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

  if (flashcardModeEnabled) {
    setText(timeLeftSpan, "∞");
    timerDiv.classList.add('no-timer')
  } else {
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

function storeCurrentAnswerRecord() {
  if (!currentAnswerRecord) {
    return;
  }
  answerHistory.push({
    questionText: currentAnswerRecord.questionText,
    answers: [...currentAnswerRecord.answers],
    correctIndex: currentAnswerRecord.correctIndex,
    selectedIndex: currentAnswerRecord.selectedIndex,
    isCorrect: Boolean(currentAnswerRecord.isCorrect),
  });
  questionAnswered = true;
  currentAnswerRecord = null;
}

function finalizePendingAnswer() {
  if (!currentAnswerRecord || questionAnswered) {
    return;
  }
  currentAnswerRecord.isCorrect =
    currentAnswerRecord.selectedIndex !== null &&
    currentAnswerRecord.selectedIndex === currentAnswerRecord.correctIndex;
  storeCurrentAnswerRecord();
}

function selectAnswer(index, btn) {
  clearInterval(timerId);

  const q = currentQuestions[currentQuestionIndex];
  if (currentAnswerRecord && !questionAnswered) {
    currentAnswerRecord.selectedIndex = index;
    currentAnswerRecord.isCorrect = index === q.correct;
    storeCurrentAnswerRecord();
  }
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
  finalizePendingAnswer();
  currentQuestionIndex++;

  if (flashcardModeEnabled) {
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
  hideElement(questionScreen);
  showElement(resultScreen);

  updateScoreDisplay(scoreText, score, currentQuestions.length);

  if (score > bestScore) {
    bestScore = score;
    saveToLocalStorage("bestScore", bestScore);
  }
  setText(bestScoreEnd, bestScore);
  renderRecap();
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

function renderRecap() {
  if (!recapContainer || !recapList) {
    return;
  }

  recapList.innerHTML = "";

  if (!answerHistory.length) {
    recapContainer.classList.add("hidden");
    return;
  }

  recapContainer.classList.remove("hidden");

  answerHistory.forEach((entry, index) => {
    const li = document.createElement("li");
    li.classList.add("recap-item");

    if (entry.selectedIndex === null) {
      li.classList.add("recap-item--skipped");
    } else if (entry.isCorrect) {
      li.classList.add("recap-item--correct");
    } else {
      li.classList.add("recap-item--wrong");
    }

    const playerAnswer =
      entry.selectedIndex !== null ? entry.answers[entry.selectedIndex] : "Pas de réponse";
    const correctAnswer = entry.answers[entry.correctIndex];

    const questionLine = document.createElement("p");
    questionLine.classList.add("recap-question");
    questionLine.textContent = `${index + 1}. ${entry.questionText}`;

    const playerLine = document.createElement("p");
    playerLine.classList.add("recap-answer");
    if (entry.selectedIndex === null) {
      playerLine.classList.add("recap-answer--skipped");
    }

    const playerLabel = document.createElement("span");
    playerLabel.classList.add("recap-label");
    playerLabel.textContent = "Votre réponse :";
    playerLine.append(playerLabel, ` ${playerAnswer}`);

    const correctLine = document.createElement("p");
    correctLine.classList.add("recap-answer", "recap-answer--correct");
    const correctLabel = document.createElement("span");
    correctLabel.classList.add("recap-label");
    correctLabel.textContent = "Bonne réponse :";
    correctLine.append(correctLabel, ` ${correctAnswer}`);

    li.appendChild(questionLine);
    li.appendChild(playerLine);
    li.appendChild(correctLine);
    recapList.appendChild(li);
  });
}
