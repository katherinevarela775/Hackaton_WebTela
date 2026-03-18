import sqlite3
import os

# Configuración de Rutas (Path Management)
# Buscamos la carpeta donde está este archivo (backend/app/)
_APP_DIR = os.path.dirname(os.path.abspath(__file__))

# La base de datos se guardará un nivel arriba, en la carpeta /backend/
_BACKEND_DIR = os.path.dirname(_APP_DIR)
DATABASE = os.path.join(_BACKEND_DIR, 'textil_connect.db')

# Rutas a tus archivos SQL
SCHEMA = os.path.join(_APP_DIR, 'squema.sql')
SEED = os.path.join(_APP_DIR, 'seed.sql')

def get_db():
    """
    Crea una conexión a la base de datos.
    Configura row_factory para que los resultados sean accesibles por nombre de columna.
    """
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Esto permite hacer row['nombre'] en lugar de row[0]
    conn.execute("PRAGMA foreign_keys = ON") # Activa la integridad referencial
    return conn

def init_db(with_seed=False):
    """
    Inicializa la base de datos usando squema.sql.
    Si with_seed es True, también carga los datos de seed.sql.
    """
    if not os.path.exists(SCHEMA):
        print(f"Error: No se encontró el archivo {SCHEMA}")
        return

    conn = get_db()
    
    # Ejecutar el esquema (Tablas y Vistas)
    with open(SCHEMA, 'r', encoding='utf-8') as f:
        conn.executescript(f.read())
    
    # Ejecutar los datos iniciales si se solicita
    if with_seed and os.path.exists(SEED):
        with open(SEED, 'r', encoding='utf-8') as f:
            conn.executescript(f.read())
            
    conn.commit()
    conn.close()
    print("Base de datos inicializada correctamente.")

def query(sql, args=()):
    """
    Función utilitaria para realizar SELECTs rápidos.
    Retorna una lista de diccionarios.
    """
