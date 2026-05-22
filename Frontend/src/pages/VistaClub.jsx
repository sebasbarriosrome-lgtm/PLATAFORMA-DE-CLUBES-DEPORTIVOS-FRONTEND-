import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { Link, useParams } from "react-router-dom";

export default function VistaClub() {
  const { slug } = useParams();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  // SOLICITUD
  const [showModal, setShowModal] = useState(false);
  const [rol, setRol] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loadingRequest, setLoadingRequest] = useState(false);

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
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="font-bold text-blue-600">
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

            <button
              onClick={() => setShowModal(true)}
              className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Solicitar ingreso
            </button>
          </div>
        </section>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold">Solicitar ingreso</h2>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <p className="text-sm text-slate-500 mt-1">
                Completa la información
              </p>
            </div>

            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border"
              >
                <option value="">Selecciona rol</option>
                <option value="deportista">Deportista</option>
                <option value="entrenador">Entrenador</option>
              </select>

              <textarea
                name="mensaje"
                placeholder="Mensaje"
                onChange={handleSolicitudChange}
                className="w-full px-4 py-3 rounded-lg border"
              />

              {rol === "deportista" && (
                <>
                  <select
                    name="peso"
                    value={formSolicitud.peso}
                    onChange={handleSolicitudChange}
                    className="w-full px-4 py-3 rounded-lg border"
                  >
                    <option value="">Selecciona peso</option>
                    {[40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100].map(
                      (p) => (
                        <option key={p} value={p}>
                          {p} kg
                        </option>
                      ),
                    )}
                  </select>

                  <select
                    name="estatura"
                    value={formSolicitud.estatura}
                    onChange={handleSolicitudChange}
                    className="w-full px-4 py-3 rounded-lg border"
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
                </>
              )}

              {rol === "entrenador" && (
                <>
                  <textarea
                    name="experiencia"
                    placeholder="Experiencia"
                    onChange={handleSolicitudChange}
                    className="w-full border p-2 rounded"
                  />
                  <input
                    name="especialidad"
                    placeholder="Especialidad"
                    onChange={handleSolicitudChange}
                    className="w-full border p-2 rounded"
                  />
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>Cancelar</button>

              <button
                onClick={handleEnviarSolicitud}
                disabled={loadingRequest}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {loadingRequest ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
