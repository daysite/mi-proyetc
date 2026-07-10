// ===== DESCARGADOR DE VIDEOS =====
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadBtn');
    const videoUrlInput = document.getElementById('videoUrl');
    const platformBtns = document.querySelectorAll('.platform-btn');
    const resultDiv = document.getElementById('downloadResult');
    const historyList = document.getElementById('historyList');

    let selectedPlatform = 'tiktok';

    // Seleccionar plataforma
    platformBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            platformBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedPlatform = this.dataset.platform;
            
            // Cambiar placeholder según plataforma
            const placeholders = {
                tiktok: 'https://www.tiktok.com/@usuario/video/123456789',
                youtube: 'https://www.youtube.com/watch?v=VIDEO_ID',
                instagram: 'https://www.instagram.com/reel/CODIGO',
                facebook: 'https://www.facebook.com/watch/?v=VIDEO_ID',
                twitter: 'https://twitter.com/usuario/status/123456789'
            };
            videoUrlInput.placeholder = placeholders[selectedPlatform] || 'Pega aquí el enlace...';
        });
    });

    // Descargar
    downloadBtn.addEventListener('click', function() {
        const url = videoUrlInput.value.trim();
        if (!url) {
            showError('Por favor, ingresa un enlace válido');
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
            <div class="loading">
                <i class="fas fa-spinner"></i>
                <p>Procesando tu video...</p>
                <small style="color: var(--text-light);">Esto puede tomar unos segundos</small>
            </div>
        `;

        try {
            // SIMULACIÓN DE API - REEMPLAZAR CON TU API REAL
            // Aquí iría tu llamada a la API real
            const response = await simulateApiCall(url, platform);

            if (response.success) {
                showResult(response);
                saveToHistory(response.title, platform);
                App.updateStats('downloads');
                updateStatsDisplay();
            } else {
                showError(response.message || 'Error al procesar el video');
            }
        } catch (error) {
            showError('Error de conexión. Intenta de nuevo más tarde.');
            console.error('Download error:', error);
        }
    }

    // SIMULACIÓN DE API (REEMPLAZAR CON TU API REAL)
    function simulateApiCall(url, platform) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const titles = {
                    tiktok: 'Video de TikTok',
                    youtube: 'Video de YouTube',
                    instagram: 'Reel de Instagram',
                    facebook: 'Video de Facebook',
                    twitter: 'Video de Twitter'
                };

                resolve({
                    success: true,
                    title: `${titles[platform] || 'Video'} - ${new Date().toLocaleDateString()}`,
                    thumbnail: `https://picsum.photos/seed/${Date.now()}/400/300`,
                    downloadUrl: '#',
                    platform: platform,
                    quality: '1080p'
                });
            }, 2000);
        });
    }

    // Mostrar resultado
    function showResult(data) {
        resultDiv.innerHTML = `
            <div class="success-result" style="
                background: var(--bg-card);
                border-radius: var(--radius);
                padding: 24px;
                margin-top: 16px;
                box-shadow: 0 4px 20px var(--shadow-color);
                border: 1px solid var(--border-color);
            ">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                    <i class="fas fa-check-circle" style="color: #4CAF50; font-size:24px;"></i>
                    <h3 style="color: var(--text-primary);">¡Listo para descargar!</h3>
                </div>
                
                <div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:16px;">
                    <div style="flex:1; min-width:200px;">
                        <img src="${data.thumbnail}" alt="Miniatura" 
                             style="width:100%; border-radius:8px; max-height:200px; object-fit:cover;">
                    </div>
                    <div style="flex:2; min-width:200px;">
                        <p style="font-weight:600; color: var(--text-primary);">${data.title}</p>
                        <p style="color: var(--text-secondary); font-size:14px; margin:8px 0;">
                            <i class="fab fa-${data.platform}"></i> ${data.platform.toUpperCase()} 
                            • ${data.quality}
                        </p>
                        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px;">
                            <button onclick="downloadFile('${data.downloadUrl}', 'video')" 
                                    class="btn-primary" style="padding:8px 20px;">
                                <i class="fas fa-download"></i> Video HD
                            </button>
                            <button onclick="downloadFile('${data.downloadUrl}', 'audio')" 
                                    class="btn-secondary" style="padding:8px 20px;">
                                <i class="fas fa-music"></i> Solo Audio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Mostrar error
    function showError(message) {
        resultDiv.innerHTML = `
            <div style="
                background: #FFF3F3;
                border: 2px solid #FF6B6B;
                border-radius: var(--radius);
                padding: 20px;
                margin-top:16px;
                display:flex;
                align-items:center;
                gap:12px;
            ">
                <i class="fas fa-exclamation-circle" style="color:#FF6B6B; font-size:24px;"></i>
                <div>
                    <p style="color:#D63031; font-weight:600;">Error</p>
                    <p style="color:#C0392B;">${message}</p>
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
            historyList.innerHTML = '<li class="empty-history">No hay descargas aún</li>';
            return;
        }
        historyList.innerHTML = history.map(item => `
            <li style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                padding:12px 16px;
                background: var(--bg-secondary);
                border-radius:8px;
                margin-bottom:8px;
                border-left: 3px solid var(--primary-color);
            ">
                <div>
                    <p style="font-weight:500; color: var(--text-primary);">${item.title}</p>
                    <small style="color: var(--text-light);">
                        <i class="fab fa-${item.platform}"></i> ${item.platform} • ${item.date}
                    </small>
                </div>
                <i class="fas fa-check-circle" style="color:#4CAF50;"></i>
            </li>
        `).join('');
    }

    // Función global para descargar archivo
    window.downloadFile = function(url, type) {
        App.showNotification('📥', `Descargando ${type === 'video' ? 'video' : 'audio'}...`);
        // Aquí iría la lógica real de descarga
        // window.open(url, '_blank');
        console.log(`Descargando ${type}: ${url}`);
    };

    // Inicializar historial
    renderHistory();
});

// Actualizar estadísticas
function updateStatsDisplay() {
    const stats = App.getStats();
    document.getElementById('totalDownloads').textContent = stats.downloads || 0;
}
