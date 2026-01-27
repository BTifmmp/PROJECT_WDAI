from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Order, OrderItem, CartItem, Notification, db # Dodano Notification

orders_bp = Blueprint('orders', __name__)

# 1. Składanie zamówienia (Checkout)
@orders_bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    user_id = get_jwt_identity()
    
    # Pobierz przedmioty z koszyka
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    if not cart_items:
        return jsonify({"msg": "Koszyk jest pusty"}), 400
    
    # Stwórz nowe zamówienie
    new_order = Order(user_id=user_id, status='pending')
    db.session.add(new_order)
    db.session.flush() # Pobieramy ID zamówienia (new_order.id)
    
    total_price = 0
    for item in cart_items:
        # Dodaj przedmiot do zamówienia
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=item.product.price
        )
        total_price += item.product.price * item.quantity
        db.session.add(order_item)
        
        # USUWANIE Z KOSZYKA (Wyczyszczenie)
        db.session.delete(item)
    
    # DODANIE POWIADOMIENIA
    new_notif = Notification(
        user_id=user_id,
        message=f"Zamówienie #{new_order.id} zostało złożone. Kwota: {total_price} zł."
    )
    db.session.add(new_notif)
    
    db.session.commit()
    
    return jsonify({
        "msg": "Zamówienie złożone, koszyk wyczyszczony",
        "order_id": new_order.id,
        "total_price": total_price
    }), 201

# 2. Historia zamówień użytkownika
@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        "id": o.id,
        "date": o.date.isoformat(),
        "status": o.status,
        "items": [{
            "product_id": i.product_id,
            "quantity": i.quantity,
            "price": i.price_at_purchase
        } for i in o.items]
    } for o in orders]), 200