// ===== APP PRINCIPAL =====
const App = {
    // Configuración
    config: {
        theme: localStorage.getItem('theme') || 'light',
        apiKeys: {
            // Aquí irían tus API keys
            // news: 'TU_API_KEY_DE_NEWS',
            // weather: 'TU_API_KEY_DE_WEATHER',
            // currency: 'TU_API_KEY_DE_CURRENCY'
        }
    },

    // Inicializar
    init() {
        this.loadTheme();
        this.setupEventListeners();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 60000);
        console.log('🚀 Utility Hub iniciado correctamente');
    },

    // Cargar tema
    loadTheme() {
        const theme = this.config.theme;
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    },

    // Cambiar tema
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.loadTheme();
        
        // Animación
        document.body.style.transition = 'background 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    },

    // Actualizar fecha y hora
    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const dateString = now.toLocaleDateString('es-ES', options);
        // Puedes mostrar esto donde quieras
    },

    // Event listeners globales
    setupEventListeners() {
        // Toggle tema
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Notificaciones
        document.getElementById('notifications')?.addEventListener('click', () => {
            this.showNotification('🔔', '¡Tienes 3 notificaciones nuevas!');
        });

        // Cerrar notificaciones automáticamente
        document.addEventListener('click', (e) => {
            const toast = document.querySelector('.toast-notification');
            if (toast && !toast.contains(e.target)) {
                toast.remove();
            }
        });
    },

    // Mostrar notificación
    showNotification(icon, message) {
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px; 
                 background: var(--bg-card); padding:16px 24px; 
                 border-radius:12px; box-shadow: 0 8px 30px var(--shadow-color);
                 border-left: 4px solid var(--primary-color);
                 position: fixed; bottom:24px; right:24px; z-index:9999;
                 animation: slideIn 0.3s ease; max-width: 400px;">
                <span style="font-size:24px;">${icon}</span>
                <span style="color: var(--text-primary);">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background:transparent; border:none; color:var(--text-light); 
                               cursor:pointer; font-size:18px;">×</button>
            </div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    },

    // Guardar estadísticas
    updateStats(type) {
        const stats = JSON.parse(localStorage.getItem('appStats') || '{}');
        stats[type] = (stats[type] || 0) + 1;
        stats.lastUpdate = new Date().toISOString();
        localStorage.setItem('appStats', JSON.stringify(stats));
    },

    // Obtener estadísticas
    getStats() {
        return JSON.parse(localStorage.getItem('appStats') || '{}');
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Estilos para toast (se agregan dinámicamente)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
