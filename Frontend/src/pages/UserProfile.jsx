import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api"; // 👈 IMPORTANTE

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const data = await apiRequest("/usuarios/perfil");

        setUser(data);
        setEditedUser({
          firstName: data.name ? data.name.split(" ")[0] : "",
          lastName: data.name ? data.name.split(" ").slice(1).join(" ") : "",
          email: data.email || "",
          phone: data.phone || "",
          birthDate: data.birthDate
            ? new Date(data.birthDate).toISOString().split("T")[0]
            : "",
          photoUrl: data.photoUrl || "",
        });
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset editedUser to current user data
    setEditedUser({
      firstName: user?.name ? user.name.split(" ")[0] : "",
      lastName: user?.name ? user.name.split(" ").slice(1).join(" ") : "",
      email: user?.email || "",
      phone: user?.phone || "",
      birthDate: user?.birthDate
        ? new Date(user.birthDate).toISOString().split("T")[0]
        : "",
      photoUrl: user?.photoUrl || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedData = {
        name: `${editedUser.firstName} ${editedUser.lastName}`.trim(),
        email: editedUser.email,
        phone: editedUser.phone,
        birthDate: editedUser.birthDate,
        photoUrl: editedUser.photoUrl,
      };
      const data = await apiRequest("/usuarios/perfil", {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });
      setUser(data);
      setIsModalOpen(false);
      // Optionally show success message
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExploreClubs = () => {
    // Navegar a la vista de clubes
    navigate("/clubs");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600"></div>
          <p className="mt-4 text-slate-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-600 font-semibold">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      {isModalOpen ? (
        /* Pantalla de edición completa */
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Editar perfil
          </h1>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={editedUser.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={editedUser.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Contacto (Teléfono)
                </label>
                <input
                  type="text"
                  name="phone"
                  value={editedUser.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={editedUser.birthDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  URL de la foto
                </label>
                <input
                  type="url"
                  name="photoUrl"
                  value={editedUser.photoUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Pantalla del perfil */
        <div className="max-w-2xl mx-auto">
          {/* Tarjeta del perfil */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            {/* Avatar y nombre */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center mb-4 shadow-md">
                <span className="text-3xl font-bold text-blue-600">
                  {user?.name ? getInitials(user.name) : "?"}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                {user?.name || "Nombre de usuario"}
              </h1>
              <p className="text-slate-500 mt-1">
                {user?.email || "email@ejemplo.com"}
              </p>
            </div>

            {/* Botón Editar perfil */}
            <div className="flex justify-center mb-6">
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 px-6 py-2 border-2 border-slate-300 rounded-full text-slate-700 font-medium hover:border-blue-500 hover:text-blue-600 transition"
              >
                <span>✏️</span>
                <span>Editar perfil</span>
              </button>
            </div>
          </div>
          {/* Tarjeta de Información personal */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Información personal
            </h2>

            <div className="space-y-6">
              {/* Teléfono */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📱</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Teléfono</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {user?.phone || "No especificado"}
                  </p>
                </div>
              </div>

              {/* Fecha de nacimiento */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📅</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Fecha de nacimiento</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {user?.birthDate
                      ? new Date(user.birthDate).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "No especificada"}
                  </p>
                </div>
              </div>

              {/* Dirección */}
              {user?.address && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📍</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Dirección</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {user.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tarjeta Explorar clubes */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-white mb-2">
              Explorar clubes
            </h2>
            <p className="text-blue-100 mb-6">
              Descubre clubs deportivos en tu zona y únete a la comunidad
            </p>
            <button
              onClick={handleExploreClubs}
              className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition shadow-md"
            >
              Ver clubes disponibles →
            </button>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-800"
            >
              <span>🚪</span>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
