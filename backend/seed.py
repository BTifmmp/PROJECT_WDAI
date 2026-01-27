import requests
import random
from app import create_app, db
from app.models import Product, User, Review

app = create_app()

LOREM_IPSUM = [
    "Świetny produkt, polecam każdemu!",
    "Trochę długo czekałem na przesyłkę, ale jakość jest super.",
    "Zupełnie jak w opisie, sprawuje się doskonale.",
    "Mógłby być nieco tańszy, ale i tak warto.",
    "Najlepszy zakup w tym roku! Bardzo solidne wykonanie.",
    "Produkt spełnia moje oczekiwania, polecam sprzedawcę.",
    "Niestety kolor na zdjęciu nieco różni się od rzeczywistego.",
    "Bardzo praktyczne i funkcjonalne. Na pewno kupię ponownie."
]

def seed_data():
    with app.app_context():
        # 1. Seedowanie produktów
        if not Product.query.first():
            print("Pobieranie produktów z API...")
            response = requests.get('https://fakestoreapi.com/products')
            if response.status_code == 200:
                for item in response.json():
                    new_prod = Product(
                        name=item['title'],
                        description=item['description'],
                        price=item['price'],
                        category=item['category'],
                        image_url=item['image'],
                        stock=15
                    )
                    db.session.add(new_prod)
                db.session.commit() # Commitujemy produkty, żeby mieć ich ID do opinii
                print("Produkty dodane!")

        # 2. Seedowanie użytkowników
        if not User.query.first():
            print("Tworzenie kont testowych...")
            test_users = [
                User(username="admin", password="admin123", role="admin"),
                User(username="prowadzacy", password="password125", role="user"),
                User(username="student1", password="student123", role="user")
            ]
            db.session.add_all(test_users)
            db.session.commit()
            print("Konta testowe stworzone!")

        # 3. Seedowanie opinii (po 2 na każdy produkt)
        if not Review.query.first():
            print("Dodawanie opinii do produktów...")
            all_products = Product.query.all()
            all_users = User.query.all()

            for prod in all_products:
                # Losujemy 2 różnych użytkowników dla każdego produktu
                authors = random.sample(all_users, 2)
                
                for author in authors:
                    new_review = Review(
                        rating=random.randint(3, 5), # Losowa ocena 3-5
                        content=random.choice(LOREM_IPSUM),
                        user_id=author.id,
                        product_id=prod.id
                    )
                    db.session.add(new_review)
            
            db.session.commit()
            print("Opinie zostały dodane!")

        print("Baza danych jest w pełni gotowa i nakarmiona!")

if __name__ == "__main__":
    seed_data()