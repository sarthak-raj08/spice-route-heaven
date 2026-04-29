const API_URL = window.location.origin;

document.getElementById('adminLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        const messageBox = document.getElementById('loginMessage');
        
        if (result.success) {
            // Store token and redirect to dashboard
            localStorage.setItem('adminToken', result.token);
            localStorage.setItem('adminUser', JSON.stringify(result.user));
            window.location.href = 'dashboard.html';
        } else {
            messageBox.className = 'message-box error';
            messageBox.innerHTML = '❌ Invalid email or password';
        }
    } catch (error) {
        console.error('Login error:', error);
        const messageBox = document.getElementById('loginMessage');
        messageBox.className = 'message-box error';
        messageBox.innerHTML = '❌ Network error. Please try again.';
    }
});