// favorites.js - Gestion de favoritos del usuario

let userFavorites = [];

async function loadFavorites() {
    if (!isLoggedIn()) return;
    userFavorites = await apiFetch('/api/favorites');
}

function isFavorite(productId) {
    return userFavorites.some(f => f.product_id === productId);
}

async function toggleFavorite(productId) {
    if (!isLoggedIn()) { showToast('Inicia sesion para guardar favoritos', 'error'); return; }
    if (isFavorite(productId)) {
        await apiFetch(`/api/favorites/${productId}`, { method: 'DELETE' });
        userFavorites = userFavorites.filter(f => f.product_id !== productId);
        showToast('Eliminado de favoritos', 'info');
    } else {
        const fav = await apiFetch('/api/favorites', { method: 'POST', body: JSON.stringify({ product_id: productId }) });
        userFavorites.push(fav.favorite);
        showToast('Agregado a favoritos', 'success');
    }
    updateFavoriteButtons();
}

function updateFavoriteButtons() {
    document.querySelectorAll('.btn-favorite').forEach(btn => {
        const productId = parseInt(btn.closest('[data-id]')?.dataset.id);
        if (productId) {
            btn.textContent = isFavorite(productId) ? '♥' : '♡';
            btn.classList.toggle('active', isFavorite(productId));
        }
    });
}

async function renderFavoritesPage(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    await loadFavorites();
    if (userFavorites.length === 0) {
        container.innerHTML = '<p class="empty">No tienes favoritos guardados</p>';
        return;
    }
    const productIds = userFavorites.map(f => f.product_id);
    const products = await fetchProducts();
    const favProducts = products.filter(p => productIds.includes(p.id));
    container.innerHTML = favProducts.map(renderProductCard).join('');
}
