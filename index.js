import alphabetToMorse from "./alphabetToMorse.js";
import morseToAlphabet from "./morseToAlphabet.js";

const dotButton = document.getElementById("dotButton");
const dashButton = document.getElementById("dashButton");
const deleteButton = document.getElementById("deleteButton");
const submitButton = document.getElementById("submitButton");
const inputMorseEl = document.getElementById("inputMorse");
const containerWordDisplay = document.querySelector(".container-wordDisplay");

let playing = false;
let inputMorse = "";
let secondary;
let currWord;
let currentMorse;

let lives = 5;

async function init() {
    inputMorse = "";
    currWord = await getRandomWord();
    currentMorse = wordToMorse(currWord);
    render(currentMorse);
    secondary = new Array(currentMorse.length).fill("?");
    console.log(currentMorse);
    playing = true;
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
    let foundDupe = false;
    let foundAny = false;

    for (let i = 0; i < currentMorse.length; i++) {
        if (input === currentMorse[i]) {
            foundAny = true;
            if (secondary[i] !== "?") {
                console.log("already same!");
                foundDupe = true;
                break;
            } else {
                secondary[i] = input;
            }
        }
    }

    if (!foundAny || foundDupe) {
        lives--;
        console.log(lives);
        if (lives === 0) {
            alert("Game Over!");
            playing = false;
            return;
        }
    }

    console.log(secondary);

    const wordHtml = secondary
        .map((letter) => {
            const span = document.createElement("span");
            span.classList.add("letter");

            if (letter !== "?") {
                if (span.classList.contains("new")) {
                    span.classList.remove("new");
                }
                span.classList.add("new");
            }

            span.textContent = letter;
            return span.outerHTML;
        })
        .join(" ");

    console.log(wordHtml);

    if (secondary.every((item) => item !== "?")) {
        handleWin();
    }

    containerWordDisplay.innerHTML = wordHtml;
    playing = true;
}

function render(morse) {
    const wordHtml = morse.map(() => '<span class="letter">?</span>').join(" ");
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
