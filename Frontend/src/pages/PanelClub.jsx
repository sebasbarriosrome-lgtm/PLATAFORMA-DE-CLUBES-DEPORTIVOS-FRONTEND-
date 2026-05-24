import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clubsService } from "../services/Clubs.service";
import { apiRequest } from "../services/api";
import SolicitudEntrenadorCard from "../components/SolicitudEntrenadorCard";
import SolicitudDeportistaCard from "../components/SolicitudDeportistaCard";

const sections = [
  { name: "Información del club", icon: "🏠" },
  { name: "Personalización", icon: "🎨" },
  { name: "Categorías", icon: "📁" },
  { name: "Entrenadores", icon: "🧑‍🏫" },
  { name: "Deportistas", icon: "🏃" },
  { name: "Entrenamientos", icon: "📆" },
  { name: "Asistencia", icon: "✅" },
  { name: "Rendimiento", icon: "📈" },
  { name: "Analítica", icon: "📊" },
  { name: "Invitar", icon: "✉️" },
  { name: "Solicitudes", icon: "📥" },
];

export default function PanelClub() {
  const [activeSection, setActiveSection] = useState("Información del club");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const [panelData, setPanelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [horarioForm, setHorarioForm] = useState({
    dia: "",
    horaInicio: "",
    horaFin: "",
    ubicacion: "",
    descripcion: "",
  });
  const [editingHorario, setEditingHorario] = useState(null);
  const [horariosLoading, setHorariosLoading] = useState(true);

  const solicitudesEntrenadores = solicitudes.filter(
    (s) => s.rol?.toLowerCase() === "entrenador",
  );

  const solicitudesDeportistas = solicitudes.filter(
    (s) => s.rol?.toLowerCase() === "deportista",
  );

  const [form, setForm] = useState({
    descripcion: "",
    logoUrl: "",
    bannerUrl: "",
    colorPrimario: "",
    colorSecundario: "",
  });

  useEffect(() => {
    const fetchPanel = async () => {
      try {
        const data = await apiRequest("/clubs/panel-club");

        setPanelData(data);

        setForm({
          descripcion: data.descripcion || "",
          logoUrl: data.clubLogo || "",
          bannerUrl: data.banner || "",
          colorPrimario: data.colorPrimario || "",
          colorSecundario: data.colorSecundario || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSolicitudes = async () => {
      try {
        const entrenadores =
          await clubsService.getSolicitudesPorRol("entrenador");
        const deportistas =
          await clubsService.getSolicitudesPorRol("deportista");
        setSolicitudes([...entrenadores, ...deportistas]);
      } catch (err) {
        console.error("Error cargando solicitudes", err);
      }
    };

    fetchPanel();
    fetchSolicitudes();
    cargarHorarios(); // ✅ USAMOS LA NUEVA FUNCIÓN
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleHorarioChange = (e) => {
    setHorarioForm({
      ...horarioForm,
      [e.target.name]: e.target.value,
    });
  };

  const resetHorarioForm = () => {
    setHorarioForm({
      dia: "",
      horaInicio: "",
      horaFin: "",
      ubicacion: "",
      descripcion: "",
    });
    setEditingHorario(null);
  };

  const HorariosLoading = async () => {
    setHorariosLoading(true);
    try {
      const datos = await clubsService.getHorariosClub();
      setHorarios(datos);
    } catch (err) {
      console.error("Error cargando horarios", err);
    }
  };

  const handleHorarioSave = async () => {
    // ✅ VALIDACIÓN (AQUÍ VA)
    if (!horarioForm.dia || !horarioForm.horaInicio || !horarioForm.horaFin) {
      setSuccessMessage("❌ Faltan campos obligatorios");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    try {
      const payload = {
        dia: horarioForm.dia,
        horaInicio: horarioForm.horaInicio,
        horaFin: horarioForm.horaFin,
        ubicacion: horarioForm.ubicacion,
        descripcion: horarioForm.descripcion,
      };

      if (editingHorario) {
        await clubsService.actualizarHorario(editingHorario.id, payload);
        setSuccessMessage("✅ Horario actualizado");
      } else {
        await clubsService.crearHorario(payload);
        setSuccessMessage("✅ Horario creado");
      }

      resetHorarioForm();
      await cargarHorarios();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSuccessMessage("❌ Error guardando horario");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleHorarioEdit = (horario) => {
    setEditingHorario(horario);
    setHorarioForm({
      dia: horario.dia,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      ubicacion: horario.ubicacion,
      descripcion: horario.descripcion || "",
    });
  };

  const cargarHorarios = async () => {
    try {
      setHorariosLoading(true);

      const datos = await clubsService.getHorariosClub();
      setHorarios(datos);
    } catch (err) {
      console.error("Error cargando horarios", err);
    } finally {
      setHorariosLoading(false);
    }
  };

  const handleHorarioDelete = async (id) => {
    try {
      await clubsService.eliminarHorario(id);
      setSuccessMessage("✅ Horario eliminado");
      await cargarHorarios();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSuccessMessage("❌ Error eliminando horario");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleHorarioCancelEdit = () => {
    resetHorarioForm();
  };

  const handleSave = async () => {
    try {
      console.log("Enviando datos:", form); // ✅ DEBUG

      const response = await apiRequest("/clubs/personalizacion", {
        method: "PUT",
        body: JSON.stringify(form),
      });

      console.log("Respuesta backend:", response);

      // ✅ REFRESCAR PANEL
      const updated = await apiRequest("/clubs/panel-club");
      setPanelData(updated);

      setSuccessMessage("Personalización guardada ✅");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (e) {
      console.error("ERROR GUARDANDO:", e);

      // ✅ MOSTRAR ERROR
      setSuccessMessage("❌ Error guardando");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  const handleSolicitud = async (id, accion) => {
    try {
      await clubsService.resolverSolicitud(id, accion);

      // ✅ RECARGAR todas las solicitudes desde el backend
      const entrenadores =
        await clubsService.getSolicitudesPorRol("entrenador");
      const deportistas = await clubsService.getSolicitudesPorRol("deportista");
      setSolicitudes([...entrenadores, ...deportistas]);

      setSuccessMessage(
        accion === "aceptado"
          ? "✅ Solicitud aceptada"
          : "❌ Solicitud rechazada",
      );

      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error(err);

      setSuccessMessage("❌ Error procesando solicitud");

      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* ✅ MENSAJE PRO */}
        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 shadow-sm">
            {successMessage}
          </div>
        )}

        {/* REGRESAR (fuera del card) */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/UserProfile")}
            className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:shadow-md transition-colors hover:bg-blue-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-blue-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L4.414 9H18a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-slate-800">Volver al perfil</span>
          </button>
        </div>

        {/* HEADER */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          {loading ? (
            <p>Cargando club...</p>
          ) : panelData ? (
            <div className="flex items-center gap-4">
              {panelData.clubLogo ? (
                <img
                  src={panelData.clubLogo}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-100 flex items-center justify-center rounded-xl">
                  {panelData.clubNombre?.[0]}
                </div>
              )}

              <div>
                <h1 className="text-2xl font-bold">{panelData.clubNombre}</h1>
                <p className="text-slate-500 text-sm">Panel del club</p>
              </div>
            </div>
          ) : (
            <p>No hay datos del club</p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* SIDEBAR */}
          <aside className="bg-white rounded-2xl p-5 shadow">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.name}
                  onClick={() => setActiveSection(section.name)}
                  className={`w-full text-left px-4 py-3 rounded-xl ${
                    activeSection === section.name
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 hover:bg-blue-50"
                  }`}
                >
                  {section.icon} {section.name}
                </button>
              ))}
            </nav>
          </aside>

          {/* MAIN */}
          <main className="space-y-6">
            {/* ADMIN */}
            {panelData && (
              <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
                {panelData.adminFoto ? (
                  <img
                    src={panelData.adminFoto}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center text-xl">
                    {panelData.adminNombre?.[0]}
                  </div>
                )}

                <div>
                  <p className="font-bold">{panelData.adminNombre}</p>
                  <p className="text-sm text-slate-500">
                    Administrador del club
                  </p>
                </div>
              </div>
            )}

            {/* CONTENIDO */}
            <div className="bg-white p-6 rounded-2xl shadow">
              {/* ✅ ENTRENADORES */}
              {activeSection === "Entrenadores" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Gestión de entrenadores
                  </h3>

                  <p className="text-slate-500">
                    Esta sección será usada para administrar los entrenadores
                    del club. Las solicitudes se gestionan exclusivamente en la
                    pestaña "Solicitudes".
                  </p>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-600">
                    <p className="font-medium">Próximamente:</p>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-sm">
                      <li>Listar entrenadores registrados</li>
                      <li>Editar información del entrenador</li>
                      <li>Activar / desactivar entrenadores</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ✅ DEPORTISTAS */}
              {activeSection === "Deportistas" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Gestión de deportistas
                  </h3>

                  <p className="text-slate-500">
                    Esta sección será usada para administrar los deportistas del
                    club. Las solicitudes se gestionan exclusivamente en la
                    pestaña "Solicitudes".
                  </p>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-600">
                    <p className="font-medium">Próximamente:</p>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-sm">
                      <li>Listar deportistas registrados</li>
                      <li>Ver estadísticas y progreso</li>
                      <li>Asignar entrenamientos</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* CONTENIDO */}
              {/* ✅ ENTRENAMIENTOS */}
              {activeSection === "Entrenamientos" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Horarios de entrenamientos
                    </h3>
                    <p className="text-slate-500">
                      Agrega y administra los horarios de entrenamiento del
                      club.
                    </p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <h4 className="font-semibold text-slate-800 mb-4">
                        Horarios existentes
                      </h4>

                      {horariosLoading ? (
                        <p className="text-slate-500">Cargando horarios...</p>
                      ) : horarios.length === 0 ? (
                        <p className="text-slate-500">
                          No hay horarios registrados todavía.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {horarios.map((horario) => (
                            <div
                              key={horario.id}
                              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {horario.dia} • {horario.horaInicio} -{" "}
                                    {horario.horaFin}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    {horario.ubicacion || "Sin ubicación"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                                    {horario.estado || "activo"}
                                  </span>
                                  <button
                                    onClick={() => handleHorarioEdit(horario)}
                                    className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleHorarioDelete(horario.id)
                                    }
                                    className="rounded-full border border-red-300 px-3 py-1 text-xs text-red-700 hover:bg-red-50"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                              <p className="mt-3 text-slate-600 text-sm">
                                {horario.descripcion || "Sin descripción"}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-semibold text-slate-800 mb-4">
                          {editingHorario ? "Editar horario" : "Nuevo horario"}
                        </h4>
                        {editingHorario && (
                          <button
                            onClick={handleHorarioCancelEdit}
                            className="text-sm text-slate-500 underline"
                          >
                            Cancelar edición
                          </button>
                        )}
                      </div>

                      <label className="block text-sm font-medium text-slate-700">
                        Día
                      </label>
                      <select
                        name="dia"
                        value={horarioForm.dia}
                        onChange={handleHorarioChange}
                        className="mt-2 mb-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                      >
                        <option>Lunes</option>
                        <option>Martes</option>
                        <option>Miércoles</option>
                        <option>Jueves</option>
                        <option>Viernes</option>
                        <option>Sábado</option>
                        <option>Domingo</option>
                      </select>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-slate-700">
                            Hora inicio
                          </label>
                          <input
                            type="time"
                            name="horaInicio"
                            value={horarioForm.horaInicio}
                            onChange={handleHorarioChange}
                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">
                            Hora fin
                          </label>
                          <input
                            type="time"
                            name="horaFin"
                            value={horarioForm.horaFin}
                            onChange={handleHorarioChange}
                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                          />
                        </div>
                      </div>

                      <label className="block text-sm font-medium text-slate-700 mt-4">
                        Ubicación
                      </label>
                      <input
                        name="ubicacion"
                        value={horarioForm.ubicacion}
                        onChange={handleHorarioChange}
                        placeholder="Ej. Cancha principal"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                      />

                      <label className="block text-sm font-medium text-slate-700 mt-4">
                        Descripción
                      </label>
                      <textarea
                        name="descripcion"
                        value={horarioForm.descripcion}
                        onChange={handleHorarioChange}
                        placeholder="Ej. Entrenamiento de velocidad y fuerza"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 resize-none"
                        rows={4}
                      />

                      <button
                        onClick={handleHorarioSave}
                        className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
                      >
                        {editingHorario
                          ? "Actualizar horario"
                          : "Guardar horario"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "Solicitudes" && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold mb-4">Solicitudes</h2>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Solicitudes de entrenadores
                    </h3>

                    {solicitudesEntrenadores.length > 0 ? (
                      <div className="space-y-4">
                        {solicitudesEntrenadores.map((s) => (
                          <SolicitudEntrenadorCard
                            key={s.id}
                            s={s}
                            onAction={handleSolicitud}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500">
                        No hay solicitudes de entrenadores
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Solicitudes de deportistas
                    </h3>

                    {solicitudesDeportistas.length > 0 ? (
                      <div className="space-y-4">
                        {solicitudesDeportistas.map((s) => (
                          <SolicitudDeportistaCard
                            key={s.id}
                            s={s}
                            onAction={handleSolicitud}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500">
                        No hay solicitudes de deportistas
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeSection === "Personalización" && (
                <div className="space-y-4">
                  {/* ✅ PREVIEW LOGO */}
                  {form.logoUrl && (
                    <img src={form.logoUrl} className="w-16 h-16 rounded-xl" />
                  )}

                  {/* ✅ PREVIEW BANNER */}
                  {form.bannerUrl && (
                    <img
                      src={form.bannerUrl}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}

                  <input
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción del club"
                    className="w-full border rounded-lg px-4 py-2"
                  />

                  <input
                    name="logoUrl"
                    value={form.logoUrl}
                    onChange={handleChange}
                    placeholder="URL del logo"
                    className="w-full border rounded-lg px-4 py-2"
                  />

                  <input
                    name="bannerUrl"
                    value={form.bannerUrl}
                    onChange={handleChange}
                    placeholder="URL del banner"
                    className="w-full border rounded-lg px-4 py-2"
                  />

                  <input
                    name="colorPrimario"
                    value={form.colorPrimario}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="#2563eb"
                  />

                  <input
                    name="colorSecundario"
                    value={form.colorSecundario}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="#ffffff"
                  />

                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Guardar personalización
                  </button>
                </div>
              )}
              {activeSection === "Información del club" && (
                <div className="space-y-3">
                  <p className="text-slate-500 text-sm uppercase tracking-wide">
                    Descripción
                  </p>

                  <div className="rounded-xl bg-slate-50 p-4 text-slate-700">
                    {panelData?.descripcion
                      ? panelData.descripcion
                      : "No hay descripción registrada"}
                  </div>
                </div>
              )}
              {/* ✅ DEFAULT SOLO PARA OTRAS */}
              {activeSection !== "Información del club" &&
                activeSection !== "Personalización" &&
                activeSection !== "Entrenadores" &&
                activeSection !== "Deportistas" &&
                activeSection !== "Invitar" &&
                activeSection !== "Solicitudes" && (
                  <p className="text-slate-500">
                    Aquí se mostrará la información de esta sección cuando
                    conectes backend.
                  </p>
                )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
