// auth.js - Autenticación de usuarios

function guardarToken(token) {
    appState.token = token;
    localStorage.setItem('token', token);
}

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': appState.token ? `Bearer ${appState.token}` : ''
    };
}

async function fetchUsuarioActual() {
    try {
        const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
        if (res.ok) {
            appState.usuarioActual = await res.json();
            if (appState.usuarioActual.role === 'vendedor') {
                document.getElementById('btnVendedorHeader').style.display = 'flex';
            }
            if (appState.usuarioActual.role === 'admin') {
                document.getElementById('btnAdminHeader').style.display = 'flex';
            }
            actualizarHeaderCliente();
        } else {
            appState.token = null;
            localStorage.removeItem('token');
            actualizarHeaderCliente();
        }
    } catch (error) {
        console.error('Error al obtener usuario:', error);
    }
}

// ===== LOGIN / REGISTRO DE CLIENTES =====

function mostrarModalCliente() {
    document.getElementById('cli-login').style.display = 'flex';
    document.getElementById('cli-registro').style.display = 'none';
    document.getElementById('modal-cliente').style.display = 'flex';
}

function cerrarModalCliente() {
    document.getElementById('modal-cliente').style.display = 'none';
}

function verRegistroCliente() {
    document.getElementById('cli-login').style.display = 'none';
    document.getElementById('cli-registro').style.display = 'flex';
}

function verLoginCliente() {
    document.getElementById('cli-registro').style.display = 'none';
    document.getElementById('cli-login').style.display = 'flex';
}

async function loginCliente() {
    const email = document.getElementById('cli-email').value.trim();
    const password = document.getElementById('cli-password').value;
    if (!email || !password) return mostrarNotificacion('Completa todos los campos', 'error');
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            guardarToken(data.access_token);
            await fetchUsuarioActual();
            mostrarNotificacion('Bienvenido, ' + appState.usuarioActual.name, 'exito');
            cerrarModalCliente();
        } else {
            mostrarNotificacion(data.msg || 'Credenciales inválidas', 'error');
        }
    } catch {
        mostrarNotificacion('Error de conexión', 'error');
    }
}

async function registrarCliente() {
    const nombre = document.getElementById('cli-reg-nombre').value.trim();
    const email = document.getElementById('cli-reg-email').value.trim();
    const password = document.getElementById('cli-reg-password').value;
    if (!nombre || !email || !password) return mostrarNotificacion('Completa todos los campos', 'error');
    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nombre, email, password, role: 'cliente' })
        });
        const data = await res.json();
        if (res.ok) {
            mostrarNotificacion('Cuenta creada. Ahora inicia sesión', 'exito');
            document.getElementById('cli-email').value = email;
            verLoginCliente();
        } else {
            mostrarNotificacion(data.msg || 'Error en registro', 'error');
        }
    } catch {
        mostrarNotificacion('Error de conexión', 'error');
    }
}

function actualizarHeaderCliente() {
    const btnLogin = document.getElementById('btnLoginCliente');
    const btnNombre = document.getElementById('btnNombreCliente');
    const btnLogout = document.getElementById('btnLogout');
    if (!btnLogin) return;
    if (appState.usuarioActual) {
        btnLogin.style.display = 'none';
        btnNombre.style.display = 'flex';
        btnNombre.textContent = appState.usuarioActual.name;
        btnLogout.style.display = 'flex';
    } else {
        btnLogin.style.display = 'flex';
        btnNombre.style.display = 'none';
        btnLogout.style.display = 'none';
    }
}

async function loginVendedor() {
    const email = document.getElementById('vendedor-email').value;
    const password = document.getElementById('vendedor-password').value;
    if (!email || !password) return mostrarNotificacion('Completa todos los campos', 'error');
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            guardarToken(data.access_token);
            await fetchUsuarioActual();
            if (appState.usuarioActual && appState.usuarioActual.role === 'vendedor') {
                mostrarNotificacion('Bienvenido, ' + appState.usuarioActual.name, 'exito');
                document.getElementById('menu-inicial').style.display = 'none';
                document.getElementById('tienda').style.display = 'none';
                document.getElementById('panel-vendedor').style.display = 'block';
                document.getElementById('nombre-vendedor').textContent = appState.usuarioActual.name;
                mostrarMisProductos();
            } else if (appState.usuarioActual) {
                mostrarNotificacion('Esta cuenta no es de vendedor. Rol: ' + appState.usuarioActual.role, 'error');
                logout();
            } else {
                mostrarNotificacion('Error al obtener datos del usuario', 'error');
            }
        } else {
            mostrarNotificacion(data.msg || 'Credenciales inválidas', 'error');
        }
    } catch (error) {
        mostrarNotificacion('Error de conexión', 'error');
    }
}

async function loginAdmin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    if (!email || !password) return mostrarNotificacion('Completa todos los campos', 'error');
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            guardarToken(data.access_token);
            await fetchUsuarioActual();
            if (appState.usuarioActual && appState.usuarioActual.role === 'admin') {
                mostrarNotificacion('Bienvenido, Administrador', 'exito');
                document.getElementById('menu-inicial').style.display = 'none';
                document.getElementById('tienda').style.display = 'none';
                document.getElementById('panel-admin').style.display = 'block';
                adminTab('dashboard');
            } else if (appState.usuarioActual) {
                mostrarNotificacion('Esta cuenta no es de administrador', 'error');
                logout();
            } else {
                mostrarNotificacion('Error al obtener datos del usuario', 'error');
            }
        } else {
            mostrarNotificacion(data.msg || 'Credenciales inválidas', 'error');
        }
    } catch (error) {
        mostrarNotificacion('Error de conexión', 'error');
    }
}

async function registrarVendedor() {
    const nombre = document.getElementById('reg-nombre').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    if (!nombre || !email || !password) return mostrarNotificacion('Completa todos los campos', 'error');
    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nombre, email, password, role: 'vendedor' })
        });
        const data = await res.json();
        if (res.ok) {
            mostrarNotificacion('Registro exitoso, ahora inicia sesión', 'exito');
            mostrarLoginVendedor();
        } else {
            mostrarNotificacion(data.msg || 'Error en registro', 'error');
        }
    } catch (error) {
        mostrarNotificacion('Error de conexión', 'error');
    }
}

function logout() {
    appState.token = null;
    localStorage.removeItem('token');
    appState.usuarioActual = null;
    document.getElementById('btnVendedorHeader').style.display = 'none';
    document.getElementById('btnAdminHeader').style.display = 'none';
    actualizarHeaderCliente();
    mostrarNotificacion('Sesión cerrada', 'exito');
    volverAlMenu();
}

function mostrarLoginVendedor() {
    document.getElementById('login-vendedor-form').style.display = 'flex';
    document.getElementById('registro-vendedor-form').style.display = 'none';
    document.getElementById('login-admin-form').style.display = 'none';
}

function mostrarRegistroVendedor() {
    document.getElementById('registro-vendedor-form').style.display = 'flex';
    document.getElementById('login-vendedor-form').style.display = 'none';
}

function mostrarLoginAdmin() {
    document.getElementById('login-admin-form').style.display = 'flex';
    document.getElementById('login-vendedor-form').style.display = 'none';
    document.getElementById('registro-vendedor-form').style.display = 'none';
}

window.fetchUsuarioActual = fetchUsuarioActual;
window.guardarToken = guardarToken;
window.authHeaders = authHeaders;
window.registrarVendedor = registrarVendedor;
window.loginVendedor = loginVendedor;
window.loginAdmin = loginAdmin;
window.logout = logout;
window.mostrarLoginVendedor = mostrarLoginVendedor;
window.mostrarRegistroVendedor = mostrarRegistroVendedor;
window.mostrarLoginAdmin = mostrarLoginAdmin;
window.mostrarModalCliente = mostrarModalCliente;
window.cerrarModalCliente = cerrarModalCliente;
window.verRegistroCliente = verRegistroCliente;
window.verLoginCliente = verLoginCliente;
window.loginCliente = loginCliente;
window.registrarCliente = registrarCliente;
window.actualizarHeaderCliente = actualizarHeaderCliente;