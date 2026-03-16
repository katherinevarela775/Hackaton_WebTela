# Este codigo crea una API que muestra distribuidores desde una base de datos

from flask import Blueprint, jsonify, request
from app.db import get_db  

distributors_bp = Blueprint('distributors', __name__)

@distributors_bp.route('/api/distributors', methods=['GET'])
def get_distributors():
    city = request.args.get('city')

    db = get_db()

    query_str = """
        SELECT id, nombre, ciudad, puntuacion_promedio 
        FROM vista_ranking_distribuidores
    """
    params = []

    if city:
        query_str += " WHERE ciudad LIKE ?"
        params.append(f"%{city}%")

    query_str += " ORDER BY puntuacion_promedio DESC"

    distribuidores = db.execute(query_str, params).fetchall()

    return jsonify([dict(row) for row in distribuidores])




