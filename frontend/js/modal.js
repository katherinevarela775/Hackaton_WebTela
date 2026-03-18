// modal.js - Manejo de modales

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
}

function openProductDetailModal(product) {
    const modal = document.getElementById('productDetailModal');
    if (!modal) return;
    const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
    modal.querySelector('.modal-title').textContent = product.name;
    modal.querySelector('.modal-description').textContent = product.description || '';
    modal.querySelector('.modal-price').textContent = formatPrice(product.price);
    modal.querySelector('.modal-stock').textContent = `Stock: ${product.stock}`;
    modal.querySelector('.modal-image').src = images[0] || '';
    modal.querySelector('.btn-add-cart').onclick = () => { addToCart(product.id, product); closeAllModals(); };
    openModal('productDetailModal');
}

function openLoginModal() {
    closeAllModals();
    openModal('loginModal');
}

function openRegisterModal() {
    closeAllModals();
    openModal('registerModal');
}

function bindModalEvents() {
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => closeAllModals());
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeAllModals();
        });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });
}
