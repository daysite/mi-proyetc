// ===== ESTADÍSTICAS =====
document.addEventListener('DOMContentLoaded', function() {
    function updateAllStats() {
        const stats = App.getStats();
        
        document.getElementById('totalDownloads').textContent = stats.downloads || 0;
        document.getElementById('todayDownloads').textContent = calculateTodayDownloads();
        document.getElementById('aiRequests').textContent = stats.aiRequests || 0;
        document.getElementById('qrGenerated').textContent = stats.qrGenerated || 0;
        document.getElementById('musicSearches').textContent = stats.musicSearches || 0;
        document.getElementById('eventsCreated').textContent = stats.eventsCreated || 0;
    }

    function calculateTodayDownloads() {
        // Obtener historial de descargas de hoy
        const history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
        const today = new Date().toDateString();
        const todayDownloads = history.filter(item => {
            const itemDate = new Date(item.date).toDateString();
            return itemDate === today;
        });
        return todayDownloads.length;
    }

    // Actualizar estadísticas cada 30 segundos
    updateAllStats();
    setInterval(updateAllStats, 30000);

    // Actualizar cuando se cambia de pestaña
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            updateAllStats();
        }
    });

    // También actualizar cuando la página se muestra
    window.addEventListener('focus', updateAllStats);
});
