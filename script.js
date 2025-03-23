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
            const assets = parseFloat(assetsInput.value) || 0;
            const liabilities = parseFloat(liabilitiesInput.value) || 0;
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
});
