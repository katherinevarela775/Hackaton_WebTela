# BulkFab - Plataforma de Telas al por Mayor

BulkFab es una plataforma de e-commerce B2B orientada al mercado textil mayorista de Paraguay. Permite a vendedores publicar productos textiles y a clientes realizar compras con precios por volumen, gestión de pedidos y panel de administración completo.

---

## Tecnologías utilizadas

**Backend**
- Python 3.x + Flask 2.3.3
- Flask-SQLAlchemy + SQLite
- Flask-JWT-Extended (autenticación por tokens)
- Flask-Bcrypt (hash de contraseñas)
- Flask-CORS
- Flask-Migrate

**Frontend**
- HTML5 + CSS3 (custom)
- JavaScript vanilla (SPA sin frameworks)
- TailwindCSS (vía CDN)

---

## Estructura del proyecto

```
Hackaton_BulkFab/
├── Backend/
│   ├── app/
│   │   ├── __init__.py          # Factory de la app, blueprints
│   │   ├── models/              # Modelos SQLAlchemy
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   └── favorite.py
│   │   ├── routes/              # Endpoints REST por módulo
│   │   │   ├── auth.py
│   │   │   ├── products.py
│   │   │   ├── orders.py
│   │   │   ├── vendor.py
│   │   │   ├── admin.py
│   │   │   └── favorites.py
│   │   ├── middleware/
│   │   │   └── auth.py          # Decorador @require_role
│   │   └── utils/
│   │       └── helpers.py
│   ├── config.py                # Configuración y variables de entorno
│   ├── run.py                   # Punto de entrada del servidor
│   ├── seed.py                  # Script para poblar la base de datos
│   ├── requirements.txt
│   └── instance/
│       └── bulkfab.db           # Base de datos SQLite
├── frontend/
│   ├── index.html               # SPA principal
│   ├── callback.html            # Callback OAuth de Google
│   ├── js/
│   │   ├── main.js              # Navegación y estado global
│   │   ├── auth.js              # Login / registro
│   │   ├── products.js          # Catálogo de productos
│   │   ├── cart.js              # Carrito y checkout
│   │   ├── favorites.js         # Lista de favoritos
│   │   ├── vendor.js            # Panel del vendedor
│   │   ├── admin.js             # Panel de administración
│   │   ├── modal.js             # Modal de detalle de producto
│   │   └── utils.js             # Estado global y utilidades
│   └── css/
│       └── style.css
└── Como_Ejecutar_BulkFab.pdf
```

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/katherinevarela775/Hackaton_WebTela.git
cd Hackaton_WebTela/Backend
```

### 2. Crear entorno virtual e instalar dependencias

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Configurar variables de entorno

Crear un archivo `.env` dentro de la carpeta `Backend/` con el siguiente contenido:

```env
SECRET_KEY=tu_clave_secreta
JWT_SECRET_KEY=tu_jwt_secret
DATABASE_URL=sqlite:///bulkfab.db
FRONTEND_URL=http://localhost:5000
```

### 4. Iniciar el servidor

```bash
python run.py
```

El servidor queda disponible en `http://localhost:5000`

### 5. Poblar la base de datos (opcional)

```bash
python seed.py
```

Esto crea 5 vendedores y 10 productos de ejemplo.

---

## API REST

**Base URL:** `http://localhost:5000/api`

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión (retorna JWT) |
| GET | `/auth/me` | Obtener usuario actual (JWT requerido) |

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/products/` | Listar productos con filtros |
| GET | `/products/<id>` | Detalle de producto |
| GET | `/products/featured` | Productos destacados |
| GET | `/products/categories` | Categorías disponibles |

### Pedidos (JWT requerido)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/orders/` | Crear pedido |
| GET | `/orders/` | Listar pedidos del usuario |
| GET | `/orders/<id>` | Detalle de pedido |

### Panel Vendedor (JWT + rol: vendedor)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/vendor/products` | Crear producto |
| GET | `/vendor/products` | Listar mis productos |
| PUT | `/vendor/products/<id>` | Editar producto |
| DELETE | `/vendor/products/<id>` | Eliminar producto |
| GET | `/vendor/stats` | Estadísticas de ventas |

### Panel Admin (JWT + rol: admin)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/admin/stats` | Estadísticas generales |
| GET | `/admin/users` | Listar usuarios |
| PUT | `/admin/users/<id>/role` | Cambiar rol de usuario |
| DELETE | `/admin/users/<id>` | Eliminar usuario |
| GET | `/admin/products` | Listar todos los productos |
| PUT | `/admin/products/<id>` | Editar producto |
| DELETE | `/admin/products/<id>` | Eliminar producto |
| GET | `/admin/orders` | Listar todos los pedidos |
| PUT | `/admin/orders/<id>/status` | Actualizar estado de pedido |

---

## Roles de usuario

| Rol | Permisos |
|-----|----------|
| `cliente` | Navegar, comprar, gestionar favoritos y pedidos |
| `vendedor` | Todo lo anterior + crear y gestionar productos propios |
| `admin` | Acceso total: usuarios, productos y pedidos |

---

## Modelos de base de datos

### User
- `id`, `name`, `email`, `password_hash`, `google_id`
- `role`: `cliente` | `vendedor` | `admin`
- `avatar`, `created_at`, `updated_at`

### Product
- `id`, `name`, `description`, `category`
- `base_price`, `sale_type`: `mayorista` | `minorista` | `ambos`
- `stock`, `images` (JSON), `ranking`
- `tags` (JSON): `oferta` | `nuevo` | `liquidacion`
- `volume_prices` (JSON): descuentos por cantidad
- `vendor_id` (FK a User), `sales_count`

### Order
- `id`, `user_id` (FK), `items` (JSON)
- `total`, `status`: `pending` | `paid` | `shipped` | `delivered` | `cancelled`
- `shipping_info` (JSON)

### Favorite
- `id`, `user_id` (FK), `product_id` (FK)

---

## Funcionalidades principales

**Para clientes**
- Catálogo de productos con filtros por categoría, tipo de venta, valoración y etiquetas
- Precios por volumen (descuentos automáticos en compras al por mayor)
- Carrito de compras con cálculo de envío por departamento (Paraguay)
- Lista de favoritos
- Historial de pedidos

**Para vendedores**
- Panel para crear, editar y eliminar productos
- Carga de imágenes de productos
- Configuración de precios por volumen
- Estadísticas de ventas

**Para administradores**
- Dashboard con métricas globales
- Gestión de usuarios (cambio de rol, eliminación)
- Gestión de productos y pedidos

---

## Usuarios de prueba (seed.py)

| Email | Contraseña | Rol |
|-------|-----------|-----|
| textilesoriente@ejemplo.com | TextilesOriente2024 | vendedor |
| itaputelas@ejemplo.com | ItapuaTelas2024 | vendedor |
| centraltextil@ejemplo.com | CentralTextil2024 | vendedor |
| telasdelnorte@ejemplo.com | TelasDelNorte2024 | vendedor |
| fashionfabrics@ejemplo.com | FashionFabrics2024 | vendedor |

---

## Autora

**Katherine Varela** — [@katherinevarela775](https://github.com/katherinevarela775)
