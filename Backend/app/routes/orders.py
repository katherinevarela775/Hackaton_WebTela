from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.order import Order

orders_bp = Blueprint('orders', __name__)


@orders_bp.route('/api/orders', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or 'total' not in data:
        return jsonify({'error': 'Se requiere el campo total'}), 400

    import json
    items_json = json.dumps(data.get('items', []))

    order = Order(
        user_id=user_id,
        total=data['total'],
        status=data.get('status', 'pendiente'),
        items=items_json
    )
    db.session.add(order)
    db.session.commit()

    return jsonify({'message': 'Pedido creado', 'order': order.to_dict()}), 201
