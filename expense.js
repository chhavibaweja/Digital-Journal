document.addEventListener("DOMContentLoaded", function () {
    /* ----------  💾 1.  SETUP LOCAL STORAGE CONTAINER  ---------- */
    // All months’ data live in this object → { jan: [ {...}, ... ], feb: [ ... ] … }
    const storedData = JSON.parse(localStorage.getItem("expenseTrackerData")) || {};

    /* ----------  UI HELPERS  (UNCHANGED)  ---------- */
    function toggleMonth(monthId) {
        document.querySelectorAll('.expense-box').forEach(box => {
            box.style.display = 'none';
        });
        const selectedMonthBox = document.getElementById(monthId);
        if (selectedMonthBox) selectedMonthBox.style.display = 'block';
    }

    /* ----------  💾 2.  SAVE CURRENT DOM LIST BACK TO STORAGE  ---------- */
    function saveExpenses(month) {
        const expenseItems = document.querySelectorAll(`#${month}-expenses .expense-item`);
        storedData[month] = Array.from(expenseItems).map(item => ({
            category: item.querySelector('.expense-category').textContent,
            amount: parseFloat(item.querySelector('.expense-amount').textContent.replace('₹','')),
            description: item.querySelector('.expense-description').textContent === 'No Description' ? '' : item.querySelector('.expense-description').textContent,
            date: item.querySelector('.expense-date').textContent
        }));
        localStorage.setItem("expenseTrackerData", JSON.stringify(storedData));
    }

    /* ----------  CORE ADD / EDIT (ORIGINAL + 1-LINE SAVE) ---------- */
    function addOrEditExpense(event, month, isEditing = false, editExpenseItem = null) {
        event.preventDefault();

        const category    = document.getElementById(`${month}-category`).value;
        const amount      = parseFloat(document.getElementById(`${month}-amount`).value);
        const description = document.getElementById(`${month}-description`).value;
        const date        = document.getElementById(`${month}-date`).value;

        if (isNaN(amount) || amount <= 0 || !category || !date) {
            alert("Please fill all required fields correctly!");
            return;
        }

        const expenseList = document.getElementById(`${month}-expenses`);

        if (isEditing && editExpenseItem) {
            editExpenseItem.querySelector('.expense-category').textContent    = category;
            editExpenseItem.querySelector('.expense-amount').textContent      = `₹${amount.toFixed(2)}`;
            editExpenseItem.querySelector('.expense-description').textContent = description ? description : 'No Description';
            editExpenseItem.querySelector('.expense-date').textContent        = date;
        } else {
            const expenseItem = document.createElement('div');
            expenseItem.className = 'expense-item';
            expenseItem.innerHTML = `
                <div>
                    <span class="expense-category">${category}</span> - 
                    <span class="expense-amount">₹${amount.toFixed(2)}</span>
                    <br>
                    <span class="expense-description">${description ? description : 'No Description'}</span> - 
                    <span class="expense-date">${date}</span>
                </div>
                <div>
                    <button class="edit-btn"   onclick="editExpense(this, '${month}')">Edit</button>
                    <button class="delete-btn" onclick="deleteExpense(this, '${month}')">Delete</button>
                </div>
            `;
            expenseList.appendChild(expenseItem);
        }

        updateTotal(month);
        saveExpenses(month);                       /* 💾 NEW */

        // Clear form
        document.getElementById(`${month}-category`).value = '';
        document.getElementById(`${month}-amount`).value   = '';
        document.getElementById(`${month}-description`).value = '';
        document.getElementById(`${month}-date`).value     = '';
    }

    /* ----------  EDIT & DELETE (UNCHANGED + 1-LINE SAVE) ---------- */
    window.editExpense = function (button, month) {
        const expenseItem = button.closest('.expense-item');
        const category    = expenseItem.querySelector('.expense-category').textContent;
        const amount      = expenseItem.querySelector('.expense-amount').textContent.replace('₹', '');
        const description = expenseItem.querySelector('.expense-description').textContent;
        const date        = expenseItem.querySelector('.expense-date').textContent;

        document.getElementById(`${month}-category`).value    = category;
        document.getElementById(`${month}-amount`).value      = amount;
        document.getElementById(`${month}-description`).value = description !== 'No Description' ? description : '';
        document.getElementById(`${month}-date`).value        = date;

        const saveButton = document.getElementById(`${month}-save-button`);
        saveButton.textContent = 'Save Changes';
        saveButton.onclick = function (event) {
            addOrEditExpense(event, month, true, expenseItem);
            saveButton.textContent = 'Add Expense';
            saveButton.onclick = function (event) { addOrEditExpense(event, month); };
        };
    };

    window.deleteExpense = function (button, month) {
        button.closest('.expense-item').remove();
        updateTotal(month);
        saveExpenses(month);                       /* 💾 NEW */
    };

    /* ----------  TOTAL CALC (UNCHANGED) ---------- */
    function updateTotal(month) {
        const expenseItems = document.querySelectorAll(`#${month}-expenses .expense-item`);
        let total = 0;
        expenseItems.forEach(item => {
            const amount = parseFloat(item.querySelector('.expense-amount').textContent.replace('₹', ''));
            total += amount;
        });
        document.getElementById(`${month}-total`).textContent = `₹${total.toFixed(2)}`;
    }

    /* ----------  BUTTON / FORM LISTENERS (UNCHANGED) ---------- */
    document.querySelectorAll('.month-btn').forEach(button => {
        button.addEventListener('click', () => toggleMonth(button.textContent));
    });
    document.querySelectorAll('form').forEach(form => {
        const month = form.id.replace('-form', '');
        form.addEventListener('submit', event => addOrEditExpense(event, month));
    });

    /* ----------  💾 3.  RENDER SAVED DATA ON STARTUP  ---------- */
    Object.keys(storedData).forEach(month => {
        const expenseList = document.getElementById(`${month}-expenses`);
        storedData[month].forEach(exp => {
            const item = document.createElement('div');
            item.className = 'expense-item';
            item.innerHTML = `
                <div>
                    <span class="expense-category">${exp.category}</span> - 
                    <span class="expense-amount">₹${exp.amount.toFixed(2)}</span>
                    <br>
                    <span class="expense-description">${exp.description || 'No Description'}</span> - 
                    <span class="expense-date">${exp.date}</span>
                </div>
                <div>
                    <button class="edit-btn"   onclick="editExpense(this, '${month}')">Edit</button>
                    <button class="delete-btn" onclick="deleteExpense(this, '${month}')">Delete</button>
                </div>
            `;
            expenseList.appendChild(item);
        });
        updateTotal(month); // keep totals correct after load
    });
});
