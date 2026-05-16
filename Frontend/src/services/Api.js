const API_URL = "http://localhost:8080";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN GUARDADO:", token);
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    console.error("Error del backend:", data);
    throw new Error(data.message || "Error en la petición");
  }

  return data;
};
