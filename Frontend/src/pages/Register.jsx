import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState("deportista");
  const [deporte, setDeporte] = useState("Seleccionar deporte");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const deportes = [
    "Seleccionar deporte",
    "Fútbol",
    "Baloncesto",
    "Natación",
    "Atletismo",
    "Tenis",
    "Ciclismo",
  ];

  const validate = () => {
    const newErrors = {};

    if (!primerNombre.trim()) {
      newErrors.primerNombre = "Primer nombre es requerido";
    } else if (!/^[a-zA-Z\s]+$/.test(primerNombre.trim())) {
      newErrors.primerNombre = "Solo letras y espacios permitidos";
    }

    if (!segundoNombre.trim()) {
      newErrors.segundoNombre = "Segundo nombre es requerido";
    } else if (!/^[a-zA-Z\s]+$/.test(segundoNombre.trim())) {
      newErrors.segundoNombre = "Solo letras y espacios permitidos";
    }

    if (!primerApellido.trim()) {
      newErrors.primerApellido = "Primer apellido es requerido";
    } else if (!/^[a-zA-Z\s]+$/.test(primerApellido.trim())) {
      newErrors.primerApellido = "Solo letras y espacios permitidos";
    }

    if (!segundoApellido.trim()) {
      newErrors.segundoApellido = "Segundo apellido es requerido";
    } else if (!/^[a-zA-Z\s]+$/.test(segundoApellido.trim())) {
      newErrors.segundoApellido = "Solo letras y espacios permitidos";
    }

    if (!telefono.trim()) {
      newErrors.telefono = "Número de teléfono es requerido";
    } else if (!/^\d{10}$/.test(telefono.trim())) {
      newErrors.telefono = "Debe ser un número de 10 dígitos";
    }

    if (!correo.trim()) {
      newErrors.correo = "Correo personal es requerido";
    } else if (!/\S+@\S+\.\S+/.test(correo)) {
      newErrors.correo = "Correo no válido";
    }

    if (!password.trim()) {
      newErrors.password = "Contraseña es requerida";
    } else if (password.length < 8) {
      newErrors.password = "Debe tener al menos 8 caracteres";
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = "Debe contener al menos una mayúscula";
    }

    if (!deporte || deporte === "Seleccionar deporte") {
      newErrors.deporte = "Selecciona un deporte";
    }

    if (!fechaNacimiento) {
      newErrors.fechaNacimiento = "Fecha de nacimiento es requerida";
    } else {
      const nacimiento = new Date(fechaNacimiento);
      const hoy = new Date();
      if (nacimiento > hoy) {
        newErrors.fechaNacimiento = "Fecha no puede ser futura";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

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
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dataRes = await res.text();

      if (!res.ok) {
        throw new Error(dataRes);
      }

      alert(err.message);

      alert("Usuario registrado");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass =
    "w-full p-3 sm:p-4 rounded-xl bg-slate-800/70 border border-cyan-400/20 placeholder:text-slate-400 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 outline-none transition-all";

  const errorClass = "text-red-400 text-sm mt-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white px-4 py-10">
      <div className="w-full max-w-3xl bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-cyan-500/20 p-8 sm:p-10 shadow-[0_20px_60px_rgba(16,185,129,0.35)]">
        <div className="text-center mb-7">
          <h2 className="text-4xl sm:text-5xl font-extrabold">Crear cuenta</h2>
          <p className="mt-2 text-cyan-200/90">¡Empieza tu camino deportivo!</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tipo */}
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

          {/* Inputs */}
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
              <div key={key}>
                <input
                  className={inputClass}
                  placeholder={ph}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                />
                {errors[key] && <p className={errorClass}>{errors[key]}</p>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

          {/* Deporte */}
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

          {/* Fecha */}
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

          <button className="w-full py-4 font-bold text-lg text-slate-950 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400">
            Registrarme
          </button>

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
