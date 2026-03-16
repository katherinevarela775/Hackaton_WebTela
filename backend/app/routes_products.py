from flask import Blueprint, jsonify, request
from app.db import get_db

products_bp = Blueprint("productos", name)

@products_bp.route("/api/categories", methods=["GET"])
def get_categories():
    db = get_db()
    # Cambiamos 'fabrics' por 'telas' y 'category' por 'nombre' de la tabla 'categorias'
    categories = db.execute("SELECT nombre FROM categorias").fetchall()

    return jsonify([cat["nombre"] for cat in categories])

@products_bp.route("/api/products", methods=["GET"])
def get_products():
    category_id = request.args.get("category_id")
    min_stock = request.args.get("min_stock")

    db = get_db()
    # Ajustamos a los nombres de squema.sql: id, nombre, precio_por_metro, stock_metros
    query_str = "SELECT id, nombre, precio_por_metro, stock_metros, categoria_id FROM telas WHERE 1=1"
    params = []
        
    if category_id:
        query_str += " AND categoria_id = ?"
        params.append(category_id)
        
    if min_stock:
        query_str += " AND stock_metros >= ?"
        params.append(min_stock)
        
    products = db.execute(query_str, params).fetchall()

    result = []
    for product in products:
        result.append({
            "id": product["id"],
            "name": product["nombre"],
            "price": product["precio_por_metro"],
            "stock": product["stock_metros"],
            "category_id": product["categoria_id"],
            "available": product["stock_metros"] > 0
        })
    return jsonify(result)