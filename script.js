const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const resultDiv = document.getElementById('result');
const rateDiv = document.getElementById('rate');
const swapBtn = document.getElementById('swap');
const convertBtn = document.getElementById('convert');

let rates = {};
const BASE_CURRENCY = 'EUR'; // Базовая валюта API

// Надёжный бесплатный API без ключей (frankfurter.app)
const API_URL = `https://api.frankfurter.app/latest?from=${BASE_CURRENCY}`;

async function loadCurrencies() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('API не отвечает');
    const data = await res.json();
    
    rates = data.rates;
    const currencies = Object.keys(rates);

    // Заполняем селекты всеми доступными валютами (автоматически)
    [fromSelect, toSelect].forEach(select => {
      select.innerHTML = '';
      currencies.sort().forEach(code => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${code}`;
        select.appendChild(option);
      });
    });

    // По умолчанию: USD → EUR
    fromSelect.value = 'USD';
    toSelect.value = 'EUR';
    
    convertCurrency();
  } catch (err) {
    console.error(err);
    resultDiv.textContent = 'Ошибка загрузки курсов';
    rateDiv.textContent = 'Проверьте интернет или попробуйте позже';
  }
}

function convertCurrency() {
  const amount = parseFloat(amountInput.value) || 0;
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!rates[from] || !rates[to] || from === to) {
    resultDiv.textContent = amount.toFixed(2);
    rateDiv.textContent = 'Выберите разные валюты';
    return;
  }

  // Конвертация через базовую валюту
  const result = amount * (rates[to] / rates[from]);

  resultDiv.textContent = result.toFixed(2);
  rateDiv.textContent = `1 ${from} = ${(rates[to] / rates[from]).toFixed(6)} ${to} (на ${new Date().toLocaleDateString('ru-RU')})`;
}

// Свап валют
swapBtn.addEventListener('click', () => {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  convertCurrency();
});

// События (автообновление при вводе)
amountInput.addEventListener('input', convertCurrency);
fromSelect.addEventListener('change', convertCurrency);
toSelect.addEventListener('change', convertCurrency);
convertBtn.addEventListener('click', convertCurrency);

// Запуск при загрузке страницы
loadCurrencies();