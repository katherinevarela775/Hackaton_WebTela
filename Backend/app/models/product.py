from app import db

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    base_price = db.Column(db.Float, nullable=False)
    sale_type = db.Column(db.Enum('mayorista', 'minorista', 'ambos', name='sale_types'))
    stock = db.Column(db.Integer, default=0)
    images = db.Column(db.JSON)  # lista de URLs
    ranking = db.Column(db.Float, default=3.0)
    tags = db.Column(db.JSON)  # ['oferta', 'nuevo', 'liquidacion']
    volume_prices = db.Column(db.JSON)  # {"5": 7500, "10": 7000, ...}
    vendor_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    vendor = db.relationship('User', backref='products')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    sales_count = db.Column(db.Integer, default=0)