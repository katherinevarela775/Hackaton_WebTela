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
