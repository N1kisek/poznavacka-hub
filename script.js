// script.js

let quizData = [];
let currentIndex = 0;
let score = 0;
let wrong = 0;
let answeredIndices = new Set();
let time = 0;
let timerInterval = null;

// HTML elementy
const imageEl = document.getElementById("mushroom-image");
const answerEl = document.getElementById("answer");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const questionEl = document.getElementById("question");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const idontknowBtn = document.getElementById("idontknow-btn");

// Funkce na odstranění diakritiky a převedení na malá písmena
function normalizeText(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// Funkce na kontrolu odpovědi
function isAnswerCorrect(correctAnswer, userInput) {
    if (correctAnswer.toLowerCase() === userInput.toLowerCase()) return true;
    if (normalizeText(correctAnswer) === normalizeText(userInput)) return true;
    return false;
}

// Načtení JSON dat
fetch("quiz.json")
  .then(res => res.json())
  .then(data => {
    quizData = data;
    quizData.sort(() => Math.random() - 0.5);
    loadQuestion();
    startTimer();
  })
  .catch(err => console.error("Nepodařilo se načíst quiz.json:", err));

function loadQuestion() {
    if (currentIndex >= quizData.length) {
        feedbackEl.textContent = "Kvíz dokončen!";
        feedbackEl.style.color = "blue";
        imageEl.src = "";
        questionEl.textContent = "";
        answerEl.disabled = true;
        submitBtn.disabled = true;
        nextBtn.disabled = true;
        idontknowBtn.disabled = true;
        return;
    }

    const q = quizData[currentIndex];
    questionEl.textContent = `Houba ${currentIndex + 1} / ${quizData.length}`;
    imageEl.src = q.image;
    answerEl.value = "";
    feedbackEl.textContent = "";
    answerEl.disabled = false;
    submitBtn.disabled = false;
    idontknowBtn.disabled = false;

    nextBtn.disabled = true; // tlačítko “Další” zpočátku neaktivní
    nextBtn.classList.remove("enabled"); // odstraníme modrou barvu
    answerEl.focus();
}

function enableNextButton() {
    nextBtn.disabled = false;
    nextBtn.classList.add("enabled"); // změní barvu na modrou
}

function checkAnswer() {
    const user = answerEl.value.trim();
    const correct = quizData[currentIndex].answer.trim();

    if (!user) return;

    if (isAnswerCorrect(correct, user)) {
        feedbackEl.textContent = "✅ Správně!";
        feedbackEl.style.color = "green";
        if (!answeredIndices.has(currentIndex)) score++;
    } else {
        feedbackEl.textContent = `❌ Špatně! Správná odpověď: ${correct}`;
        feedbackEl.style.color = "red";
        if (!answeredIndices.has(currentIndex)) wrong++;
    }

    answeredIndices.add(currentIndex);
    updateScore();

    // Aktivace tlačítka “Další”
    enableNextButton();
    answerEl.disabled = true;
    submitBtn.disabled = true;
    idontknowBtn.disabled = true;
}

function idontknow() {
    const correct = quizData[currentIndex].answer.trim();
    feedbackEl.textContent = `❌ Nevím! Správná odpověď: ${correct}`;
    feedbackEl.style.color = "red";
    if (!answeredIndices.has(currentIndex)) wrong++;
    answeredIndices.add(currentIndex);

    // Aktivace tlačítka Další
    enableNextButton();
    answerEl.disabled = true;
    submitBtn.disabled = true;
    idontknowBtn.disabled = true;
}

function nextQuestion() {
    currentIndex++;
    loadQuestion();
}

function updateScore() {
    scoreEl.textContent = `Správně: ${score} Špatně: ${wrong}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        time++;
        timerEl.textContent = `Čas: ${time} s`;
    }, 1000);
}

// Události
submitBtn.addEventListener("click", checkAnswer);
idontknowBtn.addEventListener("click", idontknow);
nextBtn.addEventListener("click", nextQuestion);
answerEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkAnswer();
});