from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.favorite import Favorite

favorites_bp = Blueprint('favorites', __name__)


@favorites_bp.route('/api/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([f.to_dict() for f in favorites]), 200


@favorites_bp.route('/api/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.get_json()
    if 'product_id' not in data:
        return jsonify({'error': 'Se requiere product_id'}), 400

    existing = Favorite.query.filter_by(user_id=user_id, product_id=data['product_id']).first()
    if existing:
        return jsonify({'error': 'Ya esta en favoritos'}), 409

    fav = Favorite(user_id=user_id, product_id=data['product_id'])
    db.session.add(fav)
    db.session.commit()
    return jsonify({'message': 'Agregado a favoritos', 'favorite': fav.to_dict()}), 201


@favorites_bp.route('/api/favorites/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(product_id):
    user_id = get_jwt_identity()
    fav = Favorite.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not fav:
        return jsonify({'error': 'Favorito no encontrado'}), 404
    db.session.delete(fav)
    db.session.commit()
    return jsonify({'message': 'Eliminado de favoritos'}), 200
