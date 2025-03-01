//** [SR]
// * Pomoć u praćenju poteza za društvenu igru [Colt Express]
// *
// * Pravila su takva kada se igra u dvoje ili troje, jedan igrač kontroliše 2 igrača i jako mi je bilo teško da pratim ko je sada na redu
// * Pa sam napravio ovaj mini program DnD gde se jasno vidi koji igrač igra prvi
// *
// * Kako radi program?
// *
// * 1.
// * 2. Kada se potez završi klikne se dugme Next Round
// * 3. Prvi koji je igrao ide na začelje, a drugi igrač dolazi na prvo mesto
//  */
// TODO - 1. Omoguciti formu za unos broja igraca
// TODO - 2. Omoguciti dinamican odabir boja
// TODO - 3. Cuvati raspored kutija
// TODO - 4- Dodati brojeve u kutije. Brojevi predstavljaju redosled koji je prvi dodat
// TODO - 4.1. Dodati dugme "Next round" - Koji ce da menja broj koji se nalazi unutar kocke (trenutno je unutar, ako se menja dizajn moze i negde drugde)

window.addEventListener('load', () => {
	generatePlayers(6);

	// JAKO GLUPO! - Da nemam JSDoc, ne bi mogao da mi nadje nijedan dogadjaj
	/** @type {NodeListOf<HTMLDivElement>} */
	const characters = document.querySelectorAll('.character');

	characters.forEach((character, index) => {
		character.addEventListener('dragstart', (ev) => {
			// ev.dataTransfer.setData('text/plain', character.outerHTML); // Radilo
			ev.dataTransfer.setData('text/plain', index);
			setTimeout(() => ev.target.classList.add('invisible'), 0);
		});

		character.addEventListener('dragend', (ev) => {
			ev.target.classList.remove('invisible');
		});
	});

	/** @type {NodeListOf<HTMLDivElement>} */
	const holders = this.document.querySelectorAll('.holder');
	holders.forEach((holder) => {
		holder.addEventListener('dragenter', (ev) => {
			if (ev.target.id !== 'chosen-container') return null;

			if ([...ev.target.classList].includes('holder')) {
				ev.target.classList.add('hovered');
			}
		});

		holder.addEventListener('dragleave', (ev) => {
			if (ev.target.id !== 'chosen-container') return null;

			if ([...ev.target.classList].includes('holder')) {
				ev.target.classList.remove('hovered');
			}
		});

		let playerOrderIndex = 0;
		holder.addEventListener('drop', (ev) => {
			if (ev.target.id !== 'chosen-container') return null;

			ev.preventDefault();

			const characterIndex = ev.dataTransfer.getData('text/plain'); // Uzimamo index
			const character = characters[characterIndex]; // Dohvatamo character iz NodeList-a po indexu

			if (character) {
				playerOrderIndex++;

				character.textContent = playerOrderIndex;

				holder.appendChild(character);
				character.classList.remove('invisible');
			}

			ev.target.classList.remove('hovered');

			refreshChosenContainer();
		});

		holder.addEventListener('dragover', (ev) => ev.preventDefault());
	});

	const btnNextRound = document.querySelector('button');

	btnNextRound.addEventListener('click', playNextRound);
});

/**
 * Maxmimum is 6 and minimum is 2
 * @param {number} totalPlayers
 * @returns
 */
function generatePlayers(totalPlayers) {
	try {
		if (!isValidPlayerCount(totalPlayers)) {
			throw new Error('Broj igrača mora biti između 2 i 6!');
		}

		renderPlayers(totalPlayers);
	} catch (err) {
		console.error('Desila se greška:', err.message);
	}
}

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
