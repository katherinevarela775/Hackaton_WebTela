class Carrito {
    constructor() {
        // Cargar datos previos de localStorage o empezar vacío
        this.items = JSON.parse(localStorage.getItem('carrito_telas')) || [];
    }

    // Agregar producto o aumentar metros
    agregar(producto, metros = 1) {
        const existe = this.items.find(item => item.id === producto.id);

        if (existe) {
            // Validar que no supere el stock de la DB
            if (existe.cantidad + metros <= producto.stock_metros) {
                existe.cantidad += metros;
            } else {
                alert("No hay suficiente stock en metros");
            }
        } else {
            this.items.push({ ...producto, cantidad: metros });
        }
        this.guardar();
    }

    // Quitar un producto por completo
    eliminar(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.guardar();
    }

    // Calcular el total en Guaraníes
    calcularTotal() {
        return this.items.reduce((total, item) => total + (item.precio_por_metro * item.cantidad), 0);
    }

    // Guardar en el navegador
    guardar() {
        localStorage.setItem('carrito_telas', JSON.stringify(this.items));
        // Opcional: Disparar un evento para actualizar la UI
        document.dispatchEvent(new Event('carritoActualizado'));
    }

    vaciar() {
        this.items = [];
        this.guardar();
    }
}

const miCarrito = new Carrito();
