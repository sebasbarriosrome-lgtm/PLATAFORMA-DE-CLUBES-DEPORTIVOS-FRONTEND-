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

    const fetchHorarios = async () => {
      try {
        const datos = await clubsService.getHorariosClub();
        setHorarios(datos);
      } catch (err) {
        console.error("Error cargando horarios", err);
      }
    };

    fetchPanel();
    fetchSolicitudes();
    fetchHorarios();
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

  const cargarHorarios = async () => {
    try {
      const datos = await clubsService.getHorariosClub();
      setHorarios(datos);
    } catch (err) {
      console.error("Error cargando horarios", err);
    }
  };

  const handleGuardarHorario = async () => {
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

  const handleEditarHorario = (horario) => {
    setEditingHorario(horario);
    setHorarioForm({
      dia: horario.dia,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      ubicacion: horario.ubicacion,
      descripcion: horario.descripcion || "",
    });
  };

  const handleEliminarHorario = async (id) => {
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

              {activeSection === "Entrenamientos" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Horarios de entrenamiento
                      </h3>
                      <p className="text-slate-500">
                        Agrega, edita o elimina horarios de entrenamiento para
                        tu club.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                      <div className="grid gap-4 lg:grid-cols-2">
                        <select
                          name="dia"
                          value={horarioForm.dia}
                          onChange={handleHorarioChange}
                          className="w-full border rounded-lg px-4 py-3"
                        >
                          <option value="">Selecciona día</option>
                          {[
                            "Lunes",
                            "Martes",
                            "Miércoles",
                            "Jueves",
                            "Viernes",
                            "Sábado",
                            "Domingo",
                          ].map((dia) => (
                            <option key={dia} value={dia}>
                              {dia}
                            </option>
                          ))}
                        </select>

                        <input
                          type="time"
                          name="horaInicio"
                          value={horarioForm.horaInicio}
                          onChange={handleHorarioChange}
                          className="w-full border rounded-lg px-4 py-3"
                          placeholder="Hora de inicio"
                        />

                        <input
                          type="time"
                          name="horaFin"
                          value={horarioForm.horaFin}
                          onChange={handleHorarioChange}
                          className="w-full border rounded-lg px-4 py-3"
                          placeholder="Hora de fin"
                        />

                        <input
                          name="ubicacion"
                          value={horarioForm.ubicacion}
                          onChange={handleHorarioChange}
                          className="w-full border rounded-lg px-4 py-3"
                          placeholder="Ubicación"
                        />
                      </div>

                      <textarea
                        name="descripcion"
                        value={horarioForm.descripcion}
                        onChange={handleHorarioChange}
                        className="w-full border rounded-lg px-4 py-3 mt-4"
                        placeholder="Descripción opcional"
                        rows={3}
                      />

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={handleGuardarHorario}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                          {editingHorario
                            ? "Actualizar horario"
                            : "Agregar horario"}
                        </button>

                        {editingHorario && (
                          <button
                            onClick={resetHorarioForm}
                            className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg"
                          >
                            Cancelar edición
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {horarios.length > 0 ? (
                      horarios.map((horario) => (
                        <div
                          key={horario.id}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                          <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div>
                              <p className="text-sm text-slate-500">
                                {horario.dia}
                              </p>
                              <p className="text-lg font-semibold text-slate-900">
                                {horario.horaInicio} - {horario.horaFin}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditarHorario(horario)}
                                className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() =>
                                  handleEliminarHorario(horario.id)
                                }
                                className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>

                          <p className="mt-3 text-slate-600">
                            {horario.descripcion ||
                              "Sin descripción adicional."}
                          </p>
                          <p className="mt-2 text-sm text-slate-500">
                            Ubicación: {horario.ubicacion || "No especificada"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
                        No hay horarios guardados todavía.
                      </div>
                    )}
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
