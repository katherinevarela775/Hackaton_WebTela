// auth.js - Manejo de autenticacion de usuarios

async function login(email, password) {
    const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    setToken(data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
}

function logout() {
    removeToken();
    window.location.reload();
}

async function register(name, email, password, role = 'cliente') {
    const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
    });
    return data;
}

async function getMe() {
    return apiFetch('/api/auth/me');
}

function updateUIForAuth() {
    const user = getCurrentUser();
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');

    if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (userMenu) userMenu.style.display = 'block';
        if (userName) userName.textContent = user.name;
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'none';
    }
}

function bindAuthEvents() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            try {
                await login(email, password);
                showToast('Sesion iniciada', 'success');
                updateUIForAuth();
            } catch (err) {
                showToast(err.message, 'error');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const role = document.getElementById('registerRole')?.value || 'cliente';
            try {
                await register(name, email, password, role);
                showToast('Cuenta creada. Inicia sesion.', 'success');
            } catch (err) {
                showToast(err.message, 'error');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}
