// ===== BUSCADOR DE POKÉMON =====
// Desarrollado por Daniel

const POKEMON_API_BASE = 'https://api.delirius.online/tools/pokemon';

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Iniciando buscador de Pokémon...');
    
    // Obtener elementos del DOM
    const searchInput = document.getElementById('pokemonSearch');
    const searchBtn = document.getElementById('searchPokemonBtn');
    const resultContainer = document.getElementById('pokemonResult');

    // Verificar que los elementos existan
    if (!searchInput || !searchBtn || !resultContainer) {
        console.error('❌ No se encontraron los elementos del buscador de Pokémon');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div style="text-align:center; padding:40px; color: #FF6B6B;">
                    <i class="fas fa-exclamation-triangle" style="font-size:48px; display:block; margin-bottom:16px;"></i>
                    <p>Error: No se encontraron los elementos del buscador</p>
                </div>
            `;
        }
        return;
    }

    console.log('✅ Elementos de Pokémon encontrados');

    // ===== FUNCIÓN PARA BUSCAR POKÉMON =====
    window.searchPokemon = function() {
        const query = searchInput.value.trim();
        
        if (query === '') {
            App.showNotification('⚠️', 'Escribe el nombre de un Pokémon');
            return;
        }

        console.log(`🔍 Buscando Pokémon: "${query}"`);

        // Mostrar loading
        resultContainer.innerHTML = `
            <div style="text-align:center; padding:40px; color: var(--text-light);">
                <i class="fas fa-spinner fa-spin" style="font-size:48px; display:block; margin-bottom:16px; color: var(--primary-color);"></i>
                <p>Buscando a <strong>${query}</strong>...</p>
                <p style="font-size:12px; margin-top:8px;">📡 Usando API de Pokémon</p>
            </div>
        `;

        // Llamar a la API
        const apiUrl = `${POKEMON_API_BASE}?query=${encodeURIComponent(query)}&language=es`;
        console.log(`📡 Llamando a: ${apiUrl}`);

        fetch(apiUrl)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('📨 Datos recibidos:', data);
                
                if (!data.status || !data.data) {
                    throw new Error('No se encontró el Pokémon');
                }

                // Mostrar resultados
                mostrarPokemon(data.data);
                App.showNotification('⚡', `¡${data.data.name} encontrado!`);
            })
            .catch(error => {
                console.error('❌ Error:', error);
                resultContainer.innerHTML = `
                    <div style="text-align:center; padding:40px; color: var(--text-light);">
                        <i class="fas fa-exclamation-circle" style="font-size:48px; display:block; margin-bottom:16px; color: #FF6B6B;"></i>
                        <p>No se encontró ningún Pokémon con el nombre <strong>"${query}"</strong></p>
                        <p style="font-size:14px;">💡 Prueba con: Pikachu, Charizard, Mewtwo, Eevee</p>
                    </div>
                `;
                App.showNotification('❌', 'Pokémon no encontrado');
            });
    };

    // ===== FUNCIÓN PARA MOSTRAR POKÉMON =====
    function mostrarPokemon(pokemon) {
        const typesColors = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            electric: '#F8D030',
            grass: '#78C850',
            ice: '#98D8D8',
            fighting: '#C03028',
            poison: '#A040A0',
            ground: '#E0C068',
            flying: '#A890F0',
            psychic: '#F85888',
            bug: '#A8B820',
            rock: '#B8A038',
            ghost: '#705898',
            dark: '#705848',
            dragon: '#7038F8',
            steel: '#B8B8D0',
            fairy: '#EE99AC'
        };

        // Obtener colores de tipos
        const typeColors = pokemon.types.map(type => typesColors[type] || '#888888');
        const mainColor = typeColors[0] || '#6C63FF';

        // Formatear estadísticas
        const stats = pokemon.stats || {};
        const statNames = {
            hp: 'HP',
            attack: 'Ataque',
            defense: 'Defensa',
            'special-attack': 'Ataque Especial',
            'special-defense': 'Defensa Especial',
            speed: 'Velocidad'
        };

        // Generar HTML de estadísticas
        const statsHtml = Object.entries(stats).map(([key, value]) => `
            <div style="margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; font-size:13px; color: var(--text-secondary);">
                    <span>${statNames[key] || key}</span>
                    <span><strong>${value}</strong></span>
                </div>
                <div style="width:100%; height:6px; background: var(--bg-input); border-radius:3px; overflow:hidden;">
                    <div style="width:${Math.min(value / 1.5, 100)}%; height:100%; background: ${mainColor}; border-radius:3px;"></div>
                </div>
            </div>
        `).join('');

        // Generar HTML de movimientos (solo primeros 10)
        const movesHtml = (pokemon.moves || []).slice(0, 10).map(move => `
            <span style="
                background: var(--bg-input);
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                color: var(--text-secondary);
                border: 1px solid var(--border-color);
                display: inline-block;
                margin: 3px;
            ">
                ${move.replace(/-/g, ' ')}
            </span>
        `).join('');

        // Generar HTML de tipos
        const typesHtml = pokemon.types.map(type => `
            <span style="
                background: ${typesColors[type] || '#888'};
                color: white;
                padding: 4px 14px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
                text-transform: capitalize;
                display: inline-block;
                margin-right: 6px;
            ">
                ${type}
            </span>
        `).join('');

        resultContainer.innerHTML = `
            <div style="
                background: var(--bg-card);
                border-radius: var(--radius);
                padding: 28px;
                margin-top: 20px;
                border: 2px solid ${mainColor};
                box-shadow: 0 8px 40px var(--shadow-color);
                position: relative;
                overflow: hidden;
            ">
                <!-- Badge de ID -->
                <div style="
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: ${mainColor};
                    color: white;
                    padding: 6px 16px;
                    border-radius: 0 0 0 12px;
                    font-size: 13px;
                    font-weight: 700;
                ">
                    #${pokemon.id}
                </div>

                <div style="display:flex; gap:24px; flex-wrap:wrap; align-items:center;">
                    <!-- Imagen -->
                    <div style="flex:1; min-width:180px; text-align:center;">
                        <img src="${pokemon.image_animated || pokemon.image || pokemon.sprite}" 
                             alt="${pokemon.name}" 
                             style="max-width:200px; width:100%; image-rendering: pixelated; filter: drop-shadow(0 8px 20px rgba(0,0,0,0.2));">
                        ${pokemon.sprite ? `
                            <div style="margin-top:8px;">
                                <img src="${pokemon.sprite}" 
                                     alt="${pokemon.name} sprite" 
                                     style="width:64px; image-rendering: pixelated;">
                            </div>
                        ` : ''}
                    </div>

                    <!-- Información -->
                    <div style="flex:2; min-width:250px;">
                        <h2 style="color: ${mainColor}; font-size:28px; margin-bottom:4px; text-transform:capitalize;">
                            ${pokemon.name}
                        </h2>
                        
                        <div style="margin-bottom:12px;">
                            ${typesHtml}
                        </div>

                        <p style="color: var(--text-secondary); font-size:14px; margin-bottom:16px; line-height:1.6;">
                            ${pokemon.description || 'Sin descripción disponible.'}
                        </p>

                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px,1fr)); gap:8px; margin-bottom:16px; font-size:14px; color: var(--text-secondary);">
                            <div><strong>Altura:</strong> ${pokemon.height || 'N/A'}</div>
                            <div><strong>Peso:</strong> ${pokemon.weight || 'N/A'}</div>
                            <div><strong>Hábitat:</strong> ${pokemon.habitat || 'N/A'}</div>
                            <div><strong>Color:</strong> ${pokemon.color || 'N/A'}</div>
                            <div><strong>Captura:</strong> ${pokemon.capture_rate || 'N/A'}</div>
                            <div><strong>Género:</strong> ${pokemon.gender || 'N/A'}</div>
                        </div>

                        <!-- Estadísticas -->
                        <div style="margin-top:16px; padding:16px; background: var(--bg-input); border-radius: var(--radius-sm);">
                            <h4 style="margin-bottom:12px; color: var(--text-primary);">📊 Estadísticas</h4>
                            ${statsHtml}
                        </div>

                        <!-- Movimientos -->
                        ${movesHtml ? `
                            <div style="margin-top:16px;">
                                <h4 style="margin-bottom:8px; color: var(--text-primary);">⚔️ Movimientos</h4>
                                <div style="display:flex; flex-wrap:wrap; gap:4px;">
                                    ${movesHtml}
                                    ${pokemon.moves.length > 10 ? `<span style="font-size:12px; color: var(--text-light);">+${pokemon.moves.length - 10} más</span>` : ''}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Items -->
                        ${pokemon.held_items && pokemon.held_items.length > 0 ? `
                            <div style="margin-top:12px; font-size:13px; color: var(--text-secondary);">
                                <strong>🎒 Items:</strong> ${pokemon.held_items.join(', ')}
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Botón para escuchar el grito (cry) -->
                ${pokemon.cry ? `
                    <div style="text-align:center; margin-top:16px; padding-top:16px; border-top: 1px solid var(--border-color);">
                        <button onclick="playPokemonCry('${pokemon.cry}')" class="btn-secondary">
                            <i class="fas fa-volume-up"></i> Escuchar grito
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // ===== FUNCIÓN PARA REPRODUCIR GRITO =====
    window.playPokemonCry = function(cryUrl) {
        if (!cryUrl) {
            App.showNotification('⚠️', 'No hay grito disponible');
            return;
        }
        try {
            const audio = new Audio(cryUrl);
            audio.play().then(() => {
                App.showNotification('🔊', '¡Grito del Pokémon!');
            }).catch(err => {
                console.error('Error al reproducir:', err);
                App.showNotification('⚠️', 'No se pudo reproducir el grito');
            });
        } catch (err) {
            App.showNotification('⚠️', 'Error al reproducir el grito');
        }
    };

    // ===== EVENTOS =====
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🖱️ Click en buscar Pokémon');
        window.searchPokemon();
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('⌨️ Enter presionado en Pokémon');
            window.searchPokemon();
        }
    });

    // ===== EJEMPLO AL INICIAR =====
    // Cargar Pikachu como ejemplo
    setTimeout(() => {
        searchInput.placeholder = 'Ej: Pikachu, Charizard, Mewtwo...';
        // Opcional: cargar un Pokémon por defecto
        // searchPokemon('pikachu');
    }, 500);

    console.log('🎯 Buscador de Pokémon listo');
    console.log('📡 API:', POKEMON_API_BASE);
});
