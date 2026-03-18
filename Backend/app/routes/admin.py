from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.middleware.auth import require_role

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/api/admin/stats', methods=['GET'])
@jwt_required()
@require_role('admin')
def get_admin_stats():
    from app.models.user import User
    from app.models.product import Product
    from app.models.order import Order
    total_users = User.query.count()
    total_products = Product.query.count()
    total_orders = Order.query.count()
    total_revenue = sum(o.total for o in Order.query.all())
    return jsonify({
        'total_users': total_users,
        'total_products': total_products,
        'total_orders': total_orders,
        'total_revenue': total_revenue
    }), 200
