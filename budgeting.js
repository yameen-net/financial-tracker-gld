document.addEventListener('DOMContentLoaded', () => {
    let incomeData = [
       
    ];

    let expenseData = [
       
    ];

    const incomeDataStr = localStorage.getItem('incomeData');
    const expenseDataStr = localStorage.getItem('expenseData');

    if (incomeDataStr) {
        incomeData = JSON.parse(incomeDataStr);
    }

    if (expenseDataStr) {
        expenseData = JSON.parse(expenseDataStr);
    }

    const incomeList = document.getElementById("incomeList");
    const expenseList = document.getElementById("expenseList");
    const viewAllModal = document.getElementById("viewAllModal");
    const viewAllList = document.getElementById("viewAllList");
    const viewAllTitle = document.getElementById("viewAllTitle");

    const totalIncomeElem = document.getElementById("totalIncome");
    const totalExpensesElem = document.getElementById("totalExpenses");
    const balanceElem = document.getElementById("balance");

    function displayEntries(data, type) {
        let list = type === 'income' ? incomeList : expenseList;
        list.innerHTML = "";
        data.slice(0, 3).forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${type === 'income' ? entry.source : entry.category}: £${entry.amount}`;
            list.appendChild(li);
        });
    }

    displayEntries(incomeData, 'income');
    displayEntries(expenseData, 'expense');

    // open the modal for adding income or expense
    window.openModal = function(type) {
        const modal = document.getElementById("modal");
        const modalTitle = document.getElementById("modalTitle");
        const form = document.getElementById("modalForm");

        modalTitle.textContent = type === 'income' ? "Add New Income" : "Add New Expense";

        form.onsubmit = function(e) {
            e.preventDefault();
            const sourceCategory = document.getElementById("sourceCategory").value.trim();
            const amount = parseFloat(document.getElementById("amount").value);

            // VALIDATION START
            if (!sourceCategory) {
                alert("Please enter a valid category or source.");
                return;
            }

            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid positive amount.");
                return;
            }
            //  VALIDATION END

            if (type === 'income') {
                incomeData.push({ source: sourceCategory, amount });
                incomeData.sort((a, b) => b.amount - a.amount);
                displayEntries(incomeData, 'income');
                localStorage.setItem('incomeData', JSON.stringify(incomeData));
            } else if (type === 'expense') {
                expenseData.push({ category: sourceCategory, amount });
                expenseData.sort((a, b) => b.amount - a.amount);
                displayEntries(expenseData, 'expense');
                localStorage.setItem('expenseData', JSON.stringify(expenseData));
            }

            updateFinancialSummary();
            closeModal();
        };


        modal.style.display = "block"; 
    };

    // Close the modal
    window.closeModal = function() {
        const modal = document.getElementById("modal");
        modal.style.display = "none"; 
        clearForm(); 
    };

   
    function clearForm() {
        document.getElementById("sourceCategory").value = "";
        document.getElementById("amount").value = "";
    }

    // open the View All Modal for income or expense
    window.openViewAllModal = function(type) {
        const data = type === 'income' ? incomeData : expenseData;
        const title = type === 'income' ? "All Income" : "All Expenses";

        viewAllTitle.textContent = title;
        viewAllList.innerHTML = "";

        data.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${type === 'income' ? entry.source : entry.category}: £${entry.amount}`;
            viewAllList.appendChild(li);
        });

        viewAllModal.style.display = "block"; 
    };

  
    window.closeViewAllModal = function() {
        viewAllModal.style.display = "none";
    };

    // update the financial summary (income, expenses, and balance)
    function updateFinancialSummary() {
        const totalIncome = incomeData.reduce((sum, entry) => sum + entry.amount, 0);
        const totalExpenses = expenseData.reduce((sum, entry) => sum + entry.amount, 0);
        const balance = totalIncome - totalExpenses;

        totalIncomeElem.textContent = totalIncome.toFixed(2);
        totalExpensesElem.textContent = totalExpenses.toFixed(2);
        balanceElem.textContent = balance.toFixed(2);

        balanceElem.parentElement.style.color = balance < 0 ? "red" : "green";

    }

    updateFinancialSummary(); // update the financial summary on page load
});
