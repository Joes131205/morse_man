import alphabetToMorse from "./alphabetToMorse.js";
import morseToAlphabet from "./morseToAlphabet.js";

const dotButton = document.getElementById("dotButton");
const dashButton = document.getElementById("dashButton");
const deleteButton = document.getElementById("deleteButton");
const submitButton = document.getElementById("submitButton");
const currMorseEl = document.getElementById("currMorse");
const inputMorseEl = document.getElementById("inputMorse");
const containerWordDisplay = document.querySelector(".container-wordDisplay");

let playing = true;
let inputMorse = "";
let currentMorse;

async function init() {
    playing = true;
    inputMorse = "";
    const currentWord = await getRandomWord();
    currentMorse = wordToMorse(currentWord);
    render(currentMorse);
    console.log(currentMorse);
}

async function getRandomWord() {
    const response = await fetch("https://random-word-api.herokuapp.com/word");
    const data = await response.json();
    return data[0];
}

function wordToMorse(str) {
    return str
        .split("")
        .map((char) => alphabetToMorse[char.toLowerCase()])
        .join(" ");
}

function morseToLetter(morse) {
    return morse
        .split(" ")
        .map((code) => morseToAlphabet[code])
        .join("");
}

function handleGuess() {
    const correctGuess = currentMorse === inputMorse;
    if (correctGuess) {
        const span = document.createElement("span");
        span.textContent = morseToLetter(currentMorse);
        containerWordDisplay.appendChild(span);
    }
}

function render(morse) {
    const wordHtml = morse
        .split(" ")
        .map(() => '<span class="letter">-</span>')
        .join("");
    console.log(wordHtml);
    containerWordDisplay.innerHTML = wordHtml;
}

function updateInputMorse(char) {
    if (playing && inputMorse.length < 4) {
        inputMorse += char;
        currMorseEl.innerHTML = inputMorse;
    }
}

dotButton.addEventListener("click", () => updateInputMorse("."));
dashButton.addEventListener("click", () => updateInputMorse("-"));

deleteButton.addEventListener("click", () => {
    if (playing && inputMorse.length > 0) {
        inputMorse = inputMorse.slice(0, -1);
        currMorseEl.innerHTML = inputMorse;
    }
});

submitButton.addEventListener("click", () => {
    if (playing) {
        const input = inputMorseEl.value;
        playing = false;
        handleGuess(input);
    }
});

init();
