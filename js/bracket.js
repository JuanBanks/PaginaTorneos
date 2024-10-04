let participants = [];
let rounds = [];
let currentRound = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Cargar los participantes del almacenamiento local
    participants = JSON.parse(localStorage.getItem('participants')) || [];
    if (participants.length < 2) {
        alert('No hay suficientes participantes para crear un bracket.');
        window.location.href = 'index.html';
        return;
    }
    createBracket();
});

function createBracket() {
    const bracketContainer = document.getElementById('bracket');
    bracketContainer.innerHTML = ''; // Limpiar el contenedor del bracket

    rounds = [];
    currentRound = 0;

    let matches = participants.slice();

    while (matches.length > 1) {
        if (matches.length % 2 !== 0) {
            matches.push('BYE');
        }
        rounds.push([...matches]);
        matches = Array(Math.ceil(matches.length / 2)).fill(null);
    }

    rounds.push(matches); // Añadir la ronda final
    renderBracket();
}

function renderBracket() {
    const bracketContainer = document.getElementById('bracket');
    bracketContainer.innerHTML = ''; // Limpiar el contenedor del bracket

    rounds.forEach((round, roundIndex) => {
        const roundContainer = document.createElement('div');
        roundContainer.className = 'round';
        if (roundIndex + 1 === rounds.length - 1) {
            roundContainer.innerHTML = `<h2>FINAL</h2>`;
        } else if (roundIndex === rounds.length - 1) {
            roundContainer.innerHTML = `<h2>GANADOR</h2>`;
        } else {
            roundContainer.innerHTML = `<h2>Ronda ${roundIndex + 1}</h2>`;
        }

        for (let i = 0; i < round.length; i += 2) {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match';

            if (i + 1 < round.length) {
                matchDiv.innerHTML = `
                    <span>${createParticipantSpan(round[i], roundIndex, i)}</span> 
                    <button onclick="advance('${round[i]}', ${roundIndex}, ${i})">Gana</button>
                    <span> vs </span>
                    <button onclick="advance('${round[i + 1]}', ${roundIndex}, ${i + 1})">Gana</button>
                    <span>${createParticipantSpan(round[i + 1], roundIndex, i + 1)}</span>
                `;
            } else {
                matchDiv.innerHTML = createParticipantSpan(round[i], roundIndex, i);
            }

            roundContainer.appendChild(matchDiv);
        }

        bracketContainer.appendChild(roundContainer);
    });
}

function createParticipantSpan(participant, roundIndex, matchIndex) {
    if (participant === 'BYE') {
        return `<input type="text" placeholder="Ingrese nombre" onchange="updateParticipant(${roundIndex}, ${matchIndex}, this.value)" />`;
    } else {
        return participant;
    }
}

function updateParticipant(roundIndex, matchIndex, newValue) {
    rounds[roundIndex][matchIndex] = newValue;
    renderBracket(); // Renderizar de nuevo el bracket para reflejar los cambios
}

function advance(winner, roundIndex, matchIndex) {
    if (roundIndex + 1 >= rounds.length) return;

    const nextRound = rounds[roundIndex + 1];
    const nextMatchIndex = Math.floor(matchIndex / 2);

    if (!nextRound[nextMatchIndex]) {
        nextRound[nextMatchIndex] = winner;
    } else {
        alert('Este partido ya tiene un ganador.');
        return;
    }

    // Deshabilitar botones del partido actual
    const buttons = document.querySelectorAll(`.round:nth-child(${roundIndex + 1}) .match:nth-child(${Math.floor(matchIndex / 2) + 1}) button`);
    buttons.forEach(button => button.disabled = true);

    if (nextRound.every(participant => participant !== null)) {
        currentRound++;
    }

    renderBracket();

    if (roundIndex + 1 === rounds.length - 1 && nextRound.filter(Boolean).length === 1) {
        displayWinner(winner);
    }
}

function displayWinner(winner) {
    const winnerMessage = document.getElementById('winnerMessage');
    winnerMessage.innerHTML = `🏆 ${winner} 🥊<br>¡Felicidades!`;
    winnerMessage.style.display = 'block';
    launchFireworks();
}


