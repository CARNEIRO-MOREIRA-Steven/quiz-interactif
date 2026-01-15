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

console.log("Quiz JS loaded...");

const questions = [
/* ================= GÉOGRAPHIE ================= */
{
  text: "Quelle est la capitale de la France ?",
  answers: ["Marseille", "Paris", "Lyon", "Bordeaux"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 10,
  theme: "Géographie",
  difficulty: "facile",
  points: 10,
  hint: "C’est la ville de la Tour Eiffel"
},
{
  text: "Quel est le plus grand océan du monde ?",
  answers: ["Atlantique", "Indien", "Arctique", "Pacifique"],
  answersImages: [null, null, null, null],
  correct: 3,
  timeLimit: 10,
  theme: "Géographie",
  difficulty: "facile",
  points: 10,
  hint: "Il borde l’Asie et l’Amérique"
},
{
  text: "Dans quel pays se trouve le désert du Sahara ?",
  answers: ["Brésil", "Algérie", "Australie", "Chili"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 12,
  theme: "Géographie",
  difficulty: "moyen",
  points: 15,
  hint: "Pays d’Afrique du Nord"
},
{
  text: "Quelle est la plus haute montagne du monde ?",
  answers: ["Mont Blanc", "Everest", "K2", "Kilimandjaro"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 12,
  theme: "Géographie",
  difficulty: "facile",
  points: 10,
  hint: "Elle se trouve dans l’Himalaya"
},
{
  text: "Quel pays a la plus grande population ?",
  answers: ["Inde", "États-Unis", "Chine", "Russie"],
  answersImages: [null, null, null, null],
  correct: 0,
  timeLimit: 15,
  theme: "Géographie",
  difficulty: "difficile",
  points: 20,
  hint: "Depuis 2023, il a dépassé la Chine"
},

/* ================= MATHÉMATIQUES ================= */
{
  text: "Combien font 2 + 3 ?",
  answers: ["3", "4", "5", "1"],
  answersImages: [null, null, null, null],
  correct: 2,
  timeLimit: 5,
  theme: "Mathématiques",
  difficulty: "facile",
  points: 5,
  hint: "Addition simple"
},
{
  text: "Combien font 9 × 6 ?",
  answers: ["45", "52", "54", "56"],
  answersImages: [null, null, null, null],
  correct: 2,
  timeLimit: 8,
  theme: "Mathématiques",
  difficulty: "facile",
  points: 10,
  hint: "Table de multiplication"
},
{
  text: "Quel est le carré de 7 ?",
  answers: ["14", "49", "21", "35"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 10,
  theme: "Mathématiques",
  difficulty: "moyen",
  points: 15,
  hint: "7 × 7"
},
{
  text: "Combien font 100 ÷ 4 ?",
  answers: ["20", "25", "40", "30"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 8,
  theme: "Mathématiques",
  difficulty: "facile",
  points: 10,
  hint: "Division exacte"
},
{
  text: "Quel nombre est premier ?",
  answers: ["9", "15", "17", "21"],
  answersImages: [null, null, null, null],
  correct: 2,
  timeLimit: 15,
  theme: "Mathématiques",
  difficulty: "difficile",
  points: 20,
  hint: "Il n’a que deux diviseurs"
},

/* ================= HISTOIRE ================= */
{
  text: "Qui était Napoléon Bonaparte ?",
  answers: ["Un roi", "Un empereur", "Un écrivain", "Un philosophe"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 12,
  theme: "Histoire",
  difficulty: "facile",
  points: 10,
  hint: "Chef militaire français"
},
{
  text: "En quelle année a eu lieu la Révolution française ?",
  answers: ["1492", "1789", "1914", "1848"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 15,
  theme: "Histoire",
  difficulty: "moyen",
  points: 15,
  hint: "Fin du XVIIIe siècle"
},
{
  text: "Qui a découvert l’Amérique ?",
  answers: ["Marco Polo", "Christophe Colomb", "Magellan", "Vasco de Gama"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 10,
  theme: "Histoire",
  difficulty: "facile",
  points: 10,
  hint: "Explorateur italien"
},
{
  text: "Quelle guerre a commencé en 1939 ?",
  answers: ["Guerre froide", "Première guerre mondiale", "Seconde guerre mondiale", "Guerre de Cent Ans"],
  answersImages: [null, null, null, null],
  correct: 2,
  timeLimit: 12,
  theme: "Histoire",
  difficulty: "moyen",
  points: 15,
  hint: "Elle s’est terminée en 1945"
},
{
  text: "Quel mur est tombé en 1989 ?",
  answers: ["Mur de Paris", "Mur de Rome", "Mur de Berlin", "Mur de Moscou"],
  answersImages: [null, null, null, null],
  correct: 2,
  timeLimit: 15,
  theme: "Histoire",
  difficulty: "difficile",
  points: 20,
  hint: "Symbole de la guerre froide"
},

/* ================= SCIENCES ================= */
{
  text: "Quelle planète est la plus proche du Soleil ?",
  answers: ["Vénus", "Mercure", "Mars", "Jupiter"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 10,
  theme: "Sciences",
  difficulty: "facile",
  points: 10,
  hint: "Très chaude"
},
{
  text: "Quel organe permet de respirer ?",
  answers: ["Cœur", "Foie", "Poumons", "Reins"],
  answersImages: [null, null, null, null],
  correct: 2,
  timeLimit: 8,
  theme: "Sciences",
  difficulty: "facile",
  points: 10,
  hint: "Ils sont deux"
},
{
  text: "L’eau bout à combien de degrés ?",
  answers: ["50°C", "90°C", "100°C", "120°C"],
  answersImages: [null, null, null, null],
  correct: 2,
  timeLimit: 10,
  theme: "Sciences",
  difficulty: "facile",
  points: 10,
  hint: "Température standard"
},
{
  text: "Quel gaz respirons-nous principalement ?",
  answers: ["Oxygène", "Azote", "Hydrogène", "CO₂"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 15,
  theme: "Sciences",
  difficulty: "moyen",
  points: 15,
  hint: "Il représente 78% de l’air"
},
{
  text: "Quel est l’ADN ?",
  answers: ["Une protéine", "Une molécule génétique", "Une cellule", "Un organe"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 15,
  theme: "Sciences",
  difficulty: "difficile",
  points: 20,
  hint: "Il contient l’information génétique"
},

/* ================= CULTURE GÉNÉRALE ================= */
{
  text: "Combien de continents existe-t-il ?",
  answers: ["5", "6", "7", "8"],
  answersImages: [null, null, null, null],
  correct: 2,
  timeLimit: 8,
  theme: "Culture générale",
  difficulty: "facile",
  points: 10,
  hint: "Inclut l’Antarctique"
},
{
  text: "Quel est le sport le plus pratiqué au monde ?",
  answers: ["Basketball", "Football", "Tennis", "Rugby"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 10,
  theme: "Culture générale",
  difficulty: "facile",
  points: 10,
  hint: "Très populaire en Europe"
},
{
  text: "Quelle couleur obtient-on en mélangeant bleu et jaune ?",
  answers: ["Vert", "Violet", "Orange", "Marron"],
  answersImages: [null, null, null, null],
  correct: 0,
  timeLimit: 8,
  theme: "Culture générale",
  difficulty: "facile",
  points: 10,
  hint: "Couleur de la nature"
},
{
  text: "Quel animal est le plus rapide ?",
  answers: ["Lion", "Guépard", "Cheval", "Aigle"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 12,
  theme: "Culture générale",
  difficulty: "moyen",
  points: 15,
  hint: "Félin africain"
},
{
  text: "Quel est le plus long fleuve du monde ?",
  answers: ["Nil", "Amazone", "Yangtsé", "Mississippi"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 15,
  theme: "Culture générale",
  difficulty: "difficile",
  points: 20,
  hint: "Il traverse l’Amérique du Sud"
},

/* ================= TECHNOLOGIE ================= */
{
  text: "Que signifie HTML ?",
  answers: ["HyperText Markup Language", "HighText Machine Language", "HyperTool Multi Language", "Home Tool Markup Language"],
  answersImages: [null, null, null, null],
  correct: 0,
  timeLimit: 15,
  theme: "Technologie",
  difficulty: "moyen",
  points: 15,
  hint: "Langage du web"
},
{
  text: "Quel appareil permet de téléphoner ?",
  answers: ["Télévision", "Ordinateur", "Smartphone", "Console"],
  answersImages: [null, null, null, null],
  correct: 2,
  timeLimit: 8,
  theme: "Technologie",
  difficulty: "facile",
  points: 10,
  hint: "Toujours dans la poche"
},
{
  text: "Que veut dire Wi-Fi ?",
  answers: ["Wireless Fidelity", "Wide File", "Web Finder", "Wireless File"],
  answersImages: [null, null, null, null],
  correct: 0,
  timeLimit: 15,
  theme: "Technologie",
  difficulty: "difficile",
  points: 20,
  hint: "Connexion sans fil"
},
{
  text: "Quel langage est utilisé pour le web ?",
  answers: ["Python", "HTML", "C++", "Java"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 12,
  theme: "Technologie",
  difficulty: "facile",
  points: 10,
  hint: "Structure des pages"
},
{
  text: "À quoi sert un système d’exploitation ?",
  answers: ["Jouer", "Gérer le matériel", "Naviguer sur internet", "Créer des images"],
  answersImages: [null, null, null, null],
  correct: 1,
  timeLimit: 15,
  theme: "Technologie",
  difficulty: "moyen",
  points: 15,
  hint: "Windows, Linux, macOS"
}
];

let currentQuestionIndex = 0;
let score = 0;
let bestScore = loadFromLocalStorage("bestScore", 0);
let timerId = null;
let userAnswers = [];

// DOM Elements
const introScreen = getElement("#intro-screen");
const questionScreen = getElement("#question-screen");
const resultScreen = getElement("#result-screen");

const bestScoreValue = getElement("#best-score-value");
const bestScoreEnd = getElement("#best-score-end");

const questionText = getElement("#question-text");
const answersDiv = getElement("#answers");
const nextBtn = getElement("#next-btn");
const startBtn = getElement("#start-btn");
const restartBtn = getElement("#restart-btn");

const scoreText = getElement("#score-text");
const timeLeftSpan = getElement("#time-left");
const recapList = getElement("#recap-list");

const currentQuestionIndexSpan = getElement("#current-question-index");
const totalQuestionsSpan = getElement("#total-questions");

// Init
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);

setText(bestScoreValue, bestScore);

function startQuiz() {
  hideElement(introScreen);
  showElement(questionScreen);

  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  recapList.innerHTML = "";

  setText(totalQuestionsSpan, questions.length);

  showQuestion();
}

function showQuestion() {
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  setText(questionText, q.text);
  setText(currentQuestionIndexSpan, currentQuestionIndex + 1);

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
      if (typeof userAnswers[currentQuestionIndex] === "undefined") {
        userAnswers[currentQuestionIndex] = null;
      }
      lockAnswers(answersDiv);
      nextBtn.classList.remove("hidden");
    }
  );
}

function selectAnswer(index, btn) {
  if (typeof userAnswers[currentQuestionIndex] !== "undefined") {
    return;
  }
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  userAnswers[currentQuestionIndex] = index;
  if (index === q.correct) {
    score++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
  }

  markCorrectAnswer(answersDiv, q.correct);
  lockAnswers(answersDiv);
  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  hideElement(questionScreen);
  showElement(resultScreen);

  updateScoreDisplay(scoreText, score, questions.length);
  renderRecap();

  if (score > bestScore) {
    bestScore = score;
    saveToLocalStorage("bestScore", bestScore);
  }
  setText(bestScoreEnd, bestScore);
}

function renderRecap() {
  recapList.innerHTML = "";
  questions.forEach((question, index) => {
    const item = document.createElement("div");
    item.classList.add("recap-item");

    const userAnswerIndex = userAnswers[index];
    const userAnswerText =
      userAnswerIndex === null || typeof userAnswerIndex === "undefined"
        ? "Pas de réponse"
        : question.answers[userAnswerIndex];
    const correctAnswerText = question.answers[question.correct];
    const isCorrect = userAnswerIndex === question.correct;
    const answerClass = isCorrect ? "correct" : "wrong";

    item.innerHTML = `
      <p><strong>Q${index + 1}.</strong> ${question.text}</p>
      <p>Votre réponse : <span class="recap-answer ${answerClass}">${userAnswerText}</span></p>
      <p>Bonne réponse : <span class="recap-answer correct">${correctAnswerText}</span></p>
    `;

    recapList.appendChild(item);
  });
}

function restartQuiz() {
  hideElement(resultScreen);
  showElement(introScreen);

  setText(bestScoreValue, bestScore);
}
