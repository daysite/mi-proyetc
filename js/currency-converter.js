// ===== CONVERSOR DE MONEDAS =====
document.addEventListener('DOMContentLoaded', function() {
    const amount = document.getElementById('currencyAmount');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const convertBtn = document.getElementById('convertCurrencyBtn');
    const resultDiv = document.getElementById('currencyResult');

    // Tasas de cambio simuladas (reemplazar con API real)
    const exchangeRates = {
        USD: { EUR: 0.92, PEN: 3.75, MXN: 17.20, ARS: 825.00, CLP: 880.00, COP: 3900.00, BRL: 4.95 },
        EUR: { USD: 1.09, PEN: 4.08, MXN: 18.70, ARS: 895.00, CLP: 956.00, COP: 4239.00, BRL: 5.38 },
        PEN: { USD: 0.27, EUR: 0.25, MXN: 4.59, ARS: 220.00, CLP: 235.00, COP: 1040.00, BRL: 1.32 },
        MXN: { USD: 0.058, EUR: 0.053, PEN: 0.22, ARS: 48.00, CLP: 51.20, COP: 226.70, BRL: 0.29 },
        ARS: { USD: 0.0012, EUR: 0.0011, PEN: 0.0045, MXN: 0.021, CLP: 1.07, COP: 4.73, BRL: 0.006 },
        CLP: { USD: 0.0011, EUR: 0.0010, PEN: 0.0043, MXN: 0.0195, ARS: 0.94, COP: 4.43, BRL: 0.0056 },
        COP: { USD: 0.00026, EUR: 0.00024, PEN: 0.00096, MXN: 0.0044, ARS: 0.21, CLP: 0.23, BRL: 0.0013 },
        BRL: { USD: 0.20, EUR: 0.19, PEN: 0.76, MXN: 3.48, ARS: 167.00, CLP: 178.00, COP: 788.00 }
    };

    convertBtn.addEventListener('click', convertCurrency);
    amount.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') convertCurrency();
    });

    function convertCurrency() {
        const value = parseFloat(amount.value);
        if (!value || value <= 0) {
            App.showNotification('⚠️', 'Ingresa una cantidad válida');
            return;
        }

        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (from === to) {
            resultDiv.innerHTML = `
                <div style="text-align:center; padding:30px; color: var(--text-primary);">
                    <p style="font-size:18px; font-weight:600;">${value} ${from}</p>
                    <p style="color: var(--text-secondary);">La moneda de origen y destino son iguales</p>
                </div>
            `;
            return;
        }

        // Calcular conversión
        let rate;
        if (exchangeRates[from] && exchangeRates[from][to]) {
            rate = exchangeRates[from][to];
        } else if (exchangeRates[to] && exchangeRates[to][from]) {
            rate = 1 / exchangeRates[to][from];
        } else {
            // Si no hay tasa directa, usar USD como puente
            const toUSD = exchangeRates[from]?.USD || (1 / exchangeRates.USD[from]);
            const fromUSD = exchangeRates[to]?.USD || (1 / exchangeRates.USD[to]);
            rate = fromUSD / toUSD;
        }

        const result = value * rate;

        // Obtener símbolos de moneda
        const symbols = {
            USD: '$', EUR: '€', PEN: 'S/', MXN: 'MX$', 
            ARS: 'AR$', CLP: 'CL$', COP: 'CO$', BRL: 'R$'
        };

        resultDiv.innerHTML = `
            <div style="
                background: var(--bg-card);
                border-radius: var(--radius);
                padding: 30px;
                text-align:center;
                border: 2px solid var(--primary-color);
                margin-top: 16px;
            ">
                <p style="font-size:14px; color: var(--text-secondary);">
                    ${value} ${from} = 
                </p>
                <p style="font-size:32px; font-weight:700; color: var(--primary-color); margin: 8px 0;">
                    ${symbols[to] || ''} ${result.toFixed(2)} ${to}
                </p>
                <p style="font-size:14px; color: var(--text-secondary);">
                    Tasa de cambio: 1 ${from} = ${rate.toFixed(4)} ${to}
                </p>
                <p style="font-size:12px; color: var(--text-light); margin-top:8px;">
                    <i class="fas fa-clock"></i> Actualizado: ${new Date().toLocaleString()}
                </p>
            </div>
        `;

        App.showNotification('💰', `Convertido: ${value} ${from} = ${result.toFixed(2)} ${to}`);
    }

    // Conversión automática al cambiar monedas
    fromCurrency.addEventListener('change', function() {
        if (amount.value && parseFloat(amount.value) > 0) {
            convertCurrency();
        }
    });

    toCurrency.addEventListener('change', function() {
        if (amount.value && parseFloat(amount.value) > 0) {
            convertCurrency();
        }
    });

    // Convertir al cargar
    setTimeout(convertCurrency, 500);
});
