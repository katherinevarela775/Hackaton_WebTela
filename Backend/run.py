from dotenv import load_dotenv
load_dotenv()

from app import create_app

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        from app import db
        db.create_all()
        print("Base de datos inicializada (tablas creadas si no existían).")
    app.run(debug=True, port=5000, use_reloader=False)
