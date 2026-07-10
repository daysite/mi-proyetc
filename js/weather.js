// ===== CLIMA =====
document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('weatherCity');
    const searchBtn = document.getElementById('getWeatherBtn');
    const locationBtn = document.getElementById('getLocationWeatherBtn');
    const resultDiv = document.getElementById('weatherResult');

    // Datos de clima simulados (reemplazar con API real)
    const weatherData = {
        'lima': {
            city: 'Lima',
            country: 'PE',
            temp: 22,
            description: 'Mayormente nublado',
            icon: '☁️',
            humidity: 80,
            wind: 12,
            feelsLike: 24
        },
        'bogota': {
            city: 'Bogotá',
            country: 'CO',
            temp: 14,
            description: 'Lluvia ligera',
            icon: '🌧️',
            humidity: 85,
            wind: 8,
            feelsLike: 12
        },
        'buenos aires': {
            city: 'Buenos Aires',
            country: 'AR',
            temp: 28,
            description: 'Soleado',
            icon: '☀️',
            humidity: 65,
            wind: 15,
            feelsLike: 30
        },
        'madrid': {
            city: 'Madrid',
            country: 'ES',
            temp: 18,
            description: 'Parcialmente nublado',
            icon: '⛅',
            humidity: 55,
            wind: 10,
            feelsLike: 17
        }
    };

    searchBtn.addEventListener('click', getWeather);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') getWeather();
    });
    locationBtn.addEventListener('click', getLocationWeather);

    function getWeather() {
        const city = cityInput.value.trim().toLowerCase();
        if (!city) {
            App.showNotification('⚠️', 'Ingresa el nombre de una ciudad');
            return;
        }

        // Buscar en datos simulados
        const data = weatherData[city];
        if (!data) {
            resultDiv.innerHTML = `
                <div style="text-align:center; padding:40px; color: var(--text-light);">
                    <i class="fas fa-cloud-rain" style="font-size:48px; display:block; margin-bottom:16px;"></i>
                    <p>No se encontró información para "${city}"</p>
                    <p style="font-size:14px;">Prueba con: Lima, Bogotá, Buenos Aires, Madrid</p>
                </div>
            `;
            return;
        }

        showWeather(data);
    }

    function getLocationWeather() {
        if (!navigator.geolocation) {
            App.showNotification('⚠️', 'Tu navegador no soporta geolocalización');
            return;
        }

        App.showNotification('📍', 'Obteniendo tu ubicación...');

        navigator.geolocation.getCurrentPosition(
            function(position) {
                // Simular obtener clima por coordenadas
                const fakeData = {
                    city: 'Tu ubicación',
                    country: 'XX',
                    temp: 22,
                    description: 'Clima agradable',
                    icon: '🌤️',
                    humidity: 70,
                    wind: 10,
                    feelsLike: 23
                };
                showWeather(fakeData);
                App.showNotification('✅', 'Clima obtenido correctamente');
            },
            function(error) {
                App.showNotification('❌', 'No se pudo obtener tu ubicación');
                console.error('Geolocation error:', error);
            }
        );
    }

    function showWeather(data) {
        resultDiv.innerHTML = `
            <div style="
                background: var(--bg-card);
                border-radius: var(--radius);
                padding: 30px;
                border: 1px solid var(--border-color);
                margin-top: 16px;
            ">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                    <div>
                        <h3 style="font-size:28px; color: var(--text-primary);">
                            ${data.city}, ${data.country}
                        </h3>
                        <p style="font-size:16px; color: var(--text-secondary);">
                            ${data.description}
                        </p>
                    </div>
                    <div style="font-size:64px;">
                        ${data.icon}
                    </div>
                </div>
                
                <div style="margin-top:20px;">
                    <div style="font-size:48px; font-weight:700; color: var(--primary-color);">
                        ${data.temp}°C
                    </div>
                    <p style="color: var(--text-secondary);">Sensación térmica: ${data.feelsLike}°C</p>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px,1fr)); gap:16px; margin-top:20px;">
                    <div style="background: var(--bg-secondary); padding:12px; border-radius:8px; text-align:center;">
                        <p style="font-size:12px; color: var(--text-light);">Humedad</p>
                        <p style="font-size:18px; font-weight:600; color: var(--text-primary);">${data.humidity}%</p>
                    </div>
                    <div style="background: var(--bg-secondary); padding:12px; border-radius:8px; text-align:center;">
                        <p style="font-size:12px; color: var(--text-light);">Viento</p>
                        <p style="font-size:18px; font-weight:600; color: var(--text-primary);">${data.wind} km/h</p>
                    </div>
                    <div style="background: var(--bg-secondary); padding:12px; border-radius:8px; text-align:center;">
                        <p style="font-size:12px; color: var(--text-light);">Actualizado</p>
                        <p style="font-size:14px; font-weight:600; color: var(--text-primary);">${new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>
        `;
    }
});
