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
    const errorMessage = data?.message || text || "Error en la petición";
    console.error("Error del backend:", data, text);
    throw new Error(errorMessage);
  }

  return data;
};
