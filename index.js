let participants = [];

function addParticipants() {
    const participantNames = document.getElementById('participant-names').value.trim();
    const newParticipants = participantNames.split('\n').map(name => name.trim()).filter(name => name !== '' && !participants.includes(name));

    if (newParticipants.length > 0) {
        participants = participants.concat(newParticipants);
        renderParticipants();
        document.getElementById('participant-names').value = '';
    } else {
        alert('No se han añadido nuevos participantes o los nombres están duplicados.');
    }
}

function removeParticipant(name) {
    participants = participants.filter(participant => participant !== name);
    renderParticipants();
}

function renderParticipants() {
    const participantsList = document.getElementById('participants-list');
    participantsList.innerHTML = '';
    participants.forEach(participant => {
        const participantDiv = document.createElement('div');
        participantDiv.className = 'participant';
        participantDiv.innerHTML = `
            <span>${participant}</span>
            <button onclick="removeParticipant('${participant}')">×</button>
        `;
        participantsList.appendChild(participantDiv);
    });
}

function createBracket() {
    if (participants.length < 2) {
        alert('Por favor, introduce al menos dos participantes.');
        return;
    }

    // Función para mezclar el array de participantes aleatoriamente (Fisher-Yates)
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Mezclar los participantes
    const shuffledParticipants = shuffle(participants);

    // Guardar los participantes mezclados en el almacenamiento local
    localStorage.setItem('participants', JSON.stringify(shuffledParticipants));

    // Redirigir a la página del bracket
    window.location.href = 'bracket.html';
}

