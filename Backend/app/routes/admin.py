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


@admin_bp.route('/api/admin/users', methods=['GET'])
@jwt_required()
@require_role('admin')
def get_all_users():
    from app.models.user import User
    users = User.query.all()
    return jsonify([{
        'id': u.id,
        'name': u.name,
        'email': u.email,
        'role': u.role,
        'created_at': u.created_at.isoformat() if u.created_at else None
    } for u in users]), 200


@admin_bp.route('/api/admin/users/<int:user_id>/role', methods=['PATCH'])
@jwt_required()
@require_role('admin')
def update_user_role(user_id):
    from app.models.user import User
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    data = request.get_json()
    if 'role' not in data:
        return jsonify({'error': 'Se requiere el campo role'}), 400
    valid_roles = ['cliente', 'vendedor', 'admin']
    if data['role'] not in valid_roles:
        return jsonify({'error': f'Rol invalido. Opciones: {valid_roles}'}), 400
    user.role = data['role']
    db.session.commit()
    return jsonify({'message': 'Rol actualizado', 'user_id': user_id, 'role': user.role}), 200


@admin_bp.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@require_role('admin')
def delete_user(user_id):
    from app.models.user import User
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Usuario eliminado'}), 200


@admin_bp.route('/api/admin/products', methods=['GET'])
@jwt_required()
@require_role('admin')
def get_all_products():
    from app.models.product import Product
    from app.utils.helpers import serialize_product
    products = Product.query.all()
    return jsonify([serialize_product(p) for p in products]), 200


@admin_bp.route('/api/admin/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
@require_role('admin')
def admin_delete_product(product_id):
    from app.models.product import Product
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Producto no encontrado'}), 404
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Producto eliminado por admin'}), 200


@admin_bp.route('/api/admin/orders', methods=['GET'])
@jwt_required()
@require_role('admin')
def get_all_orders():
    from app.models.order import Order
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders]), 200
