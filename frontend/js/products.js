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
