from flask import Blueprint, jsonify, request
from app.db import get_db_connection


# API DE DISTRIBUIDORES

distributors_bp = Blueprint('distributors', __name__)  # Creamos el Blueprint para agrupar rutas

@distributors_bp.route('/api/distributors', methods=['GET'])
def get_distributors():
    
    
    city = request.args.get('city') # REQUERIMIENTO: Filtro por Ciudad 
    
    conn = get_db_connection() # Abrimos la conexión a la base de datos
    cursor = conn.cursor()
    
    query = "SELECT id, nombre, ciudad, ranking, contacto_wa FROM distribuidores" # Usamos la tabla y los campos exactos
    params = []
    
    if city:
        query += " WHERE ciudad = ?"  # Si viene el parámetro de ciudad, filtramos la consulta
        params.append(city)
    
    query += " ORDER BY ranking DESC"  # Lógica de Ordenamiento (Mayor ranking primero
    
    
    cursor.execute(query, params)   # Ejecutamos la consulta en la base de datos
    distribuidores = cursor.fetchall()
    conn.close()
    
    
    distribuidores_list = [dict(row) for row in distribuidores]  # Convertimos los resultados a una lista de diccionarios para el JSON
    
    
    return jsonify(distribuidores_list)  # Retornamos el JSON formateado que espera el equipo de Frontend