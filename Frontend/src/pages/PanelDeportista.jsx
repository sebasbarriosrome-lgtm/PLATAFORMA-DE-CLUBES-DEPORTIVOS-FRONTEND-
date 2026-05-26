import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PanelDeportista() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // placeholder: la data real vendrá del backend en integración futura
    setUserData({ nombre: "Deportista Ejemplo" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* REGRESAR */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/UserProfile")}
            className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:shadow-md transition-colors hover:bg-blue-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-blue-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L4.414 9H18a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-slate-800">Volver al perfil</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow">
          <h1 className="text-3xl font-semibold">Panel del deportista</h1>
          <p className="mt-2 text-slate-500">
            Accede a tus entrenamientos y progreso.
          </p>
          <div className="mt-6">
            <p className="text-lg font-medium">
              Bienvenido, {userData?.nombre}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
