const words = [
 {
 spanish: "Hola",
 english: "Hello",
 category: "greetings",
 example: "Hola, ¿cómo estás?"
 },
 {
 spanish: "Adiós",
 english: "Goodbye",
 category: "greetings",
 example: "Adiós, nos vemos mañana."
 },
 {
 spanish: "Gracias",
 english: "Thank you",
 category: "greetings",
 example: "Gracias por tu ayuda."
 },
 {
 spanish: "Pan",
 english: "Bread",
 category: "food",
 example: "Me gusta comer pan."
 },
 {
 spanish: "Agua",
 english: "Water",
 category: "food",
 example: "Quiero beber agua."
 },
 {
 spanish: "Manzana",
 english: "Apple",
 category: "food",
 example: "La manzana es roja."
 },
 {
 spanish: "Aeropuerto",
 english: "Airport",
 category: "travel",
 example: "El aeropuerto está lejos."
 },
 {
 spanish: "Hotel",
 english: "Hotel",
 category: "travel",
 example: "El hotel es muy bonito."
 },
 {
 spanish: "Billete",
 english: "Ticket",
 category: "travel",
 example: "Necesito un billete de tren."
 },
 {
 spanish: "Yo soy",
 english: "I am",
 category: "grammar",
 example: "Yo soy estudiante."
 },
 {
 spanish: "Tú eres",
 english: "You are",
 category: "grammar",
 example: "Tú eres mi amigo."
 },
 {
 spanish: "Él es",
 english: "He is",
 category: "grammar",
 example: "Él es profesor."
 }
];

const STORAGE_KEY = "linguaLearnProgress";

let learnedWords = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let selectedCategory = "all";
let filteredWords = [...words];
let currentIndex = 0;

const foreignWordEl = document.getElementById("foreignWord");
const translationEl = document.getElementById("translation");
const wordCategoryEl = document.getElementById("wordCategory");
const exampleSentenceEl = document.getElementById("exampleSentence");
const progressTextEl = document.getElementById("progressText");
const progressBarEl = document.getElementById("progressBar");
const learnedWordsListEl = document.getElementById("learnedWordsList");

const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const learnedBtn = document.getElementById("learnedBtn");
const pronounceBtn = document.getElementById("pronounceBtn");
const resetProgressBtn = document.getElementById("resetProgressBtn");
const categoryButtons = document.querySelectorAll(".category-btn");

const startQuizBtn = document.getElementById("startQuizBtn");
const quizQuestionEl = document.getElementById("quizQuestion");
const quizOptionsEl = document.getElementById("quizOptions");
const quizResultEl = document.getElementById("quizResult");

function saveProgress() {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(learnedWords));
}

function displayWord() {
 if (filteredWords.length === 0) {
 foreignWordEl.textContent = "No words found";
 translationEl.textContent = "Choose another category";
 wordCategoryEl.textContent = "Empty";
 exampleSentenceEl.textContent = "";
 return;
 }

 const word = filteredWords[currentIndex];

 foreignWordEl.textContent = word.spanish;
 translationEl.textContent = word.english;
 wordCategoryEl.textContent = word.category;
 exampleSentenceEl.textContent = word.example;

 if (learnedWords.includes(word.spanish)) {
 learnedBtn.textContent = "✓ Learned";
 learnedBtn.style.background = "#16a34a";
 } else {
 learnedBtn.textContent = "Mark as Learned";
 learnedBtn.style.background = "#16a34a";
 }
}

function updateProgress() {
 progressTextEl.textContent = `${learnedWords.length} / ${words.length} learned`;

 const percentage = (learnedWords.length / words.length) * 100;
 progressBarEl.style.width = `${percentage}%`;
}

function renderLearnedWords() {
 learnedWordsListEl.innerHTML = "";

 if (learnedWords.length === 0) {
 const li = document.createElement("li");
 li.textContent = "No words learned yet. Start practicing!";
 learnedWordsListEl.appendChild(li);
 return;
 }

 learnedWords.forEach((spanishWord) => {
 const word = words.find((item) => item.spanish === spanishWord);

 if (word) {
 const li = document.createElement("li");
 li.textContent = `${word.spanish} — ${word.english}`;
 learnedWordsListEl.appendChild(li);
 }
 });
}

function markAsLearned() {
 if (filteredWords.length === 0) return;

 const currentWord = filteredWords[currentIndex];

 if (!learnedWords.includes(currentWord.spanish)) {
 learnedWords.push(currentWord.spanish);
 saveProgress();
 updateProgress();
 renderLearnedWords();
 displayWord();
 }
}

function speakWord() {
 if (filteredWords.length === 0) return;

 const word = filteredWords[currentIndex].spanish;
 const speech = new SpeechSynthesisUtterance(word);

 speech.lang = "es-ES";
 speech.rate = 0.8;

 window.speechSynthesis.cancel();
 window.speechSynthesis.speak(speech);
}

function changeCategory(category) {
 selectedCategory = category;

 if (category === "all") {
 filteredWords = [...words];
 } else {
 filteredWords = words.filter((word) => word.category === category);
 }

 currentIndex = 0;
 displayWord();
}

function getRandomWords(correctWord) {
 const incorrectWords = words
.filter((word) => word.english !== correctWord.english)
.sort(() => Math.random() - 0.5)
.slice(0, 3);

 const options = [correctWord,...incorrectWords];
 return options.sort(() => Math.random() - 0.5);
}

function startQuiz() {
 const quizWord = words[Math.floor(Math.random() * words.length)];
 const options = getRandomWords(quizWord);

 quizQuestionEl.textContent = `What is the meaning of "${quizWord.spanish}"?`;
 quizOptionsEl.innerHTML = "";
 quizResultEl.textContent = "";

 options.forEach((option) => {
 const button = document.createElement("button");
 button.classList.add("quiz-option");
 button.textContent = option.english;

 button.addEventListener("click", () => {
 if (option.english === quizWord.english) {
 quizResultEl.textContent = "Correct! Great job. ✅";
 quizResultEl.style.color = "#16a34a";

 if (!learnedWords.includes(quizWord.spanish)) {
 learnedWords.push(quizWord.spanish);
 saveProgress();
 updateProgress();
 renderLearnedWords();
 }
 } else {
 quizResultEl.textContent = `Not quite. The correct answer is: ${quizWord.english}`;
 quizResultEl.style.color = "#e74c3c";
 }

 const quizButtons = document.querySelectorAll(".quiz-option");
 quizButtons.forEach((quizButton) => {
 quizButton.disabled = true;
 });
 });

 quizOptionsEl.appendChild(button);
 });
}

previousBtn.addEventListener("click", () => {
 if (filteredWords.length === 0) return;

 currentIndex =
 currentIndex === 0 ? filteredWords.length - 1 : currentIndex - 1;

 displayWord();
});

nextBtn.addEventListener("click", () => {
 if (filteredWords.length === 0) return;

 currentIndex = (currentIndex + 1) % filteredWords.length;
 displayWord();
});

learnedBtn.addEventListener("click", markAsLearned);
pronounceBtn.addEventListener("click", speakWord);
startQuizBtn.addEventListener("click", startQuiz);

resetProgressBtn.addEventListener("click", () => {
 const confirmReset = confirm("Are you sure you want to reset all learning progress?");

 if (confirmReset) {
 learnedWords = [];
 saveProgress();
 updateProgress();
 renderLearnedWords();
 displayWord();

 quizQuestionEl.textContent = "Click Start Quiz to test yourself.";
 quizOptionsEl.innerHTML = "";
 quizResultEl.textContent = "";
 }
});

categoryButtons.forEach((button) => {
 button.addEventListener("click", () => {
 categoryButtons.forEach((btn) => btn.classList.remove("active"));
 button.classList.add("active");
 changeCategory(button.dataset.category);
 });
});

updateProgress();
renderLearnedWords();
displayWord();
