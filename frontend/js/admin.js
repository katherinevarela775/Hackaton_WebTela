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
