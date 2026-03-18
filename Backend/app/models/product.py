from app import db

class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    base_price = db.Column(db.Float, nullable=False)
    sale_type = db.Column(db.Enum("mayorista", "minorista", "ambos", name="sale_types"))
    stock = db.Column(db.Integer, default=0)
