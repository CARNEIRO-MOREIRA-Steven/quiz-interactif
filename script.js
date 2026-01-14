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


// Variables
let currentQuestionIndex = 0;
let score = 0;
let bestScore = 0;
let timeLeft = 0;
let timerId = null;

// DOM
const introScreen = document.getElementById("intro-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");

const bestScoreValue = document.getElementById("best-score-value");
const bestScoreEnd = document.getElementById("best-score-end");

const questionText = document.getElementById("question-text");
const answersDiv = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const scoreText = document.getElementById("score-text");
const timeLeftSpan = document.getElementById("time-left");

const currentQuestionIndexSpan = document.getElementById(
  "current-question-index"
);
const totalQuestionsSpan = document.getElementById("total-questions");

// On init
window.addEventListener("DOMContentLoaded", () => {
  startBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", nextQuestion);
  restartBtn.addEventListener("click", restartQuiz);

  loadBestScore();
  bestScoreValue.textContent = bestScore;
});

function loadBestScore() {
  const stored = localStorage.getItem("bestScore");
  if (stored) {
    bestScore = parseInt(stored, 10);
  }
}

function saveBestScore() {
  localStorage.setItem("bestScore", bestScore.toString());
}

function startQuiz() {
  introScreen.style.display = "none";
  questionScreen.style.display = "block";

  currentQuestionIndex = 0;
  score = 0;

  totalQuestionsSpan.textContent = questions.length;

  showQuestion();
}

function showQuestion() {
  // Stop any previous timer
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  questionText.textContent = q.text;

  currentQuestionIndexSpan.textContent = currentQuestionIndex + 1;

  // Refresh answers
  answersDiv.innerHTML = "";
  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.addEventListener("click", () => selectAnswer(index, btn));
    answersDiv.appendChild(btn);
  });

  // Hide "Question suivante" until user responds or time is up
  nextBtn.classList.add("hidden");

  // Timer
  timeLeft = q.timeLimit;
  timeLeftSpan.textContent = timeLeft;

  timerId = setInterval(() => {
    timeLeft--;
    timeLeftSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      lockAnswers();
      clearInterval(timerId);
      nextBtn.classList.remove("hidden");
    }
  }, 1000);
}

function selectAnswer(index, btnClicked) {
  const q = questions[currentQuestionIndex];

  clearInterval(timerId);

  // Vérification
  if (index === q.correct) {
    score++;
    btnClicked.classList.add("correct");
  } else {
    btnClicked.classList.add("wrong");
  }

  // Marquer la vraie réponse
  const allButtons = answersDiv.querySelectorAll("button");
  if (q.correct < allButtons.length) {
    allButtons[q.correct].classList.add("correct");
  }

  lockAnswers();
  nextBtn.classList.remove("hidden");
}

function lockAnswers() {
  const allButtons = answersDiv.querySelectorAll("button");
  allButtons.forEach((b) => {
    b.disabled = true;
  });
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
  questionScreen.style.display = "none";
  resultScreen.style.display = "block";

  scoreText.textContent = `Votre score : ${score} / ${questions.length}`;

  if (score > bestScore) {
    bestScore = score;
    saveBestScore();
  }
  bestScoreEnd.textContent = bestScore;
}

function restartQuiz() {
  resultScreen.style.display = "none";
  introScreen.style.display = "block";

  bestScoreValue.textContent = bestScore;
}
