// ===== APP PRINCIPAL =====
const App = {
    // Configuración
    config: {
        theme: localStorage.getItem('theme') || 'light',
    },

    // Inicializar
    init() {
        this.loadTheme();
        this.setupEventListeners();
        console.log('🚀 Utility Hub iniciado correctamente');
        console.log('📱 Modo actual:', this.config.theme);
    },

    // Cargar tema
    loadTheme() {
        const theme = this.config.theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Guardar en localStorage
        localStorage.setItem('theme', theme);
        console.log('🎨 Tema cargado:', theme);
    },

    // Cambiar tema
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Actualizar icono
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        this.config.theme = newTheme;
        console.log('🎨 Tema cambiado a:', newTheme);
        
        // Animación suave
        document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    },

    // Event listeners globales
    setupEventListeners() {
        // Toggle tema
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Notificaciones
        const notifBtn = document.getElementById('notifications');
        if (notifBtn) {
            notifBtn.addEventListener('click', () => {
                this.showNotification('🔔', '¡Tienes 3 notificaciones nuevas!');
            });
        }
    },

    // Mostrar notificación
    showNotification(icon, message) {
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div style="display:flex; align-items:center; gap:14px; 
                 background: var(--bg-card); padding:16px 24px; 
                 border-radius: var(--radius); 
                 box-shadow: 0 8px 40px var(--shadow-color);
                 border-left: 4px solid var(--primary-color);
                 backdrop-filter: blur(20px);
                 -webkit-backdrop-filter: blur(20px);
                 min-width: 280px;
                 border: 1px solid var(--border-color);">
                <span style="font-size:28px;">${icon}</span>
                <span style="color: var(--text-primary); font-weight: 500; flex:1;">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background:transparent; border:none; color:var(--text-light); 
                               cursor:pointer; font-size:22px; padding:0 4px;">×</button>
            </div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) toast.remove();
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

// Exponer App globalmente
window.App = App;
