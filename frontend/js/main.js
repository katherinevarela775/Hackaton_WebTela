// main.js - Punto de entrada e inicializacion de la aplicacion

function detectCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('vendor')) return 'vendor';
    if (path.includes('admin')) return 'admin';
    if (path.includes('favorites')) return 'favorites';
    if (path.includes('cart')) return 'cart';
    return 'home';
}
