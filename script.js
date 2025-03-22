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


    // Global variable to store exchange rates
let exchangeRates = {};

// Function to fetch exchange rates for all currencies
async function fetchAllExchangeRates() {
    try {
       
        const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'NZD', 'ZAR'];
        exchangeRates = {};
        
       
        const fetchPromises = currencies.map(async (currency) => {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
            const data = await response.json();
            exchangeRates[currency] = data.rates;
            return data;
        });
        
       
        await Promise.all(fetchPromises);
        
        // Update last updated timestamp
        if (document.getElementById('lastUpdated')) {
            document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
        }
        
        return true;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return false;
    }
}

// Function to convert currency using the fetched rates
async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block'; // Ensure the result div is displayed
    
    if (amount === '' || isNaN(amount)) {
        resultDiv.innerHTML = 'Please enter a valid amount.';
        return;
    }
    
    try {
        // Check if we already have the rates
        let rate;
        if (exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
         
            rate = exchangeRates[fromCurrency][toCurrency];
        } else {
          
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            const data = await response.json();
            rate = data.rates[toCurrency];
            
          
            if (!exchangeRates[fromCurrency]) {
                exchangeRates[fromCurrency] = {};
            }
            exchangeRates[fromCurrency] = data.rates;
        }
        
        const convertedAmount = (amount * rate).toFixed(2);
        
        // Append the new result instead of replacing
        const newResult = document.createElement('div');
        newResult.innerHTML = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        resultDiv.appendChild(newResult);
    } catch (error) {
        resultDiv.innerHTML = 'Error fetching exchange rate. Please try again later.';
        console.error('Conversion error:', error);
    }
}

// Function to populate the exchange rates table
function populateExchangeRatesTable() {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'NZD', 'ZAR'];
    const tableBody = document.getElementById('ratesTableBody');
    
    if (!tableBody) return; 
    
    tableBody.innerHTML = ''; 
    
    // Create a row for each base currency
    currencies.forEach(baseCurrency => {
        if (!exchangeRates[baseCurrency]) return; 
        
        const row = document.createElement('tr');
        
   
        const baseCell = document.createElement('td');
        baseCell.className = 'base-currency';
        baseCell.textContent = baseCurrency;
        row.appendChild(baseCell);
        
        
        currencies.forEach(targetCurrency => {
            const cell = document.createElement('td');
           
            const rate = exchangeRates[baseCurrency][targetCurrency] || '-';
            cell.textContent = typeof rate === 'number' ? rate.toFixed(4) : rate;
            
           
            if (baseCurrency === targetCurrency) {
                cell.className = 'same-currency';
            }
            
            row.appendChild(cell);
        });
        
        tableBody.appendChild(row);
    });
}

// Function to refresh rates
async function refreshRates() {
    const resultDiv = document.getElementById('result');
    
    // Show loading message
    if (resultDiv) {
        resultDiv.textContent = 'Refreshing exchange rates...';
        resultDiv.style.display = 'block';
    }
    
   
    const success = await fetchAllExchangeRates();
    
    if (success) {
      
        populateExchangeRatesTable();
        
        // Show success message
        if (resultDiv) {
            resultDiv.textContent = 'Exchange rates have been refreshed!';
            
           
            setTimeout(() => {
                resultDiv.style.display = 'none';
            }, 3000);
        }
    } else {
        // Show error message
        if (resultDiv) {
            resultDiv.textContent = 'Error refreshing rates. Please try again later.';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Fetch all exchange rates on page load
    await fetchAllExchangeRates();
    
    // Populate the table if it exists on this page
    if (document.getElementById('ratesTableBody')) {
        populateExchangeRatesTable();
    }
});

// Make functions available globally
window.convertCurrency = convertCurrency;
window.refreshRates = refreshRates;
window.fetchAllExchangeRates = fetchAllExchangeRates;
window.populateExchangeRatesTable = populateExchangeRatesTable;
});
