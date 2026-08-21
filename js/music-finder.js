// ===== BUSCADOR DE MÚSICA - VERSIÓN SIMPLE =====
// Desarrollado por Ander

const API_BASE = 'https://api.delirius.online';

document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos
    const input = document.getElementById('musicSearch');
    const boton = document.getElementById('searchMusicBtn');
    const resultados = document.getElementById('musicResults');

    // Verificar que los elementos existen
    if (!input || !boton || !resultados) {
        console.error('❌ Error: No se encontraron los elementos del buscador');
        console.log('Input:', input);
        console.log('Botón:', boton);
        console.log('Resultados:', resultados);
        return;
    }

    console.log('✅ Elementos del buscador encontrados');

    // ===== FUNCIÓN PARA BUSCAR =====
    function buscar() {
        const texto = input.value.trim();
        
        if (texto === '') {
            alert('⚠️ Escribe algo para buscar');
            return;
        }

        console.log(`🔍 Buscando: "${texto}"`);

        // Mostrar loading
        resultados.innerHTML = `
            <div style="text-align:center; padding:40px; color: var(--text-light);">
                <i class="fas fa-spinner fa-spin" style="font-size:48px; display:block; margin-bottom:16px; color: var(--primary-color);"></i>
                <p>Buscando "${texto}"...</p>
            </div>
        `;

        // Llamar a la API
        fetch(`${API_BASE}/search/ytsearch?q=${encodeURIComponent(texto)}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('📨 Datos recibidos:', data);
                
                if (!data.status || !data.data || data.data.length === 0) {
                    resultados.innerHTML = `
                        <div style="text-align:center; padding:40px; color: var(--text-light);">
                            <i class="fas fa-music" style="font-size:48px; display:block; margin-bottom:16px;"></i>
                            <p>No se encontraron resultados para "${texto}"</p>
                        </div>
                    `;
                    return;
                }

                // Mostrar resultados
                mostrarResultados(data.data);
            })
            .catch(error => {
                console.error('❌ Error:', error);
                resultados.innerHTML = `
                    <div style="text-align:center; padding:40px; color: var(--text-light);">
                        <i class="fas fa-exclamation-circle" style="font-size:48px; display:block; margin-bottom:16px; color: #FF6B6B;"></i>
                        <p>Error al buscar: ${error.message}</p>
                        <p style="font-size:14px;">Verifica tu conexión a internet</p>
                    </div>
                `;
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
                            onclick="copiarEnlace('${video.url}')">
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
    window.copiarEnlace = function(url) {
        navigator.clipboard.writeText(url).then(() => {
            alert('✅ Enlace copiado al portapapeles');
        }).catch(() => {
            alert('📋 URL: ' + url);
        });
    };

    // ===== CONECTAR EVENTOS =====
    // Botón "Buscar"
    boton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🖱️ Click en buscar');
        buscar();
    });

    // Tecla "Enter" en el input
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('⌨️ Enter presionado');
            buscar();
        }
    });

    console.log('🎯 Buscador listo - Escribe algo y presiona Enter');
});
