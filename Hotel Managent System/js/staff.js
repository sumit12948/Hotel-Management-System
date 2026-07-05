// Staff Management functionality
class StaffManager {
    constructor() {
        this.staff = this.getStaffFromStorage();
        this.init();
    }

    init() {
        this.renderStaffTable();
        this.updateStaffStats();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add staff button
        const addStaffBtn = document.getElementById('add-staff-btn');
        if (addStaffBtn) {
            addStaffBtn.addEventListener('click', () => {
                this.openAddStaffModal();
            });
        }

        // Modal close button
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeAddStaffModal();
            });
        }

        // Add staff form submission
        const addStaffForm = document.getElementById('add-staff-form');
        if (addStaffForm) {
            addStaffForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddStaffForm(e);
            });
        }

        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleStaffSearch(e.target.value);
            });
        }

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('add-staff-modal');
            if (e.target === modal) {
                this.closeAddStaffModal();
            }
        });
    }

    handleStaffSearch(searchTerm) {
        const filteredStaff = this.staff.filter(staff => 
            staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.position.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderStaffTable(filteredStaff);
    }

    openAddStaffModal() {
        const modal = document.getElementById('add-staff-modal');
        modal.style.display = 'block';
        
        // Set default join date to today
        const today = new Date().toISOString().split('T')[0];
        document.querySelector('input[name="joinDate"]').value = today;
    }

    closeAddStaffModal() {
        const modal = document.getElementById('add-staff-modal');
        modal.style.display = 'none';
        document.getElementById('add-staff-form').reset();
    }

    handleAddStaffForm(e) {
        const formData = new FormData(e.target);
        const staffData = {
            id: this.generateStaffId(),
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            position: formData.get('position'),
            department: formData.get('department'),
            salary: parseFloat(formData.get('salary')),
            joinDate: formData.get('joinDate'),
            status: formData.get('status')
        };

        this.addStaff(staffData);
        this.closeAddStaffModal();
        window.hotelManager.showNotification('Staff member added successfully!', 'success');
    }

    generateStaffId() {
        return 'ST' + Date.now();
    }

    addStaff(staffData) {
        this.staff.push(staffData);
        this.saveStaffToStorage();
        this.renderStaffTable();
        this.updateStaffStats();
    }

    getStaffFromStorage() {
        const storedStaff = localStorage.getItem('hotelStaff');
        if (storedStaff) {
            return JSON.parse(storedStaff);
        } else {
            return this.getDefaultStaff();
        }
    }

    getDefaultStaff() {
        return [
            {
                id: 'ST001',
                fullName: 'Sarah Wilson',
                email: 'sarah@hotel.com',
                phone: '+1234567890',
                position: 'receptionist',
                department: 'front-desk',
                salary: 32000,
                joinDate: '2023-01-15',
                status: 'active'
            },
            {
                id: 'ST002',
                fullName: 'Mike Johnson',
                email: 'mike@hotel.com',
                phone: '+1234567891',
                position: 'housekeeping',
                department: 'housekeeping',
                salary: 28000,
                joinDate: '2023-02-20',
                status: 'active'
            },
            {
                id: 'ST003',
                fullName: 'Lisa Brown',
                email: 'lisa@hotel.com',
                phone: '+1234567892',
                position: 'manager',
                department: 'management',
                salary: 55000,
                joinDate: '2022-11-10',
                status: 'active'
            }
        ];
    }

    saveStaffToStorage() {
        localStorage.setItem('hotelStaff', JSON.stringify(this.staff));
    }

    renderStaffTable(staffToRender = null) {
        const staff = staffToRender || this.staff;
        const tableContainer = document.getElementById('staff-table');
        
        if (!tableContainer) return;

        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Salary</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${staff.map(staffMember => `
                        <tr>
                            <td>${staffMember.fullName}</td>
                            <td>${this.formatPosition(staffMember.position)}</td>
                            <td>${this.formatDepartment(staffMember.department)}</td>
                            <td>${staffMember.email}</td>
                            <td>${staffMember.phone}</td>
                            <td>$${staffMember.salary.toLocaleString()}</td>
                            <td><span class="status ${staffMember.status}">${this.formatStatus(staffMember.status)}</span></td>
                            <td>
                                <button class="btn btn-primary" onclick="staffManager.viewStaffDetails('${staffMember.id}')">View</button>
                                <button class="btn btn-danger" onclick="staffManager.deleteStaff('${staffMember.id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = staff.length > 0 ? tableHTML : '<p>No staff members found.</p>';
    }

    updateStaffStats() {
        const totalStaff = this.staff.length;
        const activeStaff = this.staff.filter(staff => staff.status === 'active').length;
        const departments = new Set(this.staff.map(staff => staff.department)).size;

        document.getElementById('total-staff').textContent = totalStaff;
        document.getElementById('active-staff').textContent = activeStaff;
        document.getElementById('departments').textContent = departments;
    }

    formatPosition(position) {
        const positionMap = {
            'receptionist': 'Receptionist',
            'housekeeping': 'Housekeeping',
            'manager': 'Manager',
            'chef': 'Chef',
            'waiter': 'Waiter',
            'security': 'Security'
        };
        return positionMap[position] || position;
    }

    formatDepartment(department) {
        const deptMap = {
            'front-desk': 'Front Desk',
            'housekeeping': 'Housekeeping',
            'management': 'Management',
            'food-beverage': 'Food & Beverage',
            'security': 'Security'
        };
        return deptMap[department] || department;
    }

    formatStatus(status) {
        const statusMap = {
            'active': 'Active',
            'inactive': 'Inactive',
            'on-leave': 'On Leave'
        };
        return statusMap[status] || status;
    }

    viewStaffDetails(staffId) {
        const staff = this.staff.find(s => s.id === staffId);
        if (staff) {
            const details = `
Staff Details:

Name: ${staff.fullName}
Email: ${staff.email}
Phone: ${staff.phone}
Position: ${this.formatPosition(staff.position)}
Department: ${this.formatDepartment(staff.department)}
Salary: $${staff.salary.toLocaleString()}
Join Date: ${this.formatDate(staff.joinDate)}
Status: ${this.formatStatus(staff.status)}
            `;
            alert(details);
        }
    }

    formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    deleteStaff(staffId) {
        if (confirm('Are you sure you want to delete this staff member?')) {
            this.staff = this.staff.filter(staff => staff.id !== staffId);
            this.saveStaffToStorage();
            this.renderStaffTable();
            this.updateStaffStats();
            window.hotelManager.showNotification('Staff member deleted successfully!', 'success');
        }
    }
}

// Initialize staff manager
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('body').contains(document.getElementById('staff-table'))) {
        window.staffManager = new StaffManager();
    }
});