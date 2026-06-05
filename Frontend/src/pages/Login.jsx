// Importa el hook useState de React
import { useState } from "react";

// Importa hooks de React Router para navegación y ubicación actual
import { useNavigate, useLocation } from "react-router-dom";

// Componente principal Login
const Login = () => {
  // Hook para navegar entre rutas
  const navigate = useNavigate();

  // Hook para obtener información de la ruta actual
  const location = useLocation();

  // Determina la ruta de retorno dependiendo desde dónde llegó el usuario
  const returnPath = location.state?.from === "clubs" ? "/clubs" : "/";

  // Estado para almacenar datos del formulario
  const [form, setForm] = useState({ email: "", password: "" });

  // Estado para mensajes de error
  const [error, setError] = useState("");

  // Función que maneja cambios en los inputs
  const handleChange = (e) => {
    // Actualiza dinámicamente el campo modificado
    setForm({ ...form, [e.target.name]: e.target.value });

    // Limpia el mensaje de error al escribir
    setError("");
  };

  // Función que maneja el envío del formulario
  const handleSubmit = (e) => {
    // Evita recargar la página
    e.preventDefault();

    // Validación básica frontend
    if (!form.email || !form.password) {
      // Muestra mensaje de error si hay campos vacíos
      setError("Todos los campos son obligatorios");

      // Detiene la ejecución
      return;
    }

    // Navega al inicio después del login
    navigate("/");
  };

  // Renderizado del componente
  return (
    // Contenedor principal
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white px-4 py-10">
      {/* Botón flotante de regreso */}
      <div className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-2 text-sm shadow-lg shadow-black/40">
        {/* Botón volver */}
        <button
          type="button"
          // Navega a la ruta anterior correspondiente
          onClick={() => navigate(returnPath)}
          // Estilos del botón
          className="font-semibold text-cyan-200 hover:text-cyan-100"
        >
          ← Volver
        </button>

        {/* Nombre del sistema */}
        <span className="text-slate-100 font-bold">ClubZone</span>
      </div>

      {/* Tarjeta principal del login */}
      <div className="w-full max-w-3xl bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-cyan-500/20 p-8 sm:p-10 shadow-[0_20px_60px_rgba(16,185,129,0.35)] animate-fadeIn">
        {/* Encabezado */}
        <div className="text-center mb-7">
          {/* Título */}
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Iniciar sesión
          </h2>

          {/* Texto descriptivo */}
          <p className="mt-2 text-cyan-200/90">
            Ingresa tus credenciales y vuelve al sistema.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Contenedor de inputs */}
          <div className="grid grid-cols-1 gap-4">
            {/* Campo de correo */}
            <input
              type="email"
              // Nombre del campo
              name="email"
              // Texto placeholder
              placeholder="Correo electrónico"
              // Valor actual del estado
              value={form.email}
              // Evento al escribir
              onChange={handleChange}
              // Clases de estilo
              className="w-full p-3 sm:p-4 rounded-xl bg-slate-800/70 border border-cyan-400/20 placeholder:text-slate-400 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 outline-none transition-all"
            />

            {/* Campo de contraseña */}
            <input
              type="password"
              // Nombre del campo
              name="password"
              // Placeholder
              placeholder="Contraseña"
              // Valor actual
              value={form.password}
              // Evento al cambiar contenido
              onChange={handleChange}
              // Estilos visuales
              className="w-full p-3 sm:p-4 rounded-xl bg-slate-800/70 border border-cyan-400/20 placeholder:text-slate-400 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 outline-none transition-all"
            />
          </div>

          {/* Muestra mensaje de error si existe */}
          {error && <p className="text-red-400 text-sm mb-4 mt-3">{error}</p>}

          {/* Botón de enviar formulario */}
          <button className="w-full mt-5 py-4 font-bold text-lg text-slate-950 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 hover:from-cyan-500 hover:via-emerald-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/40 transition-all duration-300">
            Entrar
          </button>

          {/* Texto de registro */}
          <p className="mt-5 text-center text-sm text-cyan-100/80">
            {/* Texto introductorio */}
            ¿No tienes cuenta? {/* Enlace para registrarse */}
            <span
              // Navega hacia la página de registro
              onClick={() => navigate("/register")}
              // Estilos visuales
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

// Exporta el componente Login
export default Login;
