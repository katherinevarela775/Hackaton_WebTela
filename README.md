# BulkFab - Plataforma de Telas al por Mayor

Marketplace B2B para conectar fabricantes y compradores mayoristas de telas.

## Equipo

| Integrante | Rama | Responsabilidad |
|---|---|---|
| Matias Gauto | feature-auth | Autenticacion, config, User model |
| Lucas Fernandez | feature/products | Product model, helpers, rutas, seed |
| Sebas | feature/orders | Order model, rutas de pedidos |
| Elias | feature/vendor-admin | Panel vendedor y panel admin |
| Katherine Varela | feature/front | Frontend, favoritos, CSS/HTML |

## Stack

- **Backend**: Python 3 + Flask 2.3 + SQLAlchemy + JWT + Bcrypt
- **Frontend**: HTML5 + Vanilla JS + TailwindCSS + Inter font
- **DB**: SQLite (desarrollo)

## Instalacion

```bash
cd Backend
python -m venv venv && source venv/bin/activate  # Linux/Mac
python -m venv venv_win && venv_win\Scripts\activate  # Windows
pip install -r requirements.txt
python run.py
```

Abrir `frontend/index.html` en el navegador o con Live Server en puerto 5500.

## API Endpoints

### Auth
- `POST /api/auth/register` — Registrar usuario
- `POST /api/auth/login` — Iniciar sesion (retorna JWT)
- `GET /api/auth/me` — Perfil del usuario autenticado

### Productos
- `GET /api/products` — Listar productos (filtros: search, category, sort)
- `GET /api/products/:id` — Detalle de producto
- `GET /api/products/featured` — Productos destacados
- `GET /api/products/categories` — Lista de categorias

### Pedidos (requiere JWT)
- `POST /api/orders` — Crear pedido
- `GET /api/orders` — Mis pedidos
- `GET /api/orders/:id` — Detalle de pedido
- `PATCH /api/orders/:id/status` — Actualizar estado

### Favoritos (requiere JWT)
- `GET /api/favorites` — Mis favoritos
- `POST /api/favorites` — Agregar favorito
- `DELETE /api/favorites/:product_id` — Quitar favorito

### Vendedor (requiere JWT + rol vendedor)
- `GET /api/vendor/products` — Mis productos
- `POST /api/vendor/products` — Crear producto
- `PUT /api/vendor/products/:id` — Editar producto
- `DELETE /api/vendor/products/:id` — Eliminar producto
- `GET /api/vendor/orders` — Pedidos de mis productos
- `GET /api/vendor/stats` — Mis estadisticas

### Admin (requiere JWT + rol admin)
- `GET /api/admin/stats` — Estadisticas globales
- `GET /api/admin/users` — Todos los usuarios
- `PATCH /api/admin/users/:id/role` — Cambiar rol
- `DELETE /api/admin/users/:id` — Eliminar usuario
- `GET /api/admin/products` — Todos los productos
- `DELETE /api/admin/products/:id` — Eliminar producto
- `GET /api/admin/orders` — Todos los pedidos
- `PATCH /api/admin/orders/:id/status` — Actualizar estado de pedido

## Roles

- `cliente` — Puede comprar y guardar favoritos
- `vendedor` — Puede gestionar sus productos y ver sus ventas
- `admin` — Acceso completo al sistema