const API_URL = "http://localhost:8080";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error en la petición");
  }

  return data;
};
