import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clubsService } from "../services/Clubs.service";

export default function CrearClub() {
  const navigate = useNavigate();

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

  const fieldClass =
    "w-full px-4 py-3 rounded-lg border bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition border-slate-200";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors({});
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.ciudad || !form.descripcion || !form.contacto) {
      setErrors({ general: "Todos los campos obligatorios" });
      return;
    }

    try {
      await clubsService.create({
        nombre: form.nombre,
        ciudad: form.ciudad,
        descripcion: form.descripcion,
        logoUrl: form.urlLogo,
        bannerUrl: form.urlBanner,
        colorPrimario: form.colorPrimario,
        colorSecundario: form.colorSecundario,
        contacto: form.contacto,
      });

      setSuccess("✅ Club creado correctamente");

      setTimeout(() => {
        navigate("/panel-club");
      }, 1200);
    } catch (error) {
      setErrors({ general: "Error al crear club" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      {/* BOTÓN VOLVER */}
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
        {/* ✅ IZQUIERDA FORM */}
        <div className="flex items-center justify-center px-6 py-16 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Crear club
              </h2>
              <p className="mt-2 text-slate-500">
                Registra tu club deportivo en la plataforma
              </p>
            </div>

            {/* ✅ MENSAJES */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="nombre"
                placeholder="Nombre del club"
                value={form.nombre}
                onChange={handleChange}
                className={fieldClass}
              />

              <input
                name="ciudad"
                placeholder="Ciudad"
                value={form.ciudad}
                onChange={handleChange}
                className={fieldClass}
              />

              <input
                name="contacto"
                placeholder="Contacto"
                value={form.contacto}
                onChange={handleChange}
                className={fieldClass}
              />

              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={handleChange}
                className={fieldClass}
              />

              <input
                name="urlLogo"
                placeholder="URL logo"
                value={form.urlLogo}
                onChange={handleChange}
                className={fieldClass}
              />

              <input
                name="urlBanner"
                placeholder="URL banner"
                value={form.urlBanner}
                onChange={handleChange}
                className={fieldClass}
              />

              {/* 🎨 COLORES MEJORADOS */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="colorPrimario"
                    value={form.colorPrimario}
                    onChange={handleChange}
                    className="w-12 h-10 rounded-lg border cursor-pointer"
                  />
                  <span className="text-sm">{form.colorPrimario}</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="colorSecundario"
                    value={form.colorSecundario}
                    onChange={handleChange}
                    className="w-12 h-10 rounded-lg border cursor-pointer"
                  />
                  <span className="text-sm">{form.colorSecundario}</span>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 px-6 py-3 font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition"
              >
                Crear club
              </button>
            </form>
          </div>
        </div>

        {/* ✅ DERECHA DECORATIVO */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200">
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

          <div className="relative z-10 flex items-center gap-2 px-6 py-4 rounded-xl bg-white/90 shadow-2xl">
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
