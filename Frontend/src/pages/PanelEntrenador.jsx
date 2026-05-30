import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clubsService } from "../services/Clubs.service";
import { apiRequest } from "../services/api";

const sections = [
  { name: "Mis grupos", icon: "👥" },
  { name: "Categorías", icon: "🏷️" },
  { name: "Sesiones", icon: "📅" },
  { name: "Asistencia", icon: "✅" },
  { name: "Actividades", icon: "⚙️" },
  { name: "Horarios", icon: "🕒" },
  { name: "Métricas", icon: "📈" },
  { name: "Rendimiento", icon: "🏆" },
];

const initialHorarioForm = {
  dia: "",
  horaInicio: "",
  horaFin: "",
  ubicacion: "",
  descripcion: "",
  grupoId: "",
  categoriaId: "",
};

const initialSessionForm = {
  nombre: "",
  grupo: "",
  fecha: "",
  objetivo: "",
};

const initialMetricForm = {
  deportista: "",
  actividad: "",
  valor: "",
  comentario: "",
};

const DIA_NOMBRES = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

// Map from numeric values in select dropdown to enum values expected by backend
const DIA_ENUM_MAP = {
  1: "lunes",
  2: "martes",
  3: "miercoles",
  4: "jueves",
  5: "viernes",
  6: "sabado",
  7: "domingo",
};

// Reverse map: from backend enum strings to numeric values for the select
const ENUM_DIA_MAP = {
  lunes: "1",
  martes: "2",
  miercoles: "3",
  jueves: "4",
  viernes: "5",
  sabado: "6",
  domingo: "7",
};

export default function PanelEntrenador() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Mis grupos");
  const [horarios, setHorarios] = useState([]);
  const [horariosLoading, setHorariosLoading] = useState(true);
  const [horarioForm, setHorarioForm] = useState(initialHorarioForm);
  const [editingHorario, setEditingHorario] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [groups, setGroups] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [metricForm, setMetricForm] = useState(initialMetricForm);
  const [performanceReports, setPerformanceReports] = useState([]);
  const [sessionForm, setSessionForm] = useState(initialSessionForm);

  useEffect(() => {
    const fetchCoachPanel = async () => {
      try {
        const data = await apiRequest("/entrenador/panel");

        const grupos = Array.isArray(data?.grupos) ? data.grupos : [];

        setGroups(
          grupos.map((g) => ({
            id: g.id,
            nombre: g.nombre,
            categoria: g.categoria,
            deportistas: (g.deportistas || []).map((d) => d.nombre),
          })),
        );

        const categoriasAsignadas = Array.isArray(data?.categorias)
          ? data.categorias.filter((c) => c?.id && c?.nombre)
          : [];
        setCategorias(categoriasAsignadas);

        const sesiones = [];
        const horariosAgg = [];
        const atletas = [];

        grupos.forEach((g) => {
          if (Array.isArray(g.sesiones)) sesiones.push(...g.sesiones);
          if (Array.isArray(g.horarios)) horariosAgg.push(...g.horarios);
          if (Array.isArray(g.deportistas)) {
            g.deportistas.forEach((d) => {
              if (d?.id && d?.nombre) {
                atletas.push({ id: d.id, nombre: d.nombre });
              }
            });
          }
        });

        const uniqueAthletes = Array.from(
          new Map(atletas.map((a) => [a.id, a])).values(),
        );

        setSessions(Array.isArray(data?.sesiones) ? data.sesiones : sesiones);
        setHorarios(horariosAgg);
        setAthletes(uniqueAthletes);
        setActivities(Array.isArray(data?.actividades) ? data.actividades : []);
        setAttendance(Array.isArray(data?.asistencia) ? data.asistencia : []);
        setPerformanceReports(
          Array.isArray(data?.rendimiento) ? data.rendimiento : [],
        );
      } catch (err) {
        console.error("No se pudo cargar panel de entrenador:", err);
      } finally {
        setHorariosLoading(false);
      }
    };

    fetchCoachPanel();
  }, []);

  // ✅ NUEVO: Cargar horarios cuando se abre la sección
  useEffect(() => {
    if (activeSection === "Horarios") {
      cargarHorarios();
    }
  }, [activeSection]);

  const cargarHorarios = async () => {
    setHorariosLoading(true);

    try {
      const datos = await clubsService.getHorariosClub(); // ✅ SIN NADA

      console.log("Horarios obtenidos:", datos);

      setHorarios(datos || []);
    } catch (err) {
      console.error("Error cargando horarios", err);
      setHorarios([]);
    } finally {
      setHorariosLoading(false);
    }
  };

  const categoriaOptions = categorias; // siempre objetos, nunca strings

  const handleHorarioChange = (e) => {
    setHorarioForm({
      ...horarioForm,
      [e.target.name]: e.target.value,
    });
  };

  const resetHorarioForm = () => {
    setHorarioForm(initialHorarioForm);
    setEditingHorario(null);
  };

  const handleHorarioSave = async () => {
    // DEBUG: inspeccionar valores actuales del formulario
    console.log("handleHorarioSave - horarioForm (raw):", horarioForm);
    // trim values to avoid whitespace-only inputs
    let diaVal = horarioForm.dia ? String(horarioForm.dia).trim() : "";
    let inicioVal = horarioForm.horaInicio
      ? String(horarioForm.horaInicio).trim()
      : "";
    let finVal = horarioForm.horaFin ? String(horarioForm.horaFin).trim() : "";
    console.log("handleHorarioSave - valores recortados:", {
      diaVal,
      inicioVal,
      finVal,
    });

    // Fallback: si el estado React no se actualizó por alguna razón, leer directamente del DOM
    if (!diaVal || !inicioVal || !finVal) {
      const domDia = document.querySelector('select[name="dia"]')?.value || "";
      const domInicio =
        document.querySelector('input[name="horaInicio"]')?.value || "";
      const domFin =
        document.querySelector('input[name="horaFin"]')?.value || "";
      console.log("handleHorarioSave - DOM fallback:", {
        domDia,
        domInicio,
        domFin,
      });
      if (!diaVal && domDia) diaVal = String(domDia).trim();
      if (!inicioVal && domInicio) inicioVal = String(domInicio).trim();
      if (!finVal && domFin) finVal = String(domFin).trim();
      console.log("handleHorarioSave - after fallback:", {
        diaVal,
        inicioVal,
        finVal,
      });
    }

    if (!diaVal || !inicioVal || !finVal) {
      setSuccessMessage("❌ Complete día y horas para el horario");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    try {
      const payload = {
        dia: horarioForm.dia ? DIA_ENUM_MAP[String(horarioForm.dia)] : null,
        horaInicio: horarioForm.horaInicio,
        horaFin: horarioForm.horaFin,
        ubicacion: horarioForm.ubicacion,
        descripcion: horarioForm.descripcion,
        grupoId: horarioForm.grupoId || null,
        categoriaId: horarioForm.categoriaId || null,
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
    } catch (err) {
      console.error(err);
      setSuccessMessage("❌ Error guardando horario");
    } finally {
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleHorarioEdit = (horario) => {
    setEditingHorario(horario);

    // Convert backend day string (lunes, martes, etc.) to numeric value (1-7) for select
    let diaValue = horario.dia;
    if (typeof horario.dia === "string") {
      const lowerDia = horario.dia.toLowerCase();
      diaValue = ENUM_DIA_MAP[lowerDia] || horario.dia;
    }

    setHorarioForm({
      dia: diaValue,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      ubicacion: horario.ubicacion || "",
      descripcion: horario.descripcion || "",
      grupoId: horario.grupoId ? String(horario.grupoId) : "",
      categoriaId: horario.categoriaId ? String(horario.categoriaId) : "",
    });
  };

  const handleHorarioDelete = async (id) => {
    try {
      console.log("🗑️ Eliminando horario:", id);
      const result = await clubsService.eliminarHorario(id);
      console.log("🗑️ Resultado delete:", result);
      setSuccessMessage("✅ Horario eliminado");
      // Recargar horarios después de eliminar
      await cargarHorarios();
    } catch (err) {
      console.error("❌ Error eliminando horario:", err);
      setSuccessMessage("❌ Error eliminando horario: " + err.message);
    } finally {
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleSessionChange = (e) => {
    setSessionForm({
      ...sessionForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateSession = () => {
    const nuevaSesion = {
      id: sessions.length + 1,
      nombre: sessionForm.nombre || `Sesión ${sessions.length + 1}`,
      grupo: sessionForm.grupo,
      fecha: sessionForm.fecha,
      estado: "Planificada",
    };
    setSessions([nuevaSesion, ...sessions]);
    setSessionForm(initialSessionForm);
    setSuccessMessage("✅ Sesión creada");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleMetricChange = (e) => {
    setMetricForm({
      ...metricForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleMetricSubmit = () => {
    setSuccessMessage("✅ Métrica registrada");
    setMetricForm(initialMetricForm);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
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

        <div className="bg-white rounded-[32px] p-8 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                Panel del entrenador
              </h1>
              <p className="mt-2 text-slate-500 max-w-2xl">
                Supervisa grupos, crea sesiones, administra horarios y registra
                métricas de rendimiento.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4 text-slate-700">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                Rol
              </p>
              <p className="mt-2 text-xl font-semibold">Entrenador</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="bg-white rounded-2xl p-5 shadow">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.name}
                  onClick={() => setActiveSection(section.name)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition ${
                    activeSection === section.name
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-blue-50"
                  }`}
                >
                  {section.icon} {section.name}
                </button>
              ))}
            </nav>
          </aside>

          <main className="space-y-6">
            {successMessage && (
              <div
                className={
                  "rounded-3xl px-4 py-3 text-sm " +
                  (successMessage.startsWith("❌")
                    ? "border border-red-200 bg-red-50 text-red-700"
                    : "border border-emerald-200 bg-emerald-50 text-emerald-700")
                }
              >
                {successMessage}
              </div>
            )}

            {activeSection === "Mis grupos" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Mis grupos asignados
                </h2>
                <p className="mt-2 text-slate-500">
                  Revisa los grupos a tu cargo y los deportistas asignados.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <h3 className="font-semibold text-slate-900">
                        {group.nombre}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Categoría: {group.categoria}
                      </p>
                      <div className="mt-4 text-sm text-slate-700">
                        <p className="font-medium">Deportistas:</p>
                        <ul className="mt-2 list-disc pl-5 space-y-1">
                          {group.deportistas.map((athlete) => (
                            <li key={athlete}>{athlete}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "Categorías" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Categorías
                </h2>
                <p className="mt-2 text-slate-500">
                  Revisa las categorías asignadas y los grupos asociados.
                </p>

                <div className="mt-6 space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Categorías asignadas
                    </h3>
                    {categoriaOptions.length === 0 ? (
                      <p className="mt-3 text-sm text-slate-500">
                        No tienes categorías asignadas actualmente.
                      </p>
                    ) : (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {categorias.map((cat) => (
                          <div
                            key={cat.id}
                            className="rounded-3xl border border-slate-200 bg-white p-4"
                          >
                            <p className="font-semibold text-slate-900">
                              {cat.nombre}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Grupos por categoría
                    </h3>
                    {groups.length === 0 ? (
                      <p className="mt-3 text-sm text-slate-500">
                        No hay grupos registrados para mostrar.
                      </p>
                    ) : (
                      <div className="mt-4 space-y-4">
                        {categorias.map((cat) => (
                          <div key={cat.id}>
                            <p className="font-semibold text-slate-900">
                              {cat.nombre}
                            </p>
                            <p className="text-sm text-slate-500">
                              {cat.descripcion}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "Sesiones" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      Sesiones de entrenamiento
                    </h2>
                    <p className="mt-2 text-slate-500">
                      Crea sesiones para tus grupos y revisa el historial.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {session.nombre}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {session.grupo} • {session.fecha}
                            </p>
                          </div>
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                            {session.estado}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-4">
                      Agregar sesión
                    </h3>
                    <label className="block text-sm font-medium text-slate-700">
                      Nombre
                    </label>
                    <input
                      name="nombre"
                      value={sessionForm.nombre}
                      onChange={handleSessionChange}
                      placeholder="Sesión de fuerza"
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                    />
                    <label className="block text-sm font-medium text-slate-700 mt-4">
                      Grupo
                    </label>
                    <select
                      name="grupo"
                      value={sessionForm.grupo}
                      onChange={handleSessionChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                    >
                      <option value="" disabled>
                        {groups.length === 0
                          ? "No hay grupos disponibles"
                          : "Selecciona un grupo"}
                      </option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.nombre}>
                          {group.nombre}
                        </option>
                      ))}
                    </select>
                    <label className="block text-sm font-medium text-slate-700 mt-4">
                      Fecha
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      value={sessionForm.fecha}
                      onChange={handleSessionChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                    />
                    <label className="block text-sm font-medium text-slate-700 mt-4">
                      Objetivo
                    </label>
                    <textarea
                      name="objetivo"
                      value={sessionForm.objetivo}
                      onChange={handleSessionChange}
                      rows={4}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                      placeholder="Ej. Mejora de fuerza explosiva"
                    />
                    <button
                      onClick={handleCreateSession}
                      className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
                    >
                      Crear sesión
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "Asistencia" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Asistencia
                </h2>
                <p className="mt-2 text-slate-500">
                  Marca presente/ausente y revisa el historial por sesión.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {attendance.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <p className="font-semibold text-slate-900">
                          {entry.deportista}
                        </p>
                        <p className="text-sm text-slate-500">
                          {entry.grupo} • {entry.fecha}
                        </p>
                        <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                          {entry.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">
                    Nota: la funcionalidad de marcar asistencia se diseñará para
                    usarse en sesiones ya creadas.
                  </p>
                </div>
              </div>
            )}

            {activeSection === "Actividades" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Actividades
                </h2>
                <p className="mt-2 text-slate-500">
                  Revisa el catálogo de actividades y asigna las más adecuadas a
                  tus sesiones.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <h3 className="font-semibold text-slate-900">
                        {activity.nombre}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        {activity.descripcion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "Horarios" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Horarios del grupo
                </h2>
                <p className="mt-2 text-slate-500">
                  Crea y edita horarios de entrenamiento para tus grupos.
                </p>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">
                      Horarios existentes
                    </h3>
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
                                  {(() => {
                                    // Convert backend day string to display name
                                    let dayNum = horario.dia;
                                    if (typeof horario.dia === "string") {
                                      const lowerDia =
                                        horario.dia.toLowerCase();
                                      dayNum =
                                        ENUM_DIA_MAP[lowerDia] || horario.dia;
                                    }
                                    return DIA_NOMBRES[dayNum] || horario.dia;
                                  })()}{" "}
                                  • {horario.horaInicio} - {horario.horaFin}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {horario.ubicacion ||
                                    "Ubicación no especificada"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
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
                              {horario.descripcion ||
                                horario.description ||
                                horario.desc ||
                                "Sin descripción"}
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
                    )}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-slate-900 mb-4">
                        {editingHorario ? "Editar horario" : "Nuevo horario"}
                      </h3>
                      {editingHorario && (
                        <button
                          onClick={resetHorarioForm}
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
                      <option value="">Selecciona un día</option>
                      <option value="1">Lunes</option>
                      <option value="2">Martes</option>
                      <option value="3">Miércoles</option>
                      <option value="4">Jueves</option>
                      <option value="5">Viernes</option>
                      <option value="6">Sábado</option>
                      <option value="7">Domingo</option>
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
                      placeholder="Ej. Entrenamiento de velocidad"
                      rows={4}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 resize-none"
                    />

                    <label className="block text-sm font-medium text-slate-700 mt-4">
                      Grupo
                    </label>
                    <select
                      name="grupoId"
                      value={horarioForm.grupoId}
                      onChange={handleHorarioChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                    >
                      <option value="">Sin grupo específico</option>
                      {groups.map((g) => (
                        <option key={g.id} value={String(g.id)}>
                          {g.nombre}
                        </option>
                      ))}
                    </select>

                    <label className="block text-sm font-medium text-slate-700 mt-4">
                      Categoría (opcional)
                    </label>
                    <select
                      name="categoriaId"
                      value={horarioForm.categoriaId}
                      onChange={handleHorarioChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                    >
                      <option value="">Todas las categorías</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={String(cat.id)}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>

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

            {activeSection === "Métricas" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Métricas de sesión
                </h2>
                <p className="mt-2 text-slate-500">
                  Registra rendimiento por deportista y actividad.
                </p>
                <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          Últimas métricas
                        </p>
                        <p className="text-sm text-slate-500">
                          Visualiza desarrollos recientes y resultados.
                        </p>
                      </div>
                      <div className="grid gap-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-sm text-slate-500">
                            Ana Pérez • Calentamiento
                          </p>
                          <p className="mt-2 font-semibold text-slate-900">
                            Tiempo: 22 min
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-sm text-slate-500">
                            Luis Gómez • Fuerza
                          </p>
                          <p className="mt-2 font-semibold text-slate-900">
                            Repeticiones: 18
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-4">
                      Registrar métrica
                    </h3>
                    <label className="block text-sm font-medium text-slate-700">
                      Deportista
                    </label>
                    <select
                      name="deportista"
                      value={metricForm.deportista}
                      onChange={handleMetricChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                    >
                      <option value="" disabled>
                        {athletes.length === 0
                          ? "No hay deportistas"
                          : "Selecciona un deportista"}
                      </option>
                      {athletes.map((athlete) => (
                        <option key={athlete.id} value={athlete.nombre}>
                          {athlete.nombre}
                        </option>
                      ))}
                    </select>
                    <label className="block text-sm font-medium text-slate-700 mt-4">
                      Actividad
                    </label>
                    <select
                      name="actividad"
                      value={metricForm.actividad}
                      onChange={handleMetricChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                    >
                      <option value="" disabled>
                        {activities.length === 0
                          ? "No hay actividades"
                          : "Selecciona una actividad"}
                      </option>
                      {activities.map((activity) => (
                        <option key={activity.id} value={activity.nombre}>
                          {activity.nombre}
                        </option>
                      ))}
                    </select>
                    <label className="block text-sm font-medium text-slate-700 mt-4">
                      Valor
                    </label>
                    <input
                      name="valor"
                      value={metricForm.valor}
                      onChange={handleMetricChange}
                      placeholder="Ej. 18 repeticiones"
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                    />
                    <label className="block text-sm font-medium text-slate-700 mt-4">
                      Comentario
                    </label>
                    <textarea
                      name="comentario"
                      value={metricForm.comentario}
                      onChange={handleMetricChange}
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 resize-none"
                      placeholder="Observaciones de rendimiento"
                    />
                    <button
                      onClick={handleMetricSubmit}
                      className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
                    >
                      Registrar métrica
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "Rendimiento" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Rendimiento
                </h2>
                <p className="mt-2 text-slate-500">
                  Visualiza progreso y comparaciones de deportistas.
                </p>
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  {performanceReports.map((report) => (
                    <div
                      key={report.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <h3 className="font-semibold text-slate-900">
                        {report.deportista}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        {report.detalle}
                      </p>
                      <p className="mt-4 text-lg font-semibold text-blue-700">
                        {report.progreso}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
