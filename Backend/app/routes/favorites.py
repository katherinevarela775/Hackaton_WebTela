from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.favorite import Favorite

bp = Blueprint('favorites', __name__)

@bp.route('', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = int(get_jwt_identity())
    favs = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': f.id,
        'product_id': f.product_id,
        'created_at': f.created_at.isoformat() if f.created_at else None
    } for f in favs]), 200

@bp.route('/<int:product_id>', methods=['POST'])
@jwt_required()
def add_favorite(product_id):
    user_id = int(get_jwt_identity())
    if Favorite.query.filter_by(user_id=user_id, product_id=product_id).first():
        return jsonify({'msg': 'Ya está en favoritos'}), 400
    fav = Favorite(user_id=user_id, product_id=product_id)
    db.session.add(fav)
    db.session.commit()
    return jsonify({'msg': 'Agregado a favoritos'}), 201

@bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(product_id):
    user_id = int(get_jwt_identity())
    fav = Favorite.query.filter_by(user_id=user_id, product_id=product_id).first_or_404()
    db.session.delete(fav)
    db.session.commit()
    return jsonify({'msg': 'Eliminado de favoritos'}), 200