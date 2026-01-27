from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.models import User, db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Użytkownik już istnieje"}), 400
    
    # Na razie zapisujemy czyste hasło dla ułatwienia, 
    # potem dodamy hashowanie dla bezpieczeństwa!
    new_user = User(
        username=data['username'], 
        password=data['password'], 
        role='user'
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "Zarejestrowano pomyślnie"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    
    if not user:
        return jsonify({"msg": "Błędny login lub hasło"}), 401

    # Tworzymy oba tokeny (wymóg na 7.0 pkt)
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    
    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "role": user.role,
        "username": user.username
    }), 200