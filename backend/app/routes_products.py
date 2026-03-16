from flask import Blueprint, jsonify, request
from app.db import get_db # Cambiado de get_db_connection a get_db

distributors_bp = Blueprint('distributors', name)

@distributors_bp.route('/api/distributors', methods=['GET'])
def get_distributors():
    city = request.args.get('city')
    conn = get_db()
    cursor = conn.cursor()

    # Usamos tu VISTA de rankings que es mucho más potente
    query = "SELECT id, nombre, ciudad, puntuacion_promedio FROM vista_ranking_distribuidores"
    params = []

    if city:
        query += " WHERE ciudad = ?"
        params.append(city)

    query += " ORDER BY puntuacion_promedio DESC"

    cursor.execute(query, params)
    distribuidores = cursor.fetchall()
    conn.close()

    return jsonify([dict(row) for row in distribuidores]) 