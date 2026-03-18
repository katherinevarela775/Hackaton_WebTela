// products.js - Listado, busqueda y detalle de productos

async function fetchProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/products${query ? '?' + query : ''}`);
}

async function fetchProductById(id) {
    return apiFetch(`/api/products/${id}`);
}

async function fetchFeaturedProducts() {
    return apiFetch('/api/products/featured');
}

async function fetchCategories() {
    return apiFetch('/api/products/categories');
}

function renderProductCard(product) {
    const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
    const imgSrc = images[0] || 'https://via.placeholder.com/300x200?text=Tela';
    return `
        <div class="product-card" data-id="${product.id}">
            <img src="${imgSrc}" alt="${product.name}" class="product-img" />
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category || ''}</p>
                <p class="product-price">${formatPrice(product.price)}</p>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">Agregar</button>
                    <button class="btn-favorite" onclick="toggleFavorite(${product.id})">♡</button>
                </div>
            </div>
        </div>
    `;
}

async function loadProductsGrid(containerId, params = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<p class="loading">Cargando productos...</p>';
    try {
        const products = await fetchProducts(params);
        container.innerHTML = products.map(renderProductCard).join('');
    } catch (err) {
        container.innerHTML = `<p class="error">${err.message}</p>`;
    }
}

function bindProductFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');

    const applyFilters = () => {
        const params = {};
        if (searchInput?.value) params.search = searchInput.value;
        if (categoryFilter?.value) params.category = categoryFilter.value;
        if (sortFilter?.value) params.sort = sortFilter.value;
        loadProductsGrid('productsGrid', params);
    };

    searchInput?.addEventListener('input', applyFilters);
    categoryFilter?.addEventListener('change', applyFilters);
    sortFilter?.addEventListener('change', applyFilters);
}
