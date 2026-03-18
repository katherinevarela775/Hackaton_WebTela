import sqlite3
import os
from flask import current_app, g

# --- CONFIGURACIÓN DE RUTAS ---
# Ubicación de la carpeta 'app'
_APP_DIR = os.path.dirname(os.path.abspath(__file__))
# La DB se guarda en la raíz de 'backend'
_DATABASE_PATH = os.path.join(os.path.dirname(_APP_DIR), 'textil_connect.db')
# Archivos SQL dentro de 'app'
_SCHEMA_SQL = os.path.join(_APP_DIR, 'squema.sql')
_SEED_SQL   = os.path.join(_APP_DIR, 'seed.sql')

def get_db():
    """
    Crea o recupera la conexión a la base de datos.
    Usa el objeto 'g' de Flask si se corre dentro de la app, 
    o una conexión simple si se corre como test independiente.
    """
    conn = sqlite3.connect(_DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Crucial: convierte filas en diccionarios
    conn.execute("PRAGMA foreign_keys = ON") # Mantiene la integridad de telas/categorías
    return conn

def init_db(with_seed=True):
    """
    Limpia y construye la base de datos desde cero.
    Perfecto para resetear el catálogo de telas durante el hackathon.
    """
    if not os.path.exists(_SCHEMA_SQL):
        raise FileNotFoundError(f"No se encontró el archivo de esquema en: {_SCHEMA_SQL}")

    db = get_db()
    
    try:
        # 1. Crear Tablas y Vistas (Schema)
        with open(_SCHEMA_SQL, 'r', encoding='utf-8') as f:
            db.executescript(f.read())
        
        # 2. Cargar datos de Paraguay (Seed)
        if with_seed and os.path.exists(_SEED_SQL):
            with open(_SEED_SQL, 'r', encoding='utf-8') as f:
                db.executescript(f.read())
        
        db.commit()
        print(f"✅ Base de datos Textil Connect inicializada en: {_DATABASE_PATH}")
    except sqlite3.Error as e:
        print(f"❌ Error de SQLite al inicializar: {e}")
    finally:
        db.close()

def query(sql, args=(), one=False):
    """
    Ejecuta una consulta de lectura.
    Uso: query("SELECT * FROM telas WHERE id = ?", (1,), one=True)
    """
    db = get_db()
    cur = db.execute(sql, args)
    rv = [dict(row) for row in cur.fetchall()]
    db.close()
    return (rv[0] if rv else None) if one else rv

def execute(sql, args=()):
    """
    Ejecuta una acción de escritura (INSERT, UPDATE, DELETE).
    Retorna el ID del último elemento insertado.
    """
    db = get_db()
    cur = db.execute(sql, args)
    db.commit()
    last_id = cur.lastrowid
    db.close()
    return last_id
