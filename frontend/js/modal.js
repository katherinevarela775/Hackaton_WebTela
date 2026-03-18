async function abrirModal(id) {
    try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (res.ok) {
            const prod = await res.json();
            appState.productoActual = prod;
            document.getElementById('modal-imagen').innerHTML = `<img src="${prod.images?.[0] || 'https://placehold.co/400x300'}">`;
            document.getElementById('modal-titulo').textContent = prod.name;
            document.getElementById('modal-estrellas').textContent = '⭐'.repeat(Math.round(prod.ranking || 3));
            document.getElementById('modal-precio').textContent = `$${prod.base_price}`;
            document.getElementById('modal-descripcion').textContent = prod.description || 'Sin descripción.';
            
            let tablaHtml = '';
            if (prod.volume_prices && Object.keys(prod.volume_prices).length > 1) {
                tablaHtml = '<table><tr><th>Cantidad</th><th>Precio unidad</th></tr>';
                const rangos = Object.keys(prod.volume_prices).map(Number).sort((a,b)=>a-b);
                rangos.forEach(r => {
                    tablaHtml += `<tr><td>${r}+ unidades</td><td>$${prod.volume_prices[r]}</td></tr>`;
                });
                tablaHtml += '</table>';
            }
            document.getElementById('modal-tabla-precios').innerHTML = tablaHtml;

            document.getElementById('modal-cant').value = 1;
            document.getElementById('modal-cant').max = prod.stock;
            actualizarBotonFavoritoModal();
            document.getElementById('modal-detalles').style.display = 'flex';
        }
    } catch (error) {
        console.error(error);
    }
}

function actualizarBotonFavoritoModal() {
    const prod = appState.productoActual;
    if (!prod) return;
    const esFav = appState.favoritos.includes(prod.id);
    const btn = document.getElementById('modal-favorito');
    if (esFav) {
        btn.classList.add('activo');
        btn.textContent = '♥ En favoritos';
    } else {
        btn.classList.remove('activo');
        btn.textContent = '♡ Agregar a favoritos';
    }
}

function cerrarModal() {
    document.getElementById('modal-detalles').style.display = 'none';
}

document.getElementById('modal-agregar')?.addEventListener('click', () => {
    if (!appState.productoActual) return;
    const cantidad = parseInt(document.getElementById('modal-cant').value);
    agregar(appState.productoActual.id, cantidad);
    cerrarModal();
});

document.getElementById('modal-favorito')?.addEventListener('click', () => {
    if (!appState.productoActual) return;
    toggleFavorito(appState.productoActual.id);
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal-detalles');
    if (e.target === modal) cerrarModal();
});

window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;