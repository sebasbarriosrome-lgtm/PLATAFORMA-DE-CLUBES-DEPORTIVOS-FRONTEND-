import { apiRequest } from "./api";

export const authService = {
  login: (form) => {
    return apiRequest("/usuarios/login", {
      method: "POST",
      body: JSON.stringify(form),
    });
  },

  register: (form) => {
    return apiRequest("/usuarios/register", {
      method: "POST",
      body: JSON.stringify(form),
    });
  },
};
