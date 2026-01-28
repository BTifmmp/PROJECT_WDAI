const BASE_URL = "http://127.0.0.1:5000/api";

export const apiFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      // opcjonalnie: logout / redirect
      throw new Error("Brak autoryzacji");
    }
    throw new Error("Błąd API");
  }

  return res.json();
};
