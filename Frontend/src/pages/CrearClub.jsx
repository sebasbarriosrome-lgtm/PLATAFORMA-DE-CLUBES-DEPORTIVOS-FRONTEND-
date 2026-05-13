import { useLocation, useNavigate } from "react-router-dom";

export default function CrearClub() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.from === "clubs" ? "/clubs" : "/";

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center px-6">
      {/* TOP BAR */}
      <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <button
          onClick={() => navigate(returnPath)}
          className="text-blue-600 font-semibold hover:text-blue-700"
        >
          ← Volver
        </button>
        <span className="font-bold">ClubZone</span>
      </div>

      {/* CARD */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center">Crear un nuevo club</h2>

        <p className="mt-3 text-center text-slate-600">
          Aquí irá el formulario de creación.
        </p>

        <button
          onClick={() => navigate(returnPath)}
          className="mt-6 w-full rounded-xl border border-slate-200 py-2 hover:bg-slate-50"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
