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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Usuario logueado:", data.email);
        console.log("Rol:", data.rol);
        console.log("Token:", data.token);

        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("rol", data.rol);

        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);

      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900 px-4 py-10">
      <div className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm shadow-lg shadow-slate-200/60 border border-slate-200">
        <button
          type="button"
          onClick={() => navigate(returnPath)}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Volver
        </button>
        <span className="text-slate-900 font-bold">ClubZone</span>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl shadow-slate-200/40 animate-fadeIn">
        <div className="text-center mb-7">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-slate-600">
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
              className="w-full p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-300 placeholder:text-slate-400 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-300 placeholder:text-slate-400 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-4 mt-3">{error}</p>}

          <button className="w-full mt-5 py-4 font-bold text-lg text-white rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-200/40 transition-all duration-300">
            Entrar
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            ¿No tienes cuenta?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer hover:text-blue-700 font-semibold"
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
