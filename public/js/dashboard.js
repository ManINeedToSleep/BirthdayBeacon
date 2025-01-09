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
        events: '/dashboard/api/birthdays', // Endpoint to fetch birthday events
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
            const response = await fetch(`/dashboard/api/birthdays/${date}`);
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
            div.className = 'birthday-item mb-3';
            div.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${birthday.name}</strong>
                        <div class="text-muted">${birthday.email}</div>
                        ${birthday.relationship ? `<div class="text-muted">Relationship: ${birthday.relationship}</div>` : ''}
                    </div>
                </div>
            `;
            birthdaysList.appendChild(div);
        });
        
        // Debug log to see what data we're receiving
        console.log('Birthday data:', birthdays);
    }

    // Add this function to populate friends dropdown
    async function loadAvailableFriends() {
        try {
            const response = await fetch('/dashboard/api/available-friends');
            const friends = await response.json();
            const friendSelect = document.getElementById('friendId');
            friendSelect.innerHTML = '<option value="">Select Friend</option>';
            friends.forEach(friend => {
                const option = document.createElement('option');
                option.value = friend.id;
                option.textContent = friend.username;
                friendSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading friends:', error);
        }
    }

    // Call this when the modal is shown
    document.getElementById('birthdayModal').addEventListener('show.bs.modal', loadAvailableFriends);

    // Update the save birthday handler
    document.getElementById('saveBirthday').addEventListener('click', async () => {
        const formData = new FormData(document.getElementById('birthdayForm'));
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/dashboard/api/birthdays', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    friendId: data.friendId,
                    dateOfBirth: data.dateOfBirth,
                    relationship: data.relationship,
                    description: data.notes
                })
            });

            if (response.ok) {
                calendar.refetchEvents();
                modal.hide();
                // Show success message
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                // Show error message to user
            }
        } catch (error) {
            console.error('Error saving birthday:', error);
        }
    });
}); 