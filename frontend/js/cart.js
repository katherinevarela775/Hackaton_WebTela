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
