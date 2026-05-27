import { useState, useEffect } from "react";

function formatDate(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

import { useNavigate } from "react-router-dom";
import { clubsService } from "../services/Clubs.service";
import { apiRequest } from "../services/api";
import SolicitudEntrenadorCard from "../components/SolicitudEntrenadorCard";
import SolicitudDeportistaCard from "../components/SolicitudDeportistaCard";

const sections = [
  { name: "Información del club", icon: "🏠" },
  { name: "Personalización", icon: "🎨" },
  { name: "Categorías", icon: "📁" },
  { name: "Grupos", icon: "👥" },
  { name: "Entrenadores", icon: "🧑‍🏫" },
  { name: "Deportistas", icon: "🏃" },
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

  const [entrenadoresClub, setEntrenadoresClub] = useState([]);
  const [deportistasClub, setDeportistasClub] = useState([]);
  const [entrenadoresLoading, setEntrenadoresLoading] = useState(true);
  const [deportistasLoading, setDeportistasLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({
    visible: false,
    type: "",
    id: null,
    label: "",
  });

  // Categorías y Grupos
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    nombre: "",
    descripcion: "",
    entrenadorIds: [],
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [categorySearch, setCategorySearch] = useState("");

  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupForm, setGroupForm] = useState({
    nombre: "",
    descripcion: "",
    entrenadorIds: [],
  });
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupSearch, setGroupSearch] = useState("");

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

        let detalles = null;

        setPanelData(data);

        // Si la respuesta incluye un id de club, intentar recuperar detalles desde /clubs/{id}
        const clubId = data?.id || data?.clubId || data?.club?.id;
        if (clubId) {
          try {
            detalles = await clubsService.getById(clubId);
            // fusionar detalles (detalles preferidos) con data
            setPanelData((prev) => ({ ...(prev || {}), ...(detalles || {}) }));
          } catch (err) {
            console.warn(
              "No se pudieron obtener detalles del club por id",
              err,
            );
          }
        }

        setForm({
          descripcion: data.descripcion || "",
          logoUrl: data.clubLogo || "",
          bannerUrl: data.banner || "",
          colorPrimario: data.colorPrimario || "#2563eb",
          colorSecundario: data.colorSecundario || "#ffffff",
        });

        // aplicar colores actuales al CSS para vista previa inmediata
        try {
          const primary = data.colorPrimario || "#2563eb";
          const secondary = data.colorSecundario || "#ffffff";
          document.documentElement.style.setProperty("--club-primary", primary);
          document.documentElement.style.setProperty(
            "--club-secondary",
            secondary,
          );
        } catch {
          /* ignore for SSR or environments without document */
        }
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
    cargarHorarios();
    fetchEntrenadoresClub();
    fetchDeportistasClub();
    fetchCategories();
    fetchGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // si es color, aplicar variable CSS para vista previa inmediata
    try {
      if (name === "colorPrimario") {
        document.documentElement.style.setProperty("--club-primary", value);
      }
      if (name === "colorSecundario") {
        document.documentElement.style.setProperty("--club-secondary", value);
      }
    } catch {
      // no hacemos nada si document no está disponible
    }
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

  const fetchEntrenadoresClub = async () => {
    setEntrenadoresLoading(true);
    try {
      const data = await clubsService.getEntrenadores();
      setEntrenadoresClub(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando entrenadores", err);
      setEntrenadoresClub([]);
    } finally {
      setEntrenadoresLoading(false);
    }
  };

  const fetchDeportistasClub = async () => {
    setDeportistasLoading(true);
    try {
      const data = await clubsService.getDeportistas();
      setDeportistasClub(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando deportistas", err);
      setDeportistasClub([]);
    } finally {
      setDeportistasLoading(false);
    }
  };

  const handleEliminarEntrenador = async (id) => {
    try {
      await clubsService.eliminarEntrenador(id);
      setSuccessMessage("✅ Entrenador eliminado");
      await fetchEntrenadoresClub();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSuccessMessage("❌ Error eliminando entrenador");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleEliminarDeportista = async (id) => {
    try {
      await clubsService.eliminarDeportista(id);
      setSuccessMessage("✅ Deportista eliminado");
      await fetchDeportistasClub();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSuccessMessage("❌ Error eliminando deportista");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const confirmEliminar = (type, id, label) => {
    setDeleteConfirm({
      visible: true,
      type,
      id,
      label,
    });
  };

  const cancelDelete = () => {
    setDeleteConfirm({
      visible: false,
      type: "",
      id: null,
      label: "",
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteConfirm.type === "entrenador") {
        await handleEliminarEntrenador(deleteConfirm.id);
      } else if (deleteConfirm.type === "deportista") {
        await handleEliminarDeportista(deleteConfirm.id);
      }
    } finally {
      cancelDelete();
    }
  };

  const handleHorarioCancelEdit = () => {
    resetHorarioForm();
  };

  // CATEGORÍAS / GRUPOS: funciones
  const fetchCategories = async (search = "") => {
    setCategoriesLoading(true);
    try {
      const data = await clubsService.getCategories(search);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando categorías", err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchGroups = async (search = "") => {
    setGroupsLoading(true);
    try {
      const data = await clubsService.getGroups(search);
      setGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando grupos", err);
      setGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((p) => ({ ...p, [name]: value }));
  };

  const toggleCategoryEntrenador = (id) => {
    setCategoryForm((p) => {
      const exists = (p.entrenadorIds || []).includes(id);
      return {
        ...p,
        entrenadorIds: exists
          ? p.entrenadorIds.filter((x) => x !== id)
          : [...(p.entrenadorIds || []), id],
      };
    });
  };

  const handleCategorySave = async () => {
    try {
      if (editingCategory) {
        await clubsService.updateCategory(editingCategory.id, categoryForm);
        setSuccessMessage("✅ Categoría actualizada");
      } else {
        await clubsService.createCategory(categoryForm);
        setSuccessMessage("✅ Categoría creada");
      }
      setCategoryForm({ nombre: "", descripcion: "", entrenadorIds: [] });
      setEditingCategory(null);
      await fetchCategories();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSuccessMessage("❌ Error guardando categoría");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      nombre: cat.nombre || "",
      descripcion: cat.descripcion || "",
      entrenadorIds: cat.entrenadores
        ? cat.entrenadores.map((e) => e.entrenadorId || e.id)
        : [],
    });
  };

  const handleDeleteCategory = async (id) => {
    try {
      await clubsService.deleteCategory(id);
      setSuccessMessage("✅ Categoría eliminada");
      await fetchCategories();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSuccessMessage("❌ Error eliminando categoría");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleCategorySearch = async (e) => {
    const v = e.target.value;
    setCategorySearch(v);
    await fetchCategories(v);
  };

  // Grupos
  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    setGroupForm((p) => ({ ...p, [name]: value }));
  };

  const toggleGroupEntrenador = (id) => {
    setGroupForm((p) => {
      const exists = (p.entrenadorIds || []).includes(id);
      return {
        ...p,
        entrenadorIds: exists
          ? p.entrenadorIds.filter((x) => x !== id)
          : [...(p.entrenadorIds || []), id],
      };
    });
  };

  const handleGroupSave = async () => {
    try {
      if (editingGroup) {
        await clubsService.updateGroup(editingGroup.id, groupForm);
        setSuccessMessage("✅ Grupo actualizado");
      } else {
        await clubsService.createGroup(groupForm);
        setSuccessMessage("✅ Grupo creado");
      }
      setGroupForm({ nombre: "", descripcion: "", entrenadorIds: [] });
      setEditingGroup(null);
      await fetchGroups();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSuccessMessage("❌ Error guardando grupo");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleEditGroup = (g) => {
    setEditingGroup(g);
    setGroupForm({
      nombre: g.nombre || "",
      descripcion: g.descripcion || "",
      entrenadorIds: g.entrenadores
        ? g.entrenadores.map((e) => e.entrenadorId || e.id)
        : [],
    });
  };

  const handleDeleteGroup = async (id) => {
    try {
      await clubsService.deleteGroup(id);
      setSuccessMessage("✅ Grupo eliminado");
      await fetchGroups();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSuccessMessage("❌ Error eliminando grupo");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleGroupSearch = async (e) => {
    const v = e.target.value;
    setGroupSearch(v);
    await fetchGroups(v);
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

      // ✅ REFRESCAR las listas de entrenadores y deportistas
      await Promise.all([fetchEntrenadoresClub(), fetchDeportistasClub()]);

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
            {/* CATEGORÍAS */}
            {activeSection === "Categorías" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Gestión de categorías
                    </h3>
                    <p className="text-slate-500">
                      Crea, edita y asigna entrenadores a categorías.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={categorySearch}
                      onChange={handleCategorySearch}
                      placeholder="Buscar categoría..."
                      className="rounded-xl border px-3 py-2"
                    />
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setCategoryForm({
                          nombre: "",
                          descripcion: "",
                          entrenadorIds: [],
                        });
                      }}
                      className="rounded-full bg-blue-600 text-white px-4 py-2"
                    >
                      Nuevo
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  {categoriesLoading ? (
                    <p>Cargando categorías...</p>
                  ) : categories.length === 0 ? (
                    <p>No hay categorías registradas.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-700">
                        <thead>
                          <tr className="border-b bg-slate-100">
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Entrenadores</th>
                            <th className="px-4 py-3">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {categories.map((cat) => (
                            <tr key={cat.id}>
                              <td className="px-4 py-3">{cat.nombre}</td>
                              <td className="px-4 py-3">
                                {(cat.entrenadores || [])
                                  .map(
                                    (e) =>
                                      `${e.nombre || e.firstName || ""} ${e.apellido || e.lastName || ""}`,
                                  )
                                  .join(", ")}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleEditCategory(cat)}
                                  className="mr-2 rounded-full border px-3 py-1 text-sm"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="rounded-full border border-red-300 px-3 py-1 text-sm text-red-700"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h4 className="font-semibold mb-3">
                    {editingCategory ? "Editar categoría" : "Nueva categoría"}
                  </h4>
                  <label className="block text-sm font-medium">Nombre</label>
                  <input
                    name="nombre"
                    value={categoryForm.nombre}
                    onChange={handleCategoryChange}
                    className="mt-2 mb-3 w-full rounded-xl border px-4 py-2"
                  />
                  <label className="block text-sm font-medium">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={categoryForm.descripcion}
                    onChange={handleCategoryChange}
                    className="mt-2 mb-3 w-full rounded-xl border px-4 py-2"
                  />

                  <div>
                    <p className="text-sm font-medium mb-2">
                      Asignar entrenadores
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {entrenadoresLoading ? (
                        <p>Cargando...</p>
                      ) : (
                        entrenadoresClub.map((ent) => (
                          <label
                            key={ent.entrenadorId}
                            className="inline-flex items-center gap-2 border rounded-full px-3 py-1 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={(
                                categoryForm.entrenadorIds || []
                              ).includes(ent.entrenadorId)}
                              onChange={() =>
                                toggleCategoryEntrenador(ent.entrenadorId)
                              }
                            />
                            <span>
                              {ent.nombre} {ent.apellido}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleCategorySave}
                      className="rounded-xl bg-blue-600 text-white px-4 py-2"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setCategoryForm({
                          nombre: "",
                          descripcion: "",
                          entrenadorIds: [],
                        });
                      }}
                      className="rounded-xl border px-4 py-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* GRUPOS */}
            {activeSection === "Grupos" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Gestión de grupos</h3>
                    <p className="text-slate-500">
                      Crea, edita y asigna entrenadores a grupos.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={groupSearch}
                      onChange={handleGroupSearch}
                      placeholder="Buscar grupo..."
                      className="rounded-xl border px-3 py-2"
                    />
                    <button
                      onClick={() => {
                        setEditingGroup(null);
                        setGroupForm({
                          nombre: "",
                          descripcion: "",
                          entrenadorIds: [],
                        });
                      }}
                      className="rounded-full bg-blue-600 text-white px-4 py-2"
                    >
                      Nuevo
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  {groupsLoading ? (
                    <p>Cargando grupos...</p>
                  ) : groups.length === 0 ? (
                    <p>No hay grupos registrados.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-700">
                        <thead>
                          <tr className="border-b bg-slate-100">
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Entrenadores</th>
                            <th className="px-4 py-3">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {groups.map((g) => (
                            <tr key={g.id}>
                              <td className="px-4 py-3">{g.nombre}</td>
                              <td className="px-4 py-3">
                                {(g.entrenadores || [])
                                  .map(
                                    (e) =>
                                      `${e.nombre || e.firstName || ""} ${e.apellido || e.lastName || ""}`,
                                  )
                                  .join(", ")}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleEditGroup(g)}
                                  className="mr-2 rounded-full border px-3 py-1 text-sm"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteGroup(g.id)}
                                  className="rounded-full border border-red-300 px-3 py-1 text-sm text-red-700"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h4 className="font-semibold mb-3">
                    {editingGroup ? "Editar grupo" : "Nuevo grupo"}
                  </h4>
                  <label className="block text-sm font-medium">Nombre</label>
                  <input
                    name="nombre"
                    value={groupForm.nombre}
                    onChange={handleGroupChange}
                    className="mt-2 mb-3 w-full rounded-xl border px-4 py-2"
                  />
                  <label className="block text-sm font-medium">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={groupForm.descripcion}
                    onChange={handleGroupChange}
                    className="mt-2 mb-3 w-full rounded-xl border px-4 py-2"
                  />

                  <div>
                    <p className="text-sm font-medium mb-2">
                      Asignar entrenadores
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {entrenadoresLoading ? (
                        <p>Cargando...</p>
                      ) : (
                        entrenadoresClub.map((ent) => (
                          <label
                            key={ent.entrenadorId}
                            className="inline-flex items-center gap-2 border rounded-full px-3 py-1 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={(groupForm.entrenadorIds || []).includes(
                                ent.entrenadorId,
                              )}
                              onChange={() =>
                                toggleGroupEntrenador(ent.entrenadorId)
                              }
                            />
                            <span>
                              {ent.nombre} {ent.apellido}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleGroupSave}
                      className="rounded-xl bg-blue-600 text-white px-4 py-2"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditingGroup(null);
                        setGroupForm({
                          nombre: "",
                          descripcion: "",
                          entrenadorIds: [],
                        });
                      }}
                      className="rounded-xl border px-4 py-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white p-6 rounded-2xl shadow">
              {/* ✅ ENTRENADORES */}
              {activeSection === "Entrenadores" && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Gestión de entrenadores
                      </h3>
                      <p className="text-slate-500 mt-1">
                        Lista los entrenadores del club y elimina a quien ya no
                        deba formar parte del equipo.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    {entrenadoresLoading ? (
                      <p className="text-slate-500">Cargando entrenadores...</p>
                    ) : entrenadoresClub.length === 0 ? (
                      <p className="text-slate-500">
                        No hay entrenadores registrados.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-700">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-100">
                              <th className="px-4 py-3">Nombre</th>
                              <th className="px-4 py-3">Email</th>
                              <th className="px-4 py-3">Experiencia</th>
                              <th className="px-4 py-3">Especialidad</th>
                              <th className="px-4 py-3">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {entrenadoresClub.map((entrenador) => (
                              <tr key={entrenador.entrenadorId}>
                                <td className="px-4 py-3">
                                  {entrenador.nombre} {entrenador.apellido}
                                </td>
                                <td className="px-4 py-3">
                                  {entrenador.email}
                                </td>
                                <td className="px-4 py-3">
                                  {entrenador.experiencia || "-"}
                                </td>
                                <td className="px-4 py-3">
                                  {entrenador.especialidad || "-"}
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() =>
                                      confirmEliminar(
                                        "entrenador",
                                        entrenador.entrenadorId,
                                        `${entrenador.nombre} ${entrenador.apellido}`,
                                      )
                                    }
                                    className="rounded-full border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ✅ DEPORTISTAS */}
              {activeSection === "Deportistas" && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Gestión de deportistas
                      </h3>
                      <p className="text-slate-500 mt-1">
                        Lista los deportistas del club y elimina a quien ya no
                        pertenece al club.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    {deportistasLoading ? (
                      <p className="text-slate-500">Cargando deportistas...</p>
                    ) : deportistasClub.length === 0 ? (
                      <p className="text-slate-500">
                        No hay deportistas registrados.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-700">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-100">
                              <th className="px-4 py-3">Nombre</th>
                              <th className="px-4 py-3">Email</th>
                              <th className="px-4 py-3">Peso</th>
                              <th className="px-4 py-3">Estatura</th>
                              <th className="px-4 py-3">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {deportistasClub.map((deportista) => (
                              <tr key={deportista.deportistaId}>
                                <td className="px-4 py-3">
                                  {deportista.nombre} {deportista.apellido}
                                </td>
                                <td className="px-4 py-3">
                                  {deportista.email}
                                </td>
                                <td className="px-4 py-3">
                                  {deportista.peso ?? "-"}
                                </td>
                                <td className="px-4 py-3">
                                  {deportista.estatura
                                    ? `${deportista.estatura} cm`
                                    : "-"}
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() =>
                                      confirmEliminar(
                                        "deportista",
                                        deportista.deportistaId,
                                        `${deportista.nombre} ${deportista.apellido}`,
                                      )
                                    }
                                    className="rounded-full border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">Contacto</p>
                      <p className="font-medium">
                        {panelData?.contacto || "-"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">Estado</p>
                      <p className="font-medium capitalize">
                        {panelData?.estado || "-"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">Ciudad</p>
                      <p className="font-medium">{panelData?.ciudad || "-"}</p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">Creado</p>
                      <p className="font-medium">
                        {formatDate(
                          panelData?.created_at || panelData?.createdAt,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* ✅ DEFAULT SOLO PARA OTRAS */}
              {activeSection !== "Información del club" &&
                activeSection !== "Personalización" &&
                activeSection !== "Entrenadores" &&
                activeSection !== "Deportistas" &&
                activeSection !== "Invitar" &&
                activeSection !== "Solicitudes" && <></>}
            </div>
          </main>
        </div>
      </div>

      {deleteConfirm.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-900">
              ¿Seguro que quieres eliminar?
            </h2>
            <p className="mt-3 text-slate-600">
              Estás por eliminar{" "}
              <span className="font-semibold">{deleteConfirm.label}</span>. Esta
              acción no se puede deshacer.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelDelete}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-full bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
