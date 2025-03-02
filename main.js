//** [SR]
// * Pomoć u praćenju poteza za društvenu igru [Colt Express]
// *
// * Pravila su takva kada se igra u dvoje ili troje, jedan igrač kontroliše 2 igrača i jako mi je bilo teško da pratim ko je sada na redu
// * Pa sam napravio ovaj mini program DnD gde se jasno vidi koji igrač igra prvi
// *
// * Kako radi program?
// *
// TODO * 1. dodati prvi screen play game
// TODO * 2. Klikom na dugme Start Game, prelazi se na sledeci skrin odabir igrača
// TODO * 3. Korisnik bira igraca i zapocinje igru na dugme Play
// * 2. Kada se potez završi klikne se dugme Next Round
// * 3. Prvi koji je igrao ide na začelje, a drugi igrač dolazi na prvo mesto
//  */

const INITIAL_STATE = {
	playerOrderIndex: 0,
};

window.addEventListener('load', () => {
	generatePlayers(6);

	/** @type {NodeListOf<HTMLDivElement>} */
	const holders = document.querySelectorAll('.holder');
	holders.forEach((holder) => {
		holder.addEventListener('dragenter', handleDragEnter);

		holder.addEventListener('dragleave', handleDragLeave);

		holder.addEventListener('drop', handleDrop);

		holder.addEventListener('dragover', (ev) => ev.preventDefault());
	});

	const btnNextRound = document.querySelector('button');
	btnNextRound.addEventListener('click', playNextRound);

	const btnRestart = document.querySelector('#btn-restart');
	btnRestart.addEventListener('click', handleRestart);
});

const handleDragEnter = (ev) => {
	if (ev.target.id !== 'chosen-container') return;

	if (ev.target.classList.contains('holder')) {
		ev.target.classList.add('hovered');
	}
};

const handleDragLeave = (ev) => {
	if (ev.target.id !== 'chosen-container') return null;

	if ([...ev.target.classList].includes('holder')) {
		ev.target.classList.remove('hovered');
	}
};

const handleDrop = (ev) => {
	if (ev.target.id !== 'chosen-container') return null;

	ev.preventDefault();

	const characterId = ev.dataTransfer.getData('text'); // Uzimamo id elementa koji je dragovan
	const character = document.querySelector(`#${characterId}`);

	if (character) {
		character.textContent = ++INITIAL_STATE.playerOrderIndex;

		ev.target.appendChild(character);
		character.classList.remove('invisible');
	}

	ev.target.classList.remove('hovered');

	refreshChosenContainer();
};

const handleRestart = () => {
	const holders = document.querySelectorAll('.holder');
	holders.forEach((holder) => (holder.innerHTML = ''));

	INITIAL_STATE.playerOrderIndex = 0;
	generatePlayers(6);
};

/**
 * Maxmimum is 6 and minimum is 2
 * @param {number} totalPlayers
 * @returns
 */
const generatePlayers = (totalPlayers) => {
	try {
		if (!isValidPlayerCount(totalPlayers)) {
			throw new Error('Broj igrača mora biti između 2 i 6!');
		}

		renderPlayers(totalPlayers); // Kreiramo nove igrače

		/** @type {NodeListOf<HTMLDivElement>} */
		const characters = document.querySelectorAll('.character');

		const handleDragStart = (ev) => {
			ev.dataTransfer.clearData();
			ev.dataTransfer.setData('text/plain', ev.target.id);

			setTimeout(() => ev.target.classList.add('invisible'), 0);
		};

		const handleDragEnd = (ev) => ev.target.classList.remove('invisible');

		characters.forEach((character) => {
			character.addEventListener('dragstart', handleDragStart);
			character.addEventListener('dragend', handleDragEnd);
		});
	} catch (err) {
		console.error('Desila se greška:', err.message);
	}
};

const refreshChosenContainer = () => document.querySelector('#chosen-container');

const isValidPlayerCount = (totalPlayers) => totalPlayers >= 2 && totalPlayers <= 6;

const playNextRound = () => {
	// Refreshing DOM with latest changes
	const chosenContainer = refreshChosenContainer();

	updatePlayerOrder(chosenContainer);
};

const updatePlayerOrder = (chosenContainer) => {
	const characterOrders = getCurrentPlayersTurn(chosenContainer);

	rotatePlayersOrder(characterOrders);

	renderNewOrder({ chosenContainer, characterOrders });
};

const getCurrentPlayersTurn = (chosenContainer) => Array.from(chosenContainer.children);

const renderNewOrder = ({ chosenContainer, characterOrders }) => {
	chosenContainer.innerHTML = '';

	characterOrders.forEach((character) => {
		chosenContainer.appendChild(character);
	});
};

const rotatePlayersOrder = (characterOrders) => {
	const firstElement = characterOrders.shift();
	characterOrders.push(firstElement);
};

const COLORS = {
	0: 'red',
	1: 'blue',
	2: 'green',
	3: 'purple',
	4: 'gray',
	5: 'cyan',
};

function renderPlayers(totalPlayers) {
	const container = document.getElementById('choose-players');

	for (let i = 0; i < totalPlayers; i++) {
		const div = document.createElement('div');

		div.className = 'character';
		div.style.backgroundColor = COLORS[i];
		div.setAttribute('draggable', 'true');
		div.setAttribute('id', `player-${i + 1}`);

		container.appendChild(div);
	}
}

/**
 * U DnD (Drag n Drop-u) - Treba da postoje kontejneri gde ce da se dropuje content
 * I sta ce da se dropuje
 *
 * Gde ce da se dropuje treba da ima eventove poput dragenter, dragleave, dragover, drop
 * Sta ce da se dropuje treba da ima dragstart i dragend
 *
 * Takodje kontent (element) koji zelimo da dragujemo, mora da ima atribut draggable=true
 */
