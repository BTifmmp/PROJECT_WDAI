from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Product, Review, db

products_bp = Blueprint('products', __name__)

# 1. Pobieranie wszystkich produktów (Lista)
@products_bp.route('/', methods=['GET'])
def get_all_products():
    # Używamy db.session.execute dla nowszych wersji lub standardowego .all()
    products = Product.query.all()
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "category": p.category,
        "description": p.description,
        "image_url": p.image_url,
        "stock": p.stock
    } for p in products]), 200

# 2. Pobieranie szczegółów produktu
@products_bp.route('/<int:product_id>', methods=['GET'])
def get_single_product(product_id):
    # Nowoczesny sposób pobierania (db.get_or_404)
    p = db.get_or_404(Product, product_id)
    return jsonify({
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "description": p.description,
        "category": p.category,
        "image_url": p.image_url,
        "stock": p.stock
    }), 200

# 3. Pobieranie opinii wraz z username autora
@products_bp.route('/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    # Sprawdzamy czy produkt w ogóle istnieje
    db.get_or_404(Product, product_id)
    
    reviews = Review.query.filter_by(product_id=product_id).all()
    
    return jsonify([{
        "id": r.id,
        "username": r.user.username,  # To zadziała dzięki relacji r.user
        "rating": r.rating,
        "content": r.content,
        "date": r.created_at.strftime("%Y-%m-%d %H:%M")
    } for r in reviews]), 200

# 4. Dodawanie nowej opinii (Wymaga zalogowania)
@products_bp.route('/<int:product_id>/reviews', methods=['POST'])
@jwt_required()
def add_review(product_id):
    # identity to zazwyczaj user_id przekazane podczas logowania
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Podstawowa walidacja
    if not data or 'rating' not in data:
        return jsonify({"msg": "Ocena (rating) jest wymagana"}), 400
        
    try:
        rating_val = int(data['rating'])
        if not (1 <= rating_val <= 5):
            raise ValueError
    except ValueError:
        return jsonify({"msg": "Ocena musi być liczbą od 1 do 5"}), 400

    new_review = Review(
        product_id=product_id,
        user_id=current_user_id,
        rating=rating_val,
        content=data.get('content', '')
    )
    
    db.session.add(new_review)
    db.session.commit()
    
    return jsonify({"msg": "Opinia dodana pomyślnie"}), 201

# 5. Usuwanie opinii (Tylko autor może usunąć swoją opinię)
@products_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    current_user_id = get_jwt_identity()
    
    # Znajdź opinię lub zwróć 404
    review = db.get_or_404(Review, review_id)
    
    # Zabezpieczenie: Sprawdź, czy ID zalogowanego użytkownika zgadza się z ID autora opinii
    if review.user_id != current_user_id:
        return jsonify({"msg": "Nie masz uprawnień do usunięcia tej opinii"}), 403

    db.session.delete(review)
    db.session.commit()
    
    return jsonify({"msg": "Opinia została usunięta"}), 200