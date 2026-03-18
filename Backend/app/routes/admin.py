import json as json_lib
import os
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
from app import db
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.middleware.auth import require_role
from app.utils.helpers import serialize_product

bp = Blueprint('admin', __name__)


# ─── STATS ────────────────────────────────────────────────────────────────────

@bp.route('/stats', methods=['GET'])
@jwt_required()
@require_role('admin')
def stats():
    total_products = Product.query.count()
    total_vendors  = User.query.filter_by(role='vendedor').count()
    total_clients  = User.query.filter_by(role='cliente').count()
    total_sales    = db.session.query(db.func.sum(Product.sales_count)).scalar() or 0
    total_orders   = Order.query.count()
    return jsonify({
        'total_products': total_products,
        'total_vendors':  total_vendors,
        'total_clients':  total_clients,
        'total_sales':    total_sales,
        'total_orders':   total_orders,
    }), 200


# ─── USERS ────────────────────────────────────────────────────────────────────

@bp.route('/users', methods=['GET'])
@jwt_required()
@require_role('admin')
def get_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([{
        'id':         u.id,
        'name':       u.name,
        'email':      u.email,
        'role':       u.role,
        'created_at': u.created_at.isoformat() if u.created_at else None,
    } for u in users]), 200


@bp.route('/users/<int:id>/role', methods=['PUT'])
@jwt_required()
@require_role('admin')
def change_role(id):
    data = request.get_json()
    user = db.session.get(User, id)
    if user is None:
        return jsonify({'msg': 'No encontrado'}), 404
    new_role = data.get('role')
    if new_role not in ('cliente', 'vendedor', 'admin'):
        return jsonify({'msg': 'Rol inválido'}), 400
    user.role = new_role
    db.session.commit()
    return jsonify({'msg': 'Rol actualizado'}), 200


@bp.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
@require_role('admin')
def delete_user(id):
    user = db.session.get(User, id)
    if user is None:
        return jsonify({'msg': 'No encontrado'}), 404
    if user.role == 'admin':
        return jsonify({'msg': 'No puedes eliminar a otro administrador'}), 403
    db.session.delete(user)
    db.session.commit()
    return jsonify({'msg': 'Usuario eliminado'}), 200


# ─── PRODUCTS ─────────────────────────────────────────────────────────────────

@bp.route('/products', methods=['GET'])
@jwt_required()
@require_role('admin')
def get_all_products():
    products = Product.query.order_by(Product.created_at.desc()).all()
    result = []
    for p in products:
        d = serialize_product(p)
        d['vendor'] = {'id': p.vendor.id, 'name': p.vendor.name} if p.vendor else None
        result.append(d)
    return jsonify(result), 200


@bp.route('/products', methods=['POST'])
@jwt_required()
@require_role('admin')
def create_product():
    file = request.files.get('image')
    filename = None
    if file and file.filename:
        ext = file.filename.rsplit('.', 1)[-1].lower()
        if ext in current_app.config.get('ALLOWED_EXTENSIONS', {'png','jpg','jpeg','gif','webp'}):
            filename = secure_filename(file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

    data = request.form
    volume_prices = {}
    if data.get('volume_prices'):
        try:
            volume_prices = json_lib.loads(data['volume_prices'])
        except (json_lib.JSONDecodeError, ValueError):
            volume_prices = {}

    tags = []
    if data.get('tags'):
        try:
            tags = json_lib.loads(data['tags'])
        except (json_lib.JSONDecodeError, ValueError):
            tags = []

    vendor_id = data.get('vendor_id')
    product = Product(
        name=data.get('name', ''),
        description=data.get('description', ''),
        category=data.get('category', 'Natural'),
        base_price=float(data.get('base_price', 0)),
        sale_type=data.get('sale_type', 'ambos'),
        stock=int(data.get('stock', 0)),
        images=[f'/uploads/{filename}'] if filename else [],
        volume_prices=volume_prices,
        tags=tags,
        vendor_id=int(vendor_id) if vendor_id else None,
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({'msg': 'Producto creado', 'id': product.id}), 201


@bp.route('/products/<int:id>', methods=['PUT'])
@jwt_required()
@require_role('admin')
def update_product(id):
    product = db.session.get(Product, id)
    if product is None:
        return jsonify({'msg': 'No encontrado'}), 404

    file = request.files.get('image')
    if file and file.filename:
        ext = file.filename.rsplit('.', 1)[-1].lower()
        if ext in current_app.config.get('ALLOWED_EXTENSIONS', {'png','jpg','jpeg','gif','webp'}):
            filename = secure_filename(file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            product.images = [f'/uploads/{filename}']

    data = request.form
    if data.get('name'):       product.name       = data['name']
    if data.get('base_price'): product.base_price = float(data['base_price'])
    if data.get('category'):   product.category   = data['category']
    if data.get('sale_type'):  product.sale_type  = data['sale_type']
    if data.get('stock'):      product.stock      = int(data['stock'])
    if 'description' in data:  product.description = data['description']

    if data.get('volume_prices'):
        try:
            product.volume_prices = json_lib.loads(data['volume_prices'])
        except (json_lib.JSONDecodeError, ValueError):
            pass

    if data.get('tags'):
        try:
            product.tags = json_lib.loads(data['tags'])
        except (json_lib.JSONDecodeError, ValueError):
            pass

    db.session.commit()
    return jsonify({'msg': 'Producto actualizado'}), 200


@bp.route('/products/<int:id>', methods=['DELETE'])
@jwt_required()
@require_role('admin')
def delete_product(id):
    product = db.session.get(Product, id)
    if product is None:
        return jsonify({'msg': 'No encontrado'}), 404
    db.session.delete(product)
    db.session.commit()
    return jsonify({'msg': 'Producto eliminado'}), 200


# ─── ORDERS ───────────────────────────────────────────────────────────────────

@bp.route('/orders', methods=['GET'])
@jwt_required()
@require_role('admin')
def get_all_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([{
        'id':            o.id,
        'user':          {'id': o.user.id, 'name': o.user.name, 'email': o.user.email} if o.user else None,
        'total':         o.total,
        'status':        o.status,
        'created_at':    o.created_at.isoformat() if o.created_at else None,
        'items':         o.items,
        'shipping_info': o.shipping_info,
    } for o in orders]), 200


@bp.route('/orders/<int:id>/status', methods=['PUT'])
@jwt_required()
@require_role('admin')
def update_order_status(id):
    data = request.get_json()
    order = db.session.get(Order, id)
    if order is None:
        return jsonify({'msg': 'No encontrado'}), 404
    new_status = data.get('status')
    if new_status not in ('pending', 'paid', 'shipped', 'delivered', 'cancelled'):
        return jsonify({'msg': 'Estado inválido'}), 400
    order.status = new_status
    db.session.commit()
    return jsonify({'msg': 'Estado actualizado'}), 200
