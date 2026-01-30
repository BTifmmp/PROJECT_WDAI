import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom"; // Opcjonalne: do przekierowania po zamówieniu

type CartItem = {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await apiFetch("/cart/");
        if (!data) {
          setItems([]);
          return;
        }
        if (Array.isArray(data.items)) {
          setItems(data.items);
        } else if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("CART FETCH CRASHED:", err);
        setItems([]);
      }
    };

    loadCart();
  }, []);

  const removeFromCart = async (productId: number) => {
    const ok = await apiFetch(`/cart/remove/${productId}`, {
      method: "DELETE",
    });

    if (ok !== null) {
      setItems(prev => prev.filter(i => i.product_id !== productId));
    }
  };

  // --- NOWA FUNKCJA CHECKOUT ---
  const handleCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      const response = await apiFetch("/orders/checkout", {
        method: "POST",
      });

      if (response && response.order_id) {
        alert(`Zamówienie złożone! Numer zamówienia: ${response.order_id}`);
        setItems([]); // Czyścimy koszyk w UI
        
        // Opcjonalnie: przekieruj użytkownika do historii zamówień
        // navigate("/my-orders"); 
      } else {
        alert("Wystąpił błąd podczas składania zamówienia.");
      }
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      alert("Błąd połączenia z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  // Obliczanie sumy całkowitej dla przycisku
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mt-4">
      <h2>Twój Koszyk</h2>

      {items.length === 0 ? (
        <div className="alert alert-light">Pusty koszyk</div>
      ) : (
        <>
          <div className="list-group mb-3">
            {items.map(item => (
              <div
                key={item.product_id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.name}</strong> <br />
                  <small className="text-muted">{item.quantity} szt. x {item.price} zł</small>
                </div>
                <div className="text-end">
                  <span className="me-3 fw-bold">{item.price * item.quantity} zł</span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="m-0">Razem do zapłaty:</h4>
              <h4 className="m-0 text-primary">{totalPrice} zł</h4>
            </div>
            
            <button 
              className="btn btn-success btn-lg w-100" 
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
            >
              {loading ? "Przetwarzanie..." : "Złóż zamówienie (Checkout)"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}