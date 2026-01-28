from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import CartItem, db

cart_bp = Blueprint('cart', __name__)

# 1. Zobacz co masz w koszyku
@cart_bp.route('/', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    items = CartItem.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        "id": i.id,
        "product_id": i.product_id,
        "name": i.product.name,
        "price": i.product.price,
        "quantity": i.quantity
    } for i in items]), 200

# 2. Dodaj produkt do koszyka
@cart_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Sprawdzamy czy ten produkt już tam jest
    item = CartItem.query.filter_by(user_id=user_id, product_id=data['product_id']).first()
    
    if item:
        item.quantity += data.get('quantity', 1)
    else:
        item = CartItem(
            user_id=user_id,
            product_id=data['product_id'],
            quantity=data.get('quantity', 1)
        )
        db.session.add(item)
    
    db.session.commit()
    return jsonify({"msg": "Dodano do koszyka"}), 201

# 3. Usuń przedmiot z koszyka
@cart_bp.route('/remove/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    user_id = get_jwt_identity()
    item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()

    if not item:
        return jsonify({"msg": "Przedmiot nie znaleziony"}), 404
    
    db.session.delete(item)
    db.session.commit()
    return jsonify({"msg": "Usunięto"}), 200