from app import create_app, db

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Crea las tablas si no existen (solo para desarrollo, usar migraciones en producción)
        db.create_all()
        print("Base de datos inicializada (tablas creadas si no existían).")
    app.run(debug=True, port=5000, use_reloader=False)