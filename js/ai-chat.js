// ===== ASISTENTE IA =====
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendChatBtn');

    // Insertar comando rápido
    window.insertCommand = function(command) {
        chatInput.value = command;
        chatInput.focus();
        // Colocar cursor al final
        const length = chatInput.value.length;
        chatInput.setSelectionRange(length, length);
    };

    // Enviar mensaje
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Agregar mensaje del usuario
        addMessage('user', message);
        chatInput.value = '';

        // Mostrar indicador de escritura
        const typingId = addTypingIndicator();

        // Procesar mensaje
        setTimeout(() => {
            removeTypingIndicator(typingId);
            const response = processAICommand(message);
            addMessage('bot', response);
            App.updateStats('aiRequests');
        }, 500 + Math.random() * 1000);
    }

    // Agregar mensaje al chat
    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const avatar = type === 'user' ? 
            '<i class="fas fa-user" style="background: var(--primary-color); padding:8px; border-radius:50%; color:white;"></i>' :
            '<i class="fas fa-robot" style="background: var(--secondary-color); padding:8px; border-radius:50%; color:white;"></i>';

        // Procesar contenido (links, formato)
        let formattedContent = content;
        if (type === 'bot') {
            formattedContent = formatBotMessage(content);
        }

        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${formattedContent}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Formatear mensajes del bot
    function formatBotMessage(content) {
        // Reemplazar saltos de línea
        let html = content.replace(/\n/g, '<br>');
        
        // Resaltar código
        html = html.replace(/`([^`]+)`/g, '<code style="background: var(--bg-primary); padding:2px 6px; border-radius:4px; font-family: monospace;">$1</code>');
        
        // Resaltar negritas
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        return html;
    }

    // Indicador de escritura
    function addTypingIndicator() {
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'message bot typing-indicator';
        div.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot" style="background: var(--secondary-color); padding:8px; border-radius:50%; color:white;"></i>
            </div>
            <div class="message-content">
                <div style="display:flex; gap:4px; padding: 8px 0;">
                    <span style="animation: bounce 1.4s infinite; font-size:20px;">•</span>
                    <span style="animation: bounce 1.4s infinite 0.2s; font-size:20px;">•</span>
                    <span style="animation: bounce 1.4s infinite 0.4s; font-size:20px;">•</span>
                </div>
            </div>
        `;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeTypingIndicator(id) {
        const element = document.getElementById(id);
        if (element) element.remove();
    }

    // PROCESAR COMANDOS IA
    function processAICommand(input) {
        const lower = input.toLowerCase();
        
        // Comando: /imagen
        if (lower.startsWith('/imagen ')) {
            const prompt = input.substring(8).trim();
            return `🎨 **Generando imagen con IA**\n\nDescripción: "${prompt}"\n\n_Estilo sugerido: Realista_\n\n⏳ La imagen se generará en unos segundos. (Conecta tu API de DALL-E o Stable Diffusion para imágenes reales)`;
        }
        
        // Comando: /resumir
        if (lower.startsWith('/resumir ')) {
            const text = input.substring(9).trim();
            if (text.length < 50) {
                return '📝 Por favor, proporciona un texto más largo para resumir (mínimo 50 caracteres).';
            }
            return `📝 **Resumen del texto**\n\n"${text.substring(0, 100)}..."\n\n🔍 *Este es un resumen automático generado por IA.*\n\n✅ Ideas principales:\n• Punto 1\n• Punto 2\n• Punto 3\n\n_Conecta tu API de OpenAI para resúmenes reales._`;
        }
        
        // Comando: /traducir
        if (lower.startsWith('/traducir ')) {
            const parts = input.substring(10).split(' a ');
            if (parts.length < 2) {
                return '🌍 Uso: `/traducir [texto] a [idioma]`\n\nEjemplo: `/traducir Hello world a español`';
            }
            return `🌍 **Traducción**\n\nTexto: "${parts[0].trim()}"\nIdioma: ${parts[1].trim()}\n\n_Traducción: [Texto traducido aquí]_\n\n_Conecta tu API de traducción para resultados reales._`;
        }
        
        // Comando: /idea
        if (lower.startsWith('/idea ')) {
            const topic = input.substring(6).trim();
            return `💡 **Ideas creativas sobre: ${topic}**\n\n1️⃣ Idea principal\n2️⃣ Concepto alternativo\n3️⃣ Enfoque innovador\n\n_Conecta tu API de IA para generar ideas más creativas._`;
        }

        // Comando: ayuda
        if (lower === '/ayuda' || lower === '/help') {
            return `🤖 **Comandos disponibles:**\n\n` +
                   `📌 **/imagen** [descripción] - Generar imagen\n` +
                   `📌 **/resumir** [texto] - Resumir texto\n` +
                   `📌 **/traducir** [texto] a [idioma] - Traducir\n` +
                   `📌 **/idea** [tema] - Generar ideas\n` +
                   `📌 **/ayuda** - Mostrar esta ayuda\n\n` +
                   `💬 También puedes preguntarme lo que quieras.`;
        }

        // Respuesta normal (Chat)
        return `🤔 **Interesante pregunta**\n\n` +
               `*Procesando tu consulta...*\n\n` +
               `💡 Basado en mi conocimiento, te recomiendo:\n` +
               `• Investigar más sobre el tema\n` +
               `• Consultar fuentes confiables\n` +
               `• Analizar diferentes perspectivas\n\n` +
               `_Conecta tu API de OpenAI para respuestas más precisas._\n\n` +
               `📝 **Tip:** Usa /ayuda para ver todos los comandos.`;
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Estilos para el chat
    const style = document.createElement('style');
    style.textContent = `
        .chat-messages {
            max-height: 500px;
            overflow-y: auto;
            padding: 16px;
            background: var(--bg-secondary);
            border-radius: var(--radius);
            border: 1px solid var(--border-color);
            margin-bottom: 16px;
        }
        
        .message {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
            animation: fadeIn 0.3s ease;
        }
        
        .message.user {
            flex-direction: row-reverse;
        }
        
        .message.user .message-content {
            background: var(--gradient);
            color: white;
            border-radius: 12px 4px 12px 12px;
        }
        
        .message.bot .message-content {
            background: var(--bg-card);
            color: var(--text-primary);
            border-radius: 4px 12px 12px 12px;
            border: 1px solid var(--border-color);
        }
        
        .message-content {
            padding: 12px 16px;
            max-width: 80%;
            word-wrap: break-word;
        }
        
        .message-content ul {
            margin: 8px 0;
            padding-left: 20px;
        }
        
        .message-content li {
            margin: 4px 0;
        }
        
        .chat-input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
        }
        
        .chat-input-group input {
            flex: 1;
        }
        
        .quick-commands {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .quick-commands button {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            cursor: pointer;
            transition: var(--transition);
            color: var(--text-secondary);
        }
        
        .quick-commands button:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
            transform: translateY(-2px);
        }
        
        @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
            30% { transform: translateY(-5px); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
