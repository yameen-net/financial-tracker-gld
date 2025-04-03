// Run the script when the page loads
document.addEventListener('DOMContentLoaded', () => 
{
    const assetsInput = document.getElementById('assetsInput');
    const liabilitiesInput = document.getElementById('liabilitiesInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const netWorthDisplay = document.getElementById('netWorthDisplay');

    const homeChartCanvas = document.getElementById('homeNetWorthChart');
    const netWorthChartCanvas = document.getElementById('netWorthChart');

    const homeNetWorthDataStr = localStorage.getItem('homeNetWorthChartData');
    const netWorthDataStr = localStorage.getItem('netWorthChartData');

    const netChange = document.getElementById('netChange');

    const expenseList = document.getElementById('expenseList');
    const expenses = JSON.parse(localStorage.getItem('expenseData')) || {};

    const submitExpenseBtn = document.getElementById('submitExpense');
    const expenseCategoryInput = document.getElementById('expense-category');
    const expenseAmountInput = document.getElementById('expense-amount');

    if (submitExpenseBtn) {
            // event listener for adding expenses
        submitExpenseBtn.addEventListener('click', () => {
        const category = expenseCategoryInput.value;
        const amount = parseFloat(expenseAmountInput.value) || 0;
        if (category && !isNaN(amount)) {
            // Store the expense in local storage

            expenses.push({ category: category, amount: amount });
            expenses.sort((a, b) => b.amount - a.amount); // sort bby decending 
            localStorage.setItem('expenseData', JSON.stringify(expenses));
            window.location.reload()

        }
    });
    }

    const chartConfig = 
    {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Net Worth (£)',
                data: [],
                borderColor: '#333',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Entry Dates'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Net Worth (£)'
                    }
                }
            }
        }
    };

    let homeNetWorthChart = null;
    let netWorthChart = null;

    if (homeChartCanvas) 
    {
        const homeCtx = homeChartCanvas.getContext('2d');
        homeNetWorthChart = new Chart(homeCtx, chartConfig);
    }

    if (netWorthChartCanvas) 
    {
        const netWorthCtx = netWorthChartCanvas.getContext('2d');
        netWorthChart = new Chart(netWorthCtx, chartConfig);
    }

    if (netWorthDataStr)
    {
        const data = JSON.parse(netWorthDataStr);

        [homeNetWorthChart, netWorthChart].forEach(chart => {
            if (chart) {
                chart.data.labels.push(...data.labels);
                chart.data.datasets[0].data.push(...data.data);
                chart.update();
            }
        });
    }

    if (homeNetWorthChart)
    {
        const data = homeNetWorthChart.data.datasets[0].data;
        if (data.length >= 2)
        {
            const lastTwoValues = data.slice(-2);
            const netChangeValue = lastTwoValues[1] - lastTwoValues[0];

            netChange.textContent = `Net Change From Last Two Entries: £${netChangeValue.toFixed(2)} (${((netChangeValue / lastTwoValues[0]) * 100).toFixed(2)}%)`;
        }
    }
    
    if (calculateBtn) 
    {
        calculateBtn.addEventListener('click', () => {

            const assetsValue = assetsInput.value.trim();
            const liabilitiesValue = liabilitiesInput.value.trim();
        
            if (!assetsValue || !liabilitiesValue) {
                alert("Please enter both your assets and liabilities.");
                return;
            }
            
            const assets = parseFloat(assetsInput.value) || 0;
            const liabilities = parseFloat(liabilitiesInput.value) || 0;

            if (isNaN(assets) || isNaN(liabilities)) {
                alert("Make sure both values are numbers.");
                return;
            }
            const netWorth = assets - liabilities;
            netWorthDisplay.textContent = `Your Net Worth: £${netWorth.toFixed(2)}`;

            [homeNetWorthChart, netWorthChart].forEach(chart => {
                if (chart) {
                    chart.data.labels.push(`${chart.data.labels.length + 1, new Date().toLocaleDateString()}`);
                    chart.data.datasets[0].data.push(netWorth);
                    chart.update();

                    const data = {
                        labels: chart.data.labels,
                        data: chart.data.datasets[0].data
                    };

                    localStorage.setItem('netWorthChartData', JSON.stringify(data));
                    localStorage.setItem('homeNetWorthChartData', JSON.stringify(data));
                }
            });
        });
    }

    Object.keys(expenses).forEach(key => {
        const li = document.createElement('li');
        li.textContent = `${expenses[key].category}: £${expenses[key].amount}`;
        expenseList.appendChild(li);
    });

});
