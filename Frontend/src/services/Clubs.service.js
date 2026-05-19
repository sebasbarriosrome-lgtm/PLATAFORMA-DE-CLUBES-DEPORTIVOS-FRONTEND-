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
};