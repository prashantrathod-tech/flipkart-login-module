// API Base URL
const API_BASE_URL = 'http://localhost:8080/flipkart-login/api/auth';

// Toggle between login and registration forms
function toggleForm(event) {
    event.preventDefault();
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    
    loginForm.classList.toggle('active');
    registrationForm.classList.toggle('active');
    
    // Clear message
    clearMessage();
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showMessage('Login successful! Redirecting...', 'success');
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data));
            
            // Redirect to dashboard
            setTimeout(() => {
                showDashboard(data);
            }, 1000);
        } else {
            showMessage(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
}

// Handle Registration
async function handleRegister(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    
    // Validation
    if (!firstName || !lastName || !email || !password) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
                phoneNumber
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showMessage('Registration successful! Please login.', 'success');
            // Clear the form
            document.querySelector('#registrationForm form').reset();
            
            // Switch to login form
            setTimeout(() => {
                document.getElementById('registrationForm').classList.remove('active');
                document.getElementById('loginForm').classList.add('active');
                clearMessage();
            }, 1500);
        } else {
            showMessage(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('user');
    // Hide dashboard and show login
    document.getElementById('dashboard').classList.add('hidden');
    document.querySelector('.login-container').style.display = 'flex';
    // Reset forms
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registrationForm').classList.remove('active');
    document.querySelector('#loginForm form').reset();
}

// Show Dashboard
function showDashboard(userData) {
    document.querySelector('.login-container').style.display = 'none';
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('welcomeMessage').textContent = `You are logged in as ${userData.email}`;
}

// Show Message
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
}

// Clear Message
function clearMessage() {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = '';
    messageDiv.className = 'message';
}

// Check if user is already logged in on page load
window.addEventListener('load', function() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        showDashboard(userData);
    }
});
