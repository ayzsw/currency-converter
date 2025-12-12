const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';


const FLAGS_MAP = {
    'USD': '🇺🇸', // United States Dollar
    'EUR': '🇪🇺', // Euro
    'GBP': '🇬🇧', // British Pound Sterling
    'JPY': '🇯🇵', // Japanese Yen
    'AUD': '🇦🇺', // Australian Dollar
    'CAD': '🇨🇦', // Canadian Dollar
    'CHF': '🇨🇭', // Swiss Franc
    'CNY': '🇨🇳', // Chinese Yuan
    'HKD': '🇭🇰', // Hong Kong Dollar
    'SGD': '🇸🇬', // Singapore Dollar (как в макете)
    'NZD': '🇳🇿', // New Zealand Dollar
    'INR': '🇮🇳', // Indian Rupee
    'BRL': '🇧🇷', // Brazilian Real
    'ZAR': '🇿🇦', // South African Rand
    'KRW': '🇰🇷', // South Korean Won
    'RUB': '🇷🇺', // Russian Ruble
    'PLN': '🇵🇱', // Polish Zloty
    'MXN': '🇲🇽', // Mexican Peso
    // Добавьте другие валюты, которые вы хотите видеть с флагами
};


const amountInput = document.getElementById('amountInput');
const convertedAmount = document.getElementById('convertedAmount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const exchangeRateDisplay = document.getElementById('exchangeRate');

// Получаем элементы для флагов
const fromFlag = document.getElementById('fromFlag');
const toFlag = document.getElementById('toFlag');

let exchangeRates = {}; 

// Функция для отображения соответствующего флага
function updateFlag(currencyCode, flagElement) {
    const flag = FLAGS_MAP[currencyCode] || '🌐'; // Если флаг не найден, используем глобус
    flagElement.textContent = flag;
}

// --- Шаг 1: Получение курсов и заполнение SELECT ---
async function fetchRates() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data && data.rates) {
            exchangeRates = data.rates;
            
            // Заполняем SELECT'ы
            const currencies = Object.keys(exchangeRates).sort();
            currencies.forEach(currency => {
                const optionFrom = new Option(currency, currency);
                const optionTo = new Option(currency, currency);
                fromCurrencySelect.appendChild(optionFrom);
                toCurrencySelect.appendChild(optionTo);
            });

            // Устанавливаем валюты по умолчанию (SGD -> USD)
            fromCurrencySelect.value = 'SGD';
            toCurrencySelect.value = 'USD';

            // Запускаем первую конвертацию, которая также обновит флаги
            convert(); 
        } else {
            console.error('Не удалось получить данные о курсах валют.');
        }
    } catch (error) {
        console.error('Ошибка сети или API:', error);
        exchangeRateDisplay.textContent = 'Ошибка загрузки курсов.';
    }
}

// --- Шаг 2: Выполнение конвертации ---
function convert() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = parseFloat(amountInput.value);

    // Обновляем флаги при изменении валюты
    updateFlag(fromCurrency, fromFlag);
    updateFlag(toCurrency, toFlag);

    // Проверка на корректность данных
    if (isNaN(amount) || amount <= 0 || !exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        convertedAmount.value = '0.00';
        exchangeRateDisplay.textContent = 'Введите корректную сумму.';
        return;
    }

    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];

    // Формула конвертации: (Сумма / Курс_Из_В_Базу) * Курс_Базы_В_В
    const converted = (amount / rateFrom) * rateTo;

    // Вывод результата с двумя знаками после запятой
    convertedAmount.value = converted.toFixed(2);

    // Вывод индикативного курса (4 знака)
    const indicativeRate = rateTo / rateFrom;
    exchangeRateDisplay.textContent = `1 ${fromCurrency} = ${indicativeRate.toFixed(4)} ${toCurrency}`;
}

// --- Шаг 3: Обработчики событий ---

// Обмен валют (кнопка ⇅)
swapBtn.addEventListener('click', () => {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convert(); // Конвертация обновит и значения, и флаги
});

// Конвертация при изменении суммы
amountInput.addEventListener('input', convert);

// Конвертация при изменении любой из валют
fromCurrencySelect.addEventListener('change', convert);
toCurrencySelect.addEventListener('change', convert);

// --- Старт приложения ---
fetchRates();
