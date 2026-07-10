// ===== CONTROL DE PESTAÑAS =====
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    // Función para cambiar de pestaña
    function switchTab(tabId) {
        // Ocultar todos los paneles
        panels.forEach(panel => {
            panel.classList.remove('active');
        });

        // Desactivar todos los botones
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });

        // Activar el panel seleccionado
        const activePanel = document.getElementById(tabId);
        if (activePanel) {
            activePanel.classList.add('active');
        }

        // Activar el botón seleccionado
        const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            // Scroll al elemento visible
            activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }

        // Guardar en localStorage
        localStorage.setItem('activeTab', tabId);
    }

    // Event listeners para cada pestaña
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });

        // También soporte para touch
        tab.addEventListener('touchstart', function(e) {
            // Pequeño delay para evitar conflictos
            setTimeout(() => {
                const tabId = this.getAttribute('data-tab');
                switchTab(tabId);
            }, 50);
        });
    });

    // Recuperar última pestaña activa
    const lastTab = localStorage.getItem('activeTab');
    if (lastTab && document.getElementById(lastTab)) {
        switchTab(lastTab);
    } else {
        // Si no hay última pestaña, mostrar la primera
        const firstTab = document.querySelector('.tab-btn');
        if (firstTab) {
            switchTab(firstTab.getAttribute('data-tab'));
        }
    }
});
