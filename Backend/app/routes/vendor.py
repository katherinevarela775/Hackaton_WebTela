from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.middleware.auth import require_role

vendor_bp = Blueprint('vendor', __name__)
