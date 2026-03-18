#!/usr/bin/env python3
"""Seed: carga distribuidores como vendedores y telas como productos."""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models.user import User
from app.models.product import Product

app = create_app()

# Ranking promedio calculado de seed.sql:
# Textiles Oriente  (5+4+5)/3 = 4.7
# Itapúa Telas      (5+4)/2   = 4.5
# Central Textil    (4+3+5)/3 = 4.0
# Telas del Norte   (4+4)/2   = 4.0
# Fashion Fabrics   (5+5)/2   = 5.0

VENDEDORES = [
    {'name': 'Textiles Oriente S.A.',       'email': 'ventas@textilesoriente.com.py',  'password': 'TextilesOriente2024'},
    {'name': 'Distribuidora Itapúa Telas',  'email': 'contacto@itaputelas.com.py',     'password': 'ItapuaTelas2024'},
    {'name': 'Importadora Central Textil',  'email': 'info@centraltextil.com.py',      'password': 'CentralTextil2024'},
    {'name': 'Telas del Norte S.R.L.',      'email': 'ventas@telasdelnorte.com.py',    'password': 'TelasDelNorte2024'},
    {'name': 'Fashion Fabrics Paraguay',    'email': 'hello@fashionfabrics.com.py',    'password': 'FashionFabrics2024'},
]

PRODUCTOS = [
    {
        'name': 'Seda Natural',
        'description': 'Seda pura importada de China. Suave, brillante y transpirable. Ideal para vestidos de gala.',
        'base_price': 185000, 'stock': 300, 'category': 'Natural',
        'vendor_email': 'ventas@textilesoriente.com.py',
        'sale_type': 'ambos', 'tags': ['nuevo'], 'ranking': 4.7,
        'volume_prices': {'5': 175000, '10': 165000, '20': 155000},
    },
    {
        'name': 'Jean Clásico 14 oz',
        'description': 'Denim de algodón pesado 14 onzas. Resistente y duradero, perfecto para pantalones y chaquetas.',
        'base_price': 42000, 'stock': 1200, 'category': 'Natural',
        'vendor_email': 'info@centraltextil.com.py',
        'sale_type': 'ambos', 'tags': [], 'ranking': 4.0,
        'volume_prices': {'5': 39000, '10': 36000, '20': 33000},
    },
    {
        'name': 'Algodón Popelín',
        'description': 'Algodón 100% peinado de alta densidad. Ideal para camisas formales y ropa de trabajo.',
        'base_price': 28000, 'stock': 2500, 'category': 'Natural',
        'vendor_email': 'ventas@telasdelnorte.com.py',
        'sale_type': 'ambos', 'tags': ['oferta'], 'ranking': 4.0,
        'volume_prices': {'5': 26000, '10': 24000, '20': 22000},
    },
    {
        'name': 'Lino Europeo',
        'description': 'Lino importado de Bélgica. Fresco, antialérgico y con caída natural. Ideal para el clima paraguayo.',
        'base_price': 95000, 'stock': 450, 'category': 'Natural',
        'vendor_email': 'contacto@itaputelas.com.py',
        'sale_type': 'ambos', 'tags': ['nuevo'], 'ranking': 4.5,
        'volume_prices': {'5': 89000, '10': 83000, '20': 78000},
    },
    {
        'name': 'Poliéster Deportivo',
        'description': 'Microfibra de poliéster con tecnología dry-fit. Ideal para ropa deportiva y uniformes.',
        'base_price': 18500, 'stock': 3000, 'category': 'Sintética',
        'vendor_email': 'info@centraltextil.com.py',
        'sale_type': 'mayorista', 'tags': ['oferta'], 'ranking': 4.0,
        'volume_prices': {'5': 17000, '10': 15500, '20': 14000},
    },
    {
        'name': 'Viscosa Estampada',
        'description': 'Viscosa de bambú con estampados florales. Suave al tacto, cae bien y no se arruga.',
        'base_price': 35000, 'stock': 800, 'category': 'Sintética',
        'vendor_email': 'hello@fashionfabrics.com.py',
        'sale_type': 'ambos', 'tags': ['nuevo'], 'ranking': 5.0,
        'volume_prices': {'5': 32000, '10': 29000, '20': 27000},
    },
    {
        'name': 'Satén Brillo',
        'description': 'Satén de alta luminosidad, acabado espejo. Ideal para vestidos de noche y decoración de eventos.',
        'base_price': 55000, 'stock': 600, 'category': 'Especial',
        'vendor_email': 'hello@fashionfabrics.com.py',
        'sale_type': 'ambos', 'tags': ['oferta'], 'ranking': 5.0,
        'volume_prices': {'5': 51000, '10': 47000, '20': 44000},
    },
    {
        'name': 'Lana Merino',
        'description': 'Lana merino extrafina importada de Argentina. Cálida, suave y antialérgica para temporada de invierno.',
        'base_price': 130000, 'stock': 200, 'category': 'Natural',
        'vendor_email': 'contacto@itaputelas.com.py',
        'sale_type': 'ambos', 'tags': ['nuevo'], 'ranking': 4.5,
        'volume_prices': {'5': 122000, '10': 115000, '20': 108000},
    },
    {
        'name': 'Terciopelo Premium',
        'description': 'Terciopelo con pelo corto de alta densidad. Textura lujosa para tapicería, cortinas y moda de temporada.',
        'base_price': 78000, 'stock': 350, 'category': 'Especial',
        'vendor_email': 'hello@fashionfabrics.com.py',
        'sale_type': 'ambos', 'tags': ['oferta'], 'ranking': 5.0,
        'volume_prices': {'5': 73000, '10': 68000, '20': 64000},
    },
    {
        'name': 'Organza Cristal',
        'description': 'Organza translúcida de seda y poliéster. Liviana y elegante, muy usada en vestidos de novia y decoración.',
        'base_price': 62000, 'stock': 500, 'category': 'Mixta',
        'vendor_email': 'ventas@textilesoriente.com.py',
        'sale_type': 'ambos', 'tags': ['nuevo'], 'ranking': 4.7,
        'volume_prices': {'5': 58000, '10': 54000, '20': 51000},
    },
]

with app.app_context():
    print("=== Creando vendedores ===")
    vendor_map = {}
    for v in VENDEDORES:
        existing = User.query.filter_by(email=v['email']).first()
        if existing:
            vendor_map[v['email']] = existing
            print(f"  [skip] {v['name']}")
        else:
            user = User(name=v['name'], email=v['email'], role='vendedor')
            user.password = v['password']
            db.session.add(user)
            db.session.flush()
            vendor_map[v['email']] = user
            print(f"  [ok]   {v['name']}")
    db.session.commit()

    print("\n=== Creando productos ===")
    for p in PRODUCTOS:
        if Product.query.filter_by(name=p['name']).first():
            print(f"  [skip] {p['name']}")
            continue
        vendor = vendor_map[p['vendor_email']]
        product = Product(
            name=p['name'],
            description=p['description'],
            base_price=p['base_price'],
            stock=p['stock'],
            category=p['category'],
            vendor_id=vendor.id,
            sale_type=p['sale_type'],
            tags=p['tags'],
            ranking=p['ranking'],
            volume_prices=p['volume_prices'],
            images=[],
            sales_count=0,
        )
        db.session.add(product)
        print(f"  [ok]   {p['name']}")
    db.session.commit()

    print("\nSeed completado.")
    total = Product.query.count()
    print(f"Total productos en BD: {total}")
