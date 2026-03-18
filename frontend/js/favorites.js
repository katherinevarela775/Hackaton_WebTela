async function cargarFavoritos() {
    if (!appState.token) return;
    try {
        const res = await fetch(`${API_BASE}/favorites`, { headers: authHeaders() });
        if (res.ok) {
            const favs = await res.json();
            appState.favoritos = favs.map(f => f.product_id);
            actualizarContadorFav();
        }
    } catch (error) {
        console.error('Error al cargar favoritos', error);
    }
}

async function toggleFavorito(productId) {
    if (!appState.token) {
        mostrarNotificacion('Debes iniciar sesión', 'error');
        return;
    }
    const esFav = appState.favoritos.includes(productId);
    const method = esFav ? 'DELETE' : 'POST';
    try {
        const res = await fetch(`${API_BASE}/favorites/${productId}`, {
            method,
            headers: authHeaders()
        });
        if (res.ok) {
            if (esFav) {
                appState.favoritos = appState.favoritos.filter(id => id !== productId);
                mostrarNotificacion('Eliminado de favoritos', 'exito');
            } else {
                appState.favoritos.push(productId);
                mostrarNotificacion('Agregado a favoritos', 'exito');
            }
            actualizarContadorFav();
            mostrarProductos(appState.productos);
        } else {
            mostrarNotificacion('Error al modificar favoritos', 'error');
        }
    } catch (error) {
        mostrarNotificacion('Error de conexión', 'error');
    }
}

function verFavoritos() {
    const favoritosProductos = appState.productos.filter(p => appState.favoritos.includes(p.id));
    mostrarProductos(favoritosProductos);
}

function actualizarContadorFav() {
    document.getElementById('contador-fav').textContent = appState.favoritos.length;
}

window.toggleFavorito = toggleFavorito;
window.verFavoritos = verFavoritos;