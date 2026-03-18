async function cargarProductos(filtros = {}) {
    let url = `${API_BASE}/products?`;
    const params = new URLSearchParams(filtros);
    url += params.toString();
    try {
        const res = await fetch(url);
        if (res.ok) {
            appState.productos = await res.json();
            mostrarProductos(appState.productos);
            actualizarOfertas();
        } else {
            mostrarNotificacion('Error al cargar productos', 'error');
        }
    } catch (error) {
        console.error(error);
    }
}

function mostrarProductos(lista) {
    const div = document.getElementById('productos');
    div.innerHTML = '';
    if (!lista || lista.length === 0) {
        div.innerHTML = '<p style="text-align:center; color:#94a3b8; padding:40px;">No hay productos disponibles.</p>';
        return;
    }
    lista.forEach(p => {
        // Fix: ranking puede ser float (3.0), repeat() necesita entero
        const numEstrellas = Math.round(p.ranking || 3);
        const estrellas = '⭐'.repeat(Math.max(0, Math.min(5, numEstrellas)));
        const esFavorito = appState.favoritos.includes(p.id);
        const claseFav = esFavorito ? 'fav activo' : 'fav';
        const tags = p.tags || [];
        const images = p.images || [];
        
        let badges = '';
        if (p.sale_type === 'mayorista') badges += '<span class="badge mayorista">Mayorista</span>';
        else if (p.sale_type === 'minorista') badges += '<span class="badge minorista">Minorista</span>';
        else if (p.sale_type === 'ambos') {
            badges += '<span class="badge mayorista">Mayorista</span><span class="badge minorista">Minorista</span>';
        }
        badges += `<span class="badge ranking">⭐ ${(p.ranking || 3).toFixed(1)}</span>`;
        if (p.stock < 10) badges += '<span class="badge stock-bajo">Stock bajo</span>';
        if (tags.includes('oferta')) badges += '<span class="badge oferta">🔥 Oferta</span>';
        if (tags.includes('nuevo')) badges += '<span class="badge nuevo">🆕 Nuevo</span>';
        if (tags.includes('liquidacion')) badges += '<span class="badge liquidacion">🏷️ Liquidación</span>';
        if (p.volume_prices && Object.keys(p.volume_prices).length > 0) {
            badges += '<span class="badge volumen">📦 Descuento por volumen</span>';
        }

        div.innerHTML += `
            <div class="producto">
                <img src="${escapeHtml(images[0] || 'https://placehold.co/300x200?text=Sin+imagen')}" onerror="this.src='https://placehold.co/300x200'" alt="${escapeHtml(p.name)}">
                <h3>${escapeHtml(p.name)}</h3>
                <div>${estrellas}</div>
                <div class="etiquetas">${badges}</div>
                <p class="precio">Gs ${p.base_price.toLocaleString()}</p>
                <p style="font-size:12px;color:#94a3b8;margin:0 18px 8px">Stock: ${p.stock}</p>
                <input type="number" id="cant-${p.id}" value="1" min="1" max="${p.stock}" aria-label="Cantidad de ${escapeHtml(p.name)}">
                <button class="btn" onclick="agregar(${p.id})">Agregar</button>
                <button class="btn btn-detalles" onclick="abrirModal(${p.id})">🔍 Ver detalles</button>
                <button class="btn ${claseFav}" onclick="toggleFavorito(${p.id})" aria-label="${esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}">♥</button>
            </div>
        `;
    });
}

async function aplicarFiltros() {
    const filtros = {
        sale_type: document.getElementById('filtroVenta').value === 'todos' ? '' : document.getElementById('filtroVenta').value,
        min_ranking: document.getElementById('filtroRanking').value,
        tags: document.getElementById('filtroEtiqueta').value === 'todas' ? '' : document.getElementById('filtroEtiqueta').value,
        sort: document.getElementById('ordenPrecio').value
    };
    Object.keys(filtros).forEach(key => filtros[key] === '' && delete filtros[key]);
    await cargarProductos(filtros);
}

document.getElementById('buscador')?.addEventListener('keyup', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = appState.productos.filter(p => p.name.toLowerCase().includes(texto));
    mostrarProductos(filtrados);
});

async function cargarCategorias() {
    try {
        const res = await fetch(`${API_BASE}/products/categories`);
        if (res.ok) {
            const cats = await res.json();
            const categoriasDiv = document.getElementById('categorias');
            categoriasDiv.innerHTML = '';
            cats.forEach(c => {
                categoriasDiv.innerHTML += `
                    <div class="categoria" onclick="filtrarCategoria('${c}')">
                        <img src="https://placehold.co/40?text=${c}">
                        <p>${c}</p>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Error al cargar categorías', error);
    }
}

function filtrarCategoria(cat) {
    cargarProductos({ category: cat });
}

async function actualizarOfertas() {
    try {
        const res = await fetch(`${API_BASE}/products/featured`);
        if (res.ok) {
            const ofertas = await res.json();
            const grid = document.getElementById('ofertas-grid');
            grid.innerHTML = '';
            ofertas.forEach(p => {
                let badges = '';
                if (p.tags) {
                    if (p.tags.includes('oferta')) badges += '<span class="badge oferta">Oferta</span>';
                    if (p.tags.includes('nuevo')) badges += '<span class="badge nuevo">Nuevo</span>';
                    if (p.tags.includes('liquidacion')) badges += '<span class="badge liquidacion">Liquidación</span>';
                }
                let precioOferta = p.base_price;
                if (p.volume_prices && p.volume_prices['5']) precioOferta = p.volume_prices['5'];
                grid.innerHTML += `
                    <div class="oferta-card" onclick="abrirModal(${p.id})">
                        <img src="${escapeHtml(p.images?.[0] || 'https://placehold.co/200x120')}" alt="${escapeHtml(p.name)}">
                        <strong>${escapeHtml(p.name)}</strong>
                        <div class="etiquetas">${badges}</div>
                        <div>
                            <span class="precio-oferta">Gs ${precioOferta.toLocaleString()}</span>
                            <span class="precio-original">Gs ${p.base_price.toLocaleString()}</span>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Error al cargar ofertas', error);
    }
}

window.cargarProductos = cargarProductos;
window.mostrarProductos = mostrarProductos;
window.aplicarFiltros = aplicarFiltros;
window.filtrarCategoria = filtrarCategoria;
window.actualizarOfertas = actualizarOfertas;