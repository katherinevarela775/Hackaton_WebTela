// Costos de envío desde Asunción (fábrica) a cada departamento, en Guaraníes
// Basado en distancia aproximada por ruta al centro departamental
const COSTOS_ENVIO = {
    'Capital':          0,       //   0 km — retiro en fábrica, sin costo
    'Central':          15000,   //  15 km — Gran Asunción (Luque, San Lorenzo, etc.)
    'Presidente Hayes': 20000,   //  30 km — Villa Hayes
    'Cordillera':       30000,   //  54 km — Caacupé
    'Paraguarí':        40000,   //  70 km — Paraguarí
    'Guairá':           55000,   // 160 km — Villarrica
    'San Pedro':        55000,   // 170 km — San Pedro del Ycuamandiyú
    'Caaguazú':         60000,   // 180 km — Coronel Oviedo
    'Misiones':         60000,   // 200 km — San Juan Bautista
    'Caazapá':          65000,   // 230 km — Caazapá
    'Canindeyú':        70000,   // 280 km — Salto del Guairá
    'Concepción':       70000,   // 310 km — Concepción
    'Alto Paraná':      75000,   // 330 km — Ciudad del Este
    'Ñeembucú':         80000,   // 360 km — Pilar
    'Itapúa':           80000,   // 370 km — Encarnación
    'Amambay':          90000,   // 440 km — Pedro Juan Caballero
    'Boquerón':         95000,   // 480 km — Filadelfia
    'Alto Paraguay':   110000,   // 600 km — Fuerte Olimpo
};

function getCostoEnvio() {
    const dep = document.getElementById('envio-departamento')?.value || '';
    return COSTOS_ENVIO[dep] ?? null; // null = no seleccionado aún
}

function actualizarResumenEnvio() {
    const subtotal = appState.carrito.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0);
    const costoEnvio = getCostoEnvio();
    const lineas = appState.carrito.map(i =>
        `<div class="envio-resumen-item"><span>${escapeHtml(i.name)} × ${i.cantidad}</span><span>Gs ${(i.precioUnitario * i.cantidad).toLocaleString()}</span></div>`
    ).join('');

    let envioHtml = '';
    let totalFinal = subtotal;
    if (costoEnvio === null) {
        envioHtml = `<div class="envio-resumen-item envio-costo-row"><span>Envío</span><span class="envio-pendiente">Seleccioná departamento</span></div>`;
    } else if (costoEnvio === 0) {
        envioHtml = `<div class="envio-resumen-item envio-costo-row"><span>Envío</span><span class="envio-gratis">Gratis — Retiro en fábrica</span></div>`;
    } else {
        totalFinal += costoEnvio;
        envioHtml = `<div class="envio-resumen-item envio-costo-row"><span>Envío</span><span>Gs ${costoEnvio.toLocaleString()}</span></div>`;
    }

    document.getElementById('envio-resumen').innerHTML = `
        <h4>Resumen del pedido</h4>
        <div class="envio-resumen-item envio-subtotal-row"><span>Subtotal productos</span><span>Gs ${subtotal.toLocaleString()}</span></div>
        ${envioHtml}
        <div class="envio-resumen-total"><span>Total</span><span>Gs ${totalFinal.toLocaleString()}</span></div>
    `;
}

window.actualizarResumenEnvio = actualizarResumenEnvio;

function agregar(id, cantidad = null) {
    const prod = appState.productos.find(p => p.id === id);
    if (!prod) return;
    let cant = cantidad || parseInt(document.getElementById('cant-' + id)?.value || 1);
    if (cant > prod.stock) {
        mostrarNotificacion(`Stock insuficiente. Quedan ${prod.stock}`, 'error');
        return;
    }
    const item = appState.carrito.find(i => i.id === id);
    if (item) {
        if (item.cantidad + cant > prod.stock) {
            mostrarNotificacion(`No puedes agregar más. Stock disponible: ${prod.stock - item.cantidad}`, 'error');
            return;
        }
        item.cantidad += cant;
        item.precioUnitario = obtenerPrecioPorCantidad(prod, item.cantidad);
    } else {
        const precioUnitario = obtenerPrecioPorCantidad(prod, cant);
        appState.carrito.push({ ...prod, cantidad: cant, precioUnitario });
    }
    renderCarrito();
    mostrarNotificacion('Producto agregado al carrito', 'exito');
}

function obtenerPrecioPorCantidad(prod, cantidad) {
    if (!prod.volume_prices) return prod.base_price;
    const rangos = Object.keys(prod.volume_prices).map(Number).sort((a,b)=>a-b);
    let precio = prod.base_price;
    for (let r of rangos) {
        if (cantidad >= r) {
            precio = prod.volume_prices[r];
        }
    }
    return precio;
}

function renderCarrito() {
    let total = 0;
    let items = 0;
    let html = '';

    appState.carrito.forEach(p => {
        const subtotal = p.precioUnitario * p.cantidad;
        total += subtotal;
        items += p.cantidad;

        html += `
            <div class="item">
                <img src="${escapeHtml(p.images?.[0] || 'https://placehold.co/80')}" alt="${escapeHtml(p.name)}">
                <div class="item-info">
                    <b>${escapeHtml(p.name)}</b>
                    <div class="item-precio">Gs ${p.precioUnitario.toLocaleString()} c/u</div>
                    <div class="item-cantidad">
                        <button onclick="cambiarCantidad(${p.id}, -1)">-</button>
                        <span>${p.cantidad}</span>
                        <button onclick="cambiarCantidad(${p.id}, 1)">+</button>
                    </div>
                    <button class="eliminar-item" onclick="eliminarProducto(${p.id})">Eliminar</button>
                </div>
            </div>
        `;
    });

    document.getElementById('contador').textContent = items;
    document.getElementById('carrito-contenido').innerHTML = html || '<p style="padding:20px; text-align:center;">Tu carrito está vacío</p>';
    document.getElementById('subtotal-valor').textContent = 'Gs ' + total.toLocaleString();
}

function cambiarCantidad(id, delta) {
    const item = appState.carrito.find(i => i.id === id);
    if (!item) return;
    const prod = appState.productos.find(p => p.id === id);
    const nuevaCant = item.cantidad + delta;
    if (nuevaCant > prod.stock) {
        mostrarNotificacion(`Stock máximo: ${prod.stock}`, 'error');
        return;
    }
    if (nuevaCant <= 0) {
        appState.carrito = appState.carrito.filter(i => i.id !== id);
        mostrarNotificacion('Producto eliminado del carrito', 'exito');
    } else {
        item.cantidad = nuevaCant;
        item.precioUnitario = obtenerPrecioPorCantidad(prod, nuevaCant);
    }
    renderCarrito();
}

function eliminarProducto(id) {
    appState.carrito = appState.carrito.filter(i => i.id !== id);
    renderCarrito();
    mostrarNotificacion('Producto eliminado del carrito', 'exito');
}

function vaciarCarrito() {
    mostrarConfirmacion('¿Vaciar carrito?', () => {
        appState.carrito = [];
        renderCarrito();
        mostrarNotificacion('Carrito vaciado', 'exito');
    });
}

function confirmarPago() {
    if (appState.carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'error');
        return;
    }
    if (!appState.token) {
        mostrarNotificacion('Debes iniciar sesión para continuar', 'error');
        mostrarModalCliente();
        return;
    }
    abrirModalEnvio();
}

function abrirModalEnvio() {
    if (appState.usuarioActual) {
        document.getElementById('envio-nombre').value = appState.usuarioActual.name || '';
        document.getElementById('envio-email').value = appState.usuarioActual.email || '';
    }

    actualizarResumenEnvio();

    // Actualizar resumen cada vez que cambia el departamento
    const selectDep = document.getElementById('envio-departamento');
    selectDep.onchange = actualizarResumenEnvio;

    document.getElementById('modal-envio').style.display = 'flex';
}

function cerrarModalEnvio() {
    document.getElementById('modal-envio').style.display = 'none';
}

async function procesarPedido() {
    const nombre    = document.getElementById('envio-nombre').value.trim();
    const email     = document.getElementById('envio-email').value.trim();
    const telefono  = document.getElementById('envio-telefono').value.trim();
    const direccion = document.getElementById('envio-direccion').value.trim();
    const ciudad    = document.getElementById('envio-ciudad').value.trim();

    if (!nombre || !email || !telefono || !direccion || !ciudad) {
        mostrarNotificacion('Completá los campos obligatorios (*)', 'error');
        return;
    }

    const departamento = document.getElementById('envio-departamento').value;
    const costoEnvio = COSTOS_ENVIO[departamento] ?? 0;

    const shipping_info = {
        nombre,
        email,
        telefono,
        direccion,
        ciudad,
        departamento,
        costo_envio: costoEnvio,
        notas: document.getElementById('envio-notas').value.trim(),
    };

    const items = appState.carrito.map(i => ({ product_id: i.id, quantity: i.cantidad }));

    const btn = document.querySelector('.btn-confirmar-envio');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
        const res = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${appState.token}` },
            body: JSON.stringify({ items, shipping_info })
        });
        if (res.ok) {
            cerrarModalEnvio();
            document.getElementById('carrito-panel').classList.remove('abierto');
            mostrarNotificacion('¡Pedido confirmado! Te contactaremos pronto.', 'exito');
            appState.carrito = [];
            renderCarrito();
            cargarProductos();
            document.getElementById('form-envio').reset();
        } else {
            const err = await res.json();
            mostrarNotificacion(err.msg || 'Error al crear pedido', 'error');
        }
    } catch {
        mostrarNotificacion('Error de conexión', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Confirmar pedido →';
    }
}

window.agregar = agregar;
window.cambiarCantidad = cambiarCantidad;
window.eliminarProducto = eliminarProducto;
window.vaciarCarrito = vaciarCarrito;
window.confirmarPago = confirmarPago;
window.procesarPedido = procesarPedido;
window.cerrarModalEnvio = cerrarModalEnvio;
window.cerrarCarrito = () => document.getElementById('carrito-panel').classList.remove('abierto');

document.getElementById('btnCarrito')?.addEventListener('click', () => {
    document.getElementById('carrito-panel').classList.add('abierto');
});