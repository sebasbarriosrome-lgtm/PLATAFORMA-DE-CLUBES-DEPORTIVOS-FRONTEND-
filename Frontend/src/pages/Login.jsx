import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/Auth.service";

const Login = () => {
  const navigate = useNavigate();

  const returnPath = "/UserProfile"; // ✅ siempre va al perfil

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

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

    try {
      const data = await authService.login(form);

      // ✅ Guardar token
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("rol", data.rol);

      // ✅ REDIRECCIÓN SIEMPRE AL PERFIL
      navigate(returnPath);
    } catch (error) {
      console.error(error);
      setError(error.message || "Error al conectar con el servidor");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900 px-4 py-10">
      {/* Botón volver */}
      <div className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm shadow-lg border border-slate-200">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Volver
        </button>
        <span className="text-slate-900 font-bold">ClubZone</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl">
        <div className="text-center mb-7">
          <h2 className="text-4xl sm:text-5xl font-extrabold">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-slate-600">
            Ingresa tus credenciales y vuelve al sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="p-4 rounded-xl bg-slate-50 border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="p-4 rounded-xl bg-slate-50 border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

          <button className="w-full mt-5 py-4 font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            Entrar
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            ¿No tienes cuenta?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer font-semibold"
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
