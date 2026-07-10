// ===== NOTICIAS =====
document.addEventListener('DOMContentLoaded', function() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const newsResults = document.getElementById('newsResults');

    // Noticias simuladas (reemplazar con API real)
    const mockNews = {
        general: [
            { title: 'La economía global muestra signos de recuperación', description: 'Los mercados financieros reaccionan positivamente a los nuevos datos económicos.', source: 'Reuters', image: 'https://picsum.photos/seed/economy/400/250' },
            { title: 'Nuevo avance en la investigación del cáncer', description: 'Científicos descubren un tratamiento prometedor en fase de pruebas.', source: 'BBC News', image: 'https://picsum.photos/seed/cancer/400/250' },
            { title: 'Cambio climático: récords de temperatura en el Ártico', description: 'Las temperaturas en el Ártico alcanzan niveles sin precedentes.', source: 'National Geographic', image: 'https://picsum.photos/seed/arctic/400/250' },
        ],
        technology: [
            { title: 'Apple presenta su nuevo dispositivo revolucionario', description: 'El nuevo producto promete cambiar la forma en que usamos la tecnología.', source: 'TechCrunch', image: 'https://picsum.photos/seed/apple/400/250' },
            { title: 'Inteligencia Artificial supera a humanos en pruebas', description: 'Nuevo modelo de IA logra resultados sorprendentes en pruebas cognitivas.', source: 'MIT Tech Review', image: 'https://picsum.photos/seed/ai/400/250' },
            { title: 'El futuro del 5G en Latinoamérica', description: 'La expansión de la red 5G promete revolucionar la conectividad.', source: 'El País', image: 'https://picsum.photos/seed/5g/400/250' },
        ],
        business: [
            { title: 'Startup peruana levanta inversión millonaria', description: 'La empresa de tecnología logra financiamiento para su expansión internacional.', source: 'Bloomberg', image: 'https://picsum.photos/seed/startup/400/250' },
            { title: 'Nuevas tendencias en el mercado bursátil', description: 'Los inversores se vuelcan hacia sectores sostenibles.', source: 'Financial Times', image: 'https://picsum.photos/seed/stocks/400/250' },
        ],
        sports: [
            { title: 'Mundial de Fútbol: emocionante final', description: 'El partido decisivo mantuvo a los aficionados al borde de sus asientos.', source: 'ESPN', image: 'https://picsum.photos/seed/worldcup/400/250' },
            { title: 'Récord mundial en atletismo', description: 'Atleta rompe récord que parecía imbatible.', source: 'Sports Illustrated', image: 'https://picsum.photos/seed/athletics/400/250' },
        ],
        entertainment: [
            { title: 'Película latina arrasa en los premios', description: 'El cine latinoamericano obtiene reconocimiento internacional.', source: 'Variety', image: 'https://picsum.photos/seed/movie/400/250' },
            { title: 'Concierto benéfico reúne a grandes artistas', description: 'Estrellas de la música se unen por una causa importante.', source: 'Billboard', image: 'https://picsum.photos/seed/concert/400/250' },
        ],
        science: [
            { title: 'Descubren nuevo planeta habitable', description: 'Astrónomos encuentran un planeta con condiciones similares a la Tierra.', source: 'NASA', image: 'https://picsum.photos/seed/planet/400/250' },
            { title: 'Avances en medicina regenerativa', description: 'Nuevas técnicas prometen revolucionar los tratamientos médicos.', source: 'Science Daily', image: 'https://picsum.photos/seed/medicine/400/250' },
        ]
    };

    let currentCategory = 'general';

    // Cargar noticias
    function loadNews(category) {
        const news = mockNews[category] || mockNews.general;
        
        if (news.length === 0) {
            newsResults.innerHTML = `
                <div style="text-align:center; padding:40px; color: var(--text-light);">
                    <i class="fas fa-newspaper" style="font-size:48px; display:block; margin-bottom:16px;"></i>
                    <p>No hay noticias disponibles para esta categoría</p>
                </div>
            `;
            return;
        }

        newsResults.innerHTML = news.map(item => `
            <div style="
                background: var(--bg-card);
                border-radius: var(--radius);
                overflow: hidden;
                border: 1px solid var(--border-color);
                transition: var(--transition);
                cursor: pointer;
            " onclick="openNews('${item.title}')">
                <img src="${item.image}" alt="${item.title}" 
                     style="width:100%; height:160px; object-fit:cover;">
                <div style="padding:16px;">
                    <h4 style="color: var(--text-primary); font-size:16px; margin-bottom:8px;">
                        ${item.title}
                    </h4>
                    <p style="color: var(--text-secondary); font-size:14px; margin-bottom:8px;">
                        ${item.description.substring(0, 100)}...
                    </p>
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px;">
                        <span style="color: var(--text-light);">${item.source}</span>
                        <span style="color: var(--primary-color);">Leer más →</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Abrir noticia
    window.openNews = function(title) {
        App.showNotification('📰', `Abriendo: ${title.substring(0, 30)}...`);
        // Aquí iría la navegación a la noticia completa
    };

    // Categorías
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            loadNews(currentCategory);
            App.showNotification('📰', `Cargando noticias de ${currentCategory}`);
        });
    });

    // Cargar noticias iniciales
    loadNews('general');
});
