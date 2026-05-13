import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api"; // 👈 IMPORTANTE

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const data = await apiRequest("/usuarios/perfil");

        setUser(data);
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
    // Navegar a la página de edición de perfil
    navigate("/edit-profile");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
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
          <h2 className="text-xl font-bold text-white mb-2">Explorar clubes</h2>
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
      </div>
    </div>
  );
}
