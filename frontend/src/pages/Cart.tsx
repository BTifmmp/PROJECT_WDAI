import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

type CartItem = {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
      const data = await apiFetch("/cart/");
      console.log("CART RESPONSE:", data);

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

  return (
    <div className="container mt-4">
      <h2>Koszyk</h2>

      {items.length === 0 ? (
        <p>Pusty koszyk</p>
      ) : (
        items.map(item => (
          <div
            key={item.product_id}
            className="d-flex justify-content-between mb-2"
          >
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>
              {item.price * item.quantity} zł
              <button
                className="btn btn-sm btn-danger ms-2"
                onClick={() => removeFromCart(item.product_id)}
              >
                Usuń
              </button>
            </span>
          </div>
        ))
      )}
    </div>
  );
};
