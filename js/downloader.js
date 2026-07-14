<!-- ===== SELECTOR DE FORMATO ===== -->
<div class="format-selector" style="
    display: flex;
    gap: 12px;
    margin: 16px 0;
    padding: 12px 16px;
    background: var(--bg-input);
    border-radius: var(--radius-sm);
    align-items: center;
    flex-wrap: wrap;
">
    <label style="font-weight: 600; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;">
        <i class="fas fa-file"></i> Formato:
    </label>
    <button id="formatVideo" class="format-btn active" data-format="mp4" style="
        padding: 8px 20px;
        border: 2px solid var(--primary-color);
        border-radius: 8px;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
        font-weight: 600;
        transition: var(--transition);
        display: flex;
        align-items: center;
        gap: 6px;
    ">
        <i class="fas fa-video"></i> MP4 HD
    </button>
    <button id="formatAudio" class="format-btn" data-format="mp3" style="
        padding: 8px 20px;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-card);
        color: var(--text-primary);
        cursor: pointer;
        font-weight: 600;
        transition: var(--transition);
        display: flex;
        align-items: center;
        gap: 6px;
    ">
        <i class="fas fa-music"></i> MP3
    </button>
    
    <!-- 🔥 NUEVO: TEXTO QUE MUESTRA EL FORMATO SELECCIONADO -->
    <span id="formatLabel" style="
        margin-left: auto;
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-color);
        background: var(--bg-card);
        padding: 4px 14px;
        border-radius: 20px;
        border: 1px solid var(--border-color);
    ">
        Formato seleccionado: MP4 Video
    </span>
</div>
