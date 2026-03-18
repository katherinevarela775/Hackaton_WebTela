// cart.js - Logica del carrito de compras

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, product = null, quantity = 1) {
    const existing = cart.find(item => item.product_id === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ product_id: productId, product, quantity });
    }
    saveCart();
    updateCartBadge();
    showToast('Producto agregado al carrito', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product_id !== productId);
    saveCart();
    updateCartBadge();
}

function updateCartItemQty(productId, quantity) {
    const item = cart.find(i => i.product_id === productId);
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) removeFromCart(productId);
        else saveCart();
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
}

function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = getCartCount();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartBadge();
}

function renderCartItems(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">El carrito esta vacio</p>';
        return;
    }
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span class="cart-item-name">${item.product?.name || 'Producto #' + item.product_id}</span>
            <span class="cart-item-qty">x${item.quantity}</span>
            <span class="cart-item-price">${formatPrice((item.product?.price || 0) * item.quantity)}</span>
            <button onclick="removeFromCart(${item.product_id}); renderCartItems('${containerId}')">✕</button>
        </div>
    `).join('') + `<div class="cart-total"><strong>Total: ${formatPrice(getCartTotal())}</strong></div>`;
}

async function checkoutCart() {
    if (!isLoggedIn()) { showToast('Debes iniciar sesion para comprar', 'error'); return; }
    if (cart.length === 0) { showToast('El carrito esta vacio', 'error'); return; }
    const items = cart.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.product?.price || 0 }));
    const total = getCartTotal();
    try {
        await apiFetch('/api/orders', { method: 'POST', body: JSON.stringify({ total, items }) });
        clearCart();
        showToast('Pedido realizado con exito', 'success');
    } catch (err) {
        showToast(err.message, 'error');
    }
}
