let word;
let attempt;
let currentLetter;
let letterCount;
const wrapper = document.querySelector('#wrapper');

newGameModal();

function selectWord() {
    const rand = Math.floor(Math.random() * (wordsToGuess.length -1 - 0 + 1) ) + 0;
    return wordsToGuess[rand];
}

function playGame(mode) {
    word = mode === 'auto' ? selectWord().toUpperCase().split('') : mode.toUpperCase().split('');
    attempt = 0;
    currentLetter = 0;
    letterCount = countLetters(word);
    resetGame();
    initEventListener();
    initKeyboardEventListener();
}

function resetGame(){
    closeModals();
    const tiles = document.querySelectorAll('.word-letter');
    tiles.forEach(tile => {
        tile.textContent ='';
        tile.className = 'word-letter';
    })
    resetLetterButtons();
}

function resetLetterButtons() {
    const keys = document.querySelectorAll('.letter-button');
    keys.forEach(key => {
        if(key.classList.contains('button-green') ||
            key.classList.contains('button-yellow') ||
            key.classList.contains('button-gray')) {
                key.className = 'letter-button';
            }
    });
}

function listenToPlayButton(event) {
    if (event.keyCode == CODES.return){
        checkNewWord();
    }
}

function initEventListener(){
    document.addEventListener('keyup', keyboardHandle);
}

function cancelEventListener(){
    document.removeEventListener('keyup', keyboardHandle);
}

function initKeyboardEventListener() {
    document.querySelectorAll('.letter-button').forEach(button => {
        button.addEventListener('click', emitKey);
    })
}

function emitKey(event) {
    if(event.currentTarget.classList.contains('letter-button')) {
        const key = parseInt(event.currentTarget.dataset.key) || event.target.dataset.key.toUpperCase().charCodeAt(0);
        keyHandle(key);
    }
}

function keyboardHandle(event) {
    document.activeElement.blur();
    keyHandle(event.keyCode);
}

function keyHandle(key) {
    let row = document.querySelectorAll('.word')[attempt];
    let letters = row.querySelectorAll('.word-letter');
    if (key >= CODES.upperA && key <= CODES.upperZ && currentLetter < WORD_LENGTH) {
        displayLetter(key, letters[currentLetter]);
        return
    }
    if (key == CODES.return){
        revealWord(letters);
        return
    }
    if (key == CODES.backspace) {
        eraseLetter(letters[currentLetter - 1]);
    }

}

function closeModals(){
    if(document.querySelector('.results-wrap')) {
        document.querySelector('.results-wrap').remove();
    }
    if(document.querySelector('.select-mode-wrap')) {
        document.querySelector('.select-mode-wrap').remove();
    }
    if(document.querySelector('.word-input-wrap')) {
        document.querySelector('.word-input-wrap').remove();
        document.removeEventListener('keyup', listenToPlayButton);
    }
}

function newGameModal() {
    closeModals();
    
    if (!wrapper.querySelector('.select-mode-wrap')) {
        wrapper.appendChild(getSelectModeModal());
    }
}

function showInput() {
    closeModals();
    if (!wrapper.querySelector('.word-input')) {
        wrapper.appendChild(getWordInput());
    }
    wordInput.querySelector('#word-input').focus();
    document.addEventListener('keyup', listenToPlayButton)
}


function displayLetter(code, tile) {
    tile.textContent = String.fromCharCode(code);
    tile.classList.add('active');
    currentLetter++;
        
}

function eraseLetter(tile) {
    if (tile) {
        tile.textContent = '';
        tile.classList.remove('active');
        currentLetter--;
    }
}

function countLetters(word) {
    const letterCount = {};
    word.forEach(el => {
        if (!letterCount[el]) {
            letterCount[el] = 1;
        } else {
            letterCount[el]++;
        }
    });
    return letterCount;
}

function revealLetter(result, i) {
    result[i][0].classList.add('reveal');
    setTimeout(() => {
        result[i][0].classList.add(result[i][1]);
        if(i < WORD_LENGTH - 1) {
            revealLetter(result, ++i);
        }
    }, 250);
}

function revealWord(letters) {
    const guessed = [];
    letters.forEach(letter => guessed.push(letter.textContent));
    if (!dictionary.includes(getTypedWord(guessed))) {
        fireAlert(MESSAGES.notInDict, undefined);
        shake(Array.from(document.querySelectorAll('.word'))[attempt]);
        return
    }
    attempt++;
    currentLetter = 0;
    const result = checkLetters(letters, guessed);
    revealLetter(result, 0);
    setTimeout(() => {
        colorLetterButtons(result);
        checkWin(result);
        checkLose();
    }, 1700);
}

function getTypedWord(word) {
    return word.join('').toLowerCase();
}

function colorLetterButtons(result) {
    const keys = Array.from(document.querySelectorAll('button'));
    for (let letter of result) {
        const key = keys.find(k => k.textContent === letter[0].textContent);
        key.classList.add(`button-${letter[1]}`);
    }
}

function checkWin(result) {
    if (result.every(el => el[1] === 'green')){
        fireAlert(getWinMessage(), RESULTS.win);
        const word = Array.from(document.querySelectorAll('.word'))[attempt-1];
        const tiles = Array.from(word.querySelectorAll('.word-letter'));
        jump(tiles, 0);
        gameOver(RESULTS.win);
    }
}

function checkLose() {
    if(attempt > 5) {
        fireAlert(getTypedWord(word), RESULTS.lose);
        gameOver(RESULTS.lose);
    }
}

function checkLetters(letters, guess) {
    //result contains letters of the guess and arrays of their colors
    const result = [];
    for (let i = 0; i < WORD_LENGTH; i++){
        const guessLetter = guess[i];
        const letterInResult = result.find(el => el.hasOwnProperty(guessLetter));
        //if current letter is still not in result array, push it
        if (!letterInResult) {
            const output = {[guessLetter] : [[letters[i], calculateColor(guess, i)]]};
            result.push(output);
        //if current letter is already in result array
        } else {
            //if current letter is present in the Word and current occurence is less than total occurences of the letter in the Word
            if (letterCount[guess[i]] && 
            letterInResult[guessLetter].length < letterCount[guessLetter]){
            //push the color to the colors array of the letter
                letterInResult[guessLetter].push([letters[i], calculateColor(guess, i)]);
            //if current letter is present in the Word and current occurence is bigger than total occurences of the letter in the Word
            } else {
                const color = calculateColor(guess, i);
                //if color is green, find the first yellow occurence of the letter and replace it with gray
                if (color === 'green') {
                    const letterToReplace = letterInResult[guessLetter].find(el => el[1] === 'yellow');
                    letterToReplace[1] = 'gray';
                    letterInResult[guessLetter].push([letters[i], color]);
                //otherwise push new occurence as gray
                } else {
                    letterInResult[guessLetter].push([letters[i], 'gray']);
                }
            }
        }
    }
    let resultArray = [];
    //re-pack results array according to the order of the letters in the Word, so that tiles can open sequentially
    guess.forEach(el => {
        let letterToProcess = result.find(item => item.hasOwnProperty(el));
        resultArray.push(letterToProcess[el][0]);
        letterToProcess[el].shift();
    })
    return resultArray;
}

function calculateColor(guess, i) {
    if (word.includes(guess[i]) && word[i] !== guess[i]) {
        return 'yellow';
    } else if (word.includes(guess[i]) && word[i] === guess[i]) {
        return 'green';
    } else {
        return 'gray';
    }
}

function fireAlert(message, status) {
    const box = document.querySelector('#alert');
    box.querySelector('p').textContent = message;
    box.style.visibility = 'visible';
    if (status && status === RESULTS.win || !status) {
        setTimeout(() => {
 box.style.visibility = 'hidden'; 
}, 3000);
    }
}

function getWinMessage() {
    const winMessage = attempt === 1 ? MESSAGES.wow :
        attempt === 2 ? MESSAGES.perfect :
        attempt === 3 ? MESSAGES.awesome :
        MESSAGES.super;
    return winMessage
}

function shake(word){
    word.classList.add('shaken');
    setTimeout(() => word.classList.remove('shaken'), 1500);
}

function jump(letters, i){
    letters[i].classList.add('jumping');
    setTimeout(() => {
        if(i < WORD_LENGTH - 1) {
            jump(letters, ++i);
        }
    }, 70);
}

function showResultsAndStats(results) {
    if (!wrapper.querySelector('.results-wrap')) {
        wrapper.appendChild(getGameOverModal(results));
    }
}

function gameOver(status) {
    cancelEventListener();
    if (status === RESULTS.win || status === RESULTS.lose) {
        setTimeout(() => showResultsAndStats(status), 2000);
    }
}