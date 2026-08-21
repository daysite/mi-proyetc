// ===== GENERADOR DE ARTE IA =====
// Desarrollado por Ander

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Generador de Arte IA cargado');
    
    const generateBtn = document.getElementById('generateArtBtn');
    const promptInput = document.getElementById('artPrompt');
    const resultDiv = document.getElementById('artResult');
    const styleSelect = document.getElementById('artStyle');

    // Verificar que los elementos existen
    if (!generateBtn || !promptInput || !resultDiv) {
        console.warn('⚠️ Algunos elementos del generador de arte no existen');
        return;
    }

    generateBtn.addEventListener('click', function() {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            App.showNotification('⚠️', 'Describe la imagen que quieres crear');
            return;
        }

        const style = styleSelect ? styleSelect.value : 'realistic';
        
        resultDiv.innerHTML = `
            <div style="text-align:center; padding:40px; color: var(--text-light);">
                <i class="fas fa-spinner fa-spin" style="font-size:48px; display:block; margin-bottom:16px; color: var(--primary-color);"></i>
                <p>Generando imagen con IA...</p>
                <p style="font-size:14px;">Estilo: ${style}</p>
                <p style="font-size:12px; margin-top:8px;">Prompt: "${prompt}"</p>
            </div>
        `;

        // Aquí iría la integración con una API de IA (DALL-E, Stable Diffusion, etc.)
        // Por ahora, simulamos una respuesta
        setTimeout(() => {
            resultDiv.innerHTML = `
                <div style="text-align:center; padding:40px; color: var(--text-light);">
                    <i class="fas fa-image" style="font-size:48px; display:block; margin-bottom:16px; color: var(--primary-color);"></i>
                    <p>🎨 Imagen generada con IA</p>
                    <p style="font-size:14px;">Prompt: "${prompt}"</p>
                    <p style="font-size:12px; margin-top:8px; color: var(--text-light);">
                        💡 Conecta tu API de IA (DALL-E, Stable Diffusion) para generar imágenes reales
                    </p>
                    <div style="margin-top:16px; padding:20px; background: var(--bg-input); border-radius:8px; border: 2px dashed var(--border-color);">
                        <p style="font-size:48px;">🖼️</p>
                        <p style="font-size:14px;">[Imagen generada aparecería aquí]</p>
                    </div>
                </div>
            `;
            App.showNotification('🎨', 'Imagen generada (simulada)');
        }, 2000);
    });

    console.log('✅ Generador de Arte IA listo');
});
