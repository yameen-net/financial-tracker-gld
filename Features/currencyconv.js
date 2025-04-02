document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById("amountInput");
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");
    const convertButton = document.getElementById("convertButton");
    const resultDisplay = document.getElementById("resultDisplay");

    convertButton.addEventListener('click', function() {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        // Example conversion rates (this should be fetched from an API in a real scenario)
        const conversionRates = {
            "USD_EUR": 0.85,
            "EUR_USD": 1.18,
            // Add more currencies here
        };

        const rateKey = `${from}_${to}`;
        const rate = conversionRates[rateKey];

        if (rate) {
            const convertedAmount = amount * rate;
            resultDisplay.textContent = `${amount} ${from} = ${convertedAmount.toFixed(2)} ${to}`;
        } else {
            alert("Conversion rate not available.");
        }
    });
});
