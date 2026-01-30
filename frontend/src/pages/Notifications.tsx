import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

type Notification = {
  id: number;
  message: string;
  is_read: boolean;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // GET /api/notifications/
  useEffect(() => {
    apiFetch("/notifications/").then(data => {
      if (data) {
        setNotifications(data);
      }
    });
  }, []);

  // POST /api/notifications/read/:id
  const markAsRead = async (id: number) => {
    const result = await apiFetch(`/notifications/read/${id}`, {
      method: "POST",
    });

    if (result !== null) {
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>Powiadomienia</h2>

      {notifications.length === 0 && (
        <p>Brak powiadomień</p>
      )}

      {notifications.map(n => (
        <div
          key={n.id}
          className={`alert ${n.is_read ? "alert-secondary" : "alert-primary"}`}
          style={{ cursor: "pointer" }}
          onClick={() => markAsRead(n.id)}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
};
