const questionElement = document.getElementById("question");
const answerElement = document.getElementById("answer");
const showAnswerBtn = document.getElementById("showAnswerBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const cardCounter = document.getElementById("cardCounter");

const flashcardForm = document.getElementById("flashcardForm");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const formTitle = document.getElementById("formTitle");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const flashcardList = document.getElementById("flashcardList");

let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [
 {
 question: "What does HTML stand for?",
 answer: "HyperText Markup Language"
 },
 {
 question: "What is CSS used for?",
 answer: "CSS is used to style and design web pages."
 },
 {
 question: "What is JavaScript used for?",
 answer: "JavaScript adds interactivity and functionality to websites."
 }
];

let currentIndex = 0;
let editingIndex = null;
let answerVisible = false;

function saveFlashcards() {
 localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

function displayFlashcard() {
 if (flashcards.length === 0) {
 questionElement.textContent = "No flashcards available.";
 answerElement.textContent = "";
 answerElement.classList.add("hidden");
 showAnswerBtn.classList.add("hidden");
 cardCounter.textContent = "Card 0 of 0";
 previousBtn.disabled = true;
 nextBtn.disabled = true;
 return;
 }

 const currentCard = flashcards[currentIndex];

 questionElement.textContent = currentCard.question;
 answerElement.textContent = currentCard.answer;

 if (answerVisible) {
 answerElement.classList.remove("hidden");
 showAnswerBtn.textContent = "Hide Answer";
 } else {
 answerElement.classList.add("hidden");
 showAnswerBtn.textContent = "Show Answer";
 }

 showAnswerBtn.classList.remove("hidden");
 cardCounter.textContent = `Card ${currentIndex + 1} of ${flashcards.length}`;

 previousBtn.disabled = currentIndex === 0;
 nextBtn.disabled = currentIndex === flashcards.length - 1;
}

function renderFlashcardList() {
 flashcardList.innerHTML = "";

 if (flashcards.length === 0) {
 flashcardList.innerHTML = `
 <p class="empty-message">No flashcards yet. Add your first flashcard above.</p>
 `;
 return;
 }

 flashcards.forEach((card, index) => {
 const cardItem = document.createElement("div");
 cardItem.classList.add("flashcard-item");

 cardItem.innerHTML = `
 <div>
 <h3>${index + 1}. ${card.question}</h3>
 <p>${card.answer}</p>
 </div>
 <div class="item-buttons">
 <button class="edit-btn" onclick="editFlashcard(${index})">Edit</button>
 <button class="delete-btn" onclick="deleteFlashcard(${index})">Delete</button>
 </div>
 `;

 flashcardList.appendChild(cardItem);
 });
}

function resetForm() {
 flashcardForm.reset();
 editingIndex = null;
 formTitle.textContent = "Add New Flashcard";
 saveBtn.textContent = "Add Flashcard";
 cancelBtn.classList.add("hidden");
}

showAnswerBtn.addEventListener("click", () => {
 answerVisible = !answerVisible;
 displayFlashcard();
});

previousBtn.addEventListener("click", () => {
 if (currentIndex > 0) {
 currentIndex--;
 answerVisible = false;
 displayFlashcard();
 }
});

nextBtn.addEventListener("click", () => {
 if (currentIndex < flashcards.length - 1) {
 currentIndex++;
 answerVisible = false;
 displayFlashcard();
 }
});

flashcardForm.addEventListener("submit", (event) => {
 event.preventDefault();

 const question = questionInput.value.trim();
 const answer = answerInput.value.trim();

 if (!question || !answer) {
 alert("Please enter both a question and an answer.");
 return;
 }

 if (editingIndex !== null) {
 flashcards[editingIndex] = { question, answer };
 currentIndex = editingIndex;
 } else {
 flashcards.push({ question, answer });
 currentIndex = flashcards.length - 1;
 }

 saveFlashcards();
 answerVisible = false;
 resetForm();
 displayFlashcard();
 renderFlashcardList();
});

function editFlashcard(index) {
 editingIndex = index;

 questionInput.value = flashcards[index].question;
 answerInput.value = flashcards[index].answer;

 formTitle.textContent = "Edit Flashcard";
 saveBtn.textContent = "Save Changes";
 cancelBtn.classList.remove("hidden");

 window.scrollTo({
 top: document.querySelector(".form-section").offsetTop - 20,
 behavior: "smooth"
 });
}

function deleteFlashcard(index) {
 const confirmed = confirm("Are you sure you want to delete this flashcard?");

 if (!confirmed) {
 return;
 }

 flashcards.splice(index, 1);

 if (currentIndex >= flashcards.length) {
 currentIndex = flashcards.length - 1;
 }

 if (currentIndex < 0) {
 currentIndex = 0;
 }

 saveFlashcards();
 answerVisible = false;
 resetForm();
 displayFlashcard();
 renderFlashcardList();
}

cancelBtn.addEventListener("click", () => {
 resetForm();
});

displayFlashcard();
renderFlashcardList();
