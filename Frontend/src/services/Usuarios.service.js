import { apiRequest } from "./api";

export const usuarioService = {
  getInvitaciones: () =>
    apiRequest("/usuarios/invitaciones", {
      method: "GET",
    }),

  resolverInvitacion: (id, accion, extraFields = {}) =>
    apiRequest(`/usuarios/invitaciones/${id}`, {
      method: "PUT",
      body: JSON.stringify({ accion, ...extraFields }),
    }),
};
