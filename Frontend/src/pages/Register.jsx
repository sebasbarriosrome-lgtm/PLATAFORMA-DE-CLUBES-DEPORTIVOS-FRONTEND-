import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/Auth.service";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellido) newErrors.apellido = "El apellido es obligatorio";
    if (!formData.email) newErrors.email = "El email es obligatorio";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Mínimo 6 caracteres";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const data = await authService.register(formData);

      setSuccessMessage(data.message);
      setFormData({ nombre: "", apellido: "", email: "", password: "" });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900 px-4 py-10">
      <div className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm shadow-lg shadow-slate-200/60 border border-slate-200">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← Volver
        </button>
        <span className="text-slate-900 font-bold">ClubZone</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-200/40">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Registrarse
          </h2>
          <p className="mt-2 text-slate-600">Crea tu cuenta para comenzar</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {errors.general}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ingresa tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.nombre ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.nombre && (
              <p className="text-red-600 text-sm mt-2">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="apellido"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Apellido
            </label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              placeholder="Ingresa tu apellido"
              value={formData.apellido}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.apellido ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.apellido && (
              <p className="text-red-600 text-sm mt-2">{errors.apellido}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.email ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-2">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.password ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-bold text-lg rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-200/40 transition-all duration-300 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:text-blue-700 font-semibold"
          >
            Inicia sesión aquí
          </span>
        </p>
      </div>
    </div>
  );
}
