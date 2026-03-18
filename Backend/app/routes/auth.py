from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

bp = Blueprint("auth", __name__)


@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"msg": "Faltan datos"}), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "El email ya esta registrado"}), 409
    user = User(name=data.get("name", ""), email=data["email"], role=data.get("role", "cliente"))
    user.password = data["password"]
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "Usuario creado"}), 201
