// Importa el hook useState de React
import { useState } from "react";

// Importa hooks de React Router para navegación y ubicación actual
import { useNavigate, useLocation } from "react-router-dom";

// Componente principal Register
export default function Register() {
  // Hook para navegar entre rutas
  const navigate = useNavigate();

  // Hook para obtener la ubicación actual
  const location = useLocation();

  // Determina la ruta de retorno según desde dónde llegó el usuario
  const returnPath = location.state?.from === "clubs" ? "/clubs" : "/";

  // Estados del formulario
  const [tipo, setTipo] = useState("deportista"); // Tipo de usuario
  const [deporte, setDeporte] = useState("Seleccionar deporte"); // Deporte seleccionado
  const [fechaNacimiento, setFechaNacimiento] = useState(""); // Fecha de nacimiento
  const [primerNombre, setPrimerNombre] = useState(""); // Primer nombre
  const [segundoNombre, setSegundoNombre] = useState(""); // Segundo nombre
  const [primerApellido, setPrimerApellido] = useState(""); // Primer apellido
  const [segundoApellido, setSegundoApellido] = useState(""); // Segundo apellido
  const [telefono, setTelefono] = useState(""); // Teléfono
  const [correo, setCorreo] = useState(""); // Correo electrónico
  const [password, setPassword] = useState(""); // Contraseña
  const [errors, setErrors] = useState({}); // Objeto de errores

  // Lista de deportes disponibles
  const deportes = [
    "Seleccionar deporte",
    "Fútbol",
    "Baloncesto",
    "Natación",
    "Atletismo",
    "Tenis",
    "Ciclismo",
  ];

  // Función para validar los campos del formulario
  const validate = () => {
    // Objeto donde se almacenan los errores encontrados
    const newErrors = {};

    // Validación del primer nombre
    if (!primerNombre.trim()) {
      newErrors.primerNombre = "Primer nombre es requerido";
    } else if (!/^[a-zA-Z\s]+$/.test(primerNombre.trim())) {
      newErrors.primerNombre = "Solo letras y espacios permitidos";
    }

    // Validación del segundo nombre
    if (!segundoNombre.trim()) {
      newErrors.segundoNombre = "Segundo nombre es requerido";
    } else if (!/^[a-zA-Z\s]+$/.test(segundoNombre.trim())) {
      newErrors.segundoNombre = "Solo letras y espacios permitidos";
    }

    // Validación del primer apellido
    if (!primerApellido.trim()) {
      newErrors.primerApellido = "Primer apellido es requerido";
    } else if (!/^[a-zA-Z\s]+$/.test(primerApellido.trim())) {
      newErrors.primerApellido = "Solo letras y espacios permitidos";
    }

    // Validación del segundo apellido
    if (!segundoApellido.trim()) {
      newErrors.segundoApellido = "Segundo apellido es requerido";
    } else if (!/^[a-zA-Z\s]+$/.test(segundoApellido.trim())) {
      newErrors.segundoApellido = "Solo letras y espacios permitidos";
    }

    // Validación del teléfono
    if (!telefono.trim()) {
      newErrors.telefono = "Número de teléfono es requerido";
    } else if (!/^\d{10}$/.test(telefono.trim())) {
      newErrors.telefono = "Debe ser un número de 10 dígitos";
    }

    // Validación del correo
    if (!correo.trim()) {
      newErrors.correo = "Correo personal es requerido";
    } else if (!/\S+@\S+\.\S+/.test(correo)) {
      newErrors.correo = "Correo no válido";
    }

    // Validación de la contraseña
    if (!password.trim()) {
      newErrors.password = "Contraseña es requerida";
    } else if (password.length < 8) {
      newErrors.password = "Debe tener al menos 8 caracteres";
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = "Debe contener al menos una mayúscula";
    }

    // Validación del deporte seleccionado
    if (!deporte || deporte === "Seleccionar deporte") {
      newErrors.deporte = "Selecciona un deporte";
    }

    // Validación de la fecha de nacimiento
    if (!fechaNacimiento) {
      newErrors.fechaNacimiento = "Fecha de nacimiento es requerida";
    } else {
      // Convierte la fecha ingresada y la actual
      const nacimiento = new Date(fechaNacimiento);
      const hoy = new Date();

      // Verifica que la fecha no sea futura
      if (nacimiento > hoy) {
        newErrors.fechaNacimiento = "Fecha no puede ser futura";
      }
    }

    // Actualiza el estado de errores
    setErrors(newErrors);

    // Retorna true si no hay errores
    return Object.keys(newErrors).length === 0;
  };

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    // Previene el comportamiento por defecto
    e.preventDefault();

    // Si la validación falla, detiene ejecución
    if (!validate()) return;

    // Objeto con los datos a enviar
    const data = {
      tipo,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      telefono,
      correo,
      password,
      deporte,
      fechaNacimiento,
    };

    try {
      // Realiza petición POST al backend
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",

        // Cabeceras de la petición
        headers: {
          "Content-Type": "application/json",
        },

        // Convierte los datos a JSON
        body: JSON.stringify(data),
      });

      // Obtiene respuesta como texto
      const dataRes = await res.text();

      // Si hay error en la respuesta
      if (!res.ok) {
        throw new Error(dataRes);
      }

      // Muestra alerta de éxito
      alert("Usuario registrado");

      // Redirige al login
      navigate("/login");
    } catch (err) {
      // Muestra error en consola
      console.error(err);
    }
  };

  // Clases reutilizables para inputs
  const inputClass =
    "w-full p-3 sm:p-4 rounded-xl bg-slate-800/70 border border-cyan-400/20 placeholder:text-slate-400 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 outline-none transition-all";

  // Clases para mostrar errores
  const errorClass = "text-red-400 text-sm mt-1";

  // Renderizado del componente
  return (
    // Contenedor principal
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white px-4 py-10">
      {/* Botón flotante de regreso */}
      <div className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-2 text-sm shadow-lg shadow-black/40">
        {/* Botón volver */}
        <button
          type="button"
          // Navega a la ruta anterior
          onClick={() => navigate(returnPath)}
          // Estilos
          className="font-semibold text-cyan-200 hover:text-cyan-100"
        >
          ← Volver
        </button>

        {/* Nombre de la app */}
        <span className="text-slate-100 font-bold">ClubZone</span>
      </div>

      {/* Tarjeta del formulario */}
      <div className="w-full max-w-3xl bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-cyan-500/20 p-8 sm:p-10 shadow-[0_20px_60px_rgba(16,185,129,0.35)]">
        {/* Encabezado */}
        <div className="text-center mb-7">
          {/* Título */}
          <h2 className="text-4xl sm:text-5xl font-extrabold">Crear cuenta</h2>

          {/* Subtítulo */}
          <p className="mt-2 text-cyan-200/90">¡Empieza tu camino deportivo!</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Selección de tipo de usuario */}
          <div className="mb-6">
            <label className="block mb-2 text-cyan-100/80">
              Tipo de usuario
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className={inputClass}
            >
              <option value="entrenador">Entrenador</option>
              <option value="deportista">Deportista</option>
            </select>
          </div>

          {/* Inputs de nombres y apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              ["Primer Nombre", primerNombre, setPrimerNombre, "primerNombre"],
              [
                "Segundo Nombre",
                segundoNombre,
                setSegundoNombre,
                "segundoNombre",
              ],
              [
                "Primer Apellido",
                primerApellido,
                setPrimerApellido,
                "primerApellido",
              ],
              [
                "Segundo Apellido",
                segundoApellido,
                setSegundoApellido,
                "segundoApellido",
              ],
            ].map(([ph, val, set, key]) => (
              // Contenedor por cada input
              <div key={key}>
                {/* Input */}
                <input
                  className={inputClass}
                  placeholder={ph}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                />

                {/* Mensaje de error */}
                {errors[key] && <p className={errorClass}>{errors[key]}</p>}
              </div>
            ))}
          </div>

          {/* Inputs de contacto */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Teléfono */}
            <div>
              <input
                className={inputClass}
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
              {errors.telefono && (
                <p className={errorClass}>{errors.telefono}</p>
              )}
            </div>

            {/* Correo */}
            <div>
              <input
                className={inputClass}
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              {errors.correo && <p className={errorClass}>{errors.correo}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <input
                className={inputClass}
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className={errorClass}>{errors.password}</p>
              )}
            </div>
          </div>

          {/* Selector de deporte */}
          <div className="mb-6">
            <select
              value={deporte}
              onChange={(e) => setDeporte(e.target.value)}
              className={inputClass}
            >
              {deportes.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            {errors.deporte && <p className={errorClass}>{errors.deporte}</p>}
          </div>

          {/* Fecha de nacimiento */}
          <div className="mb-6">
            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className={inputClass}
            />
            {errors.fechaNacimiento && (
              <p className={errorClass}>{errors.fechaNacimiento}</p>
            )}
          </div>

          {/* Botón de registro */}
          <button className="w-full py-4 font-bold text-lg text-slate-950 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400">
            Registrarme
          </button>

          {/* Enlace a login */}
          <p className="mt-5 text-center text-sm text-cyan-100/80">
            ¿Ya tienes cuenta?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-emerald-400 cursor-pointer hover:text-emerald-300"
            >
              Inicia sesión
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
