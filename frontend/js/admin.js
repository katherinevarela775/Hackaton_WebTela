// ─── TAB NAVIGATION ───────────────────────────────────────────────────────────

function adminTab(tab) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.admin-nav-tab').forEach(el => el.classList.remove('active'));
    document.getElementById('admin-tab-' + tab).style.display = 'block';
    document.querySelector(`.admin-nav-tab[data-tab="${tab}"]`).classList.add('active');

    if (tab === 'dashboard')  { actualizarEstadisticasAdmin(); cargarPedidosRecientes(); }
    if (tab === 'productos')  { mostrarProductosAdmin(); }
    if (tab === 'usuarios')   { mostrarUsuariosAdmin(); }
    if (tab === 'pedidos')    { mostrarPedidosAdmin(); }
}

window.adminTab = adminTab;

// ─── STATS ────────────────────────────────────────────────────────────────────

async function actualizarEstadisticasAdmin() {
    try {
        const res = await fetch(`${API_BASE}/admin/stats`, { headers: authHeaders() });
        if (!res.ok) return;
        const s = await res.json();
        document.getElementById('stat-productos').textContent  = s.total_products  ?? 0;
        document.getElementById('stat-vendedores').textContent = s.total_vendors   ?? 0;
        document.getElementById('stat-clientes').textContent   = s.total_clients   ?? 0;
        document.getElementById('stat-ventas').textContent     = s.total_orders    ?? 0;
    } catch (e) { console.error(e); }
}

window.actualizarEstadisticasAdmin = actualizarEstadisticasAdmin;

// ─── RECENT ORDERS (dashboard preview) ────────────────────────────────────────

async function cargarPedidosRecientes() {
    const div = document.getElementById('admin-pedidos-recientes');
    try {
        const res = await fetch(`${API_BASE}/admin/orders`, { headers: authHeaders() });
        if (!res.ok) { div.innerHTML = '<p class="empty-msg">Sin pedidos aún.</p>'; return; }
        const orders = await res.json();
        const recent = orders.slice(0, 5);
        if (!recent.length) { div.innerHTML = '<p class="empty-msg">Sin pedidos aún.</p>'; return; }
        div.innerHTML = recent.map(o => `
            <div class="admin-row">
                <div class="admin-row-info">
                    <strong>#${o.id}</strong>
                    <span>${escapeHtml(o.user?.name || 'N/A')}</span>
                    <span class="text-muted">${formatDate(o.created_at)}</span>
                </div>
                <div class="admin-row-right">
                    <span>Gs ${(o.total || 0).toLocaleString()}</span>
                    <span class="status-badge status-${o.status}">${statusLabel(o.status)}</span>
                </div>
            </div>
        `).join('');
    } catch (e) { div.innerHTML = '<p class="empty-msg">Error al cargar.</p>'; }
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

let adminEditingProductId = null;

async function mostrarProductosAdmin() {
    const div = document.getElementById('admin-productos');
    div.innerHTML = '<p class="empty-msg">Cargando...</p>';
    try {
        const res = await fetch(`${API_BASE}/admin/products`, { headers: authHeaders() });
        if (!res.ok) { div.innerHTML = '<p class="empty-msg">Error al cargar.</p>'; return; }
        const productos = await res.json();
        if (!productos.length) { div.innerHTML = '<p class="empty-msg">No hay productos.</p>'; return; }
        div.innerHTML = productos.map(p => {
            const tags = (p.tags || []).map(t => `<span class="badge ${t}">${t}</span>`).join('');
            return `
                <div class="admin-product-row">
                    <img src="${escapeHtml(p.images?.[0] || 'https://placehold.co/60x60')}" alt="${escapeHtml(p.name)}" class="admin-product-img">
                    <div class="admin-product-info">
                        <strong>${escapeHtml(p.name)}</strong>
                        <span class="text-muted">${escapeHtml(p.category || '')} · ${escapeHtml(p.sale_type || '')}</span>
                        <div class="admin-product-meta">
                            <span>Gs ${(p.base_price || 0).toLocaleString()}</span>
                            <span>Stock: ${p.stock}</span>
                            <span class="text-muted">${escapeHtml(p.vendor?.name || 'Sin vendedor')}</span>
                            ${tags}
                        </div>
                    </div>
                    <div class="admin-actions">
                        <button class="btn-editar" onclick="abrirEditarProductoAdmin(${p.id})">✏️ Editar</button>
                        <button class="btn-eliminar" onclick="eliminarProductoAdmin(${p.id})">🗑 Eliminar</button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) { div.innerHTML = '<p class="empty-msg">Error de conexión.</p>'; }
}

function abrirFormProductoAdmin(producto = null) {
    adminEditingProductId = producto ? producto.id : null;
    const form = document.getElementById('admin-form-producto');
    const titulo = producto ? 'Editar producto' : 'Nuevo producto';
    form.innerHTML = `
        <div class="admin-form-header">
            <h3>${titulo}</h3>
            <button onclick="cerrarFormProductoAdmin()" class="btn-icon-close">✕</button>
        </div>
        <div class="grid-2" style="margin-bottom:14px;">
            <div class="envio-campo">
                <label>Nombre *</label>
                <input id="ap-nombre" type="text" value="${escapeHtml(producto?.name || '')}" placeholder="Nombre del producto">
            </div>
            <div class="envio-campo">
                <label>Precio base (Gs) *</label>
                <input id="ap-precio" type="number" value="${producto?.base_price || ''}" placeholder="Ej: 45000">
            </div>
        </div>
        <div class="grid-2" style="margin-bottom:14px;">
            <div class="envio-campo">
                <label>Categoría</label>
                <select id="ap-categoria">
                    ${['Natural','Sintética','Mixta','Especial'].map(c =>
                        `<option ${producto?.category === c ? 'selected' : ''}>${c}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="envio-campo">
                <label>Tipo de venta</label>
                <select id="ap-venta">
                    <option value="ambos"     ${producto?.sale_type==='ambos'     ? 'selected':''}>Mayorista y minorista</option>
                    <option value="mayorista" ${producto?.sale_type==='mayorista' ? 'selected':''}>Solo mayorista</option>
                    <option value="minorista" ${producto?.sale_type==='minorista' ? 'selected':''}>Solo minorista</option>
                </select>
            </div>
        </div>
        <div class="grid-2" style="margin-bottom:14px;">
            <div class="envio-campo">
                <label>Stock</label>
                <input id="ap-stock" type="number" value="${producto?.stock || 0}" placeholder="Cantidad en stock">
            </div>
            <div class="envio-campo">
                <label>Imagen</label>
                <input id="ap-imagen" type="file" accept="image/*">
            </div>
        </div>
        <div class="envio-campo" style="margin-bottom:14px;">
            <label>Descripción</label>
            <textarea id="ap-descripcion" rows="2" placeholder="Descripción del producto">${escapeHtml(producto?.description || '')}</textarea>
        </div>
        <div class="precios-volumen" style="margin-bottom:14px;">
            <label>Precios por volumen (Gs)</label>
            <div class="grid-3">
                <input id="ap-p5"  type="number" placeholder="Precio 5+ uds"  value="${producto?.volume_prices?.['5']  || ''}">
                <input id="ap-p10" type="number" placeholder="Precio 10+ uds" value="${producto?.volume_prices?.['10'] || ''}">
                <input id="ap-p20" type="number" placeholder="Precio 20+ uds" value="${producto?.volume_prices?.['20'] || ''}">
            </div>
        </div>
        <div style="margin-bottom:18px;">
            <label class="envio-campo" style="margin-bottom:8px;"><span>Etiquetas</span></label>
            <div class="etiquetas-opciones">
                <label class="etiqueta-check"><input type="checkbox" id="ap-oferta"     ${(producto?.tags||[]).includes('oferta')     ?'checked':''}> 🔥 Oferta</label>
                <label class="etiqueta-check"><input type="checkbox" id="ap-nuevo"      ${(producto?.tags||[]).includes('nuevo')      ?'checked':''}> 🆕 Nuevo</label>
                <label class="etiqueta-check"><input type="checkbox" id="ap-liquidacion"${(producto?.tags||[]).includes('liquidacion') ?'checked':''}> 🏷️ Liquidación</label>
            </div>
        </div>
        <div style="display:flex; gap:10px;">
            <button class="btn" style="width:auto; padding:11px 28px;" onclick="guardarProductoAdmin()">
                ${producto ? 'Guardar cambios' : 'Publicar producto'}
            </button>
            <button class="btn btn-detalles" style="width:auto; padding:11px 20px;" onclick="cerrarFormProductoAdmin()">Cancelar</button>
        </div>
    `;
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function abrirEditarProductoAdmin(id) {
    try {
        const res = await fetch(`${API_BASE}/admin/products`, { headers: authHeaders() });
        if (!res.ok) return;
        const products = await res.json();
        const producto = products.find(p => p.id === id);
        if (producto) abrirFormProductoAdmin(producto);
    } catch (e) { mostrarNotificacion('Error al cargar producto', 'error'); }
}

function cerrarFormProductoAdmin() {
    document.getElementById('admin-form-producto').style.display = 'none';
    adminEditingProductId = null;
}

async function guardarProductoAdmin() {
    const nombre = document.getElementById('ap-nombre').value.trim();
    const precio = document.getElementById('ap-precio').value;
    if (!nombre || !precio) {
        mostrarNotificacion('Nombre y precio son obligatorios', 'error');
        return;
    }

    const tags = [];
    if (document.getElementById('ap-oferta').checked)      tags.push('oferta');
    if (document.getElementById('ap-nuevo').checked)       tags.push('nuevo');
    if (document.getElementById('ap-liquidacion').checked) tags.push('liquidacion');

    const vp = {};
    const p5  = document.getElementById('ap-p5').value;
    const p10 = document.getElementById('ap-p10').value;
    const p20 = document.getElementById('ap-p20').value;
    if (p5)  vp['5']  = parseFloat(p5);
    if (p10) vp['10'] = parseFloat(p10);
    if (p20) vp['20'] = parseFloat(p20);

    const formData = new FormData();
    formData.append('name',         nombre);
    formData.append('base_price',   precio);
    formData.append('category',     document.getElementById('ap-categoria').value);
    formData.append('sale_type',    document.getElementById('ap-venta').value);
    formData.append('stock',        document.getElementById('ap-stock').value || 0);
    formData.append('description',  document.getElementById('ap-descripcion').value.trim());
    formData.append('tags',         JSON.stringify(tags));
    formData.append('volume_prices', JSON.stringify(vp));

    const imgFile = document.getElementById('ap-imagen').files[0];
    if (imgFile) formData.append('image', imgFile);

    const url    = adminEditingProductId
        ? `${API_BASE}/admin/products/${adminEditingProductId}`
        : `${API_BASE}/admin/products`;
    const method = adminEditingProductId ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${appState.token}` },
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            mostrarNotificacion(data.msg || 'Guardado', 'exito');
            cerrarFormProductoAdmin();
            mostrarProductosAdmin();
            actualizarEstadisticasAdmin();
            cargarProductos();
        } else {
            mostrarNotificacion(data.msg || 'Error al guardar', 'error');
        }
    } catch (e) { mostrarNotificacion('Error de conexión', 'error'); }
}

async function eliminarProductoAdmin(id) {
    mostrarConfirmacion('¿Eliminar este producto definitivamente?', async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/products/${id}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            if (res.ok) {
                mostrarNotificacion('Producto eliminado', 'exito');
                mostrarProductosAdmin();
                actualizarEstadisticasAdmin();
                cargarProductos();
            } else {
                mostrarNotificacion('Error al eliminar', 'error');
            }
        } catch (e) { mostrarNotificacion('Error de conexión', 'error'); }
    });
}

window.mostrarProductosAdmin  = mostrarProductosAdmin;
window.abrirFormProductoAdmin = abrirFormProductoAdmin;
window.abrirEditarProductoAdmin = abrirEditarProductoAdmin;
window.cerrarFormProductoAdmin  = cerrarFormProductoAdmin;
window.guardarProductoAdmin   = guardarProductoAdmin;
window.eliminarProductoAdmin  = eliminarProductoAdmin;

// ─── USERS ────────────────────────────────────────────────────────────────────

async function mostrarUsuariosAdmin() {
    const div = document.getElementById('admin-usuarios');
    div.innerHTML = '<p class="empty-msg">Cargando...</p>';
    try {
        const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders() });
        if (!res.ok) { div.innerHTML = '<p class="empty-msg">Error al cargar.</p>'; return; }
        const users = await res.json();
        if (!users.length) { div.innerHTML = '<p class="empty-msg">No hay usuarios.</p>'; return; }
        div.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Registrado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(u => `
                        <tr>
                            <td class="text-muted">${u.id}</td>
                            <td><strong>${escapeHtml(u.name)}</strong></td>
                            <td class="text-muted">${escapeHtml(u.email)}</td>
                            <td>
                                <select class="admin-role-select" onchange="cambiarRolUsuario(${u.id}, this.value)">
                                    <option value="cliente"  ${u.role==='cliente'  ?'selected':''}>Cliente</option>
                                    <option value="vendedor" ${u.role==='vendedor' ?'selected':''}>Vendedor</option>
                                    <option value="admin"    ${u.role==='admin'    ?'selected':''}>Admin</option>
                                </select>
                            </td>
                            <td class="text-muted">${formatDate(u.created_at)}</td>
                            <td>
                                ${u.role !== 'admin' ? `<button class="btn-eliminar" onclick="eliminarUsuarioAdmin(${u.id}, '${escapeHtml(u.name)}')">🗑 Eliminar</button>` : '<span class="text-muted">—</span>'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (e) { div.innerHTML = '<p class="empty-msg">Error de conexión.</p>'; }
}

async function cambiarRolUsuario(id, nuevoRol) {
    try {
        const res = await fetch(`${API_BASE}/admin/users/${id}/role`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ role: nuevoRol })
        });
        const data = await res.json();
        if (res.ok) mostrarNotificacion('Rol actualizado a ' + nuevoRol, 'exito');
        else         mostrarNotificacion(data.msg || 'Error', 'error');
    } catch (e) { mostrarNotificacion('Error de conexión', 'error'); }
}

async function eliminarUsuarioAdmin(id, nombre) {
    mostrarConfirmacion(`¿Eliminar al usuario "${nombre}"? Esto eliminará su historial.`, async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/users/${id}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            const data = await res.json();
            if (res.ok) {
                mostrarNotificacion('Usuario eliminado', 'exito');
                mostrarUsuariosAdmin();
                actualizarEstadisticasAdmin();
            } else {
                mostrarNotificacion(data.msg || 'Error', 'error');
            }
        } catch (e) { mostrarNotificacion('Error de conexión', 'error'); }
    });
}

window.mostrarUsuariosAdmin  = mostrarUsuariosAdmin;
window.cambiarRolUsuario     = cambiarRolUsuario;
window.eliminarUsuarioAdmin  = eliminarUsuarioAdmin;

// ─── ORDERS ───────────────────────────────────────────────────────────────────

async function mostrarPedidosAdmin() {
    const div = document.getElementById('admin-pedidos');
    div.innerHTML = '<p class="empty-msg">Cargando...</p>';
    try {
        const res = await fetch(`${API_BASE}/admin/orders`, { headers: authHeaders() });
        if (!res.ok) { div.innerHTML = '<p class="empty-msg">Error al cargar.</p>'; return; }
        const orders = await res.json();
        if (!orders.length) { div.innerHTML = '<p class="empty-msg">No hay pedidos aún.</p>'; return; }
        div.innerHTML = orders.map(o => {
            const ship = o.shipping_info || {};
            const itemsList = (o.items || []).map(i =>
                `<span>${escapeHtml(i.product_name)} × ${i.quantity}</span>`
            ).join(' · ');
            return `
                <div class="admin-order-card">
                    <div class="admin-order-header">
                        <div>
                            <strong>#${o.id}</strong>
                            <span class="text-muted">${formatDate(o.created_at)}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <strong>Gs ${(o.total || 0).toLocaleString()}</strong>
                            <select class="admin-role-select" onchange="cambiarEstadoPedido(${o.id}, this.value)">
                                <option value="pending"   ${o.status==='pending'   ?'selected':''}>Pendiente</option>
                                <option value="paid"      ${o.status==='paid'      ?'selected':''}>Pagado</option>
                                <option value="shipped"   ${o.status==='shipped'   ?'selected':''}>Enviado</option>
                                <option value="delivered" ${o.status==='delivered' ?'selected':''}>Entregado</option>
                                <option value="cancelled" ${o.status==='cancelled' ?'selected':''}>Cancelado</option>
                            </select>
                        </div>
                    </div>
                    <div class="admin-order-body">
                        <div class="admin-order-section">
                            <span class="admin-label">Cliente</span>
                            <span>${escapeHtml(o.user?.name || 'N/A')} — ${escapeHtml(o.user?.email || '')}</span>
                        </div>
                        <div class="admin-order-section">
                            <span class="admin-label">Envío</span>
                            <span>${escapeHtml(ship.direccion || '')}${ship.ciudad ? ', ' + escapeHtml(ship.ciudad) : ''}${ship.departamento ? ', ' + escapeHtml(ship.departamento) : ''}</span>
                            ${ship.telefono ? `<span class="text-muted">${escapeHtml(ship.telefono)}</span>` : ''}
                        </div>
                        <div class="admin-order-section">
                            <span class="admin-label">Productos</span>
                            <span class="text-muted">${itemsList || 'Sin items'}</span>
                        </div>
                        ${ship.notas ? `<div class="admin-order-section"><span class="admin-label">Notas</span><span class="text-muted">${escapeHtml(ship.notas)}</span></div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) { div.innerHTML = '<p class="empty-msg">Error de conexión.</p>'; }
}

async function cambiarEstadoPedido(id, estado) {
    try {
        const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ status: estado })
        });
        const data = await res.json();
        if (res.ok) mostrarNotificacion('Estado actualizado', 'exito');
        else         mostrarNotificacion(data.msg || 'Error', 'error');
    } catch (e) { mostrarNotificacion('Error de conexión', 'error'); }
}

window.mostrarPedidosAdmin    = mostrarPedidosAdmin;
window.cambiarEstadoPedido    = cambiarEstadoPedido;
window.cargarPedidosRecientes = cargarPedidosRecientes;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function statusLabel(s) {
    return { pending:'Pendiente', paid:'Pagado', shipped:'Enviado', delivered:'Entregado', cancelled:'Cancelado' }[s] || s;
}

function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('es-PY', { day:'2-digit', month:'2-digit', year:'numeric' });
}

function abrirPanelAdmin() {
    document.getElementById('tienda').style.display = 'none';
    document.getElementById('panel-admin').style.display = 'block';
    adminTab('dashboard');
}

window.abrirPanelAdmin = abrirPanelAdmin;
