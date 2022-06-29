/*----- constants -----*/
const MAX_WRONG_GUESSES = 5;
const WORDS = [
    'black hole',
    'planets',
    'space force',
    'light speed',
    'interstellar',
    'exploration',
    'cosmic',
    'sputnik',
    'gravity',
    'asteroid',
    'galaxy',
    'star'
  ];

/*----- app's state (variables) -----*/
let wrongGuesses; // Array to hold incorrect letters
let secret; // Array of the chars for the randomly selected word
let guess; // Array of current guessed letters
let gameStatus; // Null -> Game in progress; 'W' -> Winner; 'L' -> Loser

/*----- cached element references -----*/
const replayBtn = document.getElementById('play-again-btn');
const guessEl = document.getElementById('guess');
const spacemanImg = document.querySelector('img');
const letterBtns = [...document.querySelectorAll('article > button')];
// or Array.from(document.querySelectorAll('article > button'))
const msgEl = document.querySelector('h2');

/*----- event listeners -----*/
document.querySelector('article').addEventListener('click', handleLetterClick);
replayBtn.addEventListener('click', init);

/*----- functions -----*/
init();

function init() {
    wrongGuesses = [];
    const rndIdx = Math.floor(Math.random() * WORDS.length);
    secret = WORDS[rndIdx].toUpperCase().split('');
    // map always returns a NEW array of the same # of elements
    guess = secret.map(ltr => ltr === ' ' ? ' ' : '_');
    gameStatus = null;
    render();
}

function render() {
    // render the message
    renderMessage();
    // render the spaceman
    spacemanImg.src = `imgs/spaceman-${wrongGuesses.length}.jpg`
    // render the guess
    guessEl.textContent = guess.join('');
    // render the buttons
    renderButtons();
}

function renderMessage() {
    if (gameStatus === 'W') {
        msgEl.textContent = 'Congrats! You won!';
    } else if (gameStatus === 'L') {
        msgEl.innerHTML = `You're Out in Space! Better luck next time!<br>The word was ${secret.join('')}`;
    } else {
        msgEl.textContent = `${MAX_WRONG_GUESSES - wrongGuesses.length + 1} wrong guesses remain - Good Luck!`;
    }
}

function renderButtons() {
    letterBtns.forEach(function(btn) {
        const ltr = btn.textContent;
        if (wrongGuesses.includes(ltr)) {
            btn.className = 'wrong';
        } else if (guess.includes(ltr)) {
            btn.className = 'correct';
        } else {
            btn.className = '';
        }
    
    });
    replayBtn.style.visibility = gameStatus ? 'visible' : 'hidden';
}

function handleLetterClick(evt) {
    const ltr = evt.target.textContent;
    // guards
    if (
        gameStatus ||
        !letterBtns.includes(evt.target) ||
        wrongGuesses.includes(ltr) ||
        guess.includes(ltr)
    ) return
    if (secret.includes(ltr)) {
        //correct guess
        secret.forEach(function (char, idx) {
            if (char === ltr) guess[idx] = ltr;
        });
    } else {
        //wrong guess
        wrongGuesses.push(ltr);
    }
    // update gameStatus;
    gameStatus = getGameStatus();
    render();
}

function getGameStatus() {
    if (!guess.includes('_')) return 'W';
    if (wrongGuesses.length > MAX_WRONG_GUESSES) return 'L';
    return null;
}