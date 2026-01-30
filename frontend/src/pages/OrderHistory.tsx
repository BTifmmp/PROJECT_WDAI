import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

// Definicja typów zgodnie z Twoim backendem
type OrderItem = {
  product_id: number;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  date: string;
  status: string;
  items: OrderItem[];
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Zakładam, że endpoint w Twoim Blueprint to /orders/
        const data = await apiFetch("/orders/"); 
        console.log("ORDERS RESPONSE:", data);

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("ORDERS FETCH CRASHED:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Funkcja pomocnicza do obliczania sumy zamówienia
  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (loading) return <div className="container mt-4"><p>Ładowanie zamówień...</p></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Moje Zamówienia</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">Nie masz jeszcze żadnych zamówień.</div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card mb-4 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>
                <strong>Zamówienie #{order.id}</strong> z dnia {new Date(order.date).toLocaleDateString()}
              </span>
              <span className={`badge ${order.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {order.items.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span>
                      Produkt ID: {item.product_id} (x{item.quantity})
                    </span>
                    <span>{item.price * item.quantity} zł</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer text-end">
              <h5>Suma: <span className="text-primary">{calculateTotal(order.items).toFixed(2)} zł</span></h5>
            </div>
          </div>
        ))
      )}
    </div>
  );
}