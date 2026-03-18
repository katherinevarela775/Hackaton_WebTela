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
