const wordInputMarkup = `
    <div class="word-input" >
            <div class="cross" onClick="closeModals()"><i class="fa-solid fa-xmark"></i></div>
            <div class="modal-text-wrap">
                <h3 class="modal-heading">Enter the word for your friend to guess.</h3>
                <p> Then click "Play"</p>
                <div><input id="word-input" type="text" autofocus/></div>
            </div>
        <div class="result-buttons-wrap">
            <button class="modal-button" onClick="checkNewWord()">Play</button>
        </div>
    </div>
`;

const wordInput= document.createElement('div');
wordInput.classList.add('word-input-wrap');
wordInput.innerHTML = wordInputMarkup;

function getWord() {
    return document.querySelector('#word-input').value;
}

function checkNewWord() {
    const newWord = getWord();
    if (!dictionary.includes(getWord())) {
        shake(document.querySelector('#word-input'));
        return;
    }
    playPairGame(newWord);
}

function playPairGame(newWord) {
    playGame(newWord);
}


function getWordInput() {
    wordInput.querySelector('#word-input').value = '';
    return wordInput;
}