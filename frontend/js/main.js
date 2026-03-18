const menuInicial = document.getElementById('menu-inicial');
const tienda = document.getElementById('tienda');
const panelVendedor = document.getElementById('panel-vendedor');
const panelAdmin = document.getElementById('panel-admin');

document.addEventListener('DOMContentLoaded', async () => {
    if (appState.token) {
        await fetchUsuarioActual();
    }
    await cargarProductos();
    await cargarCategorias();
    await cargarFavoritos();
    actualizarOfertas();
    menuInicial.style.display = 'flex';
    tienda.style.display = 'none';
    panelVendedor.style.display = 'none';
    panelAdmin.style.display = 'none';
});

function entrarCliente() {
    menuInicial.style.display = 'none';
    tienda.style.display = 'block';
}

function volverAlMenuDesdeTienda() {
    tienda.style.display = 'none';
    menuInicial.style.display = 'flex';
}

function volverAlMenu() {
    panelVendedor.style.display = 'none';
    panelAdmin.style.display = 'none';
    tienda.style.display = 'none';
    menuInicial.style.display = 'flex';
}

function abrirPanelVendedor() {
    if (appState.usuarioActual?.role === 'vendedor') {
        tienda.style.display = 'none';
        panelVendedor.style.display = 'block';
        document.getElementById('nombre-vendedor').textContent = appState.usuarioActual.name;
        mostrarMisProductos();
    } else {
        mostrarNotificacion('Acceso no autorizado', 'error');
    }
}

function abrirPanelAdmin() {
    if (appState.usuarioActual?.role === 'admin') {
        tienda.style.display = 'none';
        panelAdmin.style.display = 'block';
        actualizarEstadisticasAdmin();
        mostrarProductosAdmin();
    } else {
        mostrarNotificacion('Acceso no autorizado', 'error');
    }
}

window.entrarCliente = entrarCliente;
window.volverAlMenuDesdeTienda = volverAlMenuDesdeTienda;
window.volverAlMenu = volverAlMenu;
window.abrirPanelVendedor = abrirPanelVendedor;
window.abrirPanelAdmin = abrirPanelAdmin;