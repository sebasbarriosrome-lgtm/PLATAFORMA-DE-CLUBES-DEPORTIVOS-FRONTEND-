import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.from === "clubs" ? "/clubs" : "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica frontend
    if (!form.email || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    navigate("/");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white px-4 py-10">
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
      <div className="w-full max-w-3xl bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-cyan-500/20 p-8 sm:p-10 shadow-[0_20px_60px_rgba(16,185,129,0.35)] animate-fadeIn">
        <div className="text-center mb-7">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-cyan-200/90">
            Ingresa tus credenciales y vuelve al sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 sm:p-4 rounded-xl bg-slate-800/70 border border-cyan-400/20 placeholder:text-slate-400 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 outline-none transition-all"
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 sm:p-4 rounded-xl bg-slate-800/70 border border-cyan-400/20 placeholder:text-slate-400 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 outline-none transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-4 mt-3">{error}</p>}

          <button className="w-full mt-5 py-4 font-bold text-lg text-slate-950 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 hover:from-cyan-500 hover:via-emerald-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/40 transition-all duration-300">
            Entrar
          </button>

          <p className="mt-5 text-center text-sm text-cyan-100/80">
            ¿No tienes cuenta?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-emerald-400 cursor-pointer hover:text-emerald-300"
            >
              Regístrate
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
