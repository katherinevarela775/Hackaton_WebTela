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
