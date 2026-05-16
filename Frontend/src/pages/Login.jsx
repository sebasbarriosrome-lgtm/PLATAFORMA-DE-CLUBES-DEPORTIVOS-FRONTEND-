import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/Auth.service";

export default function Login() {
  const navigate = useNavigate();
  const returnPath = "/UserProfile";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("rol", data.rol);
      navigate(returnPath);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ open }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );

  const fieldClass =
    "w-full px-4 py-3 rounded-lg border bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition border-slate-200";

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      {/* Botón volver */}
      <div className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm shadow-md border border-slate-200">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Volver
        </button>
        <span className="text-slate-900 font-bold">ClubZone</span>
      </div>

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* IZQUIERDA: formulario */}
        <div className="flex items-center justify-center px-6 py-16 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Account login
              </h2>
              <p className="mt-2 text-slate-500">
                Ingresa tus credenciales y vuelve al sistema
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={form.email}
                  onChange={handleChange}
                  className={fieldClass}
                />
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className={`${fieldClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 px-6 py-3 font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="mt-8 text-sm text-slate-600">
              ¿No tienes cuenta?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-blue-600 cursor-pointer font-semibold hover:text-blue-700"
              >
                Regístrate aquí
              </span>
            </p>
          </div>
        </div>

        {/* DERECHA: panel decorativo */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200">
          {/* Formas geométricas */}
          <div className="absolute inset-0">
            <div className="absolute -top-10 -left-10 w-72 h-24 bg-blue-500/80 rotate-[-25deg] rounded-md animate-float" />
            <div className="absolute top-24 left-40 w-56 h-20 bg-white rotate-[-25deg] rounded-md shadow-lg animate-drift" />
            <div className="absolute top-10 right-10 w-80 h-28 bg-blue-600 rotate-[-25deg] rounded-md animate-float" />
            <div className="absolute top-1/2 -left-16 w-96 h-24 bg-sky-300 rotate-[-25deg] rounded-md animate-drift" />
            <div className="absolute bottom-20 left-20 w-72 h-24 bg-blue-700 rotate-[-25deg] rounded-md animate-float" />
            <div className="absolute bottom-10 right-0 w-80 h-28 bg-blue-400 rotate-[-25deg] rounded-md animate-drift" />
            <div className="absolute bottom-32 right-32 w-40 h-16 bg-white rotate-[-25deg] rounded-md shadow-md animate-float" />
            <div className="absolute top-1/4 right-1/3 w-64 h-20 bg-blue-300 rotate-[-25deg] rounded-md animate-drift" />
            <div className="absolute bottom-1/4 left-1/2 w-48 h-16 bg-sky-200 rotate-[-25deg] rounded-md animate-float" />
            <div className="absolute top-2/3 right-1/4 w-56 h-18 bg-blue-500 rotate-[-25deg] rounded-md animate-drift" />
          </div>

          {/* Logo central */}
          <div className="relative z-10 flex items-center gap-2 px-6 py-4 rounded-xl bg-white/90 backdrop-blur shadow-2xl">
            <span className="text-5xl font-extrabold text-slate-900">Club</span>
            <span className="text-5xl font-extrabold text-white bg-blue-600 px-4 py-1 rounded-md">
              Zone
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
