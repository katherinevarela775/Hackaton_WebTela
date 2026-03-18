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
