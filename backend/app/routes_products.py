from flask import Blueprint, jsonify, request
#1=crea un grupo de rutas,2= devuelve datos en JSON, 3= lee datos del usuario.
from db import get_db
#importa la funcion que abre la conexion a la base de datos.
products_bp=Blueprint("productos",__name__)
#crea un modulo de rutas llamdo productos.

@products_bp.route("/api/test", methods=["GET"])
def test_api():
    return jsonify({"message": "API funcionando correctamente"}), 200

#End point de categorias.
@products_bp.route("/api/categories", methods=["GET"])
#define la ruta: GET /api/categories.
def get_categories():
    
    db= get_db()
    #abre conexion con la base de datos.
    
    categories=db.execute(
        "SELECT DISTINCT category FROM fabrics"
    ).fetchall()
    #busca todas las categorias.
    
    result = []
    #creamos una lista vacia.
    
    for category in categories:
    #recorre caad categoria .
        result.append(category["category"])
        #agrega el nombre a la lista.
        
    return jsonify(result)
    #convierte la lista en JSON.



#End points de productos.
@products_bp.route("/api/products",methods=["GET"])
def get_products():
    
    category_id=request.args.get("category_id")
    #permite consultas como: /api/products?category_id=2.
    min_stock=request.args.get("min_stock")
    #permite: /api/products?min_stock=10.
    
    db=get_db()
    
    query="SELECT id, name, price, stock, category_id FROM fabrics where 1=1"
    #permite agregar filtros despues.
    params=[]
         
    if category_id:
        query += " AND category_id = ?"
        params.append(category_id)
        #SQL final: SELECT * FROM fabrics WHERE category_id = 2
        
    if min_stock:
        query += " AND stock >= ?"
        params.append(min_stock)
        #SQL= stock >= 10
        
    products = db.execute(query, params).fetchall()
    
    result=[]
    
    
    for product in products:
        
        available=product["stock"] > 0
        
        result.append({
            "id": product["id"],
            "name": product["name"],
            "price": product["price"],
            "stock": product["stock"],
            "category_id": product["category_id"],
            "available": available
            
        })
    return jsonify(result)






