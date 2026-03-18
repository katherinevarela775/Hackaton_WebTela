from flask import Blueprint, jsonify, request
from app import db
from app.models.product import Product
from app.utils.helpers import serialize_product
from sqlalchemy import or_

bp = Blueprint("products", __name__)


@bp.route("", methods=["GET"])
def get_products():
    query = Product.query
    category = request.args.get("category")
    if category:
        query = query.filter(Product.category == category)
    sale_type = request.args.get("sale_type")
    if sale_type and sale_type not in ("todos", ""):
        query = query.filter(or_(Product.sale_type == sale_type, Product.sale_type == "ambos"))
    min_ranking = request.args.get("min_ranking", type=float)
    if min_ranking:
        query = query.filter(Product.ranking >= min_ranking)
    tag = request.args.get("tags")
    if tag and tag not in ("todas", ""):
        query = query.filter(Product.tags.contains(f""{tag}""))
    sort = request.args.get("sort", "normal")
    if sort == "menor":
        query = query.order_by(Product.base_price.asc())
    elif sort == "mayor":
        query = query.order_by(Product.base_price.desc())
    elif sort == "ventas":
        query = query.order_by(Product.sales_count.desc())
    productos = query.all()
    return jsonify([serialize_product(p) for p in productos]), 200
