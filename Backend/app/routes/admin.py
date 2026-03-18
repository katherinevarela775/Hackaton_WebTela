from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.middleware.auth import require_role

admin_bp = Blueprint('admin', __name__)
