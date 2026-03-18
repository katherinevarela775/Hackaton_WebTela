from flask import Flask, jsonify
from flask_cors import CORS

# Importante: Aquí luego se importaran estas las rutas de tus compañeros
# from app.routes_products import products_bp 

app = Flask(__name__)
CORS(app) 

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Servidor de Textil Connect funcionando"}), 200

# Este es el bloque que permite ejecutar el archivo
if __name__ == '__main__':
    print("Iniciando servidor en http://127.0.0.1:5000")
    app.run(debug=True, port=5000)