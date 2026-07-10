// ===== GENERADOR DE QR =====
document.addEventListener('DOMContentLoaded', function() {
    const qrInput = document.getElementById('qrInput');
    const generateBtn = document.getElementById('generateQrBtn');
    const qrResult = document.getElementById('qrResult');
    const qrSize = document.getElementById('qrSize');
    const qrColor = document.getElementById('qrColor');
    const downloadQrBtn = document.getElementById('downloadQrBtn');

    let currentQrData = null;

    generateBtn.addEventListener('click', generateQR);
    qrInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') generateQR();
    });

    function generateQR() {
        const text = qrInput.value.trim();
        if (!text) {
            App.showNotification('⚠️', 'Por favor, ingresa un texto o URL');
            return;
        }

        const size = parseInt(qrSize.value);
        const color = qrColor.value.substring(1); // Quitar # del hex

        // Usar API pública de QR (o reemplazar con tu propia API)
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${color}`;

        qrResult.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <img src="${qrUrl}" alt="Código QR" 
                     style="max-width:100%; border-radius:8px; 
                            box-shadow: 0 4px 20px var(--shadow-color);
                            border: 4px solid var(--bg-secondary);">
                <p style="margin-top:16px; color: var(--text-secondary); font-size:14px;">
                    <i class="fas fa-info-circle"></i> Escanea el código para: ${text.length > 50 ? text.substring(0, 50) + '...' : text}
                </p>
            </div>
        `;

        // Guardar datos para descarga
        currentQrData = qrUrl;
        downloadQrBtn.style.display = 'inline-flex';
        
        App.updateStats('qrGenerated');
        App.showNotification('✅', 'QR generado correctamente');
    }

    // Descargar QR
    downloadQrBtn.addEventListener('click', function() {
        if (currentQrData) {
            // Crear un enlace de descarga
            const link = document.createElement('a');
            link.href = currentQrData;
            link.download = `qr-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            App.showNotification('📥', 'Descargando código QR...');
        }
    });

    // Cambiar color automáticamente
    qrColor.addEventListener('input', function() {
        if (qrInput.value.trim()) {
            generateQR();
        }
    });

    qrSize.addEventListener('change', function() {
        if (qrInput.value.trim()) {
            generateQR();
        }
    });
});
