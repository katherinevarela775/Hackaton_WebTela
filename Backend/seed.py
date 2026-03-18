#!/usr/bin/env python3
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models.user import User
from app.models.product import Product

app = create_app()

VENDEDORES = [
    {"name": "Textiles Oriente S.A.",      "email": "ventas@textilesoriente.com.py",  "password": "TextilesOriente2024"},
    {"name": "Distribuidora Itapua Telas",  "email": "contacto@itaputelas.com.py",     "password": "ItapuaTelas2024"},
    {"name": "Importadora Central Textil",  "email": "info@centraltextil.com.py",      "password": "CentralTextil2024"},
    {"name": "Telas del Norte S.R.L.",      "email": "ventas@telasdelnorte.com.py",    "password": "TelasDelNorte2024"},
    {"name": "Fashion Fabrics Paraguay",    "email": "hello@fashionfabrics.com.py",    "password": "FashionFabrics2024"},
]

with app.app_context():
    print("=== Creando vendedores ===")
    vendor_map = {}
    for v in VENDEDORES:
        existing = User.query.filter_by(email=v["email"]).first()
        if existing:
            vendor_map[v["email"]] = existing
            print(f"  [skip] {v['name']}")
        else:
            user = User(name=v["name"], email=v["email"], role="vendedor")
            user.password = v["password"]
            db.session.add(user)
            db.session.flush()
            vendor_map[v["email"]] = user
            print(f"  [ok]   {v['name']}")
    db.session.commit()
