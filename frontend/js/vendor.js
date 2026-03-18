// vendor.js - Panel de control del vendedor

async function loadVendorStats() {
    const stats = await apiFetch('/api/vendor/stats');
    const el = document.getElementById('vendorStats');
    if (el) el.innerHTML = `
        <div class="stat-card"><h3>Productos</h3><p>${stats.total_products}</p></div>
        <div class="stat-card"><h3>Ventas</h3><p>${stats.total_sales}</p></div>
        <div class="stat-card"><h3>Revenue</h3><p>${formatPrice(stats.total_revenue)}</p></div>
    `;
}

async function loadVendorProducts() {
    const products = await apiFetch('/api/vendor/products');
    const container = document.getElementById('vendorProductsList');
    if (!container) return;
    container.innerHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category || '-'}</td>
            <td>${formatPrice(p.price)}</td>
            <td>${p.stock}</td>
            <td>
                <button onclick="openEditProductModal(${p.id})">Editar</button>
                <button onclick="deleteVendorProduct(${p.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}
