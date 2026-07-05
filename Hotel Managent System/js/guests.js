// Guest Management functionality
class GuestManager {
    constructor() {
        this.guests = this.getGuestsFromStorage();
        this.init();
    }

    init() {
        this.renderGuestsTable();
        this.updateGuestStats();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleGuestSearch(e.target.value);
            });
        }
    }

    handleGuestSearch(searchTerm) {
        const filteredGuests = this.guests.filter(guest => 
            guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.phone.includes(searchTerm)
        );
        this.renderGuestsTable(filteredGuests);
    }

    getGuestsFromStorage() {
        const storedGuests = localStorage.getItem('hotelGuests');
        if (storedGuests) {
            return JSON.parse(storedGuests);
        } else {
            // Extract guests from bookings if no guest data exists
            return this.extractGuestsFromBookings();
        }
    }

    extractGuestsFromBookings() {
        const storedBookings = localStorage.getItem('hotelBookings');
        if (storedBookings) {
            const bookings = JSON.parse(storedBookings);
            const guestsMap = new Map();
            
            bookings.forEach(booking => {
                if (!guestsMap.has(booking.guestEmail)) {
                    guestsMap.set(booking.guestEmail, {
                        id: 'G' + Date.now() + Math.random().toString(36).substr(2, 9),
                        name: booking.guestName,
                        email: booking.guestEmail,
                        phone: '',
                        address: '',
                        idNumber: '',
                        idType: 'passport',
                        vip: false,
                        preferences: '',
                        totalStays: 1,
                        lastStay: booking.checkinDate
                    });
                } else {
                    const guest = guestsMap.get(booking.guestEmail);
                    guest.totalStays += 1;
                    guest.lastStay = booking.checkinDate;
                }
            });
            
            return Array.from(guestsMap.values());
        }
        return [];
    }

    saveGuestsToStorage() {
        localStorage.setItem('hotelGuests', JSON.stringify(this.guests));
    }

    renderGuestsTable(guestsToRender = null) {
        const guests = guestsToRender || this.guests;
        const tableContainer = document.getElementById('guests-table');
        
        if (!tableContainer) return;

        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>ID Type</th>
                        <th>Total Stays</th>
                        <th>Last Stay</th>
                        <th>VIP</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${guests.map(guest => `
                        <tr>
                            <td>${guest.name}</td>
                            <td>${guest.email}</td>
                            <td>${guest.phone || 'N/A'}</td>
                            <td>${this.formatIdType(guest.idType)}</td>
                            <td>${guest.totalStays}</td>
                            <td>${guest.lastStay ? this.formatDate(guest.lastStay) : 'N/A'}</td>
                            <td>${guest.vip ? '⭐ VIP' : 'Standard'}</td>
                            <td>
                                <button class="btn btn-primary" onclick="guestManager.viewGuestDetails('${guest.id}')">View</button>
                                <button class="btn ${guest.vip ? 'btn-warning' : 'btn-success'}" 
                                        onclick="guestManager.toggleVipStatus('${guest.id}')">
                                    ${guest.vip ? 'Remove VIP' : 'Make VIP'}
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = guests.length > 0 ? tableHTML : '<p>No guests found.</p>';
    }

    updateGuestStats() {
        const totalGuests = this.guests.length;
        const vipGuests = this.guests.filter(guest => guest.vip).length;
        
        // Calculate current guests from bookings
        const storedBookings = localStorage.getItem('hotelBookings');
        let currentGuests = 0;
        if (storedBookings) {
            const bookings = JSON.parse(storedBookings);
            currentGuests = bookings.filter(booking => booking.status === 'checked-in').length;
        }

        document.getElementById('total-guests').textContent = totalGuests;
        document.getElementById('current-guests').textContent = currentGuests;
        document.getElementById('vip-guests').textContent = vipGuests;
    }

    formatDate(dateString) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    formatIdType(idType) {
        const typeMap = {
            'passport': 'Passport',
            'id-card': 'ID Card',
            'driving-license': 'Driving License'
        };
        return typeMap[idType] || idType;
    }

    viewGuestDetails(guestId) {
        const guest = this.guests.find(g => g.id === guestId);
        if (guest) {
            const details = `
Guest Details:

Name: ${guest.name}
Email: ${guest.email}
Phone: ${guest.phone || 'N/A'}
Address: ${guest.address || 'N/A'}
ID Type: ${this.formatIdType(guest.idType)}
ID Number: ${guest.idNumber || 'N/A'}
VIP Status: ${guest.vip ? 'Yes' : 'No'}
Total Stays: ${guest.totalStays}
Last Stay: ${guest.lastStay ? this.formatDate(guest.lastStay) : 'N/A'}
Preferences: ${guest.preferences || 'None'}
            `;
            alert(details);
        }
    }

    toggleVipStatus(guestId) {
        const guest = this.guests.find(g => g.id === guestId);
        if (guest) {
            guest.vip = !guest.vip;
            this.saveGuestsToStorage();
            this.renderGuestsTable();
            this.updateGuestStats();
            
            const action = guest.vip ? 'added to' : 'removed from';
            window.hotelManager.showNotification(`Guest ${action} VIP status!`, 'success');
        }
    }
}

// Initialize guest manager
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('body').contains(document.getElementById('guests-table'))) {
        window.guestManager = new GuestManager();
    }
});