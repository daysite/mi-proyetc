// ===== ASISTENTE IA CON API RIPLEAI =====
// Desarrollado por Daniel

// 🔥 API CORRECTA PARA CHAT
const AI_API_BASE = 'https://api.delirius.online/ia/ripleai';

// Personalidad del asistente
const AI_PERSONALITY = `Eres una inteligencia artificial llamada "RipleAI" creada por Daniel. 
Tu personalidad es amigable, servicial y profesional. Te presentas como: 
"👋 ¡Hola! Soy RipleAI, tu asistente inteligente creado por Daniel. Estoy aquí para ayudarte con lo que necesites, desde responder preguntas hasta generar ideas o resolver problemas. ¿En qué puedo asistirte hoy?".
Siempre respondes en español, a menos que te pregunten en otro idioma. 
Eres extremadamente útil, positivo y das respuestas detalladas pero concisas.`;

document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendChatBtn');

    // Verificar elementos
    if (!chatMessages || !chatInput || !sendBtn) {
        console.error('❌ No se encontraron los elementos del chat');
        return;
    }

    // Mensaje de bienvenida con personalidad
    const welcomeMessage = `👋 ¡Hola! Soy **RipleAI**, tu asistente inteligente creado por **Daniel**. 

Estoy aquí para ayudarte con lo que necesites:
- 📝 Responder preguntas
- 💡 Generar ideas creativas
- 🔍 Resolver problemas
- 📚 Explicar conceptos

¿En qué puedo asistirte hoy?`;

    // Agregar mensaje de bienvenida
    addMessage('bot', welcomeMessage);

    // ===== FUNCIÓN PARA ENVIAR MENSAJE =====
    window.sendMessage = function() {
        const message = chatInput.value.trim();
        if (!message) {
            App.showNotification('⚠️', 'Escribe un mensaje primero');
            return;
        }

        // Agregar mensaje del usuario
        addMessage('user', message);
        chatInput.value = '';

        // Mostrar indicador de escritura
        const typingId = addTypingIndicator();

        // Llamar a la API
        const apiUrl = `${AI_API_BASE}?query=${encodeURIComponent(message)}`;
        console.log(`📡 Llamando a: ${apiUrl}`);

        fetch(apiUrl)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                removeTypingIndicator(typingId);
                console.log('📨 Respuesta:', data);

                if (!data.status || !data.data || !data.data.result) {
                    throw new Error('La API no devolvió una respuesta válida');
                }

                // Agregar respuesta del bot
                addMessage('bot', data.data.result);
                App.updateStats('aiRequests');
            })
            .catch(error => {
                removeTypingIndicator(typingId);
                console.error('❌ Error:', error);
                const errorMsg = error.message.includes('Failed to fetch') 
                    ? '⚠️ No pude conectar con el servidor. Verifica tu conexión a internet.' 
                    : `❌ Error: ${error.message}`;
                addMessage('bot', errorMsg);
                App.showNotification('❌', 'Error al comunicarse con la IA');
            });
    };

    // ===== FUNCIÓN PARA AGREGAR MENSAJE =====
    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        // Formatear contenido (negritas, listas, etc.)
        let formattedContent = content;
        if (type === 'bot') {
            formattedContent = formatBotMessage(content);
        }

        const avatar = type === 'user' 
            ? `<div class="message-avatar" style="background: var(--primary-color); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i class="fas fa-user"></i>
               </div>`
            : `<div class="message-avatar" style="background: var(--secondary-color); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i class="fas fa-robot"></i>
               </div>`;

        messageDiv.innerHTML = `
            ${avatar}
            <div class="message-content">${formattedContent}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ===== FORMATEAR MENSAJE DEL BOT =====
    function formatBotMessage(content) {
        let html = content;
        
        // Reemplazar saltos de línea
        html = html.replace(/\n/g, '<br>');
        
        // Negritas: **texto** -> <strong>texto</strong>
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Código: `texto` -> <code>texto</code>
        html = html.replace(/`([^`]+)`/g, '<code style="background: var(--bg-input); padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>');
        
        // Listas: - item o * item -> <li>item</li>
        html = html.replace(/^[\s]*[-*]\s+(.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul style="margin: 8px 0; padding-left: 20px;">$1</ul>');
        
        return html;
    }

    // ===== INDICADOR DE ESCRITURA =====
    function addTypingIndicator() {
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'message bot typing-indicator';
        div.innerHTML = `
            <div class="message-avatar" style="background: var(--secondary-color); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i class="fas fa-robot"></i>
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

    // ===== COMANDOS RÁPIDOS =====
    window.insertCommand = function(command) {
        chatInput.value = command;
        chatInput.focus();
        // Colocar cursor al final
        const length = chatInput.value.length;
        chatInput.setSelectionRange(length, length);
    };

    // ===== EVENTOS =====
    sendBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.sendMessage();
    });

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            window.sendMessage();
        }
    });

    console.log('🤖 Asistente IA con API RipleyAI iniciado');
    console.log('📡 API:', AI_API_BASE);
    console.log('👤 Personalidad: Creado por Daniel');
});

// Estilos adicionales para el chat
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
        30% { transform: translateY(-5px); opacity: 1; }
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
        padding: 12px 16px;
        max-width: 80%;
        word-wrap: break-word;
    }
    
    .message.bot .message-content {
        background: var(--bg-card);
        color: var(--text-primary);
        border-radius: 4px 12px 12px 12px;
        padding: 12px 16px;
        max-width: 80%;
        word-wrap: break-word;
        border: 1px solid var(--border-color);
    }
    
    .message-content ul {
        margin: 8px 0;
        padding-left: 20px;
    }
    
    .message-content li {
        margin: 4px 0;
    }
`;
document.head.appendChild(style);
