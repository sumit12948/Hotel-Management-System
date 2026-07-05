// Room Management functionality
class RoomManager {
    constructor() {
        this.rooms = this.getRoomsFromStorage();
        this.init();
    }

    init() {
        this.renderRoomsTable();
        this.setupEventListeners();
        this.setupFilters();
    }

    setupEventListeners() {
        // Add room button
        const addRoomBtn = document.getElementById('add-room-btn');
        if (addRoomBtn) {
            addRoomBtn.addEventListener('click', () => {
                this.openAddRoomModal();
            });
        }

        // Modal close button
        const closeBtn = document.querySelector('#add-room-modal .close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeAddRoomModal();
            });
        }

        // Add room form submission
        const addRoomForm = document.getElementById('add-room-form');
        if (addRoomForm) {
            addRoomForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddRoomForm(e);
            });
        }

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('add-room-modal');
            if (e.target === modal) {
                this.closeAddRoomModal();
            }
        });
    }

    setupFilters() {
        const filters = ['room-type-filter', 'status-filter', 'floor-filter'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => {
                    this.applyFilters();
                });
            }
        });
    }

    applyFilters() {
        const typeFilter = document.getElementById('room-type-filter').value;
        const statusFilter = document.getElementById('status-filter').value;
        const floorFilter = document.getElementById('floor-filter').value;

        let filteredRooms = this.rooms;

        if (typeFilter) {
            filteredRooms = filteredRooms.filter(room => room.type === typeFilter);
        }

        if (statusFilter) {
            filteredRooms = filteredRooms.filter(room => room.status === statusFilter);
        }

        if (floorFilter) {
            filteredRooms = filteredRooms.filter(room => room.floor === floorFilter);
        }

        this.renderRoomsTable(filteredRooms);
    }

    openAddRoomModal() {
        const modal = document.getElementById('add-room-modal');
        if (modal) {
            modal.style.display = 'block';
            console.log('Add room modal opened');
        } else {
            console.error('Add room modal not found');
        }
    }

    closeAddRoomModal() {
        const modal = document.getElementById('add-room-modal');
        if (modal) {
            modal.style.display = 'none';
            const form = document.getElementById('add-room-form');
            if (form) form.reset();
        }
    }

    handleAddRoomForm(e) {
        const formData = new FormData(e.target);
        const roomData = {
            id: this.generateRoomId(),
            number: formData.get('roomNumber'),
            type: formData.get('roomType'),
            price: parseFloat(formData.get('price')),
            floor: formData.get('floor'),
            description: formData.get('description'),
            status: 'available',
            amenities: []
        };

        console.log('Adding new room:', roomData);
        this.addRoom(roomData);
        this.closeAddRoomModal();
        
        if (window.hotelManager && window.hotelManager.showNotification) {
            window.hotelManager.showNotification('Room added successfully!', 'success');
        } else {
            alert('Room added successfully!');
        }
    }

    generateRoomId() {
        return 'RM' + Date.now();
    }

    addRoom(roomData) {
        this.rooms.push(roomData);
        this.saveRoomsToStorage();
        this.renderRoomsTable();
        this.applyFilters();
        console.log('Room added. Total rooms:', this.rooms.length);
    }

    getRoomsFromStorage() {
        try {
            const storedRooms = localStorage.getItem('hotelRooms');
            if (storedRooms) {
                return JSON.parse(storedRooms);
            }
        } catch (error) {
            console.error('Error loading rooms from storage:', error);
        }
        
        // Return default rooms if none exist or error occurs
        return this.getDefaultRooms();
    }

    getDefaultRooms() {
        return [
            { 
                id: 'RM001', 
                number: '101', 
                type: 'single', 
                price: 120, 
                floor: '1', 
                status: 'occupied', 
                description: 'Standard single room',
                amenities: ['TV', 'WiFi', 'AC']
            },
            { 
                id: 'RM002', 
                number: '102', 
                type: 'double', 
                price: 180, 
                floor: '1', 
                status: 'available', 
                description: 'Deluxe double room',
                amenities: ['TV', 'WiFi', 'AC', 'Mini Bar']
            },
            { 
                id: 'RM003', 
                number: '103', 
                type: 'suite', 
                price: 280, 
                floor: '1', 
                status: 'maintenance', 
                description: 'Executive suite',
                amenities: ['TV', 'WiFi', 'AC', 'Mini Bar', 'Jacuzzi']
            },
            { 
                id: 'RM004', 
                number: '201', 
                type: 'single', 
                price: 120, 
                floor: '2', 
                status: 'available', 
                description: 'Standard single room',
                amenities: ['TV', 'WiFi', 'AC']
            },
            { 
                id: 'RM005', 
                number: '202', 
                type: 'double', 
                price: 180, 
                floor: '2', 
                status: 'available', 
                description: 'Deluxe double room',
                amenities: ['TV', 'WiFi', 'AC', 'Mini Bar']
            }
        ];
    }

    saveRoomsToStorage() {
        try {
            localStorage.setItem('hotelRooms', JSON.stringify(this.rooms));
            console.log('Rooms saved to storage:', this.rooms.length);
        } catch (error) {
            console.error('Error saving rooms to storage:', error);
        }
    }

    renderRoomsTable(roomsToRender = null) {
        const rooms = roomsToRender || this.rooms;
        const tableContainer = document.getElementById('rooms-table');
        
        if (!tableContainer) {
            console.error('Rooms table container not found');
            return;
        }

        if (rooms.length === 0) {
            tableContainer.innerHTML = '<p>No rooms found. <button class="btn btn-primary" onclick="roomManager.openAddRoomModal()">Add First Room</button></p>';
            return;
        }

        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Room No</th>
                        <th>Type</th>
                        <th>Floor</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${rooms.map(room => `
                        <tr>
                            <td>${room.number}</td>
                            <td>${this.formatRoomType(room.type)}</td>
                            <td>${room.floor}</td>
                            <td>$${room.price}</td>
                            <td><span class="status ${room.status}">${this.formatStatus(room.status)}</span></td>
                            <td>${room.description}</td>
                            <td>
                                <button class="btn btn-primary" onclick="roomManager.editRoom('${room.id}')">Edit</button>
                                <button class="btn btn-danger" onclick="roomManager.deleteRoom('${room.id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = tableHTML;
    }

    formatRoomType(type) {
        const typeMap = {
            'single': 'Single',
            'double': 'Double',
            'suite': 'Suite',
            'deluxe': 'Deluxe'
        };
        return typeMap[type] || type;
    }

    formatStatus(status) {
        const statusMap = {
            'available': 'Available',
            'occupied': 'Occupied',
            'maintenance': 'Maintenance',
            'cleaning': 'Cleaning'
        };
        return statusMap[status] || status;
    }

    editRoom(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (room) {
            // For now, just show a notification
            // In a real implementation, you'd open an edit modal
            const message = `Editing room ${room.number} - ${this.formatRoomType(room.type)} - $${room.price}`;
            
            if (window.hotelManager && window.hotelManager.showNotification) {
                window.hotelManager.showNotification(message, 'info');
            } else {
                alert(message);
            }
        }
    }

    deleteRoom(roomId) {
        if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
            const roomIndex = this.rooms.findIndex(room => room.id === roomId);
            if (roomIndex !== -1) {
                const roomNumber = this.rooms[roomIndex].number;
                this.rooms.splice(roomIndex, 1);
                this.saveRoomsToStorage();
                this.renderRoomsTable();
                this.applyFilters();
                
                const message = `Room ${roomNumber} deleted successfully!`;
                if (window.hotelManager && window.hotelManager.showNotification) {
                    window.hotelManager.showNotification(message, 'success');
                } else {
                    alert(message);
                }
            }
        }
    }

    // Utility method to get available rooms by type
    getAvailableRoomsByType(roomType) {
        return this.rooms.filter(room => 
            room.type === roomType && room.status === 'available'
        );
    }

    // Utility method to update room status
    updateRoomStatus(roomNumber, newStatus) {
        const room = this.rooms.find(r => r.number === roomNumber);
        if (room) {
            room.status = newStatus;
            this.saveRoomsToStorage();
            this.renderRoomsTable();
            return true;
        }
        return false;
    }
}

// Initialize room manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the rooms page
    const roomsTable = document.getElementById('rooms-table');
    if (roomsTable) {
        console.log('Initializing Room Manager...');
        window.roomManager = new RoomManager();
        
        // Test if room manager is working
        setTimeout(() => {
            console.log('Room Manager initialized with', window.roomManager.rooms.length, 'rooms');
        }, 1000);
    }
});