async function agregarProducto() {
    if (!appState.token || appState.usuarioActual?.role !== 'vendedor') {
        mostrarNotificacion('No autorizado', 'error');
        return;
    }
    const formData = new FormData();
    formData.append('name', document.getElementById('v-nombre').value);
    formData.append('base_price', document.getElementById('v-precio').value);
    formData.append('category', document.getElementById('v-categoria').value);
    formData.append('sale_type', document.getElementById('v-venta').value);
    formData.append('stock', document.getElementById('v-stock').value);
    formData.append('description', document.getElementById('v-descripcion').value);
    
    const imagen = document.getElementById('v-imagen').files[0];
    if (imagen) formData.append('image', imagen);

    const precio5 = document.getElementById('v-precio5').value;
    const precio10 = document.getElementById('v-precio10').value;
    const precio20 = document.getElementById('v-precio20').value;
    const volumePrices = {};
    if (precio5) volumePrices[5] = precio5;
    if (precio10) volumePrices[10] = precio10;
    if (precio20) volumePrices[20] = precio20;
    formData.append('volume_prices', JSON.stringify(volumePrices));

    const etiquetas = [];
    if (document.getElementById('tag-oferta').checked) etiquetas.push('oferta');
    if (document.getElementById('tag-nuevo').checked) etiquetas.push('nuevo');
    if (document.getElementById('tag-liquidacion').checked) etiquetas.push('liquidacion');
    formData.append('tags', JSON.stringify(etiquetas));

    try {
        const res = await fetch(`${API_BASE}/vendor/products`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${appState.token}` },
            body: formData
        });
        if (res.ok) {
            mostrarNotificacion('Producto publicado', 'exito');
            limpiarFormularioVendedor();
            mostrarMisProductos();
            cargarProductos();
        } else {
            const err = await res.json();
            mostrarNotificacion(err.msg || 'Error', 'error');
        }
    } catch (error) {
        mostrarNotificacion('Error de conexión', 'error');
    }
}

async function mostrarMisProductos() {
    const div = document.getElementById('mis-productos');
    try {
        const res = await fetch(`${API_BASE}/vendor/products`, { headers: authHeaders() });
        if (res.ok) {
            const productos = await res.json();
            if (productos.length === 0) {
                div.innerHTML = '<p style="color:#94a3b8; text-align:center;">No has publicado productos aún.</p>';
                return;
            }
            div.innerHTML = '';
            productos.forEach(p => {
                let etiquetasHtml = '';
                if (p.tags) {
                    if (p.tags.includes('oferta')) etiquetasHtml += '<span class="badge oferta">Oferta</span>';
                    if (p.tags.includes('nuevo')) etiquetasHtml += '<span class="badge nuevo">Nuevo</span>';
                    if (p.tags.includes('liquidacion')) etiquetasHtml += '<span class="badge liquidacion">Liquidación</span>';
                }
                div.innerHTML += `
                    <div class="producto-vendedor">
                        <h4>${escapeHtml(p.name)}</h4>
                        <div class="detalles">$${p.base_price} | Stock: ${p.stock} | ${escapeHtml(p.category)}</div>
                        <div class="etiquetas-mini">${etiquetasHtml}</div>
                        <div class="acciones">
                            <button class="btn-editar" onclick="editarProducto(${p.id})">✏ Editar</button>
                            <button class="btn-eliminar" onclick="eliminarProductoVendedor(${p.id})">🗑 Eliminar</button>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error(error);
    }
}

async function eliminarProductoVendedor(id) {
    mostrarConfirmacion('¿Eliminar producto?', async () => {
        try {
            const res = await fetch(`${API_BASE}/vendor/products/${id}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            if (res.ok) {
                mostrarNotificacion('Producto eliminado', 'exito');
                mostrarMisProductos();
                cargarProductos();
            } else {
                mostrarNotificacion('Error al eliminar', 'error');
            }
        } catch (error) {
            mostrarNotificacion('Error de conexión', 'error');
        }
    });
}

async function editarProducto(id) {
    try {
        const res = await fetch(`${API_BASE}/vendor/products/${id}`, { headers: authHeaders() });
        if (res.ok) {
            const p = await res.json();
            document.getElementById('v-nombre').value = p.name;
            document.getElementById('v-precio').value = p.base_price;
            document.getElementById('v-categoria').value = p.category;
            document.getElementById('v-venta').value = p.sale_type;
            document.getElementById('v-stock').value = p.stock;
            document.getElementById('v-descripcion').value = p.description;
            document.getElementById('v-precio5').value = p.volume_prices?.[5] || '';
            document.getElementById('v-precio10').value = p.volume_prices?.[10] || '';
            document.getElementById('v-precio20').value = p.volume_prices?.[20] || '';
            document.getElementById('tag-oferta').checked = p.tags?.includes('oferta');
            document.getElementById('tag-nuevo').checked = p.tags?.includes('nuevo');
            document.getElementById('tag-liquidacion').checked = p.tags?.includes('liquidacion');

            const btn = document.getElementById('btn-publicar');
            btn.textContent = '💾 Guardar cambios';
            btn.onclick = () => guardarEdicion(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (error) {
        console.error(error);
    }
}

async function guardarEdicion(id) {
    const formData = new FormData();
    formData.append('name', document.getElementById('v-nombre').value);
    formData.append('base_price', document.getElementById('v-precio').value);
    formData.append('category', document.getElementById('v-categoria').value);
    formData.append('sale_type', document.getElementById('v-venta').value);
    formData.append('stock', document.getElementById('v-stock').value);
    formData.append('description', document.getElementById('v-descripcion').value);
    
    const imagen = document.getElementById('v-imagen').files[0];
    if (imagen) formData.append('image', imagen);

    const volumePrices = {};
    if (document.getElementById('v-precio5').value) volumePrices[5] = document.getElementById('v-precio5').value;
    if (document.getElementById('v-precio10').value) volumePrices[10] = document.getElementById('v-precio10').value;
    if (document.getElementById('v-precio20').value) volumePrices[20] = document.getElementById('v-precio20').value;
    formData.append('volume_prices', JSON.stringify(volumePrices));

    const etiquetas = [];
    if (document.getElementById('tag-oferta').checked) etiquetas.push('oferta');
    if (document.getElementById('tag-nuevo').checked) etiquetas.push('nuevo');
    if (document.getElementById('tag-liquidacion').checked) etiquetas.push('liquidacion');
    formData.append('tags', JSON.stringify(etiquetas));

    try {
        const res = await fetch(`${API_BASE}/vendor/products/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${appState.token}` },
            body: formData
        });
        if (res.ok) {
            mostrarNotificacion('Producto actualizado', 'exito');
            limpiarFormularioVendedor();
            mostrarMisProductos();
            cargarProductos();
            const btn = document.getElementById('btn-publicar');
            btn.textContent = 'Publicar producto';
            btn.onclick = agregarProducto;
        } else {
            mostrarNotificacion('Error al actualizar', 'error');
        }
    } catch (error) {
        mostrarNotificacion('Error de conexión', 'error');
    }
}

function limpiarFormularioVendedor() {
    ['v-nombre','v-precio','v-stock','v-imagen','v-descripcion','v-precio5','v-precio10','v-precio20'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('tag-oferta').checked = false;
    document.getElementById('tag-nuevo').checked = false;
    document.getElementById('tag-liquidacion').checked = false;
}

window.agregarProducto = agregarProducto;
window.mostrarMisProductos = mostrarMisProductos;
window.eliminarProductoVendedor = eliminarProductoVendedor;
window.editarProducto = editarProducto;