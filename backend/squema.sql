-- =============================================================
-- schema.sql — Textil Connect: Base de datos de telas e importadores
-- =============================================================

PRAGMA foreign_keys = ON;

-- -------------------------------------------------------------
-- Tabla: ciudades
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ciudades (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL UNIQUE,
    departamento TEXT   NOT NULL
);

-- -------------------------------------------------------------
-- Tabla: categorias
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL UNIQUE,
    descripcion TEXT
);

-- -------------------------------------------------------------
-- Tabla: distribuidores (importadores/vendedores)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS distribuidores (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL,
    contacto    TEXT,
    email       TEXT,
    telefono    TEXT,
    ciudad_id   INTEGER NOT NULL,
    descripcion TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ciudad_id) REFERENCES ciudades(id)
);

-- -------------------------------------------------------------
-- Tabla: telas
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS telas (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre          TEXT    NOT NULL,
    descripcion     TEXT,
    precio_por_metro REAL   NOT NULL CHECK(precio_por_metro >= 0),
    stock_metros    INTEGER DEFAULT 0 CHECK(stock_metros >= 0),
    categoria_id    INTEGER NOT NULL,
    distribuidor_id INTEGER NOT NULL,
    imagen_url      TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id)    REFERENCES categorias(id),
    FOREIGN KEY (distribuidor_id) REFERENCES distribuidores(id)
);

-- -------------------------------------------------------------
-- Tabla: rankings (evaluaciones de distribuidores)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rankings (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    distribuidor_id INTEGER NOT NULL,
    puntuacion      INTEGER NOT NULL CHECK(puntuacion BETWEEN 1 AND 5),
    comentario      TEXT,
    fecha           DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (distribuidor_id) REFERENCES distribuidores(id)
);

-- -------------------------------------------------------------
-- Vista útil: ranking promedio por distribuidor
-- -------------------------------------------------------------
CREATE VIEW IF NOT EXISTS vista_ranking_distribuidores AS
SELECT
    d.id,
    d.nombre,
    c.nombre        AS ciudad,
    ROUND(AVG(r.puntuacion), 1) AS puntuacion_promedio,
    COUNT(r.id)     AS total_evaluaciones
FROM distribuidores d
JOIN ciudades c     ON d.ciudad_id = c.id
LEFT JOIN rankings r ON r.distribuidor_id = d.id
GROUP BY d.id;
