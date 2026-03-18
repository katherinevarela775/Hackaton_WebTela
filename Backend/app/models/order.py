from app import db
from datetime import datetime


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pendiente')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.Column(db.Text, nullable=True)  # JSON string con los items del pedido

    user = db.relationship('User', backref='orders')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total': self.total,
            'status': self.status,
            'items': self.items,
            'created_at': self.created_at.isoformat()
        }
