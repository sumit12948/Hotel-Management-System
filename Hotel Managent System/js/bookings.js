// Booking Management functionality
class BookingManager {
    constructor() {
        this.bookings = this.getBookingsFromStorage();
        this.init();
    }

    init() {
        this.renderBookingsTable();
        this.setupEventListeners();
        this.setupFilters();
    }

    setupEventListeners() {
        // New booking button
        const newBookingBtn = document.getElementById('new-booking-btn');
        if (newBookingBtn) {
            newBookingBtn.addEventListener('click', () => {
                this.openNewBookingModal();
            });
        }

        // Modal close button
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeNewBookingModal();
            });
        }

        // New booking form submission
        const newBookingForm = document.getElementById('new-booking-form');
        if (newBookingForm) {
            newBookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewBookingForm(e);
            });
        }

        // Room type change event
        const roomTypeSelect = document.getElementById('booking-room-type');
        if (roomTypeSelect) {
            roomTypeSelect.addEventListener('change', () => {
                this.updateAvailableRooms();
            });
        }

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('new-booking-modal');
            if (e.target === modal) {
                this.closeNewBookingModal();
            }
        });
    }

    setupFilters() {
        const statusFilter = document.getElementById('booking-status-filter');
        const fromDateFilter = document.getElementById('from-date-filter');
        const toDateFilter = document.getElementById('to-date-filter');

        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        if (fromDateFilter) {
            fromDateFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        if (toDateFilter) {
            toDateFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        const statusFilter = document.getElementById('booking-status-filter').value;
        const fromDate = document.getElementById('from-date-filter').value;
        const toDate = document.getElementById('to-date-filter').value;

        let filteredBookings = this.bookings;

        if (statusFilter) {
            filteredBookings = filteredBookings.filter(booking => booking.status === statusFilter);
        }

        if (fromDate) {
            filteredBookings = filteredBookings.filter(booking => booking.checkinDate >= fromDate);
        }

        if (toDate) {
            filteredBookings = filteredBookings.filter(booking => booking.checkoutDate <= toDate);
        }

        this.renderBookingsTable(filteredBookings);
    }

    openNewBookingModal() {
        const modal = document.getElementById('new-booking-modal');
        modal.style.display = 'block';
        this.updateAvailableRooms();
        
        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        
        document.querySelector('input[name="checkinDate"]').value = today;
        document.querySelector('input[name="checkoutDate"]').value = tomorrow;
    }

    closeNewBookingModal() {
        const modal = document.getElementById('new-booking-modal');
        modal.style.display = 'none';
        document.getElementById('new-booking-form').reset();
    }

    updateAvailableRooms() {
        const roomType = document.getElementById('booking-room-type').value;
        const availableRoomsSelect = document.getElementById('available-rooms');
        
        availableRoomsSelect.innerHTML = '<option value="">Select Room</option>';
        
        if (!roomType) return;

        // Get available rooms from room manager
        const roomManager = window.roomManager;
        if (roomManager) {
            const availableRooms = roomManager.rooms.filter(room => 
                room.type === roomType && room.status === 'available'
            );
            
            availableRooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room.number;
                option.textContent = `Room ${room.number} - $${room.price}/night`;
                availableRoomsSelect.appendChild(option);
            });
        }
    }

    handleNewBookingForm(e) {
        const formData = new FormData(e.target);
        const bookingData = {
            id: this.generateBookingId(),
            guestName: formData.get('guestName'),
            guestEmail: formData.get('guestEmail'),
            roomNumber: formData.get('roomNumber'),
            roomType: formData.get('roomType'),
            checkinDate: formData.get('checkinDate'),
            checkoutDate: formData.get('checkoutDate'),
            adults: parseInt(formData.get('adults')),
            children: parseInt(formData.get('children')),
            specialRequests: formData.get('specialRequests'),
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        this.createBooking(bookingData);
        this.closeNewBookingModal();
        window.hotelManager.showNotification('Booking created successfully!', 'success');
    }

    generateBookingId() {
        return 'BK' + Date.now();
    }

    createBooking(bookingData) {
        this.bookings.push(bookingData);
        this.saveBookingsToStorage();
        
        // Update room status
        this.updateRoomStatus(bookingData.roomNumber, 'occupied');
        
        this.renderBookingsTable();
        this.applyFilters();
    }

    updateRoomStatus(roomNumber, status) {
        const roomManager = window.roomManager;
        if (roomManager) {
            const room = roomManager.rooms.find(r => r.number === roomNumber);
            if (room) {
                room.status = status;
                roomManager.saveRoomsToStorage();
            }
        }
    }

    getBookingsFromStorage() {
        const storedBookings = localStorage.getItem('hotelBookings');
        if (storedBookings) {
            return JSON.parse(storedBookings);
        } else {
            return this.getDefaultBookings();
        }
    }

    getDefaultBookings() {
        return [
            {
                id: 'BK001',
                guestName: 'John Smith',
                guestEmail: 'john@email.com',
                roomNumber: '101',
                roomType: 'single',
                checkinDate: '2023-10-15',
                checkoutDate: '2023-10-18',
                adults: 1,
                children: 0,
                specialRequests: 'Early check-in requested',
                status: 'checked-in',
                createdAt: '2023-10-10'
            },
            {
                id: 'BK002',
                guestName: 'Emma Johnson',
                guestEmail: 'emma@email.com',
                roomNumber: '205',
                roomType: 'double',
                checkinDate: '2023-10-16',
                checkoutDate: '2023-10-20',
                adults: 2,
                children: 0,
                specialRequests: '',
                status: 'confirmed',
                createdAt: '2023-10-11'
            }
        ];
    }

    saveBookingsToStorage() {
        localStorage.setItem('hotelBookings', JSON.stringify(this.bookings));
    }

    renderBookingsTable(bookingsToRender = null) {
        const bookings = bookingsToRender || this.bookings;
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${bookings.map(booking => `
                        <tr>
                            <td>${booking.id}</td>
                            <td>${booking.guestName}</td>
                            <td>${booking.roomNumber}</td>
                            <td>${this.formatDate(booking.checkinDate)}</td>
                            <td>${this.formatDate(booking.checkoutDate)}</td>
                            <td><span class="status ${booking.status}">${this.formatStatus(booking.status)}</span></td>
                            <td>
                                <button class="btn btn-primary" onclick="bookingManager.viewBooking('${booking.id}')">View</button>
                                ${booking.status === 'confirmed' ? 
                                    `<button class="btn btn-success" onclick="bookingManager.checkIn('${booking.id}')">Check In</button>` : 
                                    ''}
                                ${booking.status === 'checked-in' ? 
                                    `<button class="btn btn-warning" onclick="bookingManager.checkOut('${booking.id}')">Check Out</button>` : 
                                    ''}
                            </td>
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
            'confirmed': 'Confirmed',
            'checked-in': 'Checked In',
            'checked-out': 'Checked Out',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    }

    viewBooking(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) {
            alert(`Booking Details:\n
ID: ${booking.id}
Guest: ${booking.guestName}
Room: ${booking.roomNumber}
Check-in: ${this.formatDate(booking.checkinDate)}
Check-out: ${this.formatDate(booking.checkoutDate)}
Status: ${this.formatStatus(booking.status)}
Special Requests: ${booking.specialRequests || 'None'}`);
        }
    }

    checkIn(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'checked-in';
            this.saveBookingsToStorage();
            this.renderBookingsTable();
            this.applyFilters();
            window.hotelManager.showNotification('Guest checked in successfully!', 'success');
        }
    }

    checkOut(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'checked-out';
            this.saveBookingsToStorage();
            
            // Free up the room
            this.updateRoomStatus(booking.roomNumber, 'available');
            
            this.renderBookingsTable();
            this.applyFilters();
            window.hotelManager.showNotification('Guest checked out successfully!', 'success');
        }
    }
}

// Initialize booking manager
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('body').contains(document.getElementById('bookings-table'))) {
        window.bookingManager = new BookingManager();
    }
});