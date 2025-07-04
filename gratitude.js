document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('add-gratitude');
    const input = document.getElementById('gratitude-input');
    const cardsContainer = document.getElementById('gratitude-cards');
    let cardBeingEdited = null;

    function saveToLocalStorage() {
        const cards = [];
        cardsContainer.querySelectorAll('.gratitude-card').forEach(card => {
            cards.push({
                date: card.querySelector('.gratitude-date').textContent,
                text: card.querySelector('.gratitude-text').textContent
            });
        });
        localStorage.setItem('gratitudeEntries', JSON.stringify(cards));
    }

    function loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('gratitudeEntries') || '[]');
        data.forEach(entry => {
            const card = createCard(entry.text, entry.date);
            cardsContainer.appendChild(card);
        });
    }

    function createCard(text, dateStr) {
        const card = document.createElement('div');
        card.className = 'gratitude-card';

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'card-buttons';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '✏️';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '🗑️';

        buttonsDiv.appendChild(editBtn);
        buttonsDiv.appendChild(deleteBtn);

        const date = document.createElement('div');
        date.className = 'gratitude-date';
        date.textContent = dateStr || new Date().toLocaleDateString();

        const textContent = document.createElement('p');
        textContent.textContent = text;
        textContent.className = 'gratitude-text';

        card.appendChild(buttonsDiv);
        card.appendChild(date);
        card.appendChild(textContent);

        deleteBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            card.remove();
            saveToLocalStorage();
        });

        card.addEventListener('click', function (e) {
            if (!e.target.classList.contains('edit-btn') && !e.target.classList.contains('delete-btn')) {
                card.classList.toggle('expanded');
            }
        });

        editBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            input.value = textContent.textContent;
            cardBeingEdited = card;
            addButton.textContent = "Save Changes";
        });

        return card;
    }

    addButton.addEventListener('click', function () {
        const text = input.value.trim();
        if (text === "") {
            alert("Please write something you're grateful for!");
            return;
        }

        if (cardBeingEdited) {
            cardBeingEdited.querySelector('.gratitude-text').textContent = text;
            cardBeingEdited = null;
            addButton.textContent = "Add Gratitude";
            input.value = "";
            saveToLocalStorage();
            return;
        }

        const newCard = createCard(text);
        cardsContainer.appendChild(newCard);
        input.value = "";
        saveToLocalStorage();
    });

    loadFromLocalStorage();
});
