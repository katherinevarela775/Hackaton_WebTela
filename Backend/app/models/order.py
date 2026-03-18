from app import db

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User')
    items = db.Column(db.JSON)  # lista de {"product_id": id, "quantity": n, "price": precio}
    total = db.Column(db.Float)
    status = db.Column(db.Enum('pending', 'paid', 'shipped', 'delivered', 'cancelled', name='order_status'), default='pending')
    shipping_info = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())