import alphabetToMorse from "./alphabetToMorse.js";
import morseToAlphabet from "./morseToAlphabet.js";

const dotButton = document.getElementById("dotButton");
const dashButton = document.getElementById("dashButton");
const deleteButton = document.getElementById("deleteButton");
const submitButton = document.getElementById("submitButton");
const inputMorseEl = document.getElementById("inputMorse");
const containerWordDisplay = document.querySelector(".container-wordDisplay");

let playing = true;
let inputMorse = "";
let secondary;
let currWord;
let currentMorse;

async function init() {
    playing = true;
    inputMorse = "";
    currWord = await getRandomWord();
    currentMorse = wordToMorse(currWord);
    render(currentMorse);
    secondary = new Array(currentMorse.length).fill("-");
    console.log(currentMorse);
}

async function getRandomWord() {
    const response = await fetch("https://random-word-api.herokuapp.com/word");
    const data = await response.json();
    return data[0];
}

function wordToMorse(str) {
    return str.split("").map((char) => alphabetToMorse[char.toLowerCase()]);
}

function morseToLetter(morse) {
    return morse
        .split(" ")
        .map((code) => morseToAlphabet[code])
        .join("");
}

function handleGuess(input) {
    console.log("handling...");
    for (let i = 0; i < currentMorse.length; i++) {
        if (input === currentMorse[i]) {
            secondary[i] = input;
        } else if (secondary[i] !== "-") {
            continue;
        } else {
            secondary[i] = "-";
        }
    }

    console.log(secondary);

    const wordHtml = secondary
        .map((letter) => `<div class="letter">${letter}</div>`)
        .join("");

    containerWordDisplay.innerHTML = wordHtml;
    playing = true;
}

function render(morse) {
    const wordHtml = morse.map(() => '<span class="letter">-</span>').join("");
    console.log(wordHtml);
    containerWordDisplay.innerHTML = wordHtml;
}

function updateInputMorse(char) {
    if (playing && inputMorse.length < 4) {
        inputMorse += char;
        console.log(inputMorse);
        inputMorseEl.textContent = inputMorse;
    }
}

dotButton.addEventListener("click", () => updateInputMorse("."));
dashButton.addEventListener("click", () => updateInputMorse("-"));

deleteButton.addEventListener("click", () => {
    if (playing && inputMorse.length > 0) {
        inputMorse = inputMorse.slice(0, -1);
        inputMorseEl.innerHTML = inputMorse;
    }
});

submitButton.addEventListener("click", () => {
    if (playing) {
        console.log(inputMorseEl.textContent);
        const input = inputMorseEl.textContent;
        playing = false;
        handleGuess(input);
    }
});

init();
