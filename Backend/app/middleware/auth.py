from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app import db


def require_role(*roles):
    """Decorator que exige que el usuario autenticado tenga uno de los roles dados.
    Debe usarse DESPUÉS de @jwt_required() para que get_jwt_identity() esté disponible.

    Uso:
        @bp.route('/ruta')
        @jwt_required()
        @require_role('admin')
        def mi_vista():
            ...
    """
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            from app.models.user import User
            user_id = int(get_jwt_identity())
            user = db.session.get(User, user_id)
            if not user or user.role not in roles:
                return jsonify({'msg': 'Acceso denegado'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator
