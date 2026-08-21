// ===== BUSCADOR DE MÚSICA =====
// Desarrollado por Ander

// 🔥 CAMBIAR EL NOMBRE DE LA VARIABLE PARA EVITAR CONFLICTOS
const MUSIC_API_BASE = 'https://api.delirius.online';

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Iniciando buscador de música...');
    
    // Obtener elementos
    const input = document.getElementById('musicSearch');
    const boton = document.getElementById('searchMusicBtn');
    const resultados = document.getElementById('musicResults');

    // Verificar elementos
    if (!input) console.error('❌ No se encontró el input #musicSearch');
    if (!boton) console.error('❌ No se encontró el botón #searchMusicBtn');
    if (!resultados) console.error('❌ No se encontró el contenedor #musicResults');

    // Si falta algún elemento, mostrar error y salir
    if (!input || !boton || !resultados) {
        if (resultados) {
            resultados.innerHTML = `
                <div style="text-align:center; padding:40px; color: #FF6B6B;">
                    <i class="fas fa-exclamation-triangle" style="font-size:48px; display:block; margin-bottom:16px;"></i>
                    <p>Error: No se encontraron los elementos del buscador</p>
                    <p style="font-size:14px;">Verifica que el HTML tenga los IDs correctos</p>
                </div>
            `;
        }
        return;
    }

    console.log('✅ Elementos encontrados correctamente');

    // ===== FUNCIÓN PARA BUSCAR =====
    function buscar() {
        const texto = input.value.trim();
        
        if (texto === '') {
            App.showNotification('⚠️', 'Escribe algo para buscar');
            return;
        }

        console.log(`🔍 Buscando: "${texto}"`);

        // Mostrar loading
        resultados.innerHTML = `
            <div style="text-align:center; padding:40px; color: var(--text-light);">
                <i class="fas fa-spinner fa-spin" style="font-size:48px; display:block; margin-bottom:16px; color: var(--primary-color);"></i>
                <p>Buscando "${texto}"...</p>
                <p style="font-size:12px; margin-top:8px; color: var(--text-light);">📡 Usando API: ${MUSIC_API_BASE}</p>
            </div>
        `;

        // Llamar a la API
        fetch(`${MUSIC_API_BASE}/search/ytsearch?q=${encodeURIComponent(texto)}`)
            .then(res => {
                console.log(`📡 Respuesta HTTP: ${res.status}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('📨 Datos recibidos:', data);
                
                if (!data.status) {
                    throw new Error('La API devolvió status: false');
                }
                
                if (!data.data || data.data.length === 0) {
                    resultados.innerHTML = `
                        <div style="text-align:center; padding:40px; color: var(--text-light);">
                            <i class="fas fa-music" style="font-size:48px; display:block; margin-bottom:16px;"></i>
                            <p>No se encontraron resultados para "${texto}"</p>
                            <p style="font-size:14px;">Intenta con otra palabra</p>
                            <p style="font-size:12px; margin-top:8px;">💡 Ejemplos: TWICE, Bad Bunny, Bohemian Rhapsody</p>
                        </div>
                    `;
                    return;
                }

                // Mostrar resultados
                mostrarResultados(data.data);
                App.updateStats('musicSearches');
            })
            .catch(error => {
                console.error('❌ Error:', error);
                resultados.innerHTML = `
                    <div style="text-align:center; padding:40px; color: var(--text-light);">
                        <i class="fas fa-exclamation-circle" style="font-size:48px; display:block; margin-bottom:16px; color: #FF6B6B;"></i>
                        <p>Error al buscar: ${error.message}</p>
                        <p style="font-size:14px;">Verifica tu conexión a internet</p>
                        <p style="font-size:12px; margin-top:8px;">💡 Prueba con: TWICE, Bad Bunny, Bohemian Rhapsody</p>
                    </div>
                `;
                App.showNotification('❌', 'Error al buscar música');
            });
    }

    // ===== FUNCIÓN PARA MOSTRAR RESULTADOS =====
    function mostrarResultados(videos) {
        resultados.innerHTML = videos.map((video, index) => `
            <div style="
                background: var(--bg-card);
                border-radius: var(--radius);
                padding: 16px;
                display: flex;
                gap: 16px;
                align-items: center;
                margin-bottom: 12px;
                border: 1px solid var(--border-color);
                flex-wrap: wrap;
            ">
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

                <img src="${video.thumbnail || video.image}" alt="${video.title}" 
                     style="width:80px; height:60px; border-radius:8px; object-fit:cover; flex-shrink:0;">

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

                <div style="display:flex; gap:8px; flex-shrink:0;">
                    <button class="btn-primary" style="padding:8px 16px; font-size:13px;" 
                            onclick="window.open('${video.url}', '_blank')">
                        <i class="fab fa-youtube"></i> Ver
                    </button>
                    <button class="btn-secondary" style="padding:8px 16px; font-size:13px;" 
                            onclick="copiarEnlaceMusica('${video.url}')">
                        <i class="fas fa-copy"></i> Copiar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // ===== FORMATO DE VISTAS =====
    function formatViews(views) {
        if (!views) return '0';
        const num = parseInt(views);
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    // ===== COPIAR ENLACE =====
    window.copiarEnlaceMusica = function(url) {
        navigator.clipboard.writeText(url).then(() => {
            App.showNotification('✅', 'Enlace copiado al portapapeles');
        }).catch(() => {
            App.showNotification('📋', 'URL: ' + url);
        });
    };

    // ===== CONECTAR EVENTOS =====
    boton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🖱️ Click en buscar');
        buscar();
    });

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('⌨️ Enter presionado');
            buscar();
        }
    });

    console.log('🎯 Buscador listo - Escribe algo y presiona Enter');
    console.log('📡 API:', MUSIC_API_BASE);
});
