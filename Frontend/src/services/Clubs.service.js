import { apiRequest } from "./api";

export const clubsService = {
  getAll: () => apiRequest("/clubs", { method: "GET" }),

  getBySlug: (slug) =>
    apiRequest(`/clubs/slug/${slug}`, {
      method: "GET",
    }),

  create: (club) =>
    apiRequest("/clubs", {
      method: "POST",
      body: JSON.stringify(club),
    }),

  update: (id, club) =>
    apiRequest(`/clubs/${id}`, {
      method: "PUT",
      body: JSON.stringify(club),
    }),

  remove: (id) =>
    apiRequest(`/clubs/${id}`, {
      method: "DELETE",
    }),

  // ✅ NUEVOS MÉTODOS 🔥🔥🔥

  // obtener todas las solicitudes
  getSolicitudes: () =>
    apiRequest("/clubs/solicitudes", {
      method: "GET",
    }),

  // ✅ filtrar por rol
  getSolicitudesPorRol: (rol) =>
    apiRequest(`/clubs/solicitudes/rol?rol=${rol}`, {
      method: "GET",
    }),

  // ✅ aceptar / rechazar solicitud
  resolverSolicitud: (id, accion) =>
    apiRequest(`/clubs/solicitud/${id}`, {
      method: "PUT",
      body: JSON.stringify({ accion }),
    }),

  getHorariosClub: async () => {
    return await apiRequest(`/clubs/horarios`, {
      method: "GET",
    });
  },

  getHorariosClubSlug: async (slug) => {
    const d = await apiRequest(`/clubs/horarios/slug/${slug}`, {
      method: "GET",
    });
    console.log(`getHorariosClubSlug(${slug}) ->`, d);
    return d;
  },

  getById: (id) =>
    apiRequest(`/clubs/${id}`, {
      method: "GET",
    }),

  getEntrenadores: () =>
    apiRequest("/clubs/entrenadores", {
      method: "GET",
    }),

  getDeportistas: () =>
    apiRequest("/clubs/deportistas", {
      method: "GET",
    }),

  assignDeportistaToGroup: (deportistaId, grupoId) =>
    apiRequest(`/clubs/deportistas/${deportistaId}/grupo`, {
      method: "PUT",
      body: JSON.stringify({ grupoId }),
    }),

  assignDeportistaToCategory: (deportistaId, categoriaId) =>
    apiRequest(`/clubs/deportistas/${deportistaId}/categoria`, {
      method: "PUT",
      body: JSON.stringify({ categoriaId }),
    }),

  eliminarEntrenador: (id) =>
    apiRequest(`/clubs/entrenadores/${id}`, {
      method: "DELETE",
    }),

  eliminarDeportista: (id) =>
    apiRequest(`/clubs/deportistas/${id}`, {
      method: "DELETE",
    }),

  crearHorario: (horario) =>
    apiRequest("/clubs/horarios", {
      method: "POST",
      body: JSON.stringify(horario),
    }),

  actualizarHorario: (id, horario) =>
    apiRequest(`/clubs/horarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(horario),
    }),

  eliminarHorario: (id) =>
    apiRequest(`/clubs/horarios/${id}`, {
      method: "DELETE",
    }),

  // Categorías
  getCategories: (search) =>
    apiRequest(
      `/clubs/categories${search ? `?search=${encodeURIComponent(search)}` : ``}`,
      {
        method: "GET",
      },
    ),

  getCategoryById: (id) =>
    apiRequest(`/clubs/categories/${id}`, {
      method: "GET",
    }),

  createCategory: (categoria) =>
    apiRequest(`/clubs/categories`, {
      method: "POST",
      body: JSON.stringify(categoria),
    }),

  updateCategory: (id, categoria) =>
    apiRequest(`/clubs/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoria),
    }),

  deleteCategory: (id) =>
    apiRequest(`/clubs/categories/${id}`, {
      method: "DELETE",
    }),

  assignEntrenadoresToCategory: (categoryId, entrenadorIds) =>
    apiRequest(`/clubs/categories/${categoryId}/entrenadores`, {
      method: "PUT",
      body: JSON.stringify({ entrenadorIds }),
    }),

  // Grupos
  getGroups: (search) =>
    apiRequest(
      `/clubs/groups${search ? `?search=${encodeURIComponent(search)}` : ``}`,
      {
        method: "GET",
      },
    ),

  getGroupById: (id) =>
    apiRequest(`/clubs/groups/${id}`, {
      method: "GET",
    }),

  createGroup: (grupo) =>
    apiRequest(`/clubs/groups`, {
      method: "POST",
      body: JSON.stringify(grupo),
    }),

  updateGroup: (id, grupo) =>
    apiRequest(`/clubs/groups/${id}`, {
      method: "PUT",
      body: JSON.stringify(grupo),
    }),

  deleteGroup: (id) =>
    apiRequest(`/clubs/groups/${id}`, {
      method: "DELETE",
    }),

  assignEntrenadoresToGroup: (groupId, entrenadorIds) =>
    apiRequest(`/clubs/groups/${groupId}/entrenadores`, {
      method: "PUT",
      body: JSON.stringify({ entrenadorIds }),
    }),

  crearInvitacion: (data) =>
    apiRequest("/clubs/invitaciones", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getInvitaciones: () => apiRequest("/clubs/invitaciones", { method: "GET" }),

  getInvitacionesBySlug: (slug) =>
    apiRequest(`/clubs/invitaciones/slug/${slug}`, { method: "GET" }),
};
