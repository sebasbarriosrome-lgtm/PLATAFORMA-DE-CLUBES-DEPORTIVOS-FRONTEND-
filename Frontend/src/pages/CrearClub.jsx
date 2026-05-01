// Importa hooks de React Router para navegación y acceso a la ubicación actual
import { useLocation, useNavigate } from "react-router-dom";

// Componente principal CrearClub
export default function CrearClub() {
  // Hook para navegar entre rutas
  const navigate = useNavigate();

  // Hook para obtener información de la ruta actual
  const location = useLocation();

  // Determina la ruta de regreso dependiendo desde dónde llegó el usuario
  const returnPath = location.state?.from === "clubs" ? "/clubs" : "/";

  // Renderizado del componente
  return (
    // Contenedor principal centrado vertical y horizontalmente
    <div className="relative flex items-center justify-center min-h-screen bg-slate-950 text-white px-6">
      {/* Botón flotante para regresar */}
      <div className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-2 text-sm shadow-lg shadow-black/40">
        {/* Botón de volver */}
        <button
          type="button"
          // Navega a la ruta almacenada en returnPath
          onClick={() => navigate(returnPath)}
          // Estilos del botón
          className="font-semibold text-cyan-200 hover:text-cyan-100"
        >
          ← Volver
        </button>

        {/* Nombre de la plataforma */}
        <span className="text-slate-100 font-bold">ClubZone</span>
      </div>

      {/* Tarjeta principal */}
      <div className="bg-slate-900/80 p-8 rounded-2xl border border-white/10 backdrop-blur-md w-full max-w-md">
        {/* Título */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          Crear un nuevo club
        </h2>

        {/* Segundo botón de volver */}
        <button
          type="button"
          // Regresa a la página anterior correspondiente
          onClick={() => navigate(returnPath)}
          // Estilos del botón
          className="mb-4 rounded-lg border border-slate-300/30 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800"
        >
          Volver
        </button>

        {/* Texto informativo */}
        <p className="text-slate-300 text-center">
          Aquí irá el formulario para crear un nuevo club.
        </p>
      </div>
    </div>
  );
}
