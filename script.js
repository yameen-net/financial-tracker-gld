document.addEventListener('DOMContentLoaded', () => {
    const assetsInput = document.getElementById('assetsInput');
    const liabilitiesInput = document.getElementById('liabilitiesInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const netWorthDisplay = document.getElementById('netWorthDisplay');

    const homeChartCanvas = document.getElementById('homeNetWorthChart');
    const netWorthChartCanvas = document.getElementById('netWorthChart');
    const homeBudgetChartCanvas = document.getElementById('homeBudgetChart');
    const budgetChartCanvas = document.getElementById('budgetChart');

    const chartConfig = {
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
                        text: 'Entry Number'
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

    let homeNetWorthChart = homeChartCanvas ? new Chart(homeChartCanvas.getContext('2d'), chartConfig) : null;
    let netWorthChart = netWorthChartCanvas ? new Chart(netWorthChartCanvas.getContext('2d'), chartConfig) : null;

    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const assets = parseFloat(assetsInput.value) || 0;
            const liabilities = parseFloat(liabilitiesInput.value) || 0;
            const netWorth = assets - liabilities;
            netWorthDisplay.textContent = `Your Net Worth: £${netWorth.toFixed(2)}`;

            [homeNetWorthChart, netWorthChart].forEach(chart => {
                if (chart) {
                    chart.data.labels.push(`Entry ${chart.data.labels.length + 1}`);
                    chart.data.datasets[0].data.push(netWorth);
                    chart.update();
                }
            });
        });
    }

    // Budget Management
    const budgetCategoryInput = document.getElementById('budgetCategory');
    const budgetAmountInput = document.getElementById('budgetAmount');
    const addBudgetBtn = document.getElementById('addBudgetBtn');
    const budgetList = document.getElementById('budgetList');

    let budgetData = {};
    let homeBudgetChart = homeBudgetChartCanvas ? new Chart(homeBudgetChartCanvas.getContext('2d'), createBudgetChartConfig()) : null;
    let budgetChart = budgetChartCanvas ? new Chart(budgetChartCanvas.getContext('2d'), createBudgetChartConfig()) : null;

    function createBudgetChartConfig() {
        return {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        };
    }

    if (addBudgetBtn) {
        addBudgetBtn.addEventListener('click', () => {
            const category = budgetCategoryInput.value.trim();
            const amount = parseFloat(budgetAmountInput.value);
            
            if (category && !isNaN(amount) && amount > 0) {
                budgetData[category] = (budgetData[category] || 0) + amount;
                updateBudgetList();
                updateBudgetCharts();
                budgetCategoryInput.value = '';
                budgetAmountInput.value = '';
            }
        });
    }

    function updateBudgetList() {
        budgetList.innerHTML = '';
        Object.entries(budgetData).forEach(([category, amount]) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${category}: £${amount.toFixed(2)}`;
            budgetList.appendChild(listItem);
        });
    }

    function updateBudgetCharts() {
        [homeBudgetChart, budgetChart].forEach(chart => {
            if (chart) {
                chart.data.labels = Object.keys(budgetData);
                chart.data.datasets[0].data = Object.values(budgetData);
                chart.update();
            }
        });
    }
});