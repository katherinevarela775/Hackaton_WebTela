// main.js - Punto de entrada e inicializacion de la aplicacion

function detectCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('vendor')) return 'vendor';
    if (path.includes('admin')) return 'admin';
    if (path.includes('favorites')) return 'favorites';
    if (path.includes('cart')) return 'cart';
    return 'home';
}

async function initPage() {
    updateUIForAuth();
    updateCartBadge();
    bindModalEvents();
    bindAuthEvents();
    bindProductFilters();

    const page = detectCurrentPage();

    if (page === 'home') {
        loadProductsGrid('productsGrid');
        loadProductsGrid('featuredGrid', { featured: true });
    } else if (page === 'vendor') {
        loadVendorStats();
        loadVendorProducts();
        loadVendorOrders();
        bindVendorProductForm();
    } else if (page === 'admin') {
        initAdminPanel();
    } else if (page === 'favorites') {
        renderFavoritesPage('favoritesGrid');
    } else if (page === 'cart') {
        renderCartItems('cartContainer');
    }

    if (isLoggedIn()) await loadFavorites();
}

document.addEventListener('DOMContentLoaded', initPage);
