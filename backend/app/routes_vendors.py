from flask import Blueprint, jsonify, request
from app.db import get_db   # conexión a la base de datos del proyecto


distributors_bp = Blueprint('distributors', __name__)  # Creamos el blueprint para las rutas de distribuidores


@distributors_bp.route('/api/distributors', methods=['GET'])  # Ruta para obtener distribuidores
def get_distributors():

    city = request.args.get('city')  # Obtener ciudad desde la URL

    conn = get_db()     # Conexión a la base de datos
    cursor = conn.cursor()

    query = "SELECT id, nombre, ciudad, puntuacion_promedio FROM vista_ranking_distribuidores"

    params = []

    if city:     # Filtro por ciudad si se envía en la URL
        query += " WHERE ciudad = ?"
        params.append(city)

    query += " ORDER BY puntuacion_promedio DESC"

    cursor.execute(query, params)

    distribuidores = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in distribuidores])