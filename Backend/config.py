import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-dev-secret')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///bulkfab.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5500')
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    # Necesario para que Authlib preserve el state de OAuth en el redirect de Google
    # 'None' permite cookies en redirects cross-site (necesario para Google OAuth)
    SESSION_COOKIE_SAMESITE = 'None'
    SESSION_COOKIE_SECURE = False  # False en desarrollo (http), True en producción (https)
    # Tiempo de expiración de sesión (para que el state de OAuth no expire)
    PERMANENT_SESSION_LIFETIME = 600  # 10 minutos