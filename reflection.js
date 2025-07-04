document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-reflection');
    const textInput = document.getElementById('reflection-text');
    const promptSelect = document.getElementById('prompt-select');
    const entriesContainer = document.getElementById('reflection-entries');
    let editingCard = null;

    function saveReflections() {
        const data = [];
        entriesContainer.querySelectorAll('.reflection-card').forEach(card => {
            data.push({
                date: card.querySelector('.reflection-date').textContent,
                prompt: card.querySelector('.reflection-prompt')?.textContent.replace("Prompt: ", "") || "",
                text: card.querySelector('.reflection-text').textContent
            });
        });
        localStorage.setItem('reflectionEntries', JSON.stringify(data));
    }

    function loadReflections() {
        const data = JSON.parse(localStorage.getItem('reflectionEntries') || '[]');
        data.forEach(entry => {
            const card = createCard(entry.text, entry.prompt, entry.date);
            entriesContainer.appendChild(card);
        });
    }

    function createCard(text, prompt, date) {
        const card = document.createElement('div');
        card.className = 'reflection-card';

        const dateDiv = document.createElement('div');
        dateDiv.className = 'reflection-date';
        dateDiv.textContent = date || new Date().toLocaleDateString();

        const promptDiv = document.createElement('div');
        promptDiv.className = 'reflection-prompt';
        if (prompt && prompt !== "None") promptDiv.textContent = `Prompt: ${prompt}`;

        const textDiv = document.createElement('div');
        textDiv.className = 'reflection-text';
        textDiv.textContent = text;

        const btnGroup = document.createElement('div');
        btnGroup.className = 'reflection-buttons';

        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.className = 'edit-btn';

        editBtn.addEventListener('click', () => {
            textInput.value = textDiv.textContent;
            promptSelect.value = prompt || "None";
            editingCard = card;
            addBtn.textContent = "Save Changes";
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            card.remove();
            if (editingCard === card) {
                editingCard = null;
                addBtn.textContent = "Add Reflection";
                textInput.value = "";
                promptSelect.value = "None";
            }
            saveReflections();
        });

        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(deleteBtn);

        card.appendChild(dateDiv);
        card.appendChild(promptDiv);
        card.appendChild(textDiv);
        card.appendChild(btnGroup);

        return card;
    }

    addBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        const prompt = promptSelect.value;
        if (!text) return alert("Please write your reflection.");

        if (editingCard) {
            editingCard.querySelector('.reflection-text').textContent = text;
            editingCard.querySelector('.reflection-prompt').textContent = prompt !== "None" ? `Prompt: ${prompt}` : "";
            editingCard = null;
            addBtn.textContent = "Add Reflection";
        } else {
            const newCard = createCard(text, prompt);
            entriesContainer.appendChild(newCard);
        }

        textInput.value = "";
        promptSelect.value = "None";
        saveReflections();
    });

    loadReflections();
});
