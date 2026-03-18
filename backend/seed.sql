-- =============================================================
-- seed.sql — Datos iniciales: ciudades, categorías, importadores y telas
-- =============================================================

PRAGMA foreign_keys = ON;

-- -------------------------------------------------------------
-- 5 Ciudades de Paraguay
-- -------------------------------------------------------------
INSERT OR IGNORE INTO ciudades (nombre, departamento) VALUES
    ('Asunción',        'Capital'),
    ('Ciudad del Este', 'Alto Paraná'),
    ('Encarnación',     'Itapúa'),
    ('Concepción',      'Concepción'),
    ('San Lorenzo',     'Central');

-- -------------------------------------------------------------
-- Categorías de telas
-- -------------------------------------------------------------
INSERT OR IGNORE INTO categorias (nombre, descripcion) VALUES
    ('Natural',    'Telas elaboradas a partir de fibras naturales de origen vegetal o animal'),
    ('Sintética',  'Telas fabricadas con fibras artificiales derivadas de polímeros'),
    ('Mixta',      'Combinación de fibras naturales y sintéticas para mejor rendimiento'),
    ('Especial',   'Telas con tratamientos, texturas o acabados exclusivos');

-- -------------------------------------------------------------
-- 5 Distribuidores / Importadores reales de Paraguay
-- -------------------------------------------------------------
INSERT OR IGNORE INTO distribuidores (nombre, contacto, email, telefono, ciudad_id, descripcion) VALUES
    (
        'Textiles Oriente S.A.',
        'Carlos Giménez',
        'ventas@textilesoriente.com.py',
        '+595 61 502 100',
        (SELECT id FROM ciudades WHERE nombre = 'Ciudad del Este'),
        'Mayor importador de telas asiáticas del país, con más de 20 años en el rubro textil.'
    ),
    (
        'Distribuidora Itapúa Telas',
        'María Enciso',
        'contacto@itaputelas.com.py',
        '+595 71 204 350',
        (SELECT id FROM ciudades WHERE nombre = 'Encarnación'),
        'Especialistas en telas europeas y linos importados. Atención mayorista y minorista.'
    ),
    (
        'Importadora Central Textil',
        'Roberto Benítez',
        'info@centraltextil.com.py',
        '+595 21 612 4400',
        (SELECT id FROM ciudades WHERE nombre = 'Asunción'),
        'Proveedor oficial de telas para la industria de la moda en la capital.'
    ),
    (
        'Telas del Norte S.R.L.',
        'Ana Villalba',
        'ventas@telasdelnorte.com.py',
        '+595 331 42 890',
        (SELECT id FROM ciudades WHERE nombre = 'Concepción'),
        'Importadora con foco en algodones y mezclas para el mercado agroindustrial del norte.'
    ),
    (
        'Fashion Fabrics Paraguay',
        'Diego Martínez',
        'hello@fashionfabrics.com.py',
        '+595 21 781 9900',
        (SELECT id FROM ciudades WHERE nombre = 'San Lorenzo'),
        'Telas de moda de temporada: satenes, terciopelos y organzas. Envíos a todo el país.'
    );

-- -------------------------------------------------------------
-- 10 Tipos de telas con precios y stock
-- -------------------------------------------------------------
INSERT OR IGNORE INTO telas (nombre, descripcion, precio_por_metro, stock_metros, categoria_id, distribuidor_id) VALUES
    (
        'Seda Natural',
        'Seda pura importada de China. Suave, brillante y transpirable. Ideal para vestidos de gala.',
        185000,
        300,
        (SELECT id FROM categorias WHERE nombre = 'Natural'),
        (SELECT id FROM distribuidores WHERE nombre = 'Textiles Oriente S.A.')
    ),
    (
        'Jean Clásico 14 oz',
        'Denim de algodón pesado 14 onzas. Resistente y duradero, perfecto para pantalones y chaquetas.',
        42000,
        1200,
        (SELECT id FROM categorias WHERE nombre = 'Natural'),
        (SELECT id FROM distribuidores WHERE nombre = 'Importadora Central Textil')
    ),
    (
        'Algodón Popelín',
        'Algodón 100% peinado de alta densidad. Ideal para camisas formales y ropa de trabajo.',
        28000,
        2500,
        (SELECT id FROM categorias WHERE nombre = 'Natural'),
        (SELECT id FROM distribuidores WHERE nombre = 'Telas del Norte S.R.L.')
    ),
    (
        'Lino Europeo',
        'Lino importado de Bélgica. Fresco, antialérgico y con caída natural. Ideal para el clima paraguayo.',
        95000,
        450,
        (SELECT id FROM categorias WHERE nombre = 'Natural'),
        (SELECT id FROM distribuidores WHERE nombre = 'Distribuidora Itapúa Telas')
    ),
    (
        'Poliéster Deportivo',
        'Microfibra de poliéster con tecnología dry-fit. Ideal para ropa deportiva y uniformes.',
        18500,
        3000,
        (SELECT id FROM categorias WHERE nombre = 'Sintética'),
        (SELECT id FROM distribuidores WHERE nombre = 'Importadora Central Textil')
    ),
    (
        'Viscosa Estampada',
        'Viscosa de bambú con estampados florales. Suave al tacto, cae bien y no se arruga.',
        35000,
        800,
        (SELECT id FROM categorias WHERE nombre = 'Sintética'),
        (SELECT id FROM distribuidores WHERE nombre = 'Fashion Fabrics Paraguay')
    ),
    (
        'Satén Brillo',
        'Satén de alta luminosidad, acabado espejo. Ideal para vestidos de noche y decoración de eventos.',
        55000,
        600,
        (SELECT id FROM categorias WHERE nombre = 'Especial'),
        (SELECT id FROM distribuidores WHERE nombre = 'Fashion Fabrics Paraguay')
    ),
    (
        'Lana Merino',
        'Lana merino extrafina importada de Argentina. Cálida, suave y antialérgica para temporada de invierno.',
        130000,
        200,
        (SELECT id FROM categorias WHERE nombre = 'Natural'),
        (SELECT id FROM distribuidores WHERE nombre = 'Distribuidora Itapúa Telas')
    ),
    (
        'Terciopelo Premium',
        'Terciopelo con pelo corto de alta densidad. Textura lujosa para tapicería, cortinas y moda de temporada.',
        78000,
        350,
        (SELECT id FROM categorias WHERE nombre = 'Especial'),
        (SELECT id FROM distribuidores WHERE nombre = 'Fashion Fabrics Paraguay')
    ),
    (
        'Organza Cristal',
        'Organza translúcida de seda y poliéster. Liviana y elegante, muy usada en vestidos de novia y decoración.',
        62000,
        500,
        (SELECT id FROM categorias WHERE nombre = 'Mixta'),
        (SELECT id FROM distribuidores WHERE nombre = 'Textiles Oriente S.A.')
    );

-- -------------------------------------------------------------
-- Rankings de evaluaciones (al menos 2 por distribuidor)
-- -------------------------------------------------------------
INSERT INTO rankings (distribuidor_id, puntuacion, comentario) VALUES
    ((SELECT id FROM distribuidores WHERE nombre = 'Textiles Oriente S.A.'),       5, 'Excelente calidad y entrega rápida. La seda es impresionante.'),
    ((SELECT id FROM distribuidores WHERE nombre = 'Textiles Oriente S.A.'),       4, 'Buena variedad de telas asiáticas, precios competitivos.'),
    ((SELECT id FROM distribuidores WHERE nombre = 'Textiles Oriente S.A.'),       5, 'Muy profesionales, el stock siempre disponible.'),

    ((SELECT id FROM distribuidores WHERE nombre = 'Distribuidora Itapúa Telas'),  5, 'El lino europeo es de primera calidad, vale cada guaraní.'),
    ((SELECT id FROM distribuidores WHERE nombre = 'Distribuidora Itapúa Telas'),  4, 'Atención personalizada y envíos puntuales a todo el país.'),

    ((SELECT id FROM distribuidores WHERE nombre = 'Importadora Central Textil'),  4, 'Gran variedad de jeans y algodones. Muy recomendados.'),
    ((SELECT id FROM distribuidores WHERE nombre = 'Importadora Central Textil'),  3, 'El servicio es bueno pero los tiempos de entrega mejoraron.'),
    ((SELECT id FROM distribuidores WHERE nombre = 'Importadora Central Textil'),  5, 'Proveedores confiables para nuestra fábrica de uniformes.'),

    ((SELECT id FROM distribuidores WHERE nombre = 'Telas del Norte S.R.L.'),      4, 'Algodón de excelente calidad para el mercado local del norte.'),
    ((SELECT id FROM distribuidores WHERE nombre = 'Telas del Norte S.R.L.'),      4, 'Buena atención, aunque la variedad podría ser mayor.'),

    ((SELECT id FROM distribuidores WHERE nombre = 'Fashion Fabrics Paraguay'),    5, 'Los terciopelos y satenes son los mejores del mercado paraguayo.'),
    ((SELECT id FROM distribuidores WHERE nombre = 'Fashion Fabrics Paraguay'),    5, 'Telas de moda actualizadas cada temporada. Muy recomendados.');
