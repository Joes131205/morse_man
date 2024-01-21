import alphabetToMorse from "./alphabetToMorse.js";
import morseToAlphabet from "./morseToAlphabet.js";

const dotButton = document.getElementById("dotButton");
const dashButton = document.getElementById("dashButton");
const deleteButton = document.getElementById("deleteButton");
const submitButton = document.getElementById("submitButton");
const inputMorseEl = document.getElementById("inputMorse");
const liveLeftEl = document.getElementById("liveLeft");
const correctsEl = document.getElementById("corrects");
const loserEl = document.getElementById("loser");

const containerWordDisplay = document.querySelector(".container-wordDisplay");

let playing = false;
let inputMorse = "";
let secondary;
let currWord;
let currentMorse;

let lives = 5;
let corrects = 0;
async function init() {
    loserEl.style.display = "none";
    lives = 5;
    liveLeftEl.innerHTML = `&#9829 ${lives}`;
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

function handleGuess(input) {
    containerWordDisplay.classList.add("guess");
    const staticAudio = new Audio("./static-pixabay.mp3");
    staticAudio.play();
    let foundDupe = false;
    let foundAny = false;

    for (let i = 0; i < currentMorse.length; i++) {
        if (input === currentMorse[i]) {
            foundAny = true;
            if (secondary[i] !== "?") {
                foundDupe = true;
                break;
            } else {
                secondary[i] = input;
            }
        }
    }

    setTimeout(() => {
        staticAudio.pause();
        staticAudio.currentTime = 0;
        containerWordDisplay.classList.remove("guess");

        if (!foundAny || foundDupe) {
            lives--;
            liveLeftEl.innerHTML = `&#9829 ${lives}`;

            console.log(lives);
            if (lives === 0) {
                loserEl.style.display = "block";
                loserEl.innerHTML = `
                <p>Actual morse: ${currentMorse}</p>
                <p>Actual word: ${currWord}</p>
                `;

                playing = false;
                return;
            }
        }
        playing = true;
    }, 1000);

    console.log(secondary);

    const wordHtml = secondary
        .map((letter) => {
            const span = document.createElement("span");
            span.classList.add("letter");
            span.textContent = letter;
            return span.outerHTML;
        })
        .join(" ");

    containerWordDisplay.innerHTML = wordHtml;

    if (secondary.every((item) => item !== "?")) {
        handleWin();
        return;
    }
}
function handleWin() {
    playing = false;
    corrects++;
    correctsEl.innerHTML = `&#10003 ${corrects}`;
    containerWordDisplay.innerHTML += `<span>Actual word: ${currWord}</span>`;
    console.log(containerWordDisplay);
}
function render(morse) {
    const wordHtml = morse.map(() => '<span class="letter">?</span>').join(" ");
    console.log(wordHtml);
    containerWordDisplay.innerHTML = wordHtml;
}

function updateInputMorse(char) {
    if (playing && inputMorse.length < 4) {
        if (char === ".") {
            const dot = new Audio("./dot.wav");
            dot.play();
        } else {
            const dash = new Audio("./dash.wav");
            dash.play();
        }
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
