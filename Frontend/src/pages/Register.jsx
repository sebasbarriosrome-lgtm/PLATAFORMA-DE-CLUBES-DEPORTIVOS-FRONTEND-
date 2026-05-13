import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Limpiar el error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  // Validación básica
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    return newErrors;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:8080/usuarios/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);

        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          password: "",
        });

        setErrors({});

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrors({
          general: data.message,
        });
      }
    } catch (error) {
      console.error(error);

      setErrors({
        general: "Error al conectar con el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900 px-4 py-10">
      {/* Botón Volver */}
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

        {/* Mensaje de error general */}
        {errors.general && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingresa tu nombre"
              className={`${inputClass} ${
                errors.nombre ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.nombre && <p className={errorClass}>{errors.nombre}</p>}
          </div>

          {/* Campo Apellido */}
          <div>
            <label
              htmlFor="apellido"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Ingresa tu apellido"
              className={`${inputClass} ${
                errors.apellido ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.apellido && <p className={errorClass}>{errors.apellido}</p>}
          </div>

          {/* Campo Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className={`${inputClass} ${
                errors.email ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>

          {/* Campo Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              className={`${inputClass} ${
                errors.password ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.password && <p className={errorClass}>{errors.password}</p>}
          </div>

          {/* Botón Registrarse */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-bold text-lg rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        {/* Link a Login */}
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
