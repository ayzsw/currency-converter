const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD'; 

// --- Функция для получения эмодзи флага из кода валюты ---
// (Например, USD -> US, EUR -> EU)
function getFlagEmoji(currencyCode) {
    if (currencyCode.length !== 3) return '🌐'; // Если код не 3 символа

    // 1. Преобразуем код валюты в код страны.
    // Это работает для большинства валют, где код валюты начинается с кода страны.
    // Пример: USD -> US, CAD -> CA
    let countryCode = currencyCode.slice(0, 2);
    
    // Специальные обработки для валют, где код страны отличается:
    if (currencyCode === 'EUR') countryCode = 'EU'; // Еврозона
    if (currencyCode === 'GBP') countryCode = 'GB'; // Фунт стерлингов

    // 2. Преобразуем код страны (например, 'US') в эмодзи-флаг.
    // Это делается путем преобразования каждой буквы кода в соответствующий региональный индикатор.
    // 'A' -> 🇦 (U+1F1E6), 'B' -> 🇧 (U+1F1E7), и т.д.
    
    const base = 127462; // Юникод для буквы 'A' (региональный индикатор A)
    
    const flag = countryCode
        .toUpperCase()
        .split('')
        .map(char => String.fromCodePoint(base + char.charCodeAt(0) - 'A'.charCodeAt(0)))
        .join('');
        
    // Если флаг корректно сформирован, возвращаем его.
    return flag.length === 2 ? flag : '🌐'; // Возвращаем глобус, если не удалось
}

const amountInput = document.getElementById('amountInput');
const convertedAmount = document.getElementById('convertedAmount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const exchangeRateDisplay = document.getElementById('exchangeRate');

const fromFlag = document.getElementById('fromFlag');
const toFlag = document.getElementById('toFlag');

let exchangeRates = {}; 

// --- Обновленная функция для отображения флага ---
function updateFlag(currencyCode, flagElement) {
    const flag = getFlagEmoji(currencyCode);
    flagElement.textContent = flag;
}

// --- Шаг 1: Получение курсов и заполнение SELECT ---
async function fetchRates() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data && data.rates) {
            exchangeRates = data.rates;
            
            const currencies = Object.keys(exchangeRates).sort();
            currencies.forEach(currency => {
                const optionFrom = new Option(currency, currency);
                const optionTo = new Option(currency, currency);
                fromCurrencySelect.appendChild(optionFrom);
                toCurrencySelect.appendChild(optionTo);
            });

            // Установка значений по умолчанию (SGD -> USD)
            fromCurrencySelect.value = 'SGD';
            toCurrencySelect.value = 'USD';

            // Запускаем первую конвертацию, которая обновит флаги
            convert(); 
        } else {
            console.error('Не удалось получить данные о курсах валют.');
        }
    } catch (error) {
        console.error('Ошибка сети или API:', error);
        exchangeRateDisplay.textContent = 'Ошибка загрузки курсов.';
    }
}

// --- Шаг 2: Выполнение конвертации (без изменений) ---
function convert() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = parseFloat(amountInput.value);

    // Обновляем флаги, используя новую функцию
    updateFlag(fromCurrency, fromFlag);
    updateFlag(toCurrency, toFlag);

    // ... (остальной код convert() остается прежним) ...
    if (isNaN(amount) || amount <= 0 || !exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        convertedAmount.value = '0.00';
        exchangeRateDisplay.textContent = 'Введите корректную сумму.';
        return;
    }

    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];
    const converted = (amount / rateFrom) * rateTo;

    convertedAmount.value = converted.toFixed(2);
    const indicativeRate = rateTo / rateFrom;
    exchangeRateDisplay.textContent = `1 ${fromCurrency} = ${indicativeRate.toFixed(4)} ${toCurrency}`;
}

// --- Обработчики событий (без изменений) ---
swapBtn.addEventListener('click', () => {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convert();
});

amountInput.addEventListener('input', convert);
fromCurrencySelect.addEventListener('change', convert);
toCurrencySelect.addEventListener('change', convert);

// --- Старт приложения ---
fetchRates();
