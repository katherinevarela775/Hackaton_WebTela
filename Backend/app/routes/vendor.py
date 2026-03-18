from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.middleware.auth import require_role

vendor_bp = Blueprint('vendor', __name__)


@vendor_bp.route('/api/vendor/products', methods=['GET'])
@jwt_required()
@require_role('vendedor')
def get_vendor_products():
    from app.models.product import Product
    user_id = get_jwt_identity()
    products = Product.query.filter_by(vendor_id=user_id).all()
    from app.utils.helpers import serialize_product
    return jsonify([serialize_product(p) for p in products]), 200


@vendor_bp.route('/api/vendor/products', methods=['POST'])
@jwt_required()
@require_role('vendedor')
def create_vendor_product():
    from app.models.product import Product
    import json
    user_id = get_jwt_identity()
    data = request.get_json()

    required = ['name', 'price']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Campo requerido: {field}'}), 400

    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        stock=data.get('stock', 0),
        category=data.get('category', ''),
        vendor_id=user_id,
        colors=json.dumps(data.get('colors', [])),
        sizes=json.dumps(data.get('sizes', [])),
        images=json.dumps(data.get('images', []))
    )
    db.session.add(product)
    db.session.commit()
    from app.utils.helpers import serialize_product
    return jsonify({'message': 'Producto creado', 'product': serialize_product(product)}), 201


@vendor_bp.route('/api/vendor/products/<int:product_id>', methods=['PUT'])
@jwt_required()
@require_role('vendedor')
def update_vendor_product(product_id):
    from app.models.product import Product
    import json
    user_id = get_jwt_identity()
    product = Product.query.filter_by(id=product_id, vendor_id=user_id).first()
    if not product:
        return jsonify({'error': 'Producto no encontrado'}), 404

    data = request.get_json()
    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'price' in data:
        product.price = data['price']
    if 'stock' in data:
        product.stock = data['stock']
    if 'category' in data:
        product.category = data['category']
    if 'colors' in data:
        product.colors = json.dumps(data['colors'])
    if 'sizes' in data:
        product.sizes = json.dumps(data['sizes'])
    if 'images' in data:
        product.images = json.dumps(data['images'])

    db.session.commit()
    from app.utils.helpers import serialize_product
    return jsonify({'message': 'Producto actualizado', 'product': serialize_product(product)}), 200


@vendor_bp.route('/api/vendor/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
@require_role('vendedor')
def delete_vendor_product(product_id):
    from app.models.product import Product
    user_id = get_jwt_identity()
    product = Product.query.filter_by(id=product_id, vendor_id=user_id).first()
    if not product:
        return jsonify({'error': 'Producto no encontrado'}), 404
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Producto eliminado'}), 200
