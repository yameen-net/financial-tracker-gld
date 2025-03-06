// Run the script when the page loads
document.addEventListener('DOMContentLoaded', () => 
{
    const assetsInput = document.getElementById('assetsInput');
    const liabilitiesInput = document.getElementById('liabilitiesInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const netWorthDisplay = document.getElementById('netWorthDisplay');

    const homeChartCanvas = document.getElementById('homeNetWorthChart');
    const netWorthChartCanvas = document.getElementById('netWorthChart');

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

    if (calculateBtn) 
    {
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
});
