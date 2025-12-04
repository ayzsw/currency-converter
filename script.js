const API_KEY = "7a7bfcc9f163bee6efcced2f";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

const fromContainer = document.getElementById("fromContainer");
const toContainer = document.getElementById("toContainer");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const fromAmount = document.getElementById("fromAmount");
const toAmount = document.getElementById("toAmount");
const rateText = document.getElementById("rateText");
const swap = document.getElementById("swap");
const keypad = document.querySelectorAll(".keypad button");
const offlineMessage = document.getElementById("offlineMessage");

function getCountryCode(currencyCode) {
    const codes = {
        USD: 'US', EUR: 'EU', GBP: 'GB', JPY: 'JP', AUD: 'AU', CAD: 'CA',
        CHF: 'CH', CNH: 'CN', SEK: 'SE', NZD: 'NZ', MXN: 'MX', SGD: 'SG',
        HKD: 'HK', NOK: 'NO', KRW: 'KR', TRY: 'TR', INR: 'IN', RUB: 'RU',
        BRL: 'BR', ZAR: 'ZA', PLN: 'PL', PHP: 'PH', TWD: 'TW', THB: 'TH',
        MYR: 'MY', IDR: 'ID', CZK: 'CZ', AED: 'AE', COP: 'CO', HUF: 'HU',
        ILS: 'IL', QAR: 'QA', DKK: 'DK', KZT: 'KZ', PKR: 'PK', SAR: 'SA',
        VND: 'VN', CLP: 'CL', IQD: 'IQ', UAH: 'UA', EGP: 'EG', KWD: 'KW',
        MAD: 'MA', OMR: 'OM', RSD: 'RS', AZN: 'AZ', AFN: 'AF', ALL: 'AL',
        DZD: 'DZ', AOA: 'AO', ARS: 'AR', AMD: 'AM', AWG: 'AW', BHD: 'BH',
        BGN: 'BG', BZD: 'BZ', BMD: 'BM', BOB: 'BO', BWP: 'BW', BYN: 'BY',
        CDF: 'CD', CRC: 'CR', CUP: 'CU', DOP: 'DO', DZD: 'DZ', FJD: 'FJ',
        GEL: 'GE', GHS: 'GH', GTQ: 'GT', HNL: 'HN', HTG: 'HT', IRR: 'IR',
        JMD: 'JM', JOD: 'JO', KES: 'KE', KGS: 'KG', KHR: 'KH', LBP: 'LB',
        LKR: 'LK', LYD: 'LY', MDL: 'MD', MKD: 'MK', MNT: 'MN', MOP: 'MO',
        MVR: 'MV', MWK: 'MW', NAD: 'NA', NGN: 'NG', NIO: 'NI', NPR: 'NP',
        PAB: 'PA', PEN: 'PE', PYG: 'PY', RON: 'RO', RWF: 'RW', SDD: 'SD',
        SLL: 'SL', SOS: 'SO', SRD: 'SR', SYP: 'SY', TJS: 'TJ', TMT: 'TM',
        TTD: 'TT', UYU: 'UY', UZS: 'UZ', VEF: 'VE', XAF: 'CM', XCD: 'AG',
        XOF: 'SN', YER: 'YE', ZMW: 'ZM',
    };
    return codes[currencyCode] || '';
}

function getFlagEmoji(countryCode) {
    if (!countryCode) return '🌐';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function updateFlag(container, currencyCode) {
    const countryCode = getCountryCode(currencyCode);
    const emoji = getFlagEmoji(countryCode);
    container.querySelector('.flag').textContent = emoji;
}

async function loadCurrencies() {
    try {
        const res = await fetch(`${BASE_URL}/latest/USD`);
        const data = await res.json();

        if (data.result === "error") {
            throw new Error(data["error-type"]);
        }

        const currencies = Object.keys(data.conversion_rates);

        currencies.forEach(c => {
            const option = `<option>${c}</option>`;
            fromCurrency.innerHTML += option;
            toCurrency.innerHTML += option;
        });

        fromCurrency.value = "SGD";
        toCurrency.value = "USD";
        offlineMessage.style.display = 'none';

        updateFlag(fromContainer, fromCurrency.value);
        updateFlag(toContainer, toCurrency.value);

        convert();
    } catch (error) {
        console.error("Ошибка при загрузке валют:", error);
        rateText.textContent = "Ошибка: не удалось получить список валют. Проверьте API Key.";
        offlineMessage.style.display = 'block';
    }
}

async function convert() {
    // Используем Number(value) для корректной обработки "1000.00"
    const amount = Number(fromAmount.value) || 0;
    
    const url = `${BASE_URL}/pair/${fromCurrency.value}/${toCurrency.value}/${amount}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.result === "error") {
            throw new Error(data["error-type"]);
        }

        const convertedAmount = data.conversion_result;
        const rate = data.conversion_rate;

        toAmount.value = convertedAmount.toFixed(2);
        rateText.textContent = `1 ${fromCurrency.value} = ${rate.toFixed(4)} ${toCurrency.value}`;
        offlineMessage.style.display = 'none';
    } catch (error) {
        console.error("Ошибка при конвертации:", error);
        toAmount.value = "----";
        rateText.textContent = `Ошибка конвертации. ${error.message}`;
        offlineMessage.style.display = 'block';
    }
}

fromCurrency.addEventListener("change", () => {
    updateFlag(fromContainer, fromCurrency.value);
    convert();
});
toCurrency.addEventListener("change", () => {
    updateFlag(toContainer, toCurrency.value);
    convert();
});

// Убираем слушатель "input" для fromAmount, так как ввод будет только через клавиатуру
// fromAmount.addEventListener("input", convert);

swap.addEventListener("click", () => {
    let t = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = t;

    updateFlag(fromContainer, fromCurrency.value);
    updateFlag(toContainer, toCurrency.value);

    convert();
});

keypad.forEach(btn => {
    btn.addEventListener("click", () => {
        let key = btn.getAttribute("data-key");
        let currentValue = fromAmount.value;

        if (key === "del") {
            // Удаляем символ, но оставляем "0.00", если строка пуста
            fromAmount.value = currentValue.slice(0, -1);
        } else if (key === ".") {
            // Разрешаем ввод точки, только если ее еще нет
            if (!currentValue.includes('.')) {
                fromAmount.value += key;
            }
        } 
        else {
            // Удаляем незначащий "0" перед вводом новой цифры
            if (currentValue === "0" || currentValue === "0.00" || currentValue === "") {
                fromAmount.value = key;
            } else {
                fromAmount.value += key;
            }
        }
        
        // Гарантируем, что поле не остается пустым
        if (fromAmount.value === "") {
            fromAmount.value = "0";
        }

        convert();
    });
});

loadCurrencies();
