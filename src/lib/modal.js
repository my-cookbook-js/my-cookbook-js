const container = document.createElement('div');
container.id = 'overlay';

const modalDiv = document.createElement('div');
modalDiv.id = 'modal';
container.appendChild(modalDiv);

const msg = document.createElement('p');
modalDiv.appendChild(msg);

const okButton = document.createElement('button');
okButton.id = 'modal-ok';
okButton.textContent = 'OK';
modalDiv.appendChild(okButton);
okButton.addEventListener('click', () => onChoice(true));

const cancelButton = document.createElement('button');
cancelButton.id = 'modal-cancel';
cancelButton.textContent = 'Cancel';
modalDiv.appendChild(cancelButton);
cancelButton.addEventListener('click', () => onChoice(false));

let callback = null;

export function showModal(message, cb) {
    callback = cb;
    msg.textContent = message;
    document.body.appendChild(container);
}

function onChoice(choice) {
    clear();
    callback(choice);
}

function clear() {
    container.remove();
}
