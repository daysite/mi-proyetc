// ===== DESCARGADOR DE VIDEOS Y AUDIO CON API REAL =====
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadBtn');
    const videoUrlInput = document.getElementById('videoUrl');
    const platformBtns = document.querySelectorAll('.platform-btn');
    const resultDiv = document.getElementById('downloadResult');
    const historyList = document.getElementById('historyList');

    let selectedPlatform = 'youtube';

    // Seleccionar plataforma
    platformBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            platformBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedPlatform = this.dataset.platform;
            
            const placeholders = {
                tiktok: 'https://www.tiktok.com/@usuario/video/123456789',
                youtube: 'https://www.youtube.com/watch?v=VIDEO_ID',
                instagram: 'https://www.instagram.com/reel/CODIGO',
                facebook: 'https://www.facebook.com/watch/?v=VIDEO_ID',
                twitter: 'https://twitter.com/usuario/status/123456789'
            };
            videoUrlInput.placeholder = placeholders[selectedPlatform] || 'Pega aquí el enlace...';
            
            // Efecto visual
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Descargar
    downloadBtn.addEventListener('click', function() {
        const url = videoUrlInput.value.trim();
        if (!url) {
            showError('⚠️ Por favor, ingresa un enlace válido');
            videoUrlInput.style.borderColor = '#FF6B6B';
            setTimeout(() => {
                videoUrlInput.style.borderColor = '';
            }, 2000);
            return;
        }
        downloadVideo(url, selectedPlatform);
    });

    // Enter para descargar
    videoUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            downloadBtn.click();
        }
    });

    // Función principal de descarga
    async function downloadVideo(url, platform) {
        resultDiv.innerHTML = `
            <div class="loading" style="
                background: var(--bg-card);
                border-radius: var(--radius);
                padding: 40px;
                margin-top: 20px;
                border: 2px dashed var(--border-color);
            ">
                <i class="fas fa-spinner" style="font-size: 40px; color: var(--primary-color);"></i>
                <p style="font-size: 18px; font-weight: 600; margin-top: 12px;">Procesando tu solicitud...</p>
                <p style="color: var(--text-light); font-size: 14px;">Esto puede tomar unos segundos</p>
                <div style="margin-top: 16px; width: 100%; max-width: 300px; height: 4px; 
                     background: var(--bg-input); border-radius: 2px; margin: 16px auto 0; overflow: hidden;">
                    <div style="width: 0%; height: 100%; background: var(--primary-gradient); 
                         border-radius: 2px; animation: progressBar 2s ease-in-out infinite;"></div>
                </div>
            </div>
        `;

        try {
            let response;

            // Si es YouTube, usar la API de audio
            if (platform === 'youtube') {
                response = await downloadAudio(url);
            } else {
                // Para otras plataformas, simular (reemplazar con tu API)
                response = await simulateApiCall(url, platform);
            }

            if (response.success) {
                showResult(response);
                saveToHistory(response.title, platform);
                App.updateStats('downloads');
                updateStatsDisplay();
            } else {
                showError('❌ ' + (response.message || 'Error al procesar la solicitud'));
            }
        } catch (error) {
            showError('❌ Error de conexión. Intenta de nuevo más tarde.');
            console.error('Download error:', error);
        }
    }

    // ===== FUNCIÓN PARA DESCARGAR AUDIO DE YOUTUBE =====
    async function downloadAudio(url) {
        try {
            // Llamar a la API de audio
            const apiUrl = `https://api.delirius.store/download/ytmp3?url=${encodeURIComponent(url)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.status || !data.data) {
                return {
                    success: false,
                    message: 'No se pudo obtener el audio'
                };
            }

            const audioData = data.data;

            return {
                success: true,
                title: audioData.title || 'Audio de YouTube',
                author: audioData.author || 'Desconocido',
                thumbnail: audioData.image || 'https://picsum.photos/seed/audio/400/300',
                downloadUrl: audioData.download,
                platform: 'youtube',
                format: 'mp3',
                size: 'Audio MP3',
                views: audioData.views || '0',
                likes: audioData.likes || '0'
            };
        } catch (error) {
            console.error('Error al descargar audio:', error);
            return {
                success: false,
                message: error.message || 'Error al conectar con la API'
            };
        }
    }

    // SIMULACIÓN DE API para otras plataformas
    function simulateApiCall(url, platform) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const titles = {
                    tiktok: '🎬 Video de TikTok',
                    youtube: '📺 Video de YouTube',
                    instagram: '📷 Reel de Instagram',
                    facebook: '📱 Video de Facebook',
                    twitter: '🐦 Video de Twitter'
                };
                
                const icons = {
                    tiktok: 'fab fa-tiktok',
                    youtube: 'fab fa-youtube',
                    instagram: 'fab fa-instagram',
                    facebook: 'fab fa-facebook',
                    twitter: 'fab fa-twitter'
                };

                resolve({
                    success: true,
                    title: `${titles[platform] || 'Video'} - ${new Date().toLocaleDateString()}`,
                    thumbnail: `https://picsum.photos/seed/${Date.now()}/400/300`,
                    downloadUrl: '#',
                    platform: platform,
                    quality: '1080p',
                    icon: icons[platform] || 'fas fa-video',
                    size: '45.2 MB',
                    format: 'video'
                });
            }, 2000);
        });
    }

    // Mostrar resultado - DISEÑO MEJORADO
    function showResult(data) {
        const platformColors = {
            tiktok: '#FF0050',
            youtube: '#FF0000',
            instagram: '#E4405F',
            facebook: '#1877F2',
            twitter: '#1DA1F2'
        };
        
        const color = platformColors[data.platform] || 'var(--primary-color)';
        const isAudio = data.format === 'mp3';

        resultDiv.innerHTML = `
            <div style="
                background: var(--bg-card);
                border-radius: var(--radius);
                padding: 28px;
                margin-top: 20px;
                border: 2px solid ${color};
                box-shadow: 0 8px 40px var(--shadow-color);
                position: relative;
                overflow: hidden;
            ">
                <!-- Badge de plataforma -->
                <div style="
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: ${color};
                    color: white;
                    padding: 6px 16px;
                    border-radius: 0 0 0 12px;
                    font-size: 13px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                ">
                    <i class="${isAudio ? 'fas fa-music' : 'fas fa-video'}"></i>
                    ${isAudio ? 'AUDIO MP3' : data.platform.toUpperCase()}
                </div>

                <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
                    <div style="
                        width: 48px;
                        height: 48px;
                        background: ${color}20;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: ${color};
                        font-size: 24px;
                    ">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div>
                        <h3 style="color: var(--text-primary); font-size: 20px;">
                            ${isAudio ? '🎵 Audio listo para descargar' : '¡Video listo para descargar!'}
                        </h3>
                        <p style="color: var(--text-light); font-size: 14px;">
                            ${isAudio ? 'Formato MP3 • Calidad 128kbps' : `Calidad ${data.quality} • Tamaño ${data.size}`}
                        </p>
                    </div>
                </div>
                
                <div style="display:flex; gap:20px; flex-wrap:wrap; margin-bottom:20px;">
                    <div style="flex:1; min-width:200px;">
                        <div style="
                            border-radius: var(--radius-sm);
                            overflow: hidden;
                            box-shadow: 0 4px 20px var(--shadow-color);
                        ">
                            <img src="${data.thumbnail}" alt="Miniatura" 
                                 style="width:100%; max-height:220px; object-fit:cover; display:block;">
                        </div>
                    </div>
                    <div style="flex:2; min-width:200px; display:flex; flex-direction:column; justify-content:space-between;">
                        <div>
                            <p style="font-weight:700; color: var(--text-primary); font-size: 18px; margin-bottom:4px;">
                                ${data.title}
                            </p>
                            ${data.author ? `<p style="color: var(--text-secondary); font-size:14px;"><i class="fas fa-user"></i> ${data.author}</p>` : ''}
                            <p style="color: var(--text-secondary); font-size:14px; display:flex; align-items:center; gap:8px; margin-top:4px;">
                                ${isAudio ? '<i class="fas fa-music" style="color: ' + color + ';"></i>' : '<i class="fas fa-video" style="color: ' + color + ';"></i>'}
                                ${isAudio ? 'MP3 • 128kbps' : data.platform.toUpperCase() + ' • ' + data.quality}
                                ${data.views ? `• 👁️ ${formatViews(data.views)}` : ''}
                            </p>
                        </div>
                        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:16px;">
                            <button onclick="downloadFile('${data.downloadUrl}', '${isAudio ? 'audio' : 'video'}')" 
                                    class="btn-primary" style="padding:10px 24px; font-size:14px; flex:1; min-width:120px;">
                                <i class="fas fa-download"></i> ${isAudio ? 'Descargar MP3' : 'Descargar Video'}
                            </button>
                            ${isAudio ? `
                                <button onclick="copyLink('${data.downloadUrl}')" 
                                        class="btn-secondary" style="padding:10px 24px; font-size:14px; flex:1; min-width:120px;">
                                    <i class="fas fa-copy"></i> Copiar enlace
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <!-- Barra de progreso de descarga -->
                <div style="
                    width: 100%;
                    height: 6px;
                    background: var(--bg-input);
                    border-radius: 3px;
                    margin-top: 8px;
                    overflow: hidden;
                ">
                    <div id="progressBar" style="
                        width: 0%;
                        height: 100%;
                        background: var(--primary-gradient);
                        border-radius: 3px;
                        transition: width 0.3s ease;
                    "></div>
                </div>
            </div>
        `;
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

    // Copiar enlace
    window.copyLink = function(url) {
        navigator.clipboard.writeText(url).then(() => {
            App.showNotification('✅', 'Enlace copiado al portapapeles');
        }).catch(() => {
            App.showNotification('📋', 'URL: ' + url);
        });
    };

    // Mostrar error
    function showError(message) {
        resultDiv.innerHTML = `
            <div style="
                background: var(--bg-card);
                border: 2px solid #FF6B6B;
                border-radius: var(--radius);
                padding: 24px;
                margin-top:20px;
                display:flex;
                align-items:center;
                gap:16px;
                box-shadow: 0 4px 20px var(--shadow-color);
            ">
                <div style="
                    width: 48px;
                    height: 48px;
                    background: #FF6B6B20;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #FF6B6B;
                    font-size: 24px;
                    flex-shrink: 0;
                ">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <div>
                    <p style="color: #FF6B6B; font-weight:700; font-size:16px;">¡Ups! Algo salió mal</p>
                    <p style="color: var(--text-secondary);">${message}</p>
                </div>
            </div>
        `;
    }

    // Guardar historial
    function saveToHistory(title, platform) {
        let history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
        history.unshift({
            title: title,
            platform: platform,
            date: new Date().toLocaleString()
        });
        if (history.length > 20) history.pop();
        localStorage.setItem('downloadHistory', JSON.stringify(history));
        renderHistory();
    }

    // Renderizar historial
    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
        if (history.length === 0) {
            historyList.innerHTML = `
                <li style="
                    text-align: center;
                    padding: 30px;
                    color: var(--text-light);
                    background: var(--bg-card);
                    border-radius: var(--radius-sm);
                    border: 2px dashed var(--border-color);
                ">
                    <i class="fas fa-history" style="font-size: 32px; display:block; margin-bottom: 8px; opacity: 0.3;"></i>
                    <p>No hay descargas aún</p>
                    <p style="font-size: 13px;">¡Empieza descargando tu primer video o audio!</p>
                </li>
            `;
            return;
        }
        
        const platformColors = {
            tiktok: '#FF0050',
            youtube: '#FF0000',
            instagram: '#E4405F',
            facebook: '#1877F2',
            twitter: '#1DA1F2'
        };

        historyList.innerHTML = history.map(item => {
            const color = platformColors[item.platform] || 'var(--primary-color)';
            return `
                <li style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:14px 18px;
                    background: var(--bg-input);
                    border-radius: var(--radius-sm);
                    margin-bottom:8px;
                    border-left: 4px solid ${color};
                    transition: var(--transition);
                ">
                    <div style="flex:1; min-width:0;">
                        <p style="font-weight:600; color: var(--text-primary); font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            ${item.title}
                        </p>
                        <div style="display:flex; align-items:center; gap:8px; font-size:13px; color: var(--text-light); margin-top:2px; flex-wrap:wrap;">
                            <span style="display:flex; align-items:center; gap:4px;">
                                <i class="fab fa-${item.platform}" style="color: ${color};"></i>
                                ${item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
                            </span>
                            <span>•</span>
                            <span>${item.date}</span>
                        </div>
                    </div>
                    <div style="
                        width: 32px;
                        height: 32px;
                        background: ${color}20;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: ${color};
                        flex-shrink: 0;
                    ">
                        <i class="fas fa-check" style="font-size: 14px;"></i>
                    </div>
                </li>
            `;
        }).join('');
    }

    // Función global para descargar archivo
    window.downloadFile = function(url, type) {
        if (type === 'audio') {
            // Descargar audio
            App.showNotification('🎵', 'Descargando audio MP3...');
            
            // Crear un enlace de descarga
            const link = document.createElement('a');
            link.href = url;
            link.download = `audio-${Date.now()}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Animar barra de progreso
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 15;
                    if (progress > 100) {
                        progress = 100;
                        clearInterval(interval);
                        App.showNotification('✅', '¡Descarga completada!');
                    }
                    progressBar.style.width = progress + '%';
                }, 300);
            }
        } else {
            // Descargar video
            App.showNotification('📥', `Descargando ${type}...`);
            window.open(url, '_blank');
        }
    };

    // Inicializar historial
    renderHistory();
});

// Actualizar estadísticas
function updateStatsDisplay() {
    const stats = App.getStats();
    const totalDownloads = document.getElementById('totalDownloads');
    if (totalDownloads) {
        totalDownloads.textContent = stats.downloads || 0;
    }
}

// Añadir animación de progreso
const style = document.createElement('style');
style.textContent = `
    @keyframes progressBar {
        0% { width: 0%; }
        50% { width: 70%; }
        100% { width: 100%; }
    }
    
    .platform-btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    }
    
    .platform-btn::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }
    
    .platform-btn:active::after {
        width: 300px;
        height: 300px;
    }
`;
document.head.appendChild(style);
