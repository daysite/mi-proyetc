// ===== BUSCADOR DE MÚSICA CON API DELIRIUS.ONLINE =====
// Desarrollado por Ander

// 🔥 API CORRECTA PARA BÚSQUEDAS
const API_BASE = 'https://api.delirius.online';

document.addEventListener('DOMContentLoaded', function() {
    const musicSearch = document.getElementById('musicSearch');
    const searchBtn = document.getElementById('searchMusicBtn');
    const resultsDiv = document.getElementById('musicResults');

    // Placeholder simple
    musicSearch.placeholder = 'Buscar canciones, artistas o álbumes...';

    // Función para buscar en la API
    async function searchMusic(query) {
        // Solo eliminar espacios al inicio y final
        let cleanQuery = query.trim();

        if (!cleanQuery || cleanQuery === '') {
            App.showNotification('⚠️', 'Escribe algo para buscar');
            return;
        }

        // Mostrar loading
        resultsDiv.innerHTML = `
            <div class="loading" style="
                background: var(--bg-card);
                border-radius: var(--radius);
                padding: 40px;
                margin-top: 20px;
                border: 2px dashed var(--border-color);
            ">
                <i class="fas fa-spinner" style="font-size: 40px; color: var(--primary-color);"></i>
                <p style="font-size: 18px; font-weight: 600; margin-top: 12px;">Buscando "${cleanQuery}"...</p>
                <p style="color: var(--text-light); font-size: 14px;">📡 Usando API: ${API_BASE}</p>
                <div style="margin-top: 16px; width: 100%; max-width: 300px; height: 4px; 
                     background: var(--bg-input); border-radius: 2px; margin: 16px auto 0; overflow: hidden;">
                    <div style="width: 0%; height: 100%; background: var(--primary-gradient); 
                         border-radius: 2px; animation: progressBar 2s ease-in-out infinite;"></div>
                </div>
            </div>
        `;

        try {
            // 🔥 LLAMAR A LA API CON LO QUE ESCRIBIÓ EL USUARIO
            const url = `${API_BASE}/search/ytsearch?q=${encodeURIComponent(cleanQuery)}`;
            console.log(`📡 Buscando en: ${url}`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - La API no respondió correctamente`);
            }
            
            const data = await response.json();

            if (!data.status || !data.data || data.data.length === 0) {
                resultsDiv.innerHTML = `
                    <div style="text-align:center; padding:40px; color: var(--text-light);">
                        <i class="fas fa-music" style="font-size:48px; display:block; margin-bottom:16px;"></i>
                        <p>No se encontraron resultados para "${cleanQuery}"</p>
                        <p style="font-size:14px;">Intenta con otra palabra o artista</p>
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
            let errorMsg = error.message || 'Error desconocido';
            if (errorMsg.includes('Failed to fetch')) {
                errorMsg = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
            }
            resultsDiv.innerHTML = `
                <div style="text-align:center; padding:40px; color: var(--text-light);">
                    <i class="fas fa-exclamation-circle" style="font-size:48px; display:block; margin-bottom:16px; color: #FF6B6B;"></i>
                    <p>Error al buscar música</p>
                    <p style="font-size:14px;">${errorMsg}</p>
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
            " onclick="window.open('${video.url}', '_blank')">
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
                            onclick="event.stopPropagation(); window.open('${video.url}', '_blank')">
                        <i class="fab fa-youtube"></i> Ver
                    </button>
                    <button class="btn-secondary" style="padding:8px 16px; font-size:13px;" 
                            onclick="event.stopPropagation(); copyLink('${video.url}')">
                        <i class="fas fa-copy"></i> Copiar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Formatear vistas
    function formatViews(views) {
        if (!views) return '0';
        const num = parseInt(views);
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
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

    // Limpiar el input al hacer clic (solo si tiene el texto de ejemplo)
    musicSearch.addEventListener('focus', function() {
        if (this.value === 'Buscar canciones, artistas o álbumes...') {
            this.value = '';
        }
    });

    console.log('🎯 Buscador de música con API Delirius Online iniciado');
    console.log('📡 API_BASE:', API_BASE);
});

// Añadir animación de progreso
const style = document.createElement('style');
style.textContent = `
    @keyframes progressBar {
        0% { width: 0%; }
        50% { width: 70%; }
        100% { width: 100%; }
    }
`;
document.head.appendChild(style);
