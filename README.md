# BulkFab — Marketplace de Telas al por Mayor

Plataforma B2B para conectar fabricantes y compradores mayoristas de telas en Paraguay. Desarrollada durante un hackathon con arquitectura Flask + Vanilla JS.

---

## Equipo de Desarrollo

| Integrante | Rama | Responsabilidad |
|---|---|---|
| Matias Gauto | `feature-auth` | Autenticacion, configuracion, User model, middleware JWT |
| Lucas Fernandez | `feature/products` | Product model, helpers, rutas de productos, seed de datos |
| Sebas | `feature/orders` | Order model, rutas de pedidos (CRUD + estados) |
| Elias | `feature/vendor-admin` | Panel de vendedor y panel de administracion |
| Katherine Varela | `feature/front` | Frontend completo, Favorite model, rutas de favoritos |

---

## Stack Tecnologico

**Backend**
- Python 3.12 + Flask 2.3.3
- Flask-JWT-Extended 4.5 (autenticacion con tokens)
- Flask-Bcrypt (hashing de contraseñas)
- SQLAlchemy 2.0 + Flask-SQLAlchemy (ORM)
- Flask-Migrate / Alembic (migraciones)
- Flask-CORS 4.0 (Cross-Origin)
- SQLite (base de datos de desarrollo)

**Frontend**
- HTML5 + Vanilla JavaScript (sin frameworks)
- Tailwind CSS via CDN
- Google Fonts — Inter
- Fetch API + localStorage

---

## Estructura del Proyecto

```
Hackaton_BulkFab/
├── Backend/
│   ├── app/
│   │   ├── __init__.py              # Fabrica de la app Flask (create_app)
│   │   ├── models/
│   │   │   ├── user.py              # Modelo User con bcrypt
│   │   │   ├── product.py           # Modelo Product con JSON fields
│   │   │   ├── order.py             # Modelo Order con items JSON
│   │   │   └── favorite.py          # Modelo Favorite con constraint unico
│   │   ├── routes/
│   │   │   ├── auth.py              # /api/auth/* (register, login, me)
│   │   │   ├── products.py          # /api/products/* (listado, filtros)
│   │   │   ├── orders.py            # /api/orders/* (CRUD pedidos)
│   │   │   ├── favorites.py         # /api/favorites/* (CRUD favoritos)
│   │   │   ├── vendor.py            # /api/vendor/* (panel vendedor)
│   │   │   └── admin.py             # /api/admin/* (panel admin)
│   │   ├── middleware/
│   │   │   └── auth.py              # Decorador require_role
│   │   └── utils/
│   │       └── helpers.py           # serialize_product
│   ├── run.py                       # Entry point del servidor
│   ├── config.py                    # Configuracion (SECRET_KEY, DB, etc.)
│   ├── seed.py                      # Datos de prueba (vendedores + productos)
│   ├── requirements.txt             # Dependencias Python
│   └── .env                         # Variables de entorno (no comitear)
├── frontend/
│   ├── index.html                   # SPA principal
│   ├── css/
│   │   └── style.css                # Estilos globales + componentes
│   └── js/
│       ├── utils.js                 # apiFetch, tokens, showToast, formatPrice
│       ├── auth.js                  # login, register, logout, updateUIForAuth
│       ├── products.js              # fetchProducts, renderProductCard, filtros
│       ├── cart.js                  # Carrito persistente en localStorage
│       ├── favorites.js             # toggleFavorite, loadFavorites
│       ├── vendor.js                # Dashboard del vendedor
│       ├── admin.js                 # Dashboard de administracion
│       ├── modal.js                 # openModal, closeModal, bindModalEvents
│       └── main.js                  # initPage, detectCurrentPage
├── .gitignore
└── README.md
```

---

## Instalacion y Ejecucion

### Requisitos

- Python 3.10 o superior
- Git

### Backend

```bash
# 1. Clonar el repositorio
git clone https://github.com/katherinevarela775/Hackaton_WebTela.git
cd Hackaton_WebTela/Backend

# 2. Crear entorno virtual
# Linux / Mac
python -m venv venv && source venv/bin/activate

# Windows
python -m venv venv_win
venv_win\Scripts\activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Crear archivo .env (ver seccion Variables de Entorno)

# 5. Ejecutar servidor
python run.py
```

El servidor queda disponible en `http://127.0.0.1:5000`

### Frontend

Abrir `frontend/index.html` directamente en el navegador, o usar Live Server en VS Code (puerto 5500).

---

## Variables de Entorno

Crear un archivo `Backend/.env` con:

```env
SECRET_KEY=cambiar_por_clave_secreta_aleatoria
JWT_SECRET_KEY=cambiar_por_clave_jwt_aleatoria
DATABASE_URL=sqlite:///bulkfab.db
FRONTEND_URL=http://localhost:5500
UPLOAD_FOLDER=uploads
```

---

## Modelos de Base de Datos

### User
| Campo | Tipo | Descripcion |
|---|---|---|
| id | Integer PK | Identificador |
| name | String | Nombre completo |
| email | String (unique) | Correo electronico |
| _password | String | Hash bcrypt |
| role | String | `cliente` / `vendedor` / `admin` |
| created_at | DateTime | Fecha de registro |

### Product
| Campo | Tipo | Descripcion |
|---|---|---|
| id | Integer PK | Identificador |
| name | String | Nombre de la tela |
| description | Text | Descripcion |
| price | Float | Precio unitario |
| stock | Integer | Unidades disponibles |
| category | String | Categoria (Algodon, Lino, etc.) |
| vendor_id | Integer FK | Vendedor propietario |
| colors | Text (JSON) | Lista de colores disponibles |
| sizes | Text (JSON) | Tallas o medidas |
| images | Text (JSON) | URLs de imagenes |

### Order
| Campo | Tipo | Descripcion |
|---|---|---|
| id | Integer PK | Identificador |
| user_id | Integer FK | Cliente que realizo el pedido |
| total | Float | Monto total |
| status | String | `pendiente` / `procesando` / `enviado` / `entregado` |
| items | Text (JSON) | Lista de productos y cantidades |
| created_at | DateTime | Fecha del pedido |

### Favorite
| Campo | Tipo | Descripcion |
|---|---|---|
| id | Integer PK | Identificador |
| user_id | Integer FK | Usuario |
| product_id | Integer FK | Producto guardado |
| created_at | DateTime | Fecha |

> Constraint unico: `(user_id, product_id)` — no se puede guardar el mismo producto dos veces.

---

## API Endpoints

**Base URL:** `http://127.0.0.1:5000`

### Salud del servidor
```
GET  /api/health
```

### Autenticacion
```
POST /api/auth/register      Body: { name, email, password, role }
POST /api/auth/login         Body: { email, password }  →  retorna access_token
GET  /api/auth/me            Header: Authorization: Bearer <token>
```

### Productos (publico)
```
GET  /api/products                    Params opcionales: search, category, sort
GET  /api/products/<id>
GET  /api/products/featured
GET  /api/products/categories
```

### Pedidos — requiere JWT
```
POST  /api/orders                     Body: { total, items: [...] }
GET   /api/orders                     Lista los pedidos del usuario autenticado
GET   /api/orders/<id>
PATCH /api/orders/<id>/status         Body: { status }
```

### Favoritos — requiere JWT
```
GET    /api/favorites
POST   /api/favorites                 Body: { product_id }
DELETE /api/favorites/<product_id>
```

### Panel Vendedor — requiere JWT + rol `vendedor`
```
GET    /api/vendor/products
POST   /api/vendor/products           Body: { name, price, stock, category, ... }
PUT    /api/vendor/products/<id>      Body: campos a actualizar
DELETE /api/vendor/products/<id>
GET    /api/vendor/orders
GET    /api/vendor/stats              Retorna: total_products, total_sales, total_revenue
```

### Panel Admin — requiere JWT + rol `admin`
```
GET    /api/admin/stats               Retorna: total_users, total_products, total_orders, total_revenue
GET    /api/admin/users
PATCH  /api/admin/users/<id>/role     Body: { role }
DELETE /api/admin/users/<id>
GET    /api/admin/products
DELETE /api/admin/products/<id>
GET    /api/admin/orders
PATCH  /api/admin/orders/<id>/status  Body: { status }
```

---

## Roles y Permisos

| Accion | cliente | vendedor | admin |
|---|:---:|:---:|:---:|
| Ver productos | ✓ | ✓ | ✓ |
| Agregar al carrito | ✓ | ✓ | ✓ |
| Guardar favoritos | ✓ | ✓ | ✓ |
| Crear pedidos | ✓ | ✓ | ✓ |
| Gestionar sus productos | — | ✓ | ✓ |
| Ver estadisticas propias | — | ✓ | ✓ |
| Gestionar todos los usuarios | — | — | ✓ |
| Gestionar todos los productos | — | — | ✓ |
| Gestionar todos los pedidos | — | — | ✓ |

---

## Datos de Prueba

El archivo `Backend/seed.py` crea automaticamente al iniciar el servidor:

**Vendedores**
| Email | Password | Rol |
|---|---|---|
| admin@bulkfab.com | admin123 | admin |
| vendedor1@bulkfab.com | vendor123 | vendedor |
| vendedor2@bulkfab.com | vendor123 | vendedor |

**Productos** — 10 telas precargadas (Seda Natural, Jean Clasico, Algodon Popelin, Lino Europeo, etc.) con precios mayoristas en ARS.

---

## Frontend — Funcionalidades

| Modulo | Archivo | Descripcion |
|---|---|---|
| Utilidades | `utils.js` | `apiFetch`, tokens, toasts, `formatPrice` |
| Autenticacion | `auth.js` | Login, registro, logout, actualizacion de UI |
| Productos | `products.js` | Listado, filtros, busqueda, renderizado de tarjetas |
| Carrito | `cart.js` | Estado persistente, checkout, badge contador |
| Favoritos | `favorites.js` | Toggle, estado local, renderizado de pagina |
| Panel Vendedor | `vendor.js` | CRUD productos, tabla de pedidos, estadisticas |
| Panel Admin | `admin.js` | Gestion de usuarios, productos, pedidos y roles |
| Modales | `modal.js` | Apertura/cierre, ESC, click overlay, detalle producto |
| Inicializacion | `main.js` | Detecta pagina activa, inicializa todos los modulos |

---

## Flujo de Autenticacion

```
1. Usuario hace POST /api/auth/login
2. Backend valida credenciales con bcrypt
3. Backend retorna JWT (access_token)
4. Frontend guarda token en localStorage
5. Todas las peticiones protegidas incluyen: Authorization: Bearer <token>
6. Middleware require_role verifica el rol antes de ejecutar la vista
```

---

## Estrategia de Ramas

```
main
└── develop
    ├── feature-auth        (Matias Gauto)
    ├── feature/products    (Lucas Fernandez)
    ├── feature/orders      (Sebas)
    ├── feature/vendor-admin (Elias)
    └── feature/front       (Katherine Varela)
```

Cada rama tiene commits granulares por funcion/metodo. Para integrar al proyecto principal se realizan Pull Requests hacia `develop`.

---

## Repositorio

[https://github.com/katherinevarela775/Hackaton_WebTela](https://github.com/katherinevarela775/Hackaton_WebTela)
