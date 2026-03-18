// products.js - Listado, busqueda y detalle de productos

async function fetchProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/products${query ? '?' + query : ''}`);
}
