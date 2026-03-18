// admin.js - Panel de administracion

async function loadAdminStats() {
    const stats = await apiFetch('/api/admin/stats');
    const el = document.getElementById('adminStats');
    if (el) el.innerHTML = `
        <div class="stat-card"><h3>Usuarios</h3><p>${stats.total_users}</p></div>
        <div class="stat-card"><h3>Productos</h3><p>${stats.total_products}</p></div>
        <div class="stat-card"><h3>Pedidos</h3><p>${stats.total_orders}</p></div>
        <div class="stat-card"><h3>Revenue</h3><p>${formatPrice(stats.total_revenue)}</p></div>
    `;
}

async function loadAdminUsers() {
    const users = await apiFetch('/api/admin/users');
    const container = document.getElementById('adminUsersList');
    if (!container) return;
    container.innerHTML = users.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>
                <select onchange="changeUserRole(${u.id}, this.value)">
                    <option value="cliente" ${u.role === 'cliente' ? 'selected' : ''}>Cliente</option>
                    <option value="vendedor" ${u.role === 'vendedor' ? 'selected' : ''}>Vendedor</option>
                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
            </td>
            <td><button onclick="deleteAdminUser(${u.id})">Eliminar</button></td>
        </tr>
    `).join('');
}

async function changeUserRole(userId, role) {
    await apiFetch(`/api/admin/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
    showToast('Rol actualizado', 'success');
}

async function deleteAdminUser(userId) {
    if (!confirm('¿Eliminar usuario?')) return;
    await apiFetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    showToast('Usuario eliminado', 'success');
    loadAdminUsers();
}

async function loadAdminProducts() {
    const products = await apiFetch('/api/admin/products');
    const container = document.getElementById('adminProductsList');
    if (!container) return;
    container.innerHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.vendor_id}</td>
            <td>${formatPrice(p.price)}</td>
            <td><button onclick="deleteAdminProduct(${p.id})">Eliminar</button></td>
        </tr>
    `).join('');
}

async function deleteAdminProduct(productId) {
    if (!confirm('¿Eliminar producto?')) return;
    await apiFetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
    showToast('Producto eliminado', 'success');
    loadAdminProducts();
}

async function loadAdminOrders() {
    const orders = await apiFetch('/api/admin/orders');
    const container = document.getElementById('adminOrdersList');
    if (!container) return;
    container.innerHTML = orders.map(o => `
        <tr>
            <td>${o.id}</td>
            <td>${o.user_id}</td>
            <td>${formatPrice(o.total)}</td>
            <td>
                <select onchange="updateAdminOrderStatus(${o.id}, this.value)">
                    <option value="pendiente" ${o.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="procesando" ${o.status === 'procesando' ? 'selected' : ''}>Procesando</option>
                    <option value="enviado" ${o.status === 'enviado' ? 'selected' : ''}>Enviado</option>
                    <option value="entregado" ${o.status === 'entregado' ? 'selected' : ''}>Entregado</option>
                </select>
            </td>
            <td>${o.created_at}</td>
        </tr>
    `).join('');
}

async function updateAdminOrderStatus(orderId, status) {
    await apiFetch(`/api/admin/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    showToast('Estado actualizado', 'success');
}

function initAdminPanel() {
    loadAdminStats();
    loadAdminUsers();
    loadAdminProducts();
    loadAdminOrders();
}
