import os
import json
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.product import Product
from app.middleware.auth import require_role
from app.utils.helpers import serialize_product
from werkzeug.utils import secure_filename

bp = Blueprint('vendor', __name__)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


@bp.route('/products', methods=['POST'])
@jwt_required()
@require_role('vendedor')
def create_product():
    user_id = int(get_jwt_identity())

    file = request.files.get('image')
    filename = None
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

    data = request.form
    volume_prices = {}
    if data.get('volume_prices'):
        try:
            volume_prices = json.loads(data['volume_prices'])
        except (json.JSONDecodeError, ValueError):
            volume_prices = {}

    tags = []
    if data.get('tags'):
        try:
            tags = json.loads(data['tags'])
        except (json.JSONDecodeError, ValueError):
            tags = []

    product = Product(
        name=data.get('name'),
        description=data.get('description', ''),
        category=data.get('category'),
        base_price=float(data.get('base_price', 0)),
        sale_type=data.get('sale_type', 'ambos'),
        stock=int(data.get('stock', 0)),
        images=[f'/uploads/{filename}'] if filename else [],
        volume_prices=volume_prices,
        tags=tags,
        vendor_id=user_id
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({'msg': 'Producto creado', 'id': product.id}), 201


@bp.route('/products', methods=['GET'])
@jwt_required()
@require_role('vendedor')
def get_my_products():
    user_id = int(get_jwt_identity())
    products = Product.query.filter_by(vendor_id=user_id).all()
    return jsonify([serialize_product(p) for p in products]), 200


@bp.route('/products/<int:id>', methods=['GET'])
@jwt_required()
@require_role('vendedor')
def get_product(id):
    user_id = int(get_jwt_identity())
    product = Product.query.filter_by(id=id, vendor_id=user_id).first_or_404()
    return jsonify(serialize_product(product)), 200


@bp.route('/products/<int:id>', methods=['PUT'])
@jwt_required()
@require_role('vendedor')
def update_product(id):
    user_id = int(get_jwt_identity())
    product = Product.query.filter_by(id=id, vendor_id=user_id).first_or_404()

    file = request.files.get('image')
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        product.images = [f'/uploads/{filename}']

    data = request.form
    product.name = data.get('name', product.name)
    product.base_price = float(data.get('base_price', product.base_price))
    product.category = data.get('category', product.category)
    product.sale_type = data.get('sale_type', product.sale_type)
    product.stock = int(data.get('stock', product.stock))
    product.description = data.get('description', product.description)

    if data.get('volume_prices'):
        try:
            product.volume_prices = json.loads(data['volume_prices'])
        except (json.JSONDecodeError, ValueError):
            pass

    if data.get('tags'):
        try:
            product.tags = json.loads(data['tags'])
        except (json.JSONDecodeError, ValueError):
            pass

    db.session.commit()
    return jsonify({'msg': 'Producto actualizado'}), 200


@bp.route('/products/<int:id>', methods=['DELETE'])
@jwt_required()
@require_role('vendedor')
def delete_product(id):
    user_id = int(get_jwt_identity())
    product = Product.query.filter_by(id=id, vendor_id=user_id).first_or_404()
    db.session.delete(product)
    db.session.commit()
    return jsonify({'msg': 'Producto eliminado'}), 200


@bp.route('/stats', methods=['GET'])
@jwt_required()
@require_role('vendedor')
def vendor_stats():
    user_id = int(get_jwt_identity())
    products = Product.query.filter_by(vendor_id=user_id).all()
    total_sales = sum(p.sales_count for p in products)
    return jsonify({'total_sales': total_sales, 'product_count': len(products)}), 200
