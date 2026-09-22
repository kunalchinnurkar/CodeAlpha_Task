const quotes = [
 {
 text: "The future belongs to those who believe in the beauty of their dreams.",
 author: "Eleanor Roosevelt"
 },
 {
 text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
 author: "Winston Churchill"
 },
 {
 text: "Believe you can and you're halfway there.",
 author: "Theodore Roosevelt"
 },
 {
 text: "Do what you can, with what you have, where you are.",
 author: "Theodore Roosevelt"
 },
 {
 text: "The only way to do great work is to love what you do.",
 author: "Steve Jobs"
 },
 {
 text: "It always seems impossible until it is done.",
 author: "Nelson Mandela"
 }
];

const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const newQuoteBtn = document.getElementById("newQuoteBtn");

let lastQuoteIndex = -1;

function generateQuote() {
 let randomIndex;

 do {
 randomIndex = Math.floor(Math.random() * quotes.length);
 } while (randomIndex === lastQuoteIndex);

 lastQuoteIndex = randomIndex;

 quoteText.textContent = `"${quotes[randomIndex].text}"`;
 authorText.textContent = `— ${quotes[randomIndex].author}`;
}

newQuoteBtn.addEventListener("click", generateQuote);

generateQuote();
