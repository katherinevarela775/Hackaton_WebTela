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
