import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CrearClub() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.from === "clubs" ? "/clubs" : "/";

  const [form, setForm] = useState({
    nombre: "",
    ciudad: "",
    descripcion: "",
    urlLogo: "",
    urlBanner: "",
    colorPrimario: "#1477f8",
    colorSecundario: "#22c55e",
    contacto: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccess("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!form.ciudad.trim()) newErrors.ciudad = "La ciudad es obligatoria";
    if (!form.descripcion.trim())
      newErrors.descripcion = "La descripción es obligatoria";
    if (!form.contacto.trim())
      newErrors.contacto = "El número de contacto es obligatorio";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateForm();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setSuccess("Club creado con éxito. Serás redirigido al listado...");
    console.log("Club creado:", form);
    setTimeout(() => navigate(returnPath), 1200);
  };

  const inputBase =
    "w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 px-4 py-10 text-slate-900">
      <div className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm shadow-lg shadow-slate-200/50 border border-slate-200">
        <button
          type="button"
          onClick={() => navigate(returnPath)}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Volver
        </button>
        <span className="font-bold">ClubZone</span>
      </div>

      <div className="mx-auto w-full max-w-4xl rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40 backdrop-blur-sm sm:p-12">
        <div className="mb-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-blue-600 font-semibold">
              Crear club
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
              Crea tu club deportivo
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600 leading-7">
              Completa los datos principales, define tus colores y agrega los
              enlaces para el logo y el banner.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">
              Resumen rápido
            </p>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p>
                Nombre:{" "}
                <span className="font-semibold text-slate-900">
                  {form.nombre || "-"}
                </span>
              </p>
              <p>
                Ciudad:{" "}
                <span className="font-semibold text-slate-900">
                  {form.ciudad || "-"}
                </span>
              </p>
              <p>
                Contacto:{" "}
                <span className="font-semibold text-slate-900">
                  {form.contacto || "-"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                🏟️
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Datos del club
                </h2>
                <p className="text-sm text-slate-600">
                  Información obligatoria para crear tu club.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nombre
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del club"
                  className={inputBase}
                />
                {errors.nombre && (
                  <p className="mt-2 text-sm text-red-600">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Ciudad
                </label>
                <input
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  placeholder="Ciudad donde opera"
                  className={inputBase}
                />
                {errors.ciudad && (
                  <p className="mt-2 text-sm text-red-600">{errors.ciudad}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Número de contacto
                </label>
                <input
                  name="contacto"
                  type="tel"
                  value={form.contacto}
                  onChange={handleChange}
                  placeholder="Teléfono o WhatsApp"
                  className={inputBase}
                />
                {errors.contacto && (
                  <p className="mt-2 text-sm text-red-600">{errors.contacto}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Describe tu club, visión o equipo"
                  rows={5}
                  className={`${inputBase} min-h-[120px] resize-none`}
                />
                {errors.descripcion && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.descripcion}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-white">
                🎨
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Branding
                </h2>
                <p className="text-sm text-slate-600">
                  Define tus enlaces y colores principales.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  URL de logo (opcional)
                </label>
                <input
                  name="urlLogo"
                  type="url"
                  value={form.urlLogo}
                  onChange={handleChange}
                  placeholder="https://"
                  className={inputBase}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  URL de banner (opcional)
                </label>
                <input
                  name="urlBanner"
                  type="url"
                  value={form.urlBanner}
                  onChange={handleChange}
                  placeholder="https://"
                  className={inputBase}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Color primario
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      name="colorPrimario"
                      type="color"
                      value={form.colorPrimario}
                      onChange={handleChange}
                      className="h-12 w-16 rounded-2xl border border-slate-300 bg-white p-1"
                    />
                    <input
                      type="text"
                      value={form.colorPrimario}
                      readOnly
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Color secundario
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      name="colorSecundario"
                      type="color"
                      value={form.colorSecundario}
                      onChange={handleChange}
                      className="h-12 w-16 rounded-2xl border border-slate-300 bg-white p-1"
                    />
                    <input
                      type="text"
                      value={form.colorSecundario}
                      readOnly
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="w-full rounded-3xl bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4 text-lg font-semibold text-white shadow-xl shadow-blue-200/40 transition hover:brightness-110"
          >
            Registrar club
          </button>
        </form>
      </div>
    </div>
  );
}
