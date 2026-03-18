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

async function register(name, email, password, role = 'cliente') {
    const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
    });
    return data;
}
