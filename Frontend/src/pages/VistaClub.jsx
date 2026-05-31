import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function VistaClub() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [horarios, setHorarios] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtro, setFiltro] = useState("");

  // SOLICITUD
  const [showModal, setShowModal] = useState(false);
  const [rol, setRol] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loadingRequest, setLoadingRequest] = useState(false);

  //INVITACIONES
  const [invitaciones, setInvitaciones] = useState([]);

  const [formSolicitud, setFormSolicitud] = useState({
    mensaje: "",
    peso: "",
    estatura: "",
    experiencia: "",
    especialidad: "",
  });

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const data = await apiRequest(`/clubs/slug/${slug}`);

        setClub({
          id: data.id,
          name: data.nombre,
          location: data.ciudad,
          tagline: data.descripcion,
          banner: data.banner_url || data.bannerUrl,
          logo: data.logo_url || data.logoUrl,
          phone: data.contacto,
        });

        // aplicar colores del club si vienen
        try {
          const primary =
            data.colorPrimario || data.color_primario || "#2563eb";
          const secondary =
            data.colorSecundario || data.color_secundario || "#ffffff";
          document.documentElement.style.setProperty("--club-primary", primary);
          document.documentElement.style.setProperty(
            "--club-secondary",
            secondary,
          );
        } catch (e) {}

        const horariosData = await apiRequest(`/clubs/horarios/slug/${slug}`);
        console.log("VistaClub horarios ->", horariosData);
        setHorarios(horariosData);
        // extraer grupos / categorías si vienen en la respuesta del club
        const grupos = Array.isArray(data?.grupos) ? data.grupos : [];
        setGroups(
          grupos.map((g) => ({
            id: g.id,
            nombre: g.nombre,
            categoria: g.categoria,
          })),
        );
        const catsMap = new Map();
        horariosData.forEach((h) => {
          if (h.categoriaId && h.categoriaNombre) {
            catsMap.set(h.categoriaId, h.categoriaNombre);
          }
        });
        setCategories(
          Array.from(catsMap.entries()).map(([id, nombre]) => ({ id, nombre })),
        );
        try {
          const invData = await apiRequest(`/clubs/invitaciones/slug/${slug}`);
          setInvitaciones(Array.isArray(invData) ? invData : []);
        } catch {
          setInvitaciones([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchClub();
  }, [slug]);

  const handleSolicitudChange = (e) => {
    setFormSolicitud({
      ...formSolicitud,
      [e.target.name]: e.target.value,
    });
  };

  const handleEnviarSolicitud = async () => {
    if (!rol || !formSolicitud.mensaje) {
      setError("Todos los campos obligatorios");
      return;
    }

    if (rol === "deportista") {
      if (!formSolicitud.peso || !formSolicitud.estatura) {
        setError("Peso y estatura son obligatorios");
        return;
      }
    }

    if (rol === "entrenador") {
      if (!formSolicitud.experiencia || !formSolicitud.especialidad) {
        setError("Todos los campos obligatorios");
        return;
      }
    }

    setError("");
    setLoadingRequest(true);

    try {
      const payload = {
        clubId: club.id,
        rol,
        mensaje: formSolicitud.mensaje,

        // ✅ IMPORTANTE
        peso: formSolicitud.peso ? Number(formSolicitud.peso) : null,
        estatura: formSolicitud.estatura
          ? Number(formSolicitud.estatura)
          : null,

        experiencia: formSolicitud.experiencia,
        especialidad: formSolicitud.especialidad,
      };

      await apiRequest("/clubs/solicitud", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccess("Solicitud enviada");

      setTimeout(() => {
        setShowModal(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al enviar solicitud");

      setTimeout(() => setError(""), 3000);
    } finally {
      setLoadingRequest(false);
    }
  };

  const initials = club?.name
    ? club.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CD";

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!club) return <div className="p-6">Club no encontrado</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-black text-blue-600"
          >
            <div className="h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center">
              CZ
            </div>
            ClubZone
          </Link>
        </div>
      </header>

      <main className="space-y-10 pb-16">
        <section className="px-4 pt-6">
          {club.banner ? (
            <img
              src={club.banner}
              className="w-full h-60 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-60 bg-gray-200 flex items-center justify-center rounded-xl">
              Sin banner
            </div>
          )}
        </section>

        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-200 flex items-center justify-center">
                {club.logo ? (
                  <img src={club.logo} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold">{initials}</span>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold">{club.name}</h1>
                <p className="text-sm text-slate-500">📍 {club.location}</p>
              </div>
            </div>

            <p className="mt-4 text-slate-600">{club.tagline}</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400">Teléfono</p>
                <p className="font-semibold">{club.phone}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400">Estado</p>
                <p className="font-semibold">Activo</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold mb-3">
                Horarios de entrenamiento
              </h2>
              <div className="flex gap-3 items-center mb-4">
                <label className="text-sm text-slate-600">Filtrar:</label>
                <select
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="rounded-lg border px-3 py-2"
                >
                  <option value="">Todos</option>
                  {groups.map((g) => (
                    <option key={`g-${g.id}`} value={`group:${g.id}`}>
                      {g.nombre}
                    </option>
                  ))}
                  {categories.map((c) => (
                    <option key={`c-${c.id}`} value={`category:${c.id}`}>
                      {`Categoría: ${c.nombre}`}
                    </option>
                  ))}
                </select>
              </div>
              {horarios.length > 0 ? (
                <div className="space-y-4">
                  {horarios
                    .filter((h) => {
                      if (!filtro) return true;
                      if (filtro.startsWith("group:")) {
                        const id = filtro.split(":")[1];
                        return String(h.grupoId) === String(id);
                      }
                      if (filtro.startsWith("category:")) {
                        const id = filtro.split(":")[1];
                        return String(h.categoriaId) === String(id);
                      }
                      return true;
                    })
                    .map((horario) => (
                      <div
                        key={horario.id}
                        className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200"
                      >
                        <div className="flex flex-wrap gap-3 items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-500">
                              {horario.dia}
                            </p>
                            <p className="font-semibold text-slate-900">
                              {horario.horaInicio} - {horario.horaFin}
                            </p>
                          </div>
                          <span className="text-xs rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                            {horario.estado}
                          </span>
                        </div>

                        <p className="mt-3 text-slate-600">
                          {horario.descripcion ||
                            horario.description ||
                            horario.desc ||
                            "Sin descripción"}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Ubicación: {horario.ubicacion || "No especificada"}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          {[
                            horario.grupoNombre
                              ? `Grupo: ${horario.grupoNombre}`
                              : null,
                            horario.categoriaNombre
                              ? `Categoría: ${horario.categoriaNombre}`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(" · ") || "Sin destinatario"}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-slate-500">
                  No hay horarios publicados aún.
                </p>
              )}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="mt-5 px-4 py-2 rounded-lg"
              style={{ backgroundColor: "var(--club-primary)", color: "white" }}
            >
              Solicitar ingreso
            </button>
          </div>
        </section>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                  Solicitud de ingreso
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Únete al club {club.name}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Completa los datos necesarios para enviar tu solicitud.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Cerrar
              </button>
            </div>

            {error && (
              <div className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-[28px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <div className="mt-6 grid gap-4">
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Rol</span>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">Selecciona rol</option>
                  <option value="deportista">Deportista</option>
                  <option value="entrenador">Entrenador</option>
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Mensaje</span>
                <textarea
                  name="mensaje"
                  rows={4}
                  placeholder="Escribe un mensaje para el club"
                  onChange={handleSolicitudChange}
                  className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </label>

              {rol === "deportista" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-medium">Peso (kg)</span>
                    <select
                      name="peso"
                      value={formSolicitud.peso}
                      onChange={handleSolicitudChange}
                      className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    >
                      <option value="">Selecciona peso</option>
                      {[
                        40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
                      ].map((p) => (
                        <option key={p} value={p}>
                          {p} kg
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-medium">Estatura (cm)</span>
                    <select
                      name="estatura"
                      value={formSolicitud.estatura}
                      onChange={handleSolicitudChange}
                      className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    >
                      <option value="">Selecciona estatura</option>
                      {[
                        140, 150, 160, 165, 170, 175, 180, 185, 190, 195, 200,
                      ].map((e) => (
                        <option key={e} value={e}>
                          {e} cm
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              {rol === "entrenador" && (
                <div className="grid gap-4">
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-medium">Experiencia</span>
                    <textarea
                      name="experiencia"
                      rows={3}
                      placeholder="Describe tu experiencia"
                      onChange={handleSolicitudChange}
                      className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-medium">Especialidad</span>
                    <input
                      name="especialidad"
                      placeholder="Ej. fútbol, natación, entrenamiento funcional"
                      onChange={handleSolicitudChange}
                      className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviarSolicitud}
                disabled={loadingRequest}
                className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingRequest ? "Enviando..." : "Enviar solicitud"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
