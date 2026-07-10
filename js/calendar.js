// ===== CALENDARIO =====
document.addEventListener('DOMContentLoaded', function() {
    const currentMonthYear = document.getElementById('currentMonthYear');
    const calendarGrid = document.getElementById('calendarGrid');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const eventDate = document.getElementById('eventDate');
    const eventTitle = document.getElementById('eventTitle');
    const addEventBtn = document.getElementById('addEventBtn');
    const eventsList = document.getElementById('eventsList');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Cargar eventos guardados
    function getEvents() {
        return JSON.parse(localStorage.getItem('calendarEvents') || '{}');
    }

    function saveEvents(events) {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }

    // Renderizar calendario
    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const today = new Date();
        
        // Actualizar título
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        currentMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Días de la semana
        const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        
        let html = `<div style="display:grid; grid-template-columns:repeat(7,1fr); gap:4px; margin-bottom:8px;">
            ${weekDays.map(day => `
                <div style="text-align:center; font-weight:600; color: var(--text-secondary); 
                            font-size:13px; padding:8px 0;">
                    ${day}
                </div>
            `).join('')}
        </div>`;

        html += `<div style="display:grid; grid-template-columns:repeat(7,1fr); gap:4px;">`;
        
        // Días vacíos al inicio
        for (let i = 0; i < firstDay; i++) {
            html += `<div style="padding:8px; text-align:center;"></div>`;
        }

        const events = getEvents();
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dayStr = String(day).padStart(2, '0');
            const fullDate = `${dateKey}-${dayStr}`;
            const isToday = currentYear === today.getFullYear() && 
                           currentMonth === today.getMonth() && 
                           day === today.getDate();
            const hasEvent = events[fullDate] && events[fullDate].length > 0;

            html += `
                <div onclick="selectDate('${fullDate}')" 
                     style="
                        padding:8px 4px;
                        text-align:center;
                        background: ${isToday ? 'var(--gradient)' : 'var(--bg-secondary)'};
                        color: ${isToday ? 'white' : 'var(--text-primary)'};
                        border-radius: 8px;
                        cursor: pointer;
                        transition: var(--transition);
                        border: 2px solid ${hasEvent ? 'var(--primary-color)' : 'transparent'};
                        position: relative;
                        min-height: 40px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    "
                    onmouseover="this.style.transform='scale(1.05)'"
                    onmouseout="this.style.transform='scale(1)'"
                >
                    <span style="font-size:14px; font-weight:500;">${day}</span>
                    ${hasEvent ? `<span style="font-size:8px; color: var(--primary-color);">●</span>` : ''}
                </div>
            `;
        }

        html += `</div>`;
        calendarGrid.innerHTML = html;

        // Actualizar lista de eventos
        renderEvents();
    }

    // Seleccionar fecha
    window.selectDate = function(date) {
        eventDate.value = date;
        renderEvents();
    };

    // Renderizar eventos
    function renderEvents() {
        const events = getEvents();
        const selectedDate = eventDate.value;
        const eventsListElement = document.getElementById('eventsList');

        if (!selectedDate) {
            eventsListElement.innerHTML = '<li class="empty-events">Selecciona una fecha para ver eventos</li>';
            return;
        }

        const dayEvents = events[selectedDate] || [];
        if (dayEvents.length === 0) {
            eventsListElement.innerHTML = '<li class="empty-events">No hay eventos para esta fecha</li>';
            return;
        }

        eventsListElement.innerHTML = dayEvents.map((event, index) => `
            <li style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                padding:10px 14px;
                background: var(--bg-card);
                border-radius:8px;
                margin-bottom:6px;
                border-left: 4px solid var(--primary-color);
            ">
                <span style="color: var(--text-primary);">${event}</span>
                <button onclick="deleteEvent('${selectedDate}', ${index})" 
                        style="background:transparent; border:none; color:#FF6B6B; cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `).join('');
    }

    // Agregar evento
    addEventBtn.addEventListener('click', function() {
        const date = eventDate.value;
        const title = eventTitle.value.trim();

        if (!date) {
            App.showNotification('⚠️', 'Selecciona una fecha');
            return;
        }

        if (!title) {
            App.showNotification('⚠️', 'Ingresa un título para el evento');
            return;
        }

        const events = getEvents();
        if (!events[date]) events[date] = [];
        events[date].push(title);
        saveEvents(events);
        eventTitle.value = '';
        renderCalendar();
        App.updateStats('eventsCreated');
        App.showNotification('✅', 'Evento agregado correctamente');
    });

    // Eliminar evento
    window.deleteEvent = function(date, index) {
        const events = getEvents();
        if (events[date]) {
            events[date].splice(index, 1);
            if (events[date].length === 0) {
                delete events[date];
            }
            saveEvents(events);
            renderCalendar();
            App.showNotification('🗑️', 'Evento eliminado');
        }
    };

    // Cambiar mes
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // Inicializar
    renderCalendar();
    // Fecha por defecto = hoy
    const today = new Date();
    eventDate.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    renderEvents();
});
