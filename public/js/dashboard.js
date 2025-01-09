document.addEventListener('DOMContentLoaded', function() {
    let calendar;
    let selectedDate = null;
    const modal = new bootstrap.Modal(document.getElementById('birthdayModal'));

    // Initialize FullCalendar
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
        },
        dateClick: handleDateClick,
        eventClick: handleEventClick,
        events: '/api/birthdays', // Endpoint to fetch birthday events
        eventContent: renderEventContent,
        dayCellDidMount: function(arg) {
            // Highlight today's date
            if (arg.date.toDateString() === new Date().toDateString()) {
                arg.el.classList.add('today');
            }
        }
    });

    calendar.render();

    // Handle date clicks
    function handleDateClick(info) {
        selectedDate = info.dateStr;
        document.getElementById('selectedDate').value = selectedDate;
        fetchBirthdays(selectedDate);
        modal.show();
    }

    // Handle event clicks
    function handleEventClick(info) {
        selectedDate = info.event.startStr;
        document.getElementById('selectedDate').value = selectedDate;
        fetchBirthdays(selectedDate);
        modal.show();
    }

    // Custom event rendering
    function renderEventContent(eventInfo) {
        return {
            html: `<div class="fc-event-title">
                    🎂 ${eventInfo.event.title}
                   </div>`
        };
    }

    // Fetch birthdays for selected date
    async function fetchBirthdays(date) {
        try {
            const response = await fetch(`/api/birthdays/${date}`);
            const birthdays = await response.json();
            displayBirthdays(birthdays);
        } catch (error) {
            console.error('Error fetching birthdays:', error);
        }
    }

    // Display birthdays in modal
    function displayBirthdays(birthdays) {
        const birthdaysList = document.getElementById('birthdaysList');
        birthdaysList.innerHTML = '';

        if (birthdays.length === 0) {
            birthdaysList.innerHTML = '<p>No birthdays on this date</p>';
            return;
        }

        birthdays.forEach(birthday => {
            const div = document.createElement('div');
            div.className = 'birthday-item';
            div.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${birthday.name}</strong>
                        <div class="text-muted">${birthday.relationship}</div>
                    </div>
                    <div>
                        <i class="fas fa-edit edit-birthday-btn" 
                           onclick="editBirthday(${birthday.id})"></i>
                    </div>
                </div>
            `;
            birthdaysList.appendChild(div);
        });
    }

    // Save birthday
    document.getElementById('saveBirthday').addEventListener('click', async () => {
        const formData = new FormData(document.getElementById('birthdayForm'));
        try {
            const response = await fetch('/api/birthdays', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            if (response.ok) {
                calendar.refetchEvents();
                modal.hide();
                // Show success message
            }
        } catch (error) {
            console.error('Error saving birthday:', error);
        }
    });
}); 