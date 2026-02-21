document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toRegister = document.getElementById('to-register');
    const toLogin = document.getElementById('to-login');
    const messageContainer = document.getElementById('message-container');

    // Switch between forms
    toRegister.addEventListener('click', () => {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        messageContainer.innerHTML = '';
    });

    toLogin.addEventListener('click', () => {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        messageContainer.innerHTML = '';
    });

    const showMessage = (message, type) => {
        messageContainer.innerHTML = `<p class="msg-${type}">${message}</p>`;
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 5000);
    };

    // Handle Registration
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        if (password !== confirmPassword) {
            return showMessage('Passwords do not match', 'error');
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (res.ok) {
                showMessage(data.message, 'success');
                setTimeout(() => toLogin.click(), 2000);
            } else {
                showMessage(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            showMessage('Server error. Please try again later.', 'error');
        }
    });

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                showMessage(`Welcome back, ${data.name}!`, 'success');
                localStorage.setItem('user', JSON.stringify(data));
                // Redirect or update UI
                console.log('Logged in successfully', data);
            } else {
                showMessage(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            showMessage('Server error. Please try again later.', 'error');
        }
    });
});
