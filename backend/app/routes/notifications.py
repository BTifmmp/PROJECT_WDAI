from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Notification, db

notifications_bp = Blueprint('notifications', __name__)

# 1. Pobierz wszystkie powiadomienia użytkownika
@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    
    return jsonify([{
        "id": n.id,
        "message": n.message,
        "is_read": n.is_read,
        "created_at": n.created_at.strftime("%Y-%m-%d %H:%M")
    } for n in notifications]), 200

# 2. Oznacz powiadomienie jako przeczytane
@notifications_bp.route('/read/<int:notif_id>', methods=['POST'])
@jwt_required()
def mark_as_read(notif_id):
    user_id = get_jwt_identity()
    notification = Notification.query.filter_by(id=notif_id, user_id=user_id).first_or_404()
    
    notification.is_read = True
    db.session.commit()
    
    return jsonify({"msg": "Powiadomienie przeczytane"}), 200