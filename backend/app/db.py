import sqlite3
import os

# Ruta absoluta a la base de datos SQLite (en la carpeta backend/)
_BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE  = os.path.join(_BASE_DIR, 'textil_connect.db')
SCHEMA    = os.path.join(_BASE_DIR, 'squema.sql')
SEED      = os.path.join(_BASE_DIR, 'seed.sql')


def get_db() -> sqlite3.Connection:
    """Abre y devuelve una conexión a la base de datos.
    Las filas se devuelven como diccionarios (sqlite3.Row).
    """
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row   # acceso por nombre de columna
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db(with_seed: bool = False) -> None:
    """Crea las tablas a partir de squema.sql.
    Si with_seed=True también inserta los datos de seed.sql.
    """
    conn = get_db()
    with open(SCHEMA, 'r', encoding='utf-8') as f:
        conn.executescript(f.read())

    if with_seed:
        with open(SEED, 'r', encoding='utf-8') as f:
            conn.executescript(f.read())

    conn.close()


def query(sql: str, args: tuple = ()) -> list[dict]:
    """Ejecuta un SELECT y devuelve una lista de diccionarios."""
    conn = get_db()
    cur  = conn.execute(sql, args)
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows


def execute(sql: str, args: tuple = ()) -> int:
    """Ejecuta INSERT / UPDATE / DELETE y devuelve el lastrowid."""
    conn = get_db()
    cur  = conn.execute(sql, args)
    conn.commit()
    last_id = cur.lastrowid
    conn.close()
    return last_id
