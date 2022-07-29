const gameOverMarkup = `
    <div class="results" id="results">
        <div class="cross" onClick="closeModals()"><i class="fa-solid fa-xmark"></i></div>
        <div class="modal-text-wrap">
                
                <p><strong>Statistics</strong> will be added here in a later edition</p>
                <p>Do you want to <strong>play a new game</strong>?</p>
        </div>
        <div class="result-buttons-wrap">
            <button id="new-game" class="modal-button" onClick="newGameModal()">Play new game</button>
            <button class="modal-button" onClick="closeModals()">Close</button>
        </div>
    </div>
`;

const gameOverModal = document.createElement('div');
gameOverModal.classList.add('results-wrap');
gameOverModal.innerHTML = gameOverMarkup;
const heading = document.createElement('h3');
heading.classList.add('modal-heading');
const modalWrap = gameOverModal.querySelector('.modal-text-wrap');


function getGameOverModal(results) {
    if(results) {
        modalWrap.prepend(heading);
        heading.innerHTML = HEADINGS[results];
    }
    return gameOverModal;
}