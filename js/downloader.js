// ===== DESCARGADOR CON PROXY ALTERNATIVO =====
// Desarrollado por Ander

// 🔥 PROXY ALTERNATIVO - USAR CUALQUIERA DE ESTOS
const PROXY_OPTIONS = [
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://proxy.cors.sh/',
    '' // Sin proxy (fallback)
];

// Intentar con el primer proxy que funcione
let ACTIVE_PROXY = PROXY_OPTIONS[0];

const API_URL = 'https://hub.convert1s.com/api/download';
const ORIGIN = 'https://real-y2mate.com';
const REFERER = 'https://real-y2mate.com/';
const YT_REGEX = /(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0';
const VALID_QUALITIES = ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'];
const DEFAULT_QUALITY = '1080p';
const POLL_INTERVAL = 2500;
const POLL_MAX = 80;

document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadBtn');
    const videoUrlInput = document.getElementById('videoUrl');
    const platformBtns = document.querySelectorAll('.platform-btn');
    const resultDiv = document.getElementById('downloadResult');
    const historyList = document.getElementById('historyList');

    let selectedPlatform = 'youtube';
    let selectedFormat = 'mp4';

    const formatVideoBtn = document.getElementById('formatVideo');
    const formatAudioBtn = document.getElementById('formatAudio');
    const formatLabel = document.getElementById('formatLabel');

    // ===== FUNCIONES DEL SCRAPER =====
    function baseHeaders(extra = {}) {
        return {
            accept: 'application/json',
            'accept-language': 'es-419,es;q=0.9,es-ES;q=0.8,en;q=0.7',
            origin: ORIGIN,
            referer: REFERER,
            'user-agent': USER_AGENT,
            ...extra
        };
    }

    function extractVideoId(url) {
        const match = String(url || '').match(YT_REGEX);
        return match ? match[1] : null;
    }

    function normalizeQuality(quality) {
        const q = String(quality || '').replace(/p$/i, '');
        return q && VALID_QUALITIES.includes(`${q}p`) ? `${q}p` : DEFAULT_QUALITY;
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function formatDuration(seconds) {
        const s = Math.max(0, Math.floor(seconds || 0));
        const h = Math.floor(s / 3600);
        const min = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return h > 0
            ? `${h}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
            : `${min}:${String(sec).padStart(2, '0')}`;
    }

    // ===== INTENTAR CON DIFERENTES PROXIES =====
    async function fetchWithProxy(url, options = {}) {
        // Probar cada proxy en orden
        for (let i = 0; i < PROXY_OPTIONS.length; i++) {
            const proxy = PROXY_OPTIONS[i];
            try {
                let finalUrl = url;
                let fetchOptions = { ...options };
                
                if (proxy) {
                    // Si el proxy requiere encodeURIComponent
                    if (proxy.includes('allorigins') || proxy.includes('cors.sh')) {
                        finalUrl = `${proxy}${encodeURIComponent(url)}`;
                    } else {
                        finalUrl = `${proxy}${url}`;
                    }
                    // Para algunos proxies, necesitamos eliminar ciertos headers
                    if (proxy.includes('cors-anywhere')) {
                        fetchOptions.headers = {
                            ...fetchOptions.headers,
                            'Origin': ORIGIN,
                            'X-Requested-With': 'XMLHttpRequest'
                        };
                    }
                }
                
                console.log(`🔄 Intentando proxy ${i+1}/${PROXY_OPTIONS.length}: ${proxy || 'sin proxy'}`);
                console.log(`📡 URL: ${finalUrl}`);
                
                const response = await fetch(finalUrl, fetchOptions);
                if (response.ok) {
                    console.log(`✅ Proxy ${i+1} funcionó!`);
                    ACTIVE_PROXY = proxy;
                    return response;
                }
                console.log(`❌ Proxy ${i+1} falló con HTTP ${response.status}`);
            } catch (error) {
                console.log(`❌ Proxy ${i+1} falló:`, error.message);
            }
        }
        throw new Error('Todos los proxies fallaron. Verifica tu conexión a internet.');
    }

    async function convert(url, quality = DEFAULT_QUALITY) {
        const videoId = extractVideoId(url);
        if (!videoId) throw new Error('Enlace de YouTube inválido');
        const q = normalizeQuality(quality);

        const body = JSON.stringify({
            url,
            os: 'windows',
            output: { 
                type: selectedFormat === 'mp4' ? 'video' : 'audio', 
                format: selectedFormat === 'mp4' ? 'mp4' : 'mp3', 
                quality: q 
            },
            audio: { bitrate: '128k' }
        });

        console.log('📡 Enviando solicitud a:', API_URL);
        console.log('📦 Body:', body);

        const res = await fetchWithProxy(API_URL, {
            method: 'POST',
            headers: baseHeaders({ 'content-type': 'application/json' }),
            body: body
        });

        const data = await res.json();
        console.log('📨 Respuesta:', data);

        if (!data.statusUrl) throw new Error(data.error || 'No se pudo iniciar la conversión');

        let title = data.title || '';
        for (let i = 0; i < POLL_MAX; i++) {
            console.log(`⏳ Polling ${i+1}/${POLL_MAX}...`);
            const statusRes = await fetchWithProxy(data.statusUrl, { headers: baseHeaders() });
            if (!statusRes.ok) { await sleep(POLL_INTERVAL); continue; }
            const status = await statusRes.json();
            if (status.title) title = status.title;
            if (status.status === 'error' || status.status === 'failed') {
                throw new Error(status.error || 'La conversión falló');
            }
            if (status.status === 'completed' && status.downloadUrl) {
                return {
                    videoId,
                    downloadUrl: status.downloadUrl,
                    title,
                    selectedQuality: data.selectedQuality || q,
                    duration: data.duration || status.duration || 0,
                    author: data.author || '',
                    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                };
            }
            await sleep(POLL_INTERVAL);
        }
        throw new Error('La conversión tardó demasiado, intenta de nuevo');
    }

    // ===== ACTUALIZAR FORMATO =====
    function updateFormatSelection(format) {
        if (format === 'mp4') {
            formatVideoBtn.style.borderColor = 'var(--primary-color)';
            formatVideoBtn.style.background = 'var(--primary-color)';
            formatVideoBtn.style.color = 'white';
            formatVideoBtn.classList.add('active');
            
            formatAudioBtn.style.borderColor = 'var(--border-color)';
            formatAudioBtn.style.background = 'var(--bg-card)';
            formatAudioBtn.style.color = 'var(--text-primary)';
            formatAudioBtn.classList.remove('active');

            if (formatLabel) {
                formatLabel.textContent = 'Formato seleccionado: MP4 Video';
                formatLabel.style.color = 'var(--primary-color)';
            }
            
            selectedFormat = 'mp4';
            console.log('✅ Formato cambiado a: MP4');

        } else if (format === 'mp3') {
            formatAudioBtn.style.borderColor = 'var(--primary-color)';
            formatAudioBtn.style.background = 'var(--primary-color)';
            formatAudioBtn.style.color = 'white';
            formatAudioBtn.classList.add('active');
            
            formatVideoBtn.style.borderColor = 'var(--border-color)';
            formatVideoBtn.style.background = 'var(--bg-card)';
            formatVideoBtn.style.color = 'var(--text-primary)';
            formatVideoBtn.classList.remove('active');

            if (formatLabel) {
                formatLabel.textContent = 'Formato seleccionado: MP3 Audio';
                formatLabel.style.color = 'var(--secondary-color)';
            }
            
            selectedFormat = 'mp3';
            console.log('✅ Formato cambiado a: MP3');
        }
    }

    // ===== EVENT LISTENERS =====
    if (formatVideoBtn && formatAudioBtn) {
        formatVideoBtn.addEventListener('click', function() {
            if (selectedFormat === 'mp4') return;
            updateFormatSelection('mp4');
        });

        formatAudioBtn.addEventListener('click', function() {
            if (selectedFormat === 'mp3') return;
            updateFormatSelection('mp3');
        });

        updateFormatSelection('mp4');
    }

    // ===== SELECCIONAR PLATAFORMA =====
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
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // ===== DESCARGAR =====
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

    videoUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            downloadBtn.click();
        }
    });

    // ===== FUNCIÓN PRINCIPAL DE DESCARGA =====
    async function downloadVideo(url, platform) {
        const formatLabelText = selectedFormat === 'mp4' ? 'MP4 Video' : 'MP3 Audio';
        
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
                <p style="color: var(--text-light); font-size: 14px;">Formato seleccionado: <strong style="color: var(--primary-color);">${formatLabelText}</strong></p>
                <p style="color: var(--text-light); font-size: 12px; margin-top: 4px;">⏳ Intentando con múltiples proxies...</p>
                <p style="color: var(--text-light); font-size: 11px; margin-top: 4px;">🔒 Esto puede tomar hasta 60 segundos</p>
                <div style="margin-top: 16px; width: 100%; max-width: 300px; height: 4px; 
                     background: var(--bg-input); border-radius: 2px; margin: 16px auto 0; overflow: hidden;">
                    <div style="width: 0%; height: 100%; background: var(--primary-gradient); 
                         border-radius: 2px; animation: progressBar 2s ease-in-out infinite;"></div>
                </div>
            </div>
        `;

        try {
            let response;

            if (platform === 'youtube') {
                const quality = selectedFormat === 'mp4' ? DEFAULT_QUALITY : '128k';
                const result = await convert(url, quality);
                
                response = {
                    success: true,
                    title: result.title || 'Contenido de YouTube',
                    author: result.author || 'Desconocido',
                    thumbnail: result.thumbnail || `https://i.ytimg.com/vi/${extractVideoId(url)}/hqdefault.jpg`,
                    downloadUrl: result.downloadUrl,
                    platform: 'youtube',
                    type: selectedFormat === 'mp4' ? 'video' : 'audio',
                    format: selectedFormat,
                    size: selectedFormat === 'mp4' ? 'Video MP4' : 'Audio MP3',
                    duration: result.duration || '0',
                    quality: result.selectedQuality || DEFAULT_QUALITY
                };
            } else {
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
            console.error('Error:', error);
            let errorMsg = error.message || 'Error desconocido';
            if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
                errorMsg = 'No se pudo conectar con el servidor. Todos los proxies fallaron. Intenta: 1) Usar otro enlace, 2) Probar más tarde, 3) Usar una VPN.';
            }
            showError('❌ ' + errorMsg);
        }
    }

    // ===== SIMULACIÓN PARA OTRAS PLATAFORMAS =====
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
                    format: 'video',
                    type: 'video',
                    duration: '0'
                });
            }, 2000);
        });
    }

    // ===== MOSTRAR RESULTADO =====
    function showResult(data) {
        const platformColors = {
            tiktok: '#FF0050',
            youtube: '#FF0000',
            instagram: '#E4405F',
            facebook: '#1877F2',
            twitter: '#1DA1F2'
        };
        
        const color = platformColors[data.platform] || 'var(--primary-color)';
        const isAudio = data.type === 'audio';
        const formatDisplay = isAudio ? 'AUDIO MP3' : 'VIDEO MP4';
        const formatLabelText = isAudio ? 'MP3 • 128kbps' : `MP4 • ${data.quality || 'HD'}`;
        const buttonText = isAudio ? 'Descargar MP3' : 'Descargar Video';
        const iconClass = isAudio ? 'fa-music' : 'fa-video';

        let durationText = '';
        if (data.duration && data.duration !== '0') {
            const seconds = parseInt(data.duration);
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            durationText = `• ⏱️ ${minutes}:${String(secs).padStart(2, '0')}`;
        }

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
                    <i class="fas ${iconClass}"></i>
                    ${formatDisplay}
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
                            ${isAudio ? '🎵 Audio listo para descargar' : '🎬 Video listo para descargar'}
                        </h3>
                        <p style="color: var(--text-light); font-size: 14px;">
                            Formato ${formatLabelText} ${durationText}
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
                            <p style="color: var(--text-secondary); font-size:14px; display:flex; align-items:center; gap:8px; margin-top:4px; flex-wrap:wrap;">
                                <i class="fas ${iconClass}" style="color: ${color};"></i>
                                ${formatLabelText}
                                ${data.size ? `• 📦 ${data.size}` : ''}
                            </p>
                        </div>
                        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:16px;">
                            <button onclick="downloadFile('${data.downloadUrl}', '${isAudio ? 'audio' : 'video'}')" 
                                    class="btn-primary" style="padding:10px 24px; font-size:14px; flex:1; min-width:120px;">
                                <i class="fas fa-download"></i> ${buttonText}
                            </button>
                            <button onclick="copyLink('${data.downloadUrl}')" 
                                    class="btn-secondary" style="padding:10px 24px; font-size:14px; flex:1; min-width:120px;">
                                <i class="fas fa-copy"></i> Copiar enlace
                            </button>
                        </div>
                    </div>
                </div>
                
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

    // ===== FUNCIONES GLOBALES =====
    window.copyLink = function(url) {
        navigator.clipboard.writeText(url).then(() => {
            App.showNotification('✅', 'Enlace copiado al portapapeles');
        }).catch(() => {
            App.showNotification('📋', 'URL: ' + url);
        });
    };

    window.downloadFile = function(url, type) {
        if (!url || url === '#') {
            App.showNotification('⚠️', 'Enlace de descarga no disponible');
            return;
        }

        App.showNotification('📥', `Descargando ${type === 'audio' ? 'audio MP3' : 'video MP4'}...`);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = type === 'audio' ? `audio-${Date.now()}.mp3` : `video-${Date.now()}.mp4`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
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
    };

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
                    <p style="color: var(--text-light); font-size:12px; margin-top:4px;">
                        💡 Alternativas: 1) Prueba con otro enlace, 2) Usa una VPN, 3) Intenta más tarde.
                    </p>
                </div>
            </div>
        `;
    }

    // ===== HISTORIAL =====
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

    // ===== INICIALIZAR =====
    renderHistory();
    console.log('🎯 Descargador con múltiples proxies iniciado');
    console.log('🔄 Proxies disponibles:', PROXY_OPTIONS.length);
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
