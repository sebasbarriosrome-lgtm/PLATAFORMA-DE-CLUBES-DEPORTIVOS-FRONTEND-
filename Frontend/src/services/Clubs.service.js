import { apiRequest } from "./api";

export const clubsService = {
  getAll: () => {
    return apiRequest("/clubs", {
      method: "GET",
    });
  },

  getById: (id) => {
    return apiRequest(`/clubs/${id}`, {
      method: "GET",
    });
  },

  create: (club) => {
    return apiRequest("/clubs", {
      method: "POST",
      body: JSON.stringify(club),
    });
  },

  update: (id, club) => {
    return apiRequest(`/clubs/${id}`, {
      method: "PUT",
      body: JSON.stringify(club),
    });
  },

  remove: (id) => {
    return apiRequest(`/clubs/${id}`, {
      method: "DELETE",
    });
  },
};
