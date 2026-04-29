const API_URL = window.location.origin;
let currentToken = localStorage.getItem('adminToken');

// Check authentication
if (!currentToken) {
    window.location.href = 'admin.html';
}

// Add token to all fetch requests
async function authFetch(url, options = {}) {
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${currentToken}`
    };
    return fetch(url, options);
}

// Load dashboard stats
async function loadDashboard() {
    try {
        const response = await authFetch(`${API_URL}/api/admin/stats`);
        const data = await response.json();
        
        if (data.success) {
            // Display stats
            const statsHtml = `
                <div class="stat-card">
                    <h3>Total Bookings</h3>
                    <div class="number">${data.stats.totalBookings}</div>
                </div>
                <div class="stat-card">
                    <h3>Pending Bookings</h3>
                    <div class="number">${data.stats.pendingBookings}</div>
                </div>
                <div class="stat-card">
                    <h3>Confirmed Bookings</h3>
                    <div class="number">${data.stats.confirmedBookings}</div>
                </div>
                <div class="stat-card">
                    <h3>Messages</h3>
                    <div class="number">${data.stats.totalMessages}</div>
                </div>
                <div class="stat-card">
                    <h3>Unread Messages</h3>
                    <div class="number">${data.stats.unreadMessages}</div>
                </div>
            `;
            document.getElementById('statsGrid').innerHTML = statsHtml;
            
            // Display recent bookings
            renderRecentBookings(data.recentBookings);
            
            // Display recent messages
            renderRecentMessages(data.recentMessages);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Render recent bookings
function renderRecentBookings(bookings) {
    if (!bookings || bookings.length === 0) {
        document.getElementById('recentBookingsTable').innerHTML = '<p>No bookings found.</p>';
        return;
    }
    
    const tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Reference</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Guests</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${bookings.map(booking => `
                    <tr>
                        <td>${booking.bookingReference}</td>
                        <td>${booking.name}</td>
                        <td>${booking.location}</td>
                        <td>${new Date(booking.date).toLocaleDateString()}</td>
                        <td>${booking.guests}</td>
                        <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
                        <td>
                            <select onchange="updateBookingStatus('${booking._id}', this.value)" class="btn-sm">
                                <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                                <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('recentBookingsTable').innerHTML = tableHtml;
}

// Render recent messages
function renderRecentMessages(messages) {
    if (!messages || messages.length === 0) {
        document.getElementById('recentMessagesTable').innerHTML = '<p>No messages found.</p>';
        return;
    }
    
    const tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${messages.map(msg => `
                    <tr>
                        <td>${msg.name}</td>
                        <td>${msg.email}</td>
                        <td>${msg.location}</td>
                        <td>${msg.message.substring(0, 50)}...</td>
                        <td><span class="status-badge">${msg.status}</span></td>
                        <td>
                            ${msg.status === 'unread' ? `<button onclick="markMessageRead('${msg._id}')" class="btn-sm">Mark Read</button>` : 'Read'}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('recentMessagesTable').innerHTML = tableHtml;
}

// Load all bookings
async function loadAllBookings() {
    try {
        const response = await authFetch(`${API_URL}/api/admin/bookings`);
        const data = await response.json();
        
        if (data.success && data.bookings) {
            const tableHtml = `
                <table>
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Location</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Guests</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.bookings.map(booking => `
                            <tr>
                                <td>${booking.bookingReference}</td>
                                <td>${booking.name}</td>
                                <td>${booking.email}</td>
                                <td>${booking.phone}</td>
                                <td>${booking.location}</td>
                                <td>${new Date(booking.date).toLocaleDateString()}</td>
                                <td>${booking.time}</td>
                                <td>${booking.guests}</td>
                                <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
                                <td>
                                    <select onchange="updateBookingStatus('${booking._id}', this.value)" class="btn-sm">
                                        <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                                        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                        <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            document.getElementById('allBookingsTable').innerHTML = tableHtml;
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

// Load all messages
async function loadAllMessages() {
    try {
        const response = await authFetch(`${API_URL}/api/admin/messages`);
        const data = await response.json();
        
        if (data.success && data.messages) {
            const tableHtml = `
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Location</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.messages.map(msg => `
                            <tr>
                                <td>${msg.name}</td>
                                <td>${msg.email}</td>
                                <td>${msg.phone}</td>
                                <td>${msg.location}</td>
                                <td>${msg.message}</td>
                                <td>${new Date(msg.createdAt).toLocaleString()}</td>
                                <td><span class="status-badge">${msg.status}</span></td>
                                <td>
                                    ${msg.status === 'unread' ? `<button onclick="markMessageRead('${msg._id}')" class="btn-sm">Mark Read</button>` : '✓ Read'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            document.getElementById('allMessagesTable').innerHTML = tableHtml;
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Update booking status
async function updateBookingStatus(bookingId, status) {
    try {
        const response = await authFetch(`${API_URL}/api/admin/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        
        const data = await response.json();
        if (data.success) {
            alert('Booking status updated successfully!');
            // Reload current tab
            const activeTab = document.querySelector('.sidebar nav a.active').getAttribute('data-tab');
            if (activeTab === 'dashboard') {
                loadDashboard();
            } else if (activeTab === 'bookings') {
                loadAllBookings();
            }
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status');
    }
}

// Mark message as read
async function markMessageRead(messageId) {
    try {
        const response = await authFetch(`${API_URL}/api/admin/messages/${messageId}/read`, {
            method: 'PUT'
        });
        
        const data = await response.json();
        if (data.success) {
            alert('Message marked as read!');
            // Reload current tab
            const activeTab = document.querySelector('.sidebar nav a.active').getAttribute('data-tab');
            if (activeTab === 'dashboard') {
                loadDashboard();
            } else if (activeTab === 'messages') {
                loadAllMessages();
            }
        }
    } catch (error) {
        console.error('Error marking message:', error);
        alert('Failed to mark message as read');
    }
}

// Tab switching
document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active class
        document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        
        const tab = link.getAttribute('data-tab');
        
        // Hide all tabs
        document.getElementById('dashboardTab').style.display = 'none';
        document.getElementById('bookingsTab').style.display = 'none';
        document.getElementById('messagesTab').style.display = 'none';
        
        // Show selected tab
        if (tab === 'dashboard') {
            document.getElementById('dashboardTab').style.display = 'block';
            loadDashboard();
        } else if (tab === 'bookings') {
            document.getElementById('bookingsTab').style.display = 'block';
            loadAllBookings();
        } else if (tab === 'messages') {
            document.getElementById('messagesTab').style.display = 'block';
            loadAllMessages();
        }
    });
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'admin.html';
});

// Initial load
loadDashboard();