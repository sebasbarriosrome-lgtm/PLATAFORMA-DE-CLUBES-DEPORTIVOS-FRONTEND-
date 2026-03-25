import { useLocation, useNavigate } from "react-router-dom";

export default function CrearClub() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.from === "clubs" ? "/clubs" : "/";

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-slate-950 text-white px-6">
      <div className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-2 text-sm shadow-lg shadow-black/40">
        <button
          type="button"
          onClick={() => navigate(returnPath)}
          className="font-semibold text-cyan-200 hover:text-cyan-100"
        >
          ← Volver
        </button>
        <span className="text-slate-100 font-bold">ClubZone</span>
      </div>
      <div className="bg-slate-900/80 p-8 rounded-2xl border border-white/10 backdrop-blur-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Crear un nuevo club
        </h2>

        <button
          type="button"
          onClick={() => navigate(returnPath)}
          className="mb-4 rounded-lg border border-slate-300/30 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800"
        >
          Volver
        </button>

        <p className="text-slate-300 text-center">
          Aquí irá el formulario para crear un nuevo club.
        </p>
      </div>
    </div>
  );
}
