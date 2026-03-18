from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.order import Order
from app.models.product import Product

bp = Blueprint('orders', __name__)

@bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    items = data.get('items', [])
    total = 0
    order_items = []
    for item in items:
        product = db.session.get(Product, item['product_id'])
        if not product or product.stock < item['quantity']:
            return jsonify({'msg': f'Stock insuficiente para {product.name if product else "producto"}'}), 400
        # Precio base (podrías implementar volumen aquí)
        price = product.base_price
        subtotal = price * item['quantity']
        total += subtotal
        order_items.append({
            'product_id': product.id,
            'product_name': product.name,
            'quantity': item['quantity'],
            'price': price
        })
        product.stock -= item['quantity']
        product.sales_count += item['quantity']
    shipping_info = data.get('shipping_info', {})
    order = Order(user_id=user_id, items=order_items, total=total, shipping_info=shipping_info)
    db.session.add(order)
    db.session.commit()
    return jsonify({'msg': 'Orden creada', 'order_id': order.id}), 201

@bp.route('', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = int(get_jwt_identity())
    orders = Order.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': o.id,
        'total': o.total,
        'status': o.status,
        'created_at': o.created_at.isoformat() if o.created_at else None,
        'items': o.items
    } for o in orders]), 200

@bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_order(id):
    user_id = int(get_jwt_identity())
    order = Order.query.filter_by(id=id, user_id=user_id).first_or_404()
    return jsonify({
        'id': order.id,
        'total': order.total,
        'status': order.status,
        'created_at': order.created_at.isoformat() if order.created_at else None,
        'items': order.items
    }), 200