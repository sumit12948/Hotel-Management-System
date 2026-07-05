// Dashboard specific functionality

class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.loadDashboardData();
        this.setupEventListeners();
        this.updateRealTimeData();
    }

    setupEventListeners() {
        // View all bookings button
        const viewAllBtn = document.getElementById('view-all-bookings');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                window.location.href = 'pages/bookings.html';
            });
        }

        // Quick action buttons
        this.setupQuickActions();
    }

    setupQuickActions() {
        const actions = document.querySelectorAll('.action-btn');
        actions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.action-btn').dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    handleQuickAction(action) {
        switch(action) {
            case 'checkin':
                window.hotelManager.showNotification('Check-in modal opened', 'info');
                break;
            case 'checkout':
                window.hotelManager.showNotification('Check-out modal opened', 'info');
                break;
            case 'new-booking':
                window.location.href = 'pages/bookings.html?new=true';
                break;
            case 'room-service':
                window.hotelManager.showNotification('Room service requested', 'success');
                break;
        }
    }

    loadDashboardData() {
        // Simulate API call to load dashboard data
        setTimeout(() => {
            const dashboardData = {
                totalRooms: 45,
                occupiedRooms: 32,
                availableRooms: 10,
                maintenanceRooms: 3,
                checkinsToday: 8,
                checkoutsToday: 5,
                revenue: 12540,
                recentBookings: [
                    {
                        id: 'BK001',
                        guest: 'John Smith',
                        room: '101',
                        checkin: '2023-10-15',
                        checkout: '2023-10-18',
                        status: 'occupied'
                    },
                    {
                        id: 'BK002',
                        guest: 'Emma Johnson',
                        room: '205',
                        checkin: '2023-10-16',
                        checkout: '2023-10-20',
                        status: 'confirmed'
                    },
                    {
                        id: 'BK003',
                        guest: 'Michael Brown',
                        room: '312',
                        checkin: '2023-10-17',
                        checkout: '2023-10-19',
                        status: 'confirmed'
                    }
                ]
            };

            this.updateDashboardUI(dashboardData);
        }, 1000);
    }

    updateDashboardUI(data) {
        // Update cards
        document.getElementById('total-rooms').textContent = data.totalRooms;
        document.getElementById('occupied-rooms').textContent = data.occupiedRooms;
        document.getElementById('checkins-today').textContent = data.checkinsToday;
        document.getElementById('revenue').textContent = `$${data.revenue.toLocaleString()}`;

        // Update bookings table
        this.renderBookingsTable(data.recentBookings);
    }

    renderBookingsTable(bookings) {
        const tableContainer = document.getElementById('bookings-table');
        if (!tableContainer) return;

        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Guest Name</th>
                        <th>Room No</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${bookings.map(booking => `
                        <tr>
                            <td>${booking.id}</td>
                            <td>${booking.guest}</td>
                            <td>${booking.room}</td>
                            <td>${this.formatDate(booking.checkin)}</td>
                            <td>${this.formatDate(booking.checkout)}</td>
                            <td><span class="status ${booking.status}">${this.formatStatus(booking.status)}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = tableHTML;
    }

    formatDate(dateString) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    formatStatus(status) {
        const statusMap = {
            'occupied': 'Occupied',
            'confirmed': 'Confirmed',
            'checked-out': 'Checked Out',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    }

    updateRealTimeData() {
        // Simulate real-time updates
        setInterval(() => {
            // Update random data for demo purposes
            const randomChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const occupiedElement = document.getElementById('occupied-rooms');
            if (occupiedElement) {
                const current = parseInt(occupiedElement.textContent);
                const newValue = Math.max(0, current + randomChange);
                occupiedElement.textContent = newValue;
            }
        }, 10000); // Update every 10 seconds
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.dashboard-page')) {
        window.dashboard = new Dashboard();
    }
});