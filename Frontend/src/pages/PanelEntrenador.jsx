import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { clubsService } from "../services/Clubs.service";
import { sesionesService } from "../services/Sesiones.service";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ─── Constantes ───────────────────────────────────────────────────────────────

const sections = [
  { name: "Mis grupos", icon: "👥" },
  { name: "Categorías", icon: "🏷️" },
  { name: "Deportistas", icon: "🏃" },
  { name: "Sesiones", icon: "📅" },
  { name: "Horarios", icon: "🕒" },
  { name: "Métricas", icon: "📈" },
  { name: "Rendimiento", icon: "🏆" },
];

const SESSION_TABS = ["Actividades", "Asistencia"];

const ESTADO_COLORS = {
  programada: "bg-blue-100 text-blue-700",
  completada: "bg-emerald-100 text-emerald-700",
  cancelada: "bg-red-100 text-red-700",
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
const DIA_ENUM_MAP = {
  1: "lunes",
  2: "martes",
  3: "miercoles",
  4: "jueves",
  5: "viernes",
  6: "sabado",
  7: "domingo",
};
const ENUM_DIA_MAP = {
  lunes: "1",
  martes: "2",
  miercoles: "3",
  jueves: "4",
  viernes: "5",
  sabado: "6",
  domingo: "7",
};

const initialHorarioForm = {
  dia: "",
  horaInicio: "",
  horaFin: "",
  ubicacion: "",
  descripcion: "",
  grupoId: "",
  categoriaId: "",
};
const initialSesionForm = {
  grupoId: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
  descripcion: "",
};
const initialActividadForm = {
  actividadId: "",
  duracionMinutos: "",
  descripcion: "",
};
const initialNewActForm = { nombre: "", descripcion: "" };
const initialMetricForm = {
  deportistaId: "",
  sesionActividadId: "",
  tiempo: "",
  distancia: "",
  velocidad: "",
  tecnica: "",
  rendimientoFisico: "",
  observaciones: "",
};

// ─── Helpers UI ───────────────────────────────────────────────────────────────

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function inputCls() {
  return "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
}

function PrimaryBtn({ onClick, children, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
    >
      {children}
    </button>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PanelEntrenador() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Mis grupos");
  const [successMessage, setSuccessMessage] = useState("");

  // datos globales del panel
  const [groups, setGroups] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [assignedAthletes, setAssignedAthletes] = useState([]);

  // horarios
  const [horarios, setHorarios] = useState([]);
  const [horariosLoading, setHorariosLoading] = useState(false);
  const [horarioForm, setHorarioForm] = useState(initialHorarioForm);
  const [editingHorario, setEditingHorario] = useState(null);

  // deportistas — asignación
  const [assignmentForm, setAssignmentForm] = useState({
    deportistaId: "",
    grupoId: "",
    categoriaId: "",
  });

  // sesiones
  const [sesiones, setSesiones] = useState([]);
  const [sesionesLoading, setSesionesLoading] = useState(false);
  const [sesionForm, setSesionForm] = useState(initialSesionForm);
  const [selectedSesion, setSelectedSesion] = useState(null);
  const [sesionTab, setSesionTab] = useState("Actividades");

  // actividades del catálogo
  const [actividades, setActividades] = useState([]);
  const [actividadForm, setActividadForm] = useState(initialActividadForm);
  const [newActForm, setNewActForm] = useState(initialNewActForm);
  const [showNewActForm, setShowNewActForm] = useState(false);

  // actividades de la sesión seleccionada
  const [sesionActividades, setSesionActividades] = useState([]);
  const [actividadesLoading, setActividadesLoading] = useState(false);

  // asistencia de la sesión seleccionada
  const [asistencia, setAsistencia] = useState([]);
  const [asistenciaLoading, setAsistenciaLoading] = useState(false);

  // métricas
  const [metricForm, setMetricForm] = useState(initialMetricForm);
  const [metricas, setMetricas] = useState([]);
  const [metricasLoading, setMetricasLoading] = useState(false);
  const [selectedSesionMetrica, setSelectedSesionMetrica] = useState(null);
  const [sesionesParaMetricas, setSesionesParaMetricas] = useState([]);

  // rendimiento
  const [rendGrafica, setRendGrafica] = useState("evolucion");
  const [rendGrupoId, setRendGrupoId] = useState("");
  const [rendDeportistaId, setRendDeportistaId] = useState("");
  const [rendSesionId, setRendSesionId] = useState("");
  const [rendActividadId, setRendActividadId] = useState("");
  const [rendData, setRendData] = useState([]);
  const [rendLoading, setRendLoading] = useState(false);
  const [sesionesParaRendimiento, setSesionesParaRendimiento] = useState([]);

  // ── Helpers de notificación ──────────────────────────────────────────────

  const notify = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // ── Carga inicial ────────────────────────────────────────────────────────

  const loadTrainerData = useCallback(async () => {
    try {
      const [groupsData, categoriesData, deportistasData] = await Promise.all([
        clubsService.getGroups(),
        clubsService.getCategories(),
        clubsService.getDeportistas(),
      ]);

      const normalizedGroups = Array.isArray(groupsData)
        ? groupsData.map((g) => ({
            ...g,
            deportistas: Array.isArray(g.deportistas)
              ? g.deportistas.map((a) => ({
                  id: a.deportistaId ?? a.id,
                  nombre: `${a.nombre} ${a.apellido}`,
                  ...a,
                }))
              : [],
          }))
        : [];

      setGroups(normalizedGroups);
      setCategorias(Array.isArray(categoriesData) ? categoriesData : []);

      const athleteList = Array.isArray(deportistasData)
        ? deportistasData.map((a) => ({
            id: a.deportistaId,
            nombre: `${a.nombre} ${a.apellido}`,
            grupoId: a.grupoId ?? "",
            categoriaId: a.categoriaId ?? "",
          }))
        : [];

      setAthletes(athleteList);
      setAssignedAthletes(athleteList);
    } catch (err) {
      console.error("Error cargando datos del entrenador:", err);
    }
  }, []);

  useEffect(() => {
    loadTrainerData();
  }, [loadTrainerData]);

  // ── Carga por sección ────────────────────────────────────────────────────

  useEffect(() => {
    if (activeSection === "Horarios") cargarHorarios();
    if (activeSection === "Sesiones") cargarSesionesYActividades();
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "Métricas") {
      sesionesService
        .getSesiones()
        .then((ses) => setSesionesParaMetricas(Array.isArray(ses) ? ses : []))
        .catch(() => setSesionesParaMetricas([]));
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "Rendimiento") {
      // Cargar sesiones y actividades para los filtros de rendimiento
      Promise.all([
        sesionesService.getSesiones(),
        sesionesService.getActividades(),
      ])
        .then(([ses, acts]) => {
          setSesionesParaRendimiento(Array.isArray(ses) ? ses : []);
          setActividades(Array.isArray(acts) ? acts : []);
        })
        .catch(() => {});
    }
  }, [activeSection]);

  const cargarHorarios = async () => {
    setHorariosLoading(true);
    try {
      const datos = await clubsService.getHorariosClub();
      setHorarios(datos || []);
    } catch {
      setHorarios([]);
    } finally {
      setHorariosLoading(false);
    }
  };

  const cargarSesionesYActividades = async () => {
    setSesionesLoading(true);
    try {
      const [ses, acts] = await Promise.all([
        sesionesService.getSesiones(),
        sesionesService.getActividades(),
      ]);
      setSesiones(Array.isArray(ses) ? ses : []);
      setActividades(Array.isArray(acts) ? acts : []);
    } catch (err) {
      console.error("Error cargando sesiones:", err);
    } finally {
      setSesionesLoading(false);
    }
  };

  // ── Detalle de sesión ────────────────────────────────────────────────────

  const abrirSesion = async (sesion) => {
    setSelectedSesion(sesion);
    setSesionTab("Actividades");
    await Promise.all([
      cargarActividadesDeSesion(sesion.id),
      cargarAsistenciaDeSesion(sesion.id),
    ]);
  };

  const cerrarSesion = () => {
    setSelectedSesion(null);
    setSesionActividades([]);
    setAsistencia([]);
  };

  const cargarActividadesDeSesion = async (sesionId) => {
    setActividadesLoading(true);
    try {
      const data = await sesionesService.getActividadesBySesion(sesionId);
      setSesionActividades(Array.isArray(data) ? data : []);
    } catch {
      setSesionActividades([]);
    } finally {
      setActividadesLoading(false);
    }
  };

  const cargarAsistenciaDeSesion = async (sesionId) => {
    setAsistenciaLoading(true);
    try {
      const data = await sesionesService.getAsistenciaBySesion(sesionId);
      setAsistencia(Array.isArray(data) ? data : []);
    } catch {
      setAsistencia([]);
    } finally {
      setAsistenciaLoading(false);
    }
  };

  // ── Sesiones CRUD ────────────────────────────────────────────────────────

  const handleCrearSesion = async () => {
    if (!sesionForm.grupoId || !sesionForm.fecha) {
      notify("❌ Selecciona grupo y fecha");
      return;
    }
    try {
      await sesionesService.crearSesion(sesionForm);
      notify("✅ Sesión creada");
      setSesionForm(initialSesionForm);
      await cargarSesionesYActividades();
    } catch (err) {
      notify("❌ " + err.message);
    }
  };

  const handleCambiarEstado = async (sesionId, estado) => {
    try {
      await sesionesService.actualizarEstadoSesion(sesionId, estado);
      notify("✅ Estado actualizado");
      await cargarSesionesYActividades();
      if (selectedSesion?.id === sesionId) {
        setSelectedSesion((prev) => ({ ...prev, estado }));
      }
    } catch (err) {
      notify("❌ " + err.message);
    }
  };

  const handleEliminarSesion = async (sesionId) => {
    try {
      await sesionesService.eliminarSesion(sesionId);
      notify("✅ Sesión eliminada");
      if (selectedSesion?.id === sesionId) cerrarSesion();
      await cargarSesionesYActividades();
    } catch (err) {
      notify("❌ " + err.message);
    }
  };

  // ── Actividades de sesión ────────────────────────────────────────────────

  const handleAgregarActividad = async () => {
    if (!actividadForm.actividadId) {
      notify("❌ Selecciona una actividad");
      return;
    }
    try {
      await sesionesService.agregarActividadASesion(selectedSesion.id, {
        actividadId: Number(actividadForm.actividadId),
        duracionMinutos: actividadForm.duracionMinutos
          ? Number(actividadForm.duracionMinutos)
          : null,
        descripcion: actividadForm.descripcion,
      });
      notify("✅ Actividad agregada");
      setActividadForm(initialActividadForm);
      await cargarActividadesDeSesion(selectedSesion.id);
    } catch (err) {
      notify("❌ " + err.message);
    }
  };

  const handleQuitarActividad = async (sesionActividadId) => {
    try {
      await sesionesService.quitarActividadDeSesion(sesionActividadId);
      notify("✅ Actividad eliminada");
      await cargarActividadesDeSesion(selectedSesion.id);
    } catch (err) {
      notify("❌ " + err.message);
    }
  };

  const handleCrearNuevaActividad = async () => {
    if (!newActForm.nombre.trim()) {
      notify("❌ Escribe un nombre para la actividad");
      return;
    }
    try {
      await sesionesService.crearActividad(newActForm);
      notify("✅ Actividad creada en el catálogo");
      setNewActForm(initialNewActForm);
      setShowNewActForm(false);
      await cargarSesionesYActividades();
    } catch (err) {
      notify("❌ " + err.message);
    }
  };

  // ── Asistencia ───────────────────────────────────────────────────────────

  const toggleAsistencia = (deportistaId) => {
    setAsistencia((prev) =>
      prev.map((a) =>
        a.deportistaId === deportistaId
          ? { ...a, estado: a.estado === "presente" ? "ausente" : "presente" }
          : a,
      ),
    );
  };

  const handleGuardarAsistencia = async () => {
    if (!selectedSesion) return;
    try {
      const lista = asistencia.map((a) => ({
        deportistaId: a.deportistaId,
        estado: a.estado,
        fecha: selectedSesion.fecha,
      }));
      await sesionesService.registrarAsistenciaLote(selectedSesion.id, lista);
      notify("✅ Asistencia guardada");
    } catch (err) {
      notify("❌ " + err.message);
    }
  };

  // ── Horarios ─────────────────────────────────────────────────────────────

  const handleHorarioChange = (e) =>
    setHorarioForm({ ...horarioForm, [e.target.name]: e.target.value });

  const resetHorarioForm = () => {
    setHorarioForm(initialHorarioForm);
    setEditingHorario(null);
  };

  const handleHorarioSave = async () => {
    if (!horarioForm.dia || !horarioForm.horaInicio || !horarioForm.horaFin) {
      notify("❌ Complete día y horas para el horario");
      return;
    }
    try {
      const payload = {
        dia: DIA_ENUM_MAP[String(horarioForm.dia)],
        horaInicio: horarioForm.horaInicio,
        horaFin: horarioForm.horaFin,
        ubicacion: horarioForm.ubicacion,
        descripcion: horarioForm.descripcion,
        grupoId: horarioForm.grupoId || null,
        categoriaId: horarioForm.categoriaId || null,
      };
      if (editingHorario) {
        await clubsService.actualizarHorario(editingHorario.id, payload);
        notify("✅ Horario actualizado");
      } else {
        await clubsService.crearHorario(payload);
        notify("✅ Horario creado");
      }
      resetHorarioForm();
      await cargarHorarios();
    } catch (err) {
      notify("❌ " + err.message);
    }
  };

  const handleHorarioEdit = (h) => {
    setEditingHorario(h);
    let diaValue =
      typeof h.dia === "string"
        ? ENUM_DIA_MAP[h.dia.toLowerCase()] || h.dia
        : h.dia;
    setHorarioForm({
      dia: diaValue,
      horaInicio: h.horaInicio,
      horaFin: h.horaFin,
      ubicacion: h.ubicacion || "",
      descripcion: h.descripcion || "",
      grupoId: h.grupoId ? String(h.grupoId) : "",
      categoriaId: h.categoriaId ? String(h.categoriaId) : "",
    });
  };

  const handleHorarioDelete = async (id) => {
    try {
      await clubsService.eliminarHorario(id);
      notify("✅ Horario eliminado");
      await cargarHorarios();
    } catch (err) {
      notify("❌ " + err.message);
    }
  };

  // ── Deportistas ──────────────────────────────────────────────────────────

  const getCategoriaName = (id) =>
    categorias.find((c) => String(c.id) === String(id))?.nombre || "";
  const getGroupName = (id) =>
    groups.find((g) => String(g.id) === String(id))?.nombre || "";

  const handleAssignAthlete = async () => {
    if (!assignmentForm.deportistaId) {
      notify("❌ Selecciona un deportista");
      return;
    }
    if (!assignmentForm.grupoId && !assignmentForm.categoriaId) {
      notify("❌ Selecciona grupo o categoría");
      return;
    }
    try {
      const actions = [];
      if (assignmentForm.grupoId)
        actions.push(
          clubsService.assignDeportistaToGroup(
            assignmentForm.deportistaId,
            assignmentForm.grupoId,
          ),
        );
      if (assignmentForm.categoriaId)
        actions.push(
          clubsService.assignDeportistaToCategory(
            assignmentForm.deportistaId,
            assignmentForm.categoriaId,
          ),
        );
      await Promise.all(actions);
      notify("✅ Deportista actualizado");
      setAssignmentForm({ deportistaId: "", grupoId: "", categoriaId: "" });
      await loadTrainerData();
    } catch (err) {
      notify("❌ " + err.message);
    }
  };

  // ── Métricas ─────────────────────────────────────────────────────────────

  const cargarMetricasDeSesion = async (sesionId) => {
    setMetricasLoading(true);
    try {
      const data = await sesionesService.getMetricasBySesion(sesionId);
      setMetricas(Array.isArray(data) ? data : []);
    } catch {
      setMetricas([]);
    } finally {
      setMetricasLoading(false);
    }
  };

  const handleSeleccionarSesionMetrica = async (sesion) => {
    setSelectedSesionMetrica(sesion);
    setMetricForm(initialMetricForm);
    await Promise.all([
      cargarMetricasDeSesion(sesion.id),
      cargarActividadesDeSesion(sesion.id),
      cargarAsistenciaDeSesion(sesion.id),
    ]);
  };

  const handleRegistrarMetrica = async () => {
    if (!selectedSesionMetrica) {
      notify("❌ Selecciona una sesión");
      return;
    }
    if (!metricForm.deportistaId || !metricForm.sesionActividadId) {
      notify("❌ Selecciona deportista y actividad");
      return;
    }
    const camposValor = [
      metricForm.tiempo,
      metricForm.distancia,
      metricForm.velocidad,
      metricForm.tecnica,
      metricForm.rendimientoFisico,
    ];
    if (camposValor.every((v) => !v)) {
      notify("❌ Ingresa al menos un valor de rendimiento");
      return;
    }
    try {
      await sesionesService.registrarMetrica(selectedSesionMetrica.id, {
        deportistaId: Number(metricForm.deportistaId),
        sesionActividadId: Number(metricForm.sesionActividadId),
        tiempo: metricForm.tiempo || null,
        distancia: metricForm.distancia || null,
        velocidad: metricForm.velocidad || null,
        tecnica: metricForm.tecnica || null,
        rendimientoFisico: metricForm.rendimientoFisico || null,
        observaciones: metricForm.observaciones,
      });
      notify("✅ Métrica registrada");
      setMetricForm(initialMetricForm);
      await cargarMetricasDeSesion(selectedSesionMetrica.id);
    } catch (err) {
      notify("❌ " + err.message);
    }
  };

  const handleEliminarMetrica = async (metricaId) => {
    try {
      await sesionesService.eliminarMetrica(metricaId);
      notify("✅ Métrica eliminada");
      await cargarMetricasDeSesion(selectedSesionMetrica.id);
    } catch (err) {
      notify("❌ " + err.message);
    }
  };

  // ── Rendimiento ──────────────────────────────────────────────────────────

  const cargarRendimiento = async () => {
    setRendLoading(true);
    setRendData([]);
    try {
      let data = [];
      if (rendGrafica === "evolucion") {
        if (!rendDeportistaId) {
          notify("❌ Selecciona un deportista");
          setRendLoading(false);
          return;
        }
        data = await sesionesService.getEvolucionDeportista(
          rendDeportistaId,
          rendActividadId || null,
        );
      } else if (rendGrafica === "comparacion") {
        if (!rendSesionId) {
          notify("❌ Selecciona una sesión");
          setRendLoading(false);
          return;
        }
        data = await sesionesService.getComparacionSesion(
          rendSesionId,
          rendActividadId || null,
        );
      } else if (rendGrafica === "asistencia") {
        if (!rendGrupoId) {
          notify("❌ Selecciona un grupo");
          setRendLoading(false);
          return;
        }
        data = await sesionesService.getAsistenciaGrupo(rendGrupoId);
      } else if (rendGrafica === "promedios") {
        if (!rendGrupoId) {
          notify("❌ Selecciona un grupo");
          setRendLoading(false);
          return;
        }
        data = await sesionesService.getPromediosSesiones(rendGrupoId);
      }
      setRendData(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length === 0) {
        notify("⚠️ No hay datos para los filtros seleccionados");
      }
    } catch (err) {
      notify("❌ " + err.message);
    } finally {
      setRendLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Botón volver */}
        <button
          onClick={() => navigate("/UserProfile")}
          className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:shadow-md hover:bg-blue-50 transition-colors"
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
          Volver al perfil
        </button>

        {/* Header */}
        <div className="bg-white rounded-[32px] p-8 shadow-md flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        {/* Layout */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="bg-white rounded-2xl p-5 shadow">
            <nav className="space-y-2">
              {sections.map((s) => (
                <button
                  key={s.name}
                  onClick={() => {
                    setActiveSection(s.name);
                    cerrarSesion();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition text-sm ${
                    activeSection === s.name
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-blue-50"
                  }`}
                >
                  {s.icon} {s.name}
                </button>
              ))}
            </nav>
          </aside>

          {/* Contenido */}
          <main className="space-y-6">
            {/* Notificación */}
            {successMessage && (
              <div
                className={`rounded-3xl px-4 py-3 text-sm ${
                  successMessage.startsWith("❌")
                    ? "border border-red-200 bg-red-50 text-red-700"
                    : successMessage.startsWith("⚠️")
                      ? "border border-amber-200 bg-amber-50 text-amber-700"
                      : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {successMessage}
              </div>
            )}

            {/* ── MIS GRUPOS ── */}
            {activeSection === "Mis grupos" && (
              <SectionCard
                title="Mis grupos asignados"
                subtitle="Revisa los grupos a tu cargo y los deportistas asignados."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <h3 className="font-semibold text-slate-900">
                        Grupo: {group.nombre}
                      </h3>
                      <div className="mt-4 text-sm text-slate-700">
                        <p className="font-medium">Deportistas:</p>
                        <ul className="mt-2 list-disc pl-5 space-y-1">
                          {group.deportistas.map((a) => (
                            <li key={a.id || a.nombre}>{a.nombre}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* ── CATEGORÍAS ── */}
            {activeSection === "Categorías" && (
              <SectionCard
                title="Categorías"
                subtitle="Revisa las categorías asignadas."
              >
                {categorias.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No tienes categorías asignadas.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {categorias.map((cat) => (
                      <div
                        key={cat.id}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="font-semibold text-slate-900">
                          {cat.nombre}
                        </p>
                        {cat.descripcion && (
                          <p className="mt-1 text-sm text-slate-500">
                            {cat.descripcion}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            )}

            {/* ── DEPORTISTAS ── */}
            {activeSection === "Deportistas" && (
              <SectionCard
                title="Deportistas"
                subtitle="Asigna deportistas a un grupo o categoría."
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Deportistas existentes
                    </h3>
                    {assignedAthletes.length === 0 ? (
                      <p className="mt-3 text-sm text-slate-500">
                        No hay deportistas cargados.
                      </p>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {assignedAthletes.map((a) => (
                          <div
                            key={a.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4"
                          >
                            <p className="font-semibold text-slate-900">
                              {a.nombre}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                              Grupo: {getGroupName(a.grupoId) || "Sin grupo"}
                            </p>
                            <p className="text-sm text-slate-500">
                              Categoría:{" "}
                              {getCategoriaName(a.categoriaId) ||
                                "Sin categoría"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Asignar deportista
                    </h3>
                    <FormField label="Deportista">
                      <select
                        value={assignmentForm.deportistaId}
                        onChange={(e) =>
                          setAssignmentForm({
                            ...assignmentForm,
                            deportistaId: e.target.value,
                          })
                        }
                        className={inputCls()}
                      >
                        <option value="">
                          {athletes.length === 0
                            ? "No hay deportistas"
                            : "Selecciona"}
                        </option>
                        {athletes.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.nombre}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Grupo">
                      <select
                        value={assignmentForm.grupoId}
                        onChange={(e) =>
                          setAssignmentForm({
                            ...assignmentForm,
                            grupoId: e.target.value,
                          })
                        }
                        className={inputCls()}
                      >
                        <option value="">No asignar a grupo</option>
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.nombre}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Categoría">
                      <select
                        value={assignmentForm.categoriaId}
                        onChange={(e) =>
                          setAssignmentForm({
                            ...assignmentForm,
                            categoriaId: e.target.value,
                          })
                        }
                        className={inputCls()}
                      >
                        <option value="">No asignar a categoría</option>
                        {categorias.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <PrimaryBtn onClick={handleAssignAthlete}>
                      Asignar deportista
                    </PrimaryBtn>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* ── SESIONES ── */}
            {activeSection === "Sesiones" && !selectedSesion && (
              <SectionCard
                title="Sesiones de entrenamiento"
                subtitle="Crea sesiones para tus grupos. Haz clic en una para gestionar actividades y asistencia."
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                  <div className="space-y-3">
                    {sesionesLoading && (
                      <p className="text-sm text-slate-400">
                        Cargando sesiones...
                      </p>
                    )}
                    {!sesionesLoading && sesiones.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No hay sesiones creadas todavía.
                      </p>
                    )}
                    {sesiones.map((s) => (
                      <div
                        key={s.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => abrirSesion(s)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {s.grupoNombre || "Grupo"} — {s.fecha}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                              {s.horaInicio} – {s.horaFin}
                              {s.descripcion && ` · ${s.descripcion}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${ESTADO_COLORS[s.estado] || "bg-slate-100 text-slate-600"}`}
                            >
                              {s.estado}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEliminarSesion(s.id);
                              }}
                              className="rounded-full border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="font-semibold text-slate-900">
                      Nueva sesión
                    </h3>
                    <FormField label="Grupo">
                      <select
                        value={sesionForm.grupoId}
                        onChange={(e) =>
                          setSesionForm({
                            ...sesionForm,
                            grupoId: e.target.value,
                          })
                        }
                        className={inputCls()}
                      >
                        <option value="">
                          {groups.length === 0
                            ? "Sin grupos"
                            : "Selecciona un grupo"}
                        </option>
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.nombre}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Fecha">
                      <input
                        type="date"
                        value={sesionForm.fecha}
                        onChange={(e) =>
                          setSesionForm({
                            ...sesionForm,
                            fecha: e.target.value,
                          })
                        }
                        className={inputCls()}
                      />
                    </FormField>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">
                          Hora inicio
                        </label>
                        <input
                          type="time"
                          value={sesionForm.horaInicio}
                          onChange={(e) =>
                            setSesionForm({
                              ...sesionForm,
                              horaInicio: e.target.value,
                            })
                          }
                          className={`mt-2 ${inputCls()}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">
                          Hora fin
                        </label>
                        <input
                          type="time"
                          value={sesionForm.horaFin}
                          onChange={(e) =>
                            setSesionForm({
                              ...sesionForm,
                              horaFin: e.target.value,
                            })
                          }
                          className={`mt-2 ${inputCls()}`}
                        />
                      </div>
                    </div>
                    <FormField label="Descripción (opcional)">
                      <textarea
                        rows={3}
                        value={sesionForm.descripcion}
                        onChange={(e) =>
                          setSesionForm({
                            ...sesionForm,
                            descripcion: e.target.value,
                          })
                        }
                        placeholder="Ej. Trabajo de velocidad y resistencia"
                        className={`resize-none ${inputCls()}`}
                      />
                    </FormField>
                    <PrimaryBtn onClick={handleCrearSesion}>
                      Crear sesión
                    </PrimaryBtn>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* ── DETALLE DE SESIÓN ── */}
            {activeSection === "Sesiones" && selectedSesion && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <button
                        onClick={cerrarSesion}
                        className="mb-3 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        ← Volver a sesiones
                      </button>
                      <h2 className="text-2xl font-semibold text-slate-900">
                        {selectedSesion.grupoNombre} — {selectedSesion.fecha}
                      </h2>
                      <p className="mt-1 text-slate-500 text-sm">
                        {selectedSesion.horaInicio} – {selectedSesion.horaFin}
                        {selectedSesion.descripcion &&
                          ` · ${selectedSesion.descripcion}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${ESTADO_COLORS[selectedSesion.estado] || "bg-slate-100 text-slate-600"}`}
                      >
                        {selectedSesion.estado}
                      </span>
                      {selectedSesion.estado === "programada" && (
                        <button
                          onClick={() =>
                            handleCambiarEstado(selectedSesion.id, "completada")
                          }
                          className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-200"
                        >
                          Marcar completada
                        </button>
                      )}
                      {selectedSesion.estado !== "cancelada" && (
                        <button
                          onClick={() =>
                            handleCambiarEstado(selectedSesion.id, "cancelada")
                          }
                          className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-200"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
                    {SESSION_TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSesionTab(tab)}
                        className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
                          sesionTab === tab
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {tab === "Actividades"
                          ? "⚙️ Actividades"
                          : "✅ Asistencia"}
                      </button>
                    ))}
                  </div>
                </div>

                {sesionTab === "Actividades" && (
                  <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                    <div className="bg-white rounded-3xl p-6 shadow-sm">
                      <h3 className="font-semibold text-slate-900 mb-4">
                        Actividades de esta sesión
                      </h3>
                      {actividadesLoading && (
                        <p className="text-sm text-slate-400">Cargando...</p>
                      )}
                      {!actividadesLoading &&
                        sesionActividades.length === 0 && (
                          <p className="text-sm text-slate-500">
                            Aún no hay actividades asignadas a esta sesión.
                          </p>
                        )}
                      <div className="space-y-3">
                        {sesionActividades.map((sa) => (
                          <div
                            key={sa.sesionActividadId}
                            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div>
                              <p className="font-medium text-slate-900">
                                <span className="text-slate-400 text-xs mr-2">
                                  #{sa.orden}
                                </span>
                                {sa.actividadNombre}
                              </p>
                              {sa.duracionMinutos && (
                                <p className="text-xs text-slate-500 mt-1">
                                  ⏱ {sa.duracionMinutos} min
                                </p>
                              )}
                              {sa.nota && (
                                <p className="text-xs text-slate-500">
                                  {sa.nota}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                handleQuitarActividad(sa.sesionActividadId)
                              }
                              className="shrink-0 rounded-full border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                            >
                              Quitar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white rounded-3xl p-5 shadow-sm">
                        <h3 className="font-semibold text-slate-900 mb-2">
                          Agregar actividad
                        </h3>
                        <FormField label="Actividad del catálogo">
                          <select
                            value={actividadForm.actividadId}
                            onChange={(e) =>
                              setActividadForm({
                                ...actividadForm,
                                actividadId: e.target.value,
                              })
                            }
                            className={inputCls()}
                          >
                            <option value="">
                              {actividades.length === 0
                                ? "Sin actividades"
                                : "Selecciona"}
                            </option>
                            {actividades.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.nombre}
                              </option>
                            ))}
                          </select>
                        </FormField>
                        <FormField label="Duración (minutos)">
                          <input
                            type="number"
                            min="1"
                            value={actividadForm.duracionMinutos}
                            onChange={(e) =>
                              setActividadForm({
                                ...actividadForm,
                                duracionMinutos: e.target.value,
                              })
                            }
                            placeholder="Ej. 20"
                            className={inputCls()}
                          />
                        </FormField>
                        <FormField label="Nota (opcional)">
                          <input
                            value={actividadForm.descripcion}
                            onChange={(e) =>
                              setActividadForm({
                                ...actividadForm,
                                descripcion: e.target.value,
                              })
                            }
                            placeholder="Ej. Series de 3x10"
                            className={inputCls()}
                          />
                        </FormField>
                        <PrimaryBtn onClick={handleAgregarActividad}>
                          Agregar a sesión
                        </PrimaryBtn>
                      </div>

                      <div className="bg-white rounded-3xl p-5 shadow-sm">
                        <button
                          onClick={() => setShowNewActForm(!showNewActForm)}
                          className="w-full text-left text-sm font-medium text-blue-600 hover:underline"
                        >
                          {showNewActForm
                            ? "▲ Cancelar"
                            : "＋ Crear nueva actividad en el catálogo"}
                        </button>
                        {showNewActForm && (
                          <div className="mt-4 space-y-3">
                            <FormField label="Nombre">
                              <input
                                value={newActForm.nombre}
                                onChange={(e) =>
                                  setNewActForm({
                                    ...newActForm,
                                    nombre: e.target.value,
                                  })
                                }
                                placeholder="Ej. Calentamiento dinámico"
                                className={inputCls()}
                              />
                            </FormField>
                            <FormField label="Descripción (opcional)">
                              <textarea
                                rows={2}
                                value={newActForm.descripcion}
                                onChange={(e) =>
                                  setNewActForm({
                                    ...newActForm,
                                    descripcion: e.target.value,
                                  })
                                }
                                className={`resize-none ${inputCls()}`}
                              />
                            </FormField>
                            <PrimaryBtn onClick={handleCrearNuevaActividad}>
                              Guardar actividad
                            </PrimaryBtn>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {sesionTab === "Asistencia" && (
                  <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          Lista de asistencia
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Toca el nombre para cambiar el estado. Guarda al
                          terminar.
                        </p>
                      </div>
                      <button
                        onClick={handleGuardarAsistencia}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        Guardar asistencia
                      </button>
                    </div>

                    {asistenciaLoading && (
                      <p className="text-sm text-slate-400">
                        Cargando deportistas...
                      </p>
                    )}
                    {!asistenciaLoading && asistencia.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No hay deportistas en este grupo.
                      </p>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {asistencia.map((a) => (
                        <button
                          key={a.deportistaId}
                          onClick={() => toggleAsistencia(a.deportistaId)}
                          className={`rounded-2xl border-2 p-4 text-left transition-colors ${
                            a.estado === "presente"
                              ? "border-emerald-400 bg-emerald-50"
                              : "border-slate-200 bg-slate-50 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-slate-900 text-sm">
                              {a.nombre}
                            </p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                a.estado === "presente"
                                  ? "bg-emerald-200 text-emerald-800"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {a.estado === "presente" ? "Presente" : "Ausente"}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {asistencia.length > 0 && (
                      <div className="mt-6 flex gap-4 rounded-2xl bg-slate-50 p-4 text-sm">
                        <span className="text-emerald-700 font-medium">
                          ✅ Presentes:{" "}
                          {
                            asistencia.filter((a) => a.estado === "presente")
                              .length
                          }
                        </span>
                        <span className="text-slate-500">
                          ❌ Ausentes:{" "}
                          {
                            asistencia.filter((a) => a.estado !== "presente")
                              .length
                          }
                        </span>
                        <span className="text-slate-400">
                          Total: {asistencia.length}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── HORARIOS ── */}
            {activeSection === "Horarios" && (
              <SectionCard
                title="Horarios del grupo"
                subtitle="Crea y edita horarios de entrenamiento para tus grupos."
              >
                <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">
                      Horarios existentes
                    </h3>
                    {horariosLoading ? (
                      <p className="text-slate-500 text-sm">
                        Cargando horarios...
                      </p>
                    ) : horarios.length === 0 ? (
                      <p className="text-slate-500 text-sm">
                        No hay horarios registrados.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {horarios.map((h) => {
                          const dayNum =
                            typeof h.dia === "string"
                              ? ENUM_DIA_MAP[h.dia.toLowerCase()] || h.dia
                              : h.dia;
                          return (
                            <div
                              key={h.id}
                              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {DIA_NOMBRES[dayNum] || h.dia} ·{" "}
                                    {h.horaInicio} – {h.horaFin}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    {h.ubicacion || "Sin ubicación"}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleHorarioEdit(h)}
                                    className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleHorarioDelete(h.id)}
                                    className="rounded-full border border-red-300 px-3 py-1 text-xs text-red-700 hover:bg-red-50"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                              {h.descripcion && (
                                <p className="mt-2 text-sm text-slate-600">
                                  {h.descripcion}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">
                        {editingHorario ? "Editar horario" : "Nuevo horario"}
                      </h3>
                      {editingHorario && (
                        <button
                          onClick={resetHorarioForm}
                          className="text-sm text-slate-400 hover:text-slate-600 underline"
                        >
                          Cancelar
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
                      className={`mt-2 ${inputCls()}`}
                    >
                      <option value="">Selecciona un día</option>
                      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <option key={n} value={n}>
                          {DIA_NOMBRES[n]}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">
                          Hora inicio
                        </label>
                        <input
                          type="time"
                          name="horaInicio"
                          value={horarioForm.horaInicio}
                          onChange={handleHorarioChange}
                          className={`mt-2 ${inputCls()}`}
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
                          className={`mt-2 ${inputCls()}`}
                        />
                      </div>
                    </div>

                    <FormField label="Ubicación">
                      <input
                        name="ubicacion"
                        value={horarioForm.ubicacion}
                        onChange={handleHorarioChange}
                        placeholder="Ej. Cancha principal"
                        className={inputCls()}
                      />
                    </FormField>
                    <FormField label="Descripción">
                      <textarea
                        name="descripcion"
                        value={horarioForm.descripcion}
                        onChange={handleHorarioChange}
                        rows={3}
                        className={`resize-none ${inputCls()}`}
                      />
                    </FormField>
                    <FormField label="Grupo">
                      <select
                        name="grupoId"
                        value={horarioForm.grupoId}
                        onChange={handleHorarioChange}
                        className={inputCls()}
                      >
                        <option value="">Sin grupo específico</option>
                        {groups.map((g) => (
                          <option key={g.id} value={String(g.id)}>
                            {g.nombre}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Categoría (opcional)">
                      <select
                        name="categoriaId"
                        value={horarioForm.categoriaId}
                        onChange={handleHorarioChange}
                        className={inputCls()}
                      >
                        <option value="">Todas las categorías</option>
                        {categorias.map((c) => (
                          <option key={c.id} value={String(c.id)}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <PrimaryBtn onClick={handleHorarioSave}>
                      {editingHorario
                        ? "Actualizar horario"
                        : "Guardar horario"}
                    </PrimaryBtn>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* ── MÉTRICAS ── */}
            {activeSection === "Métricas" && (
              <SectionCard
                title="Métricas de sesión"
                subtitle="Selecciona una sesión para registrar o consultar métricas por deportista y actividad."
              >
                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600 mb-3">
                      Sesiones
                    </p>
                    {sesionesParaMetricas.length === 0 && (
                      <p className="text-sm text-slate-400">
                        Sin sesiones disponibles.
                      </p>
                    )}
                    {sesionesParaMetricas.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSeleccionarSesionMetrica(s)}
                        className={`w-full text-left rounded-2xl border p-3 transition-colors text-sm ${
                          selectedSesionMetrica?.id === s.id
                            ? "border-blue-400 bg-blue-50"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <p className="font-semibold text-slate-900 truncate">
                          {s.grupoNombre}
                        </p>
                        <p className="text-slate-500">{s.fecha}</p>
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_COLORS[s.estado] || "bg-slate-100 text-slate-600"}`}
                        >
                          {s.estado}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-6">
                    {!selectedSesionMetrica ? (
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
                        <p className="text-slate-400">
                          ← Selecciona una sesión para ver o registrar métricas.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="font-semibold text-slate-900">
                                Métricas — {selectedSesionMetrica.grupoNombre}
                              </p>
                              <p className="text-sm text-slate-500">
                                {selectedSesionMetrica.fecha}
                              </p>
                            </div>
                            {metricasLoading && (
                              <p className="text-xs text-slate-400">
                                Cargando...
                              </p>
                            )}
                          </div>

                          {metricas.length === 0 && !metricasLoading && (
                            <p className="text-sm text-slate-400">
                              No hay métricas registradas para esta sesión.
                            </p>
                          )}

                          <div className="space-y-3">
                            {metricas.map((m) => (
                              <div
                                key={m.id}
                                className="rounded-2xl border border-slate-200 bg-white p-4 flex items-start justify-between gap-4"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-slate-900 text-sm">
                                    {m.deportistaNombre}
                                  </p>
                                  <p className="text-xs text-blue-600 font-medium mt-0.5">
                                    {m.actividadNombre}
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                                    {m.tiempo != null && (
                                      <span>⏱ {m.tiempo} min</span>
                                    )}
                                    {m.distancia != null && (
                                      <span>📏 {m.distancia} m</span>
                                    )}
                                    {m.velocidad != null && (
                                      <span>💨 {m.velocidad} m/s</span>
                                    )}
                                    {m.tecnica != null && (
                                      <span>🎯 Técnica: {m.tecnica}/10</span>
                                    )}
                                    {m.rendimientoFisico != null && (
                                      <span>
                                        💪 Rendimiento: {m.rendimientoFisico}/10
                                      </span>
                                    )}
                                  </div>
                                  {m.observaciones && (
                                    <p className="mt-1 text-xs text-slate-400 italic">
                                      {m.observaciones}
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleEliminarMetrica(m.id)}
                                  className="shrink-0 rounded-full border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                          <h3 className="font-semibold text-slate-900 mb-1">
                            Registrar métrica
                          </h3>
                          <p className="text-xs text-slate-400 mb-4">
                            Solo se requiere deportista + actividad + al menos
                            un valor.
                          </p>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField label="Deportista">
                              <select
                                value={metricForm.deportistaId}
                                onChange={(e) =>
                                  setMetricForm({
                                    ...metricForm,
                                    deportistaId: e.target.value,
                                  })
                                }
                                className={inputCls()}
                              >
                                <option value="">Selecciona</option>
                                {asistencia.map((a) => (
                                  <option
                                    key={a.deportistaId}
                                    value={a.deportistaId}
                                  >
                                    {a.nombre}
                                  </option>
                                ))}
                              </select>
                            </FormField>

                            <FormField label="Actividad de la sesión">
                              <select
                                value={metricForm.sesionActividadId}
                                onChange={(e) =>
                                  setMetricForm({
                                    ...metricForm,
                                    sesionActividadId: e.target.value,
                                  })
                                }
                                className={inputCls()}
                              >
                                <option value="">Selecciona</option>
                                {sesionActividades.map((sa) => (
                                  <option
                                    key={sa.sesionActividadId}
                                    value={sa.sesionActividadId}
                                  >
                                    {sa.actividadNombre}
                                  </option>
                                ))}
                              </select>
                            </FormField>

                            <FormField label="Tiempo (min)">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={metricForm.tiempo}
                                onChange={(e) =>
                                  setMetricForm({
                                    ...metricForm,
                                    tiempo: e.target.value,
                                  })
                                }
                                placeholder="Ej. 22.5"
                                className={inputCls()}
                              />
                            </FormField>

                            <FormField label="Distancia (m)">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={metricForm.distancia}
                                onChange={(e) =>
                                  setMetricForm({
                                    ...metricForm,
                                    distancia: e.target.value,
                                  })
                                }
                                placeholder="Ej. 400"
                                className={inputCls()}
                              />
                            </FormField>

                            <FormField label="Velocidad (m/s)">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={metricForm.velocidad}
                                onChange={(e) =>
                                  setMetricForm({
                                    ...metricForm,
                                    velocidad: e.target.value,
                                  })
                                }
                                placeholder="Ej. 3.5"
                                className={inputCls()}
                              />
                            </FormField>

                            <FormField label="Técnica (1–10)">
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={metricForm.tecnica}
                                onChange={(e) =>
                                  setMetricForm({
                                    ...metricForm,
                                    tecnica: e.target.value,
                                  })
                                }
                                placeholder="1 a 10"
                                className={inputCls()}
                              />
                            </FormField>

                            <FormField label="Rendimiento físico (1–10)">
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={metricForm.rendimientoFisico}
                                onChange={(e) =>
                                  setMetricForm({
                                    ...metricForm,
                                    rendimientoFisico: e.target.value,
                                  })
                                }
                                placeholder="1 a 10"
                                className={inputCls()}
                              />
                            </FormField>

                            <FormField label="Observaciones">
                              <textarea
                                rows={2}
                                value={metricForm.observaciones}
                                onChange={(e) =>
                                  setMetricForm({
                                    ...metricForm,
                                    observaciones: e.target.value,
                                  })
                                }
                                placeholder="Notas adicionales..."
                                className={`resize-none ${inputCls()}`}
                              />
                            </FormField>
                          </div>

                          <PrimaryBtn onClick={handleRegistrarMetrica}>
                            Registrar métrica
                          </PrimaryBtn>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </SectionCard>
            )}

            {/* ── RENDIMIENTO ── */}
            {activeSection === "Rendimiento" && (
              <SectionCard
                title="Rendimiento"
                subtitle="Visualiza progreso, comparaciones y asistencia de tus deportistas."
              >
                {/* Selector de gráfica */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { key: "evolucion", label: "📈 Evolución técnica" },
                    { key: "comparacion", label: "📊 Comparación sesión" },
                    { key: "asistencia", label: "✅ Asistencia" },
                    { key: "promedios", label: "⚡ Promedios físicos" },
                  ].map((g) => (
                    <button
                      key={g.key}
                      onClick={() => {
                        setRendGrafica(g.key);
                        setRendData([]);
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        rendGrafica === g.key
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-blue-50"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
                {/* Filtros */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                  {/* Grupo — requerido en asistencia y promedios */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Grupo
                      {rendGrafica === "asistencia" ||
                      rendGrafica === "promedios"
                        ? " *"
                        : ""}
                    </label>
                    <select
                      value={rendGrupoId}
                      onChange={(e) => setRendGrupoId(e.target.value)}
                      className={inputCls()}
                    >
                      <option value="">
                        {rendGrafica === "asistencia" ||
                        rendGrafica === "promedios"
                          ? "Selecciona"
                          : "Todos"}
                      </option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Deportista — solo en evolución */}
                  {rendGrafica === "evolucion" && (
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Deportista *
                      </label>
                      <select
                        value={rendDeportistaId}
                        onChange={(e) => setRendDeportistaId(e.target.value)}
                        className={inputCls()}
                      >
                        <option value="">Selecciona</option>
                        {athletes.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Sesión — solo en comparación */}
                  {rendGrafica === "comparacion" && (
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Sesión *
                      </label>
                      <select
                        value={rendSesionId}
                        onChange={(e) => setRendSesionId(e.target.value)}
                        className={inputCls()}
                      >
                        <option value="">Selecciona</option>
                        {sesionesParaRendimiento.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.grupoNombre} — {s.fecha}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Actividad — en evolución y comparación */}
                  {(rendGrafica === "evolucion" ||
                    rendGrafica === "comparacion") && (
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Actividad (opcional)
                      </label>
                      <select
                        value={rendActividadId}
                        onChange={(e) => setRendActividadId(e.target.value)}
                        className={inputCls()}
                      >
                        <option value="">Todas</option>
                        {actividades.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Botón generar */}
                  <div className="flex items-end">
                    <button
                      onClick={cargarRendimiento}
                      disabled={rendLoading}
                      className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {rendLoading ? "Cargando..." : "Generar gráfica"}
                    </button>
                  </div>
                </div>
                {/* Área de gráfica */}
                {rendData.length === 0 && !rendLoading && (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center">
                    <p className="text-slate-400 text-sm">
                      Selecciona los filtros y haz clic en "Generar gráfica".
                    </p>
                  </div>
                )}
                {rendData.length > 0 && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    {/* GRÁFICA 1: Evolución técnica/rendimiento — líneas */}
                    {rendGrafica === "evolucion" && (
                      <>
                        <h3 className="font-semibold text-slate-900 mb-4">
                          Evolución — Técnica y Rendimiento físico
                        </h3>
                        <ResponsiveContainer width="100%" height={320}>
                          <LineChart
                            data={rendData}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f1f5f9"
                            />
                            <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
                            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                fontSize: "12px",
                              }}
                              formatter={(v) =>
                                v != null ? Number(v).toFixed(1) : "-"
                              }
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="tecnica"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              name="Técnica (1–10)"
                            />
                            <Line
                              type="monotone"
                              dataKey="rendimiento"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              name="Rendimiento físico (1–10)"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </>
                    )}

                    {/* GRÁFICA 2: Comparación de deportistas — barras */}
                    {rendGrafica === "comparacion" && (
                      <>
                        <h3 className="font-semibold text-slate-900 mb-4">
                          Comparación de deportistas en la sesión
                        </h3>
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart
                            data={rendData}
                            margin={{ top: 5, right: 20, left: 0, bottom: 40 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f1f5f9"
                            />
                            <XAxis
                              dataKey="deportista"
                              tick={{
                                fontSize: 10,
                                angle: -30,
                                textAnchor: "end",
                              }}
                            />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                fontSize: "12px",
                              }}
                              formatter={(v) =>
                                v != null ? Number(v).toFixed(1) : "-"
                              }
                            />
                            <Legend />
                            <Bar
                              dataKey="tecnica"
                              fill="#3b82f6"
                              name="Técnica"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              dataKey="rendimiento"
                              fill="#10b981"
                              name="Rendimiento"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              dataKey="tiempo"
                              fill="#f59e0b"
                              name="Tiempo (min)"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </>
                    )}

                    {/* GRÁFICA 3: Asistencia — barras apiladas */}
                    {rendGrafica === "asistencia" && (
                      <>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          Asistencia por deportista
                        </h3>
                        <p className="text-xs text-slate-400 mb-4">
                          Total sesiones con registro: {rendData[0]?.total ?? 0}
                        </p>
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart
                            data={rendData}
                            margin={{ top: 5, right: 20, left: 0, bottom: 40 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f1f5f9"
                            />
                            <XAxis
                              dataKey="deportista"
                              tick={{
                                fontSize: 10,
                                angle: -30,
                                textAnchor: "end",
                              }}
                            />
                            <YAxis
                              allowDecimals={false}
                              tick={{ fontSize: 11 }}
                            />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                fontSize: "12px",
                              }}
                            />
                            <Legend />
                            <Bar
                              dataKey="presentes"
                              fill="#10b981"
                              name="Presentes"
                              stackId="a"
                            />
                            <Bar
                              dataKey="ausentes"
                              fill="#f87171"
                              name="Ausentes"
                              stackId="a"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </>
                    )}

                    {/* GRÁFICA 4: Promedios físicos por sesión — líneas múltiples */}
                    {rendGrafica === "promedios" && (
                      <>
                        <h3 className="font-semibold text-slate-900 mb-4">
                          Promedio distancia / velocidad / tiempo por sesión
                        </h3>
                        <ResponsiveContainer width="100%" height={320}>
                          <LineChart
                            data={rendData}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f1f5f9"
                            />
                            <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                fontSize: "12px",
                              }}
                              formatter={(v) =>
                                v != null ? Number(v).toFixed(2) : "-"
                              }
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="tiempo"
                              stroke="#f59e0b"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              name="Tiempo prom. (min)"
                            />
                            <Line
                              type="monotone"
                              dataKey="distancia"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              name="Distancia prom. (m)"
                            />
                            <Line
                              type="monotone"
                              dataKey="velocidad"
                              stroke="#8b5cf6"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              name="Velocidad prom. (m/s)"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </>
                    )}
                  </div>
                )}
              </SectionCard>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
