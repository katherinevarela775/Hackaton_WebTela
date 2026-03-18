from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app import db
