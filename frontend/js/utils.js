window.appState = {
    productos: [],
    carrito: [],
    favoritos: [],
    token: localStorage.getItem('token') || null,
    usuarioActual: null,
    productoActual: null,
    accionConfirm: null
};

const API_BASE = 'http://localhost:5000/api'; // siempre abrir desde http://localhost:5000

function mostrarNotificacion(mensaje, tipo = 'error') {
    const container = document.getElementById('notificacion-container');
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    container.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 4000);
}

function mostrarConfirmacion(mensaje, onConfirm) {
    const modal = document.getElementById('modal-confirmacion');
    document.getElementById('confirm-mensaje').textContent = mensaje;
    appState.accionConfirm = onConfirm;
    modal.style.display = 'flex';
}

window.addEventListener('click', (e) => {
    const modalConfirm = document.getElementById('modal-confirmacion');
    if (e.target === modalConfirm) modalConfirm.style.display = 'none';

    const modalCliente = document.getElementById('modal-cliente');
    if (e.target === modalCliente) modalCliente.style.display = 'none';

    const modalEnvio = document.getElementById('modal-envio');
    if (e.target === modalEnvio) modalEnvio.style.display = 'none';
});

document.getElementById('confirm-si')?.addEventListener('click', () => {
    if (appState.accionConfirm) {
        appState.accionConfirm();
        appState.accionConfirm = null;
    }
    document.getElementById('modal-confirmacion').style.display = 'none';
});

document.getElementById('confirm-no')?.addEventListener('click', () => {
    appState.accionConfirm = null;
    document.getElementById('modal-confirmacion').style.display = 'none';
});

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

window.mostrarNotificacion = mostrarNotificacion;
window.mostrarConfirmacion = mostrarConfirmacion;
window.escapeHtml = escapeHtml;