const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

const amountInput = document.getElementById('amountInput');
const convertedAmount = document.getElementById('convertedAmount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const exchangeRateDisplay = document.getElementById('exchangeRate');
const fromFlag = document.getElementById('fromFlag');
const toFlag = document.getElementById('toFlag');

let exchangeRates = {}; 

// Генерация флага из кода валюты (USD -> US -> 🇺🇸)
function getFlagEmoji(currencyCode) {
    // Большинство валют начинаются с кода страны (RUB -> RU)
    let countryCode = currencyCode.slice(0, 2);
    
    // Исключения
    if (currencyCode === 'EUR') countryCode = 'EU';
    if (currencyCode === 'GBP') countryCode = 'GB';
    if (currencyCode === 'BTC') return '₿';
    
    return countryCode
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
}

async function fetchRates() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        exchangeRates = data.rates;
        
        const currencies = Object.keys(exchangeRates).sort();
        currencies.forEach(currency => {
            fromCurrencySelect.add(new Option(currency, currency));
            toCurrencySelect.add(new Option(currency, currency));
        });

        fromCurrencySelect.value = 'SGD';
        toCurrencySelect.value = 'USD';
        convert(); 
    } catch (e) {
        console.error('Ошибка API');
    }
}

function convert() {
    const from = fromCurrencySelect.value;
    const to = toCurrencySelect.value;
    const amount = parseFloat(amountInput.value) || 0;

    fromFlag.textContent = getFlagEmoji(from);
    toFlag.textContent = getFlagEmoji(to);

    const rate = exchangeRates[to] / exchangeRates[from];
    convertedAmount.value = (amount * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    exchangeRateDisplay.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
}

swapBtn.addEventListener('click', () => {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convert();
});

amountInput.addEventListener('input', convert);
fromCurrencySelect.addEventListener('change', convert);
toCurrencySelect.addEventListener('change', convert);

fetchRates();
