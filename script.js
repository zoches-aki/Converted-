// May 2025 rates (USD/CNY/DZD)
const rates = {
  official: {
      USD: { CNY: 7.2, DZD: 135 },  // Official bank rates
      CNY: { USD: 1/7.2, DZD: (1/7.2) * 135 },
      DZD: { USD: 1/135, CNY: (1/135) * 7.2 }
  },
  parallel: {
      USD: { CNY: 7.2, DZD: 220 },  // Street rates (Algeria)
      CNY: { USD: 1/7.2, DZD: (1/7.2) * 220 },
      DZD: { USD: 1/220, CNY: (1/220) * 7.2 }
  }
};

let currentRateType = 'official';
let isConverting = false;

function toggleRates(type) {
  currentRateType = type;
  const rateDisplay = document.getElementById('rateDisplay');
  if (type === 'official') {
      rateDisplay.innerHTML = '<span>1 USD = 7.2 ¥ (CNY)</span><span>1 USD = 135 DZD</span>';
  } else {
      rateDisplay.innerHTML = '<span>1 USD = 7.2 ¥ (CNY)</span><span>1 USD = 220 DZD</span>';
  }
  // Auto-convert based on last active field
  const activeField = document.activeElement.id;
  if (activeField.includes('USD') || activeField.includes('CNY') || activeField.includes('DZD')) {
      convertCurrency(activeField.replace('Input', ''));
  }
}

function convertCurrency(source) {
  if (isConverting) return;
  
  const inputs = {
      USD: document.getElementById('usdInput'),
      CNY: document.getElementById('cnyInput'),
      DZD: document.getElementById('dzdInput')
  };

  const sourceValue = parseFloat(inputs[source].value);
  
  if (isNaN(sourceValue)) {
      clearInputs();
      return;
  }

  isConverting = true;

  const rateSet = rates[currentRateType];

  switch(source) {
      case 'USD':
          inputs.CNY.value = (sourceValue * rateSet.USD.CNY).toFixed(2);
          inputs.DZD.value = (sourceValue * rateSet.USD.DZD).toFixed(2);
          break;
      case 'CNY':
          inputs.USD.value = (sourceValue * rateSet.CNY.USD).toFixed(2);
          inputs.DZD.value = (sourceValue * rateSet.CNY.DZD).toFixed(2);
          break;
      case 'DZD':
          inputs.USD.value = (sourceValue * rateSet.DZD.USD).toFixed(2);
          inputs.CNY.value = (sourceValue * rateSet.DZD.CNY).toFixed(2);
          break;
  }

  updateResult(source, sourceValue);
  isConverting = false;
}

function updateResult(source, value) {
  const result = document.getElementById('result');
  const usd = parseFloat(document.getElementById('usdInput').value);
  const cny = parseFloat(document.getElementById('cnyInput').value);
  const dzd = parseFloat(document.getElementById('dzdInput').value);

  result.innerHTML = `
      ${value.toFixed(2)} ${source} =<br>
      <span class="highlight">${usd.toFixed(2)} USD</span> |
      <span class="highlight">${cny.toFixed(2)} ¥</span> |
      <span class="highlight">${dzd.toFixed(2)} DZD</span>
  `;
}

function clearInputs() {
  document.getElementById('usdInput').value = '';
  document.getElementById('cnyInput').value = '';
  document.getElementById('dzdInput').value = '';
  document.getElementById('result').innerHTML = '';
}

// Initialize with official rates
toggleRates('official');
