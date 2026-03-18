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

async function deleteVendorProduct(productId) {
    if (!confirm('¿Eliminar este producto?')) return;
    await apiFetch(`/api/vendor/products/${productId}`, { method: 'DELETE' });
    showToast('Producto eliminado', 'success');
    loadVendorProducts();
}

async function createVendorProduct(formData) {
    const product = await apiFetch('/api/vendor/products', {
        method: 'POST',
        body: JSON.stringify(formData)
    });
    showToast('Producto creado', 'success');
    loadVendorProducts();
    return product;
}

async function updateVendorProduct(productId, formData) {
    const product = await apiFetch(`/api/vendor/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
    });
    showToast('Producto actualizado', 'success');
    loadVendorProducts();
    return product;
}

async function loadVendorOrders() {
    const orders = await apiFetch('/api/vendor/orders');
    const container = document.getElementById('vendorOrdersList');
    if (!container) return;
    container.innerHTML = orders.map(o => `
        <tr>
            <td>${o.id}</td>
            <td>${o.user_id}</td>
            <td>${formatPrice(o.total)}</td>
            <td><span class="badge badge-${o.status}">${o.status}</span></td>
            <td>${o.created_at}</td>
        </tr>
    `).join('');
}

function bindVendorProductForm() {
    const form = document.getElementById('vendorProductForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: form.querySelector('[name=name]').value,
            description: form.querySelector('[name=description]').value,
            price: parseFloat(form.querySelector('[name=price]').value),
            stock: parseInt(form.querySelector('[name=stock]').value),
            category: form.querySelector('[name=category]').value
        };
        const productId = form.dataset.editId;
        if (productId) await updateVendorProduct(parseInt(productId), data);
        else await createVendorProduct(data);
        form.reset();
    });
}
