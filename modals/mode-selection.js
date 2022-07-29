const modeSelectionMarkup = `
    <div class="select-mode" id="select-mode">
        <div>
            <div class="cross" onClick="closeModals()"><i class="fa-solid fa-xmark"></i></div>
            <div class="modal-text-wrap">
                <h3 class="modal-heading">Please, select game mode</h3>
                <p><strong>Auto</strong> - will select a word randomly for you</p>
                <p><strong>Pair</strong> - you will see a form to enter a word for your friend to guess</p>
            </div>
        </div>
        <div class="result-buttons-wrap">
            <button id="auto" class="modal-button" onClick="playGame('auto')">Auto</button>
            <button class="modal-button" onClick="showInput()">Pair</button>
        </div>
    </div>
`;

const modeSelectionModal= document.createElement('div');
modeSelectionModal.classList.add('select-mode-wrap');
modeSelectionModal.innerHTML = modeSelectionMarkup;


function getSelectModeModal() {
    return modeSelectionModal;
}