import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { usuarioService } from "../services/Usuarios.service";
import InvitacionesClubes from "../components/InvitacionesClubes";

const getUserFullName = (profile) => {
  if (!profile) return "";
  if (profile.name) return profile.name;
  return `${profile.nombre || ""} ${profile.apellido || ""}`.trim();
};

const getFirstNameFromProfile = (profile) => {
  const fullName = getUserFullName(profile);
  return fullName.split(" ")[0] || "";
};

const getLastNameFromProfile = (profile) => {
  const fullName = getUserFullName(profile);
  return fullName.split(" ").slice(1).join(" ") || "";
};

const getProfileValue = (profile, ...keys) => {
  if (!profile) return "";
  return keys.reduce((value, key) => value || profile[key] || "", "");
};

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [saving, setSaving] = useState(false);
  const [invitaciones, setInvitaciones] = useState([]);
  const [loadingInvitaciones, setLoadingInvitaciones] = useState(true);
  const [selectedInvitacion, setSelectedInvitacion] = useState(null);
  const [acceptData, setAcceptData] = useState({
    peso: "",
    estatura: "",
    experiencia: "",
    especialidad: "",
  });
  const [actionError, setActionError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const normalizeRole = (role) => {
    if (Array.isArray(role)) {
      return role.map(normalizeRole).join(" ");
    }

    if (role && typeof role === "object") {
      return normalizeRole(
        role.nombre || role.name || role.rol || role.authority || "",
      );
    }

    return String(role || "")
      .toLowerCase()
      .replace(/[_\s-]/g, "");
  };

  // eslint-disable-next-line no-unused-vars
  const isCoach = () => {
    // Kept for reference but no longer needed
    return false;
  };

  // eslint-disable-next-line no-unused-vars
  const getRoleCandidates = (profile) => {
    if (!profile) return [];
    const candidates = [];
    if (profile.rol !== undefined) candidates.push(profile.rol);
    if (profile.role !== undefined) candidates.push(profile.role);
    if (Array.isArray(profile.roles)) candidates.push(...profile.roles);
    return candidates;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const data = await apiRequest("/usuarios/perfil");
        setUser(data);
        setEditedUser({
          firstName: getFirstNameFromProfile(data),
          lastName: getLastNameFromProfile(data),
          email: getProfileValue(data, "email", "correo"),
          telefono: getProfileValue(data, "telefono", "phone"),
          birthDate: data.birthDate
            ? new Date(data.birthDate).toISOString().split("T")[0]
            : "",
          photoUrl: getProfileValue(data, "photoUrl", "fotoUrl"),
        });
        setLoading(false);
      } catch (err) {
        const message = err.message || "Error al obtener perfil";
        if (
          message.includes("Token inválido") ||
          message.includes("Usuario no encontrado") ||
          message.includes("No autorizado")
        ) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        setError(message);
        setLoading(false);
      }
    };

    const fetchInvitaciones = async () => {
      try {
        setLoadingInvitaciones(true);
        const data = await usuarioService.getInvitaciones();
        setInvitaciones(data);
      } catch (err) {
        console.error("Error al cargar invitaciones:", err);
      } finally {
        setLoadingInvitaciones(false);
      }
    };

    fetchUserData();
    fetchInvitaciones();
  }, [navigate]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleEditProfile = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditedUser({
      firstName: getFirstNameFromProfile(user),
      lastName: getLastNameFromProfile(user),
      email: getProfileValue(user, "email", "correo"),
      telefono: getProfileValue(user, "telefono", "phone"),
      birthDate: user?.birthDate
        ? new Date(user.birthDate).toISOString().split("T")[0]
        : "",
      photoUrl: getProfileValue(user, "photoUrl", "fotoUrl"),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Helper para convertir strings vacíos a null
      const toNullIfEmpty = (value) => {
        const trimmed = value?.trim();
        return trimmed && trimmed.length > 0 ? trimmed : null;
      };

      const updatedData = {
        name: toNullIfEmpty(editedUser.firstName) || "",
        apellido: toNullIfEmpty(editedUser.lastName) || "",
        email: toNullIfEmpty(editedUser.email) || "",
        telefono: toNullIfEmpty(editedUser.telefono),
        birthDate: toNullIfEmpty(editedUser.birthDate),
        photoUrl: toNullIfEmpty(editedUser.photoUrl),
      };

      const response = await apiRequest("/usuarios/perfil", {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });

      if (response?.token) {
        localStorage.setItem("token", response.token);
      }

      const perfilActualizado = await apiRequest("/usuarios/perfil");

      setUser(perfilActualizado);

      setEditedUser({
        firstName: perfilActualizado.name
          ? perfilActualizado.name.split(" ")[0]
          : "",
        lastName: perfilActualizado.name
          ? perfilActualizado.name.split(" ").slice(1).join(" ")
          : "",
        email: perfilActualizado.email || "",
        telefono: perfilActualizado.telefono || "",
        birthDate: perfilActualizado.birthDate
          ? new Date(perfilActualizado.birthDate).toISOString().split("T")[0]
          : "",
        photoUrl: perfilActualizado.photoUrl || "",
      });

      setIsModalOpen(false);
    } catch (err) {
      const message = err.message || "No se pudo actualizar";
      if (
        message.includes("Token inválido") ||
        message.includes("Usuario no encontrado") ||
        message.includes("No autorizado")
      ) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const fetchInvitaciones = async () => {
    try {
      setLoadingInvitaciones(true);
      const data = await usuarioService.getInvitaciones();
      setInvitaciones(data);
    } catch (err) {
      console.error("Error al cargar invitaciones:", err);
    } finally {
      setLoadingInvitaciones(false);
    }
  };

  const handleInvitacionAction = async (id, accion, extraFields = {}) => {
    try {
      setError(null);
      setActionError(null);
      setActionLoading(true);
      await usuarioService.resolverInvitacion(id, accion, extraFields);
      await fetchInvitaciones();
    } catch (err) {
      const message = err.message || "No se pudo actualizar la invitación";
      setError(message);
      setActionError(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectInvitacion = async (id) => {
    await handleInvitacionAction(id, "rechazado");
  };

  const handleOpenAccept = (invitacion) => {
    setActionError(null);
    setSelectedInvitacion(invitacion);
    setAcceptData({
      peso: "",
      estatura: "",
      experiencia: "",
      especialidad: "",
    });
  };

  const handleAcceptInvitacion = async () => {
    if (!selectedInvitacion) return;

    const rol = String(selectedInvitacion.rol || "").toLowerCase();
    const payload = {
      peso: null,
      estatura: null,
      experiencia: null,
      especialidad: null,
    };

    if (rol === "deportista") {
      payload.peso = acceptData.peso ? Number(acceptData.peso) : null;
      payload.estatura = acceptData.estatura
        ? Number(acceptData.estatura)
        : null;
    }

    if (rol === "entrenador") {
      payload.experiencia = acceptData.experiencia?.trim() || null;
      payload.especialidad = acceptData.especialidad?.trim() || null;
    }

    try {
      await handleInvitacionAction(selectedInvitacion.id, "aceptado", payload);
      setSelectedInvitacion(null);
    } catch {
      // Error already handled in handleInvitacionAction
    }
  };

  const handleAcceptFieldChange = (event) => {
    const { name, value } = event.target;
    setAcceptData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseAcceptModal = () => {
    setSelectedInvitacion(null);
    setAcceptData({
      peso: "",
      estatura: "",
      experiencia: "",
      especialidad: "",
    });
    setActionError(null);
  };

  const handleExploreClubs = () => {
    navigate("/clubs");
  };

  // ✅ IR A MI CLUB/PANEL
  const handleMyClub = async () => {
    try {
      const rolValidacion = await apiRequest("/usuarios/validar-rol");

      if (rolValidacion.tienePanel && rolValidacion.rol) {
        const rol = rolValidacion.rol.toLowerCase();
        if (rol.includes("entrenador")) {
          navigate("/panel-entrenador");
          return;
        }
        if (rol.includes("deportista")) {
          navigate("/panel-deportista");
          return;
        }
        if (rol.includes("admin")) {
          navigate("/panel-club");
          return;
        }
      }

      navigate("/crear-club");
    } catch (error) {
      console.error("Error en handleMyClub:", error);
      navigate("/crear-club");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center p-10">Cargando perfil...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      {/* Botón regresar (diseño igual al ejemplo) */}
      <div className="absolute left-4 top-4 z-50">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-md border border-slate-200 hover:shadow-lg transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L4.414 9H18a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Volver</span>
        </button>
      </div>
      <div className="max-w-7xl mx-auto space-y-6 pt-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] shadow-[0_35px_80px_rgba(15,23,42,0.08)] p-8 pt-28 sm:pt-24">
              <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 ring-4 ring-white shadow-sm flex items-center justify-center">
                  {user?.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-semibold text-sky-600">
                      {getInitials(user?.name)}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <h1 className="text-3xl font-semibold text-slate-900">
                    {user?.name}
                  </h1>
                  <p className="mt-2 text-slate-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleEditProfile}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Editar perfil
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[28px] shadow p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  Información personal
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Revisa tus datos y mantén tu perfil actualizado.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-sky-600 shadow-sm">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      Teléfono
                    </p>
                    <p className="mt-2 text-base font-medium text-slate-900">
                      {user?.telefono || "No registrado"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-sky-600 shadow-sm">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      Fecha de nacimiento
                    </p>
                    <p className="mt-2 text-base font-medium text-slate-900">
                      {formatDate(user?.birthDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-gradient-to-r from-sky-600 to-blue-600 p-8 text-white shadow-lg">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold">Explorar clubes</h2>
                <p className="mt-2 text-sm text-slate-100">
                  Descubre clubes deportivos en tu zona y únete a la comunidad.
                </p>
                <button
                  onClick={handleExploreClubs}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-md transition hover:bg-slate-100"
                >
                  Ver clubes disponibles →
                </button>
                <button
                  onClick={handleMyClub}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-md transition hover:bg-slate-100"
                >
                  Ir a mi club →
                </button>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={logout}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="sticky top-24">
              <InvitacionesClubes
                invitaciones={invitaciones}
                loading={loadingInvitaciones}
                onAccept={(item) => handleOpenAccept(item)}
                onReject={(id) => handleRejectInvitacion(id)}
              />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Editar perfil
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Actualiza tus datos personales.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
              >
                Cerrar
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Nombre</span>
                <input
                  type="text"
                  name="firstName"
                  value={editedUser.firstName}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Apellido</span>
                <input
                  type="text"
                  name="lastName"
                  value={editedUser.lastName}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Teléfono</span>
                <input
                  type="text"
                  name="telefono"
                  value={editedUser.telefono}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>
            <div className="mt-4">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Fecha de nacimiento</span>
                <input
                  type="date"
                  name="birthDate"
                  value={editedUser.birthDate}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>
            <div className="mt-4">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Foto de perfil (URL)</span>

                <input
                  type="url"
                  name="photoUrl"
                  value={editedUser.photoUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={handleCloseModal}
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedInvitacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-[0_35px_90px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                  Confirmar invitación
                </p>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Aceptar invitación al club {selectedInvitacion.clubName}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Completa los datos necesarios para aceptar la invitación como{" "}
                  {selectedInvitacion.rol}.
                </p>
              </div>
              <button
                onClick={handleCloseAcceptModal}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {String(selectedInvitacion.rol || "").toLowerCase() ===
                "deportista" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-medium">Peso (kg)</span>
                    <input
                      type="number"
                      name="peso"
                      step="0.1"
                      value={acceptData.peso}
                      onChange={handleAcceptFieldChange}
                      className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-medium">Estatura (cm)</span>
                    <input
                      type="number"
                      name="estatura"
                      value={acceptData.estatura}
                      onChange={handleAcceptFieldChange}
                      className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </label>
                </div>
              )}

              {String(selectedInvitacion.rol || "").toLowerCase() ===
                "entrenador" && (
                <div className="grid gap-4">
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-medium">Años de experiencia</span>
                    <input
                      type="text"
                      name="experiencia"
                      value={acceptData.experiencia}
                      onChange={handleAcceptFieldChange}
                      className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-medium">Especialidad</span>
                    <input
                      type="text"
                      name="especialidad"
                      value={acceptData.especialidad}
                      onChange={handleAcceptFieldChange}
                      className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </label>
                </div>
              )}

              {actionError && (
                <div className="rounded-[28px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {actionError}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseAcceptModal}
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAcceptInvitacion}
                disabled={actionLoading}
                className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? "Aceptando..." : "Aceptar invitación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
