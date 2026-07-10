// ===== BUSCADOR DE MÚSICA =====
document.addEventListener('DOMContentLoaded', function() {
    const musicSearch = document.getElementById('musicSearch');
    const searchBtn = document.getElementById('searchMusicBtn');
    const resultsDiv = document.getElementById('musicResults');

    // Ejemplos de canciones (simulación)
    const mockSongs = [
        { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', year: 1975, preview: '#', cover: 'https://picsum.photos/seed/queen/200/200' },
        { title: 'Imagine', artist: 'John Lennon', album: 'Imagine', year: 1971, preview: '#', cover: 'https://picsum.photos/seed/lennon/200/200' },
        { title: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', year: 1982, preview: '#', cover: 'https://picsum.photos/seed/jackson/200/200' },
        { title: 'Yesterday', artist: 'The Beatles', album: 'Help!', year: 1965, preview: '#', cover: 'https://picsum.photos/seed/beatles/200/200' },
        { title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)', year: 2017, preview: '#', cover: 'https://picsum.photos/seed/edsheeran/200/200' },
        { title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', album: 'Despacito', year: 2017, preview: '#', cover: 'https://picsum.photos/seed/despacito/200/200' },
        { title: 'Havana', artist: 'Camila Cabello', album: 'Camila', year: 2018, preview: '#', cover: 'https://picsum.photos/seed/havana/200/200' },
    ];

    searchBtn.addEventListener('click', searchMusic);
    musicSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchMusic();
    });

    function searchMusic() {
        const query = musicSearch.value.trim().toLowerCase();
        if (!query) {
            App.showNotification('🔍', 'Ingresa el nombre de una canción o artista');
            return;
        }

        // Simular búsqueda (reemplazar con API real)
        resultsDiv.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner"></i>
                <p>Buscando "${query}"...</p>
            </div>
        `;

        setTimeout(() => {
            // Filtrar canciones (simulación)
            const results = mockSongs.filter(song => 
                song.title.toLowerCase().includes(query) || 
                song.artist.toLowerCase().includes(query)
            );

            if (results.length === 0) {
                resultsDiv.innerHTML = `
                    <div style="text-align:center; padding:40px; color: var(--text-light);">
                        <i class="fas fa-music" style="font-size:48px; display:block; margin-bottom:16px;"></i>
                        <p>No se encontraron canciones para "${query}"</p>
                        <p style="font-size:14px;">Intenta con otra búsqueda</p>
                    </div>
                `;
                return;
            }

            // Mostrar resultados
            resultsDiv.innerHTML = results.map(song => `
                <div style="
                    background: var(--bg-card);
                    border-radius: var(--radius);
                    padding: 16px;
                    display: flex;
                    gap: 16px;
                    align-items: center;
                    margin-bottom: 12px;
                    border: 1px solid var(--border-color);
                    transition: var(--transition);
                    cursor: pointer;
                " onclick="playPreview('${song.preview}')">
                    <img src="${song.cover}" alt="${song.title}" 
                         style="width:60px; height:60px; border-radius:8px; object-fit:cover;">
                    <div style="flex:1;">
                        <h4 style="color: var(--text-primary);">${song.title}</h4>
                        <p style="color: var(--text-secondary); font-size:14px;">
                            ${song.artist} • ${song.album} (${song.year})
                        </p>
                    </div>
                    <button class="btn-primary" style="padding:8px 16px; font-size:13px;" 
                            onclick="event.stopPropagation(); playPreview('${song.preview}')">
                        <i class="fas fa-play"></i> Preview
                    </button>
                </div>
            `).join('');

            App.updateStats('musicSearches');
            App.showNotification('🎵', `Encontradas ${results.length} canciones`);
        }, 1000);
    }

    // Reproducir preview
    window.playPreview = function(url) {
        App.showNotification('🎵', 'Reproduciendo preview... (Conecta tu API de música)');
        // Aquí iría la integración con una API de música real
        // Ejemplo: window.open(url, '_blank');
    };
});
