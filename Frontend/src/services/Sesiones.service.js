import { apiRequest } from "./api";

export const sesionesService = {
  // ─────────────────────────────────────────────
  // SESIONES
  // ─────────────────────────────────────────────

  getSesiones: () => apiRequest("/entrenador/sesiones"),

  crearSesion: (data) =>
    apiRequest("/entrenador/sesiones", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  actualizarEstadoSesion: (sesionId, estado) =>
    apiRequest(`/entrenador/sesiones/${sesionId}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    }),

  eliminarSesion: (sesionId) =>
    apiRequest(`/entrenador/sesiones/${sesionId}`, {
      method: "DELETE",
    }),

  // ─────────────────────────────────────────────
  // CATÁLOGO DE ACTIVIDADES
  // ─────────────────────────────────────────────

  getActividades: () => apiRequest("/entrenador/actividades"),

  crearActividad: (data) =>
    apiRequest("/entrenador/actividades", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ─────────────────────────────────────────────
  // ACTIVIDADES DE UNA SESIÓN
  // ─────────────────────────────────────────────

  getActividadesBySesion: (sesionId) =>
    apiRequest(`/entrenador/sesiones/${sesionId}/actividades`),

  agregarActividadASesion: (sesionId, data) =>
    apiRequest(`/entrenador/sesiones/${sesionId}/actividades`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  quitarActividadDeSesion: (sesionActividadId) =>
    apiRequest(`/entrenador/sesiones/actividades/${sesionActividadId}`, {
      method: "DELETE",
    }),

  // ─────────────────────────────────────────────
  // ASISTENCIA
  // ─────────────────────────────────────────────

  getAsistenciaBySesion: (sesionId) =>
    apiRequest(`/entrenador/sesiones/${sesionId}/asistencia`),

  registrarAsistenciaLote: (sesionId, lista) =>
    apiRequest(`/entrenador/sesiones/${sesionId}/asistencia/lote`, {
      method: "POST",
      body: JSON.stringify(lista),
    }),
};
