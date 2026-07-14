// ===== BUSCADOR DE MÚSICA CON API REAL =====
document.addEventListener('DOMContentLoaded', function() {
    const musicSearch = document.getElementById('musicSearch');
    const searchBtn = document.getElementById('searchMusicBtn');
    const resultsDiv = document.getElementById('musicResults');

    // Función para buscar en la API
    async function searchMusic(query) {
        if (!query || query.trim() === '') {
            App.showNotification('⚠️', 'Ingresa el nombre de una canción o artista');
            return;
        }

        // Mostrar loading
        resultsDiv.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner"></i>
                <p>Buscando "${query}"...</p>
            </div>
        `;

        try {
            // Llamar a la API
            const url = `https://api.delirius.store/search/ytsearch?q=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!data.status || !data.data || data.data.length === 0) {
                resultsDiv.innerHTML = `
                    <div style="text-align:center; padding:40px; color: var(--text-light);">
                        <i class="fas fa-music" style="font-size:48px; display:block; margin-bottom:16px;"></i>
                        <p>No se encontraron resultados para "${query}"</p>
                        <p style="font-size:14px;">Intenta con otra búsqueda</p>
                    </div>
                `;
                return;
            }

            // Mostrar resultados
            renderResults(data.data);
            App.updateStats('musicSearches');
            App.showNotification('🎵', `Encontrados ${data.data.length} resultados`);

        } catch (error) {
            console.error('Error al buscar música:', error);
            resultsDiv.innerHTML = `
                <div style="text-align:center; padding:40px; color: var(--text-light);">
                    <i class="fas fa-exclamation-circle" style="font-size:48px; display:block; margin-bottom:16px; color: #FF6B6B;"></i>
                    <p>Error al conectar con la API</p>
                    <p style="font-size:14px;">${error.message}</p>
                </div>
            `;
            App.showNotification('❌', 'Error al buscar música');
        }
    }

    // Función para renderizar resultados
    function renderResults(videos) {
        resultsDiv.innerHTML = videos.map((video, index) => `
            <div style="
                background: var(--bg-card);
                border-radius: var(--radius);
                padding: 16px;
                display: flex;
                gap: 16px;
                align-items: center;
                margin-bottom: 12px;
                border: 1px solid var(--border-color);
                transition: var(--transition);
                cursor: pointer;
                flex-wrap: wrap;
            ">
                <!-- Número -->
                <div style="
                    width: 32px;
                    height: 32px;
                    background: var(--primary-color);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 13px;
                    flex-shrink: 0;
                ">
                    ${index + 1}
                </div>

                <!-- Mini imagen -->
                <img src="${video.thumbnail || video.image}" alt="${video.title}" 
                     style="width:80px; height:60px; border-radius:8px; object-fit:cover; flex-shrink:0;">

                <!-- Info -->
                <div style="flex:1; min-width:150px;">
                    <h4 style="color: var(--text-primary); font-size:15px; margin-bottom:4px; 
                               white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${video.title}
                    </h4>
                    <div style="display:flex; gap:12px; flex-wrap:wrap; font-size:13px; color: var(--text-secondary);">
                        <span><i class="fas fa-user"></i> ${video.author.name}</span>
                        <span><i class="fas fa-eye"></i> ${formatViews(video.views)}</span>
                        <span><i class="fas fa-clock"></i> ${video.duration}</span>
                        ${video.isLive ? '<span style="color:#FF0000;">🔴 EN VIVO</span>' : ''}
                    </div>
                </div>

                <!-- Botones -->
                <div style="display:flex; gap:8px; flex-shrink:0;">
                    <button class="btn-primary" style="padding:8px 16px; font-size:13px;" 
                            onclick="window.open('${video.url}', '_blank')">
                        <i class="fab fa-youtube"></i> Ver
                    </button>
                    <button class="btn-secondary" style="padding:8px 16px; font-size:13px;" 
                            onclick="copyLink('${video.url}')">
                        <i class="fas fa-copy"></i> Copiar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Formatear vistas
    function formatViews(views) {
        if (!views) return '0';
        if (views >= 1000000000) return (views / 1000000000).toFixed(1) + 'B';
        if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
        if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
        return views.toString();
    }

    // Función para copiar link
    window.copyLink = function(url) {
        navigator.clipboard.writeText(url).then(() => {
            App.showNotification('✅', 'Enlace copiado al portapapeles');
        }).catch(() => {
            App.showNotification('📋', 'URL: ' + url);
        });
    };

    // Event listeners
    searchBtn.addEventListener('click', function() {
        searchMusic(musicSearch.value);
    });

    musicSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchMusic(musicSearch.value);
        }
    });

    // Búsqueda automática al cargar con un ejemplo
    setTimeout(() => {
        musicSearch.placeholder = 'Ej: TWICE, BTS, Bad Bunny...';
    }, 1000);
});
