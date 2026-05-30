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

function InvitarSection({ onSuccess }) {
  const [invitaciones, setInvitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: "", rol: "deportista" });

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setLoading(true);
    try {
      const data = await clubsService.getInvitaciones();
      setInvitaciones(Array.isArray(data) ? data : []);
    } catch {
      setInvitaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnviar = async () => {
    if (!form.email || !form.rol) {
      onSuccess("❌ Email y rol son requeridos");
      return;
    }
    try {
      await clubsService.crearInvitacion(form);
      onSuccess("✅ Invitación enviada");
      setForm({ email: "", rol: "deportista" });
      await cargar();
    } catch (e) {
      onSuccess("❌ " + (e.message || "Error enviando invitación"));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Invitar miembros
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Invita usuarios registrados al club por su email.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Nueva invitación</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email del usuario
            </label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="usuario@email.com"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Rol
            </label>
            <select
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="deportista">Deportista</option>
              <option value="entrenador">Entrenador</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleEnviar}
          className="mt-4 rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Enviar invitación
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">
          Invitaciones enviadas
        </h3>
        {loading ? (
          <p className="text-slate-500">Cargando...</p>
        ) : invitaciones.length === 0 ? (
          <p className="text-slate-500">No hay invitaciones enviadas.</p>
        ) : (
          <table className="min-w-full text-sm text-slate-700">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invitaciones.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-4 py-3">
                    {inv.nombre} {inv.apellido}
                  </td>
                  <td className="px-4 py-3">{inv.email}</td>
                  <td className="px-4 py-3 capitalize">{inv.rol}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        inv.estado === "pendiente"
                          ? "bg-yellow-100 text-yellow-700"
                          : inv.estado === "aceptada"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {inv.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {inv.createdAt
                      ? new Date(inv.createdAt).toLocaleDateString("es-ES")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function PanelClub() {
  const [activeSection, setActiveSection] = useState("Información del club");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const [panelData, setPanelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState([]);

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
      // Primero intentar eliminar cualquier asociación del entrenador
      const extractId = (e) =>
        e?.entrenadorId != null ? e.entrenadorId : e?.id;

      // Quitar entrenador de categorías que lo contienen
      const catsToUpdate = (categories || []).filter(
        (c) =>
          Array.isArray(c.entrenadores) &&
          c.entrenadores.some((e) => extractId(e) === id),
      );

      for (const c of catsToUpdate) {
        const newIds = (c.entrenadores || [])
          .map((e) => extractId(e))
          .filter((x) => x !== id);
        await clubsService.assignEntrenadoresToCategory(c.id, newIds);
      }

      // Quitar entrenador de grupos que lo contienen
      const groupsToUpdate = (groups || []).filter(
        (g) =>
          Array.isArray(g.entrenadores) &&
          g.entrenadores.some((e) => extractId(e) === id),
      );

      for (const g of groupsToUpdate) {
        const newIds = (g.entrenadores || [])
          .map((e) => extractId(e))
          .filter((x) => x !== id);
        await clubsService.assignEntrenadoresToGroup(g.id, newIds);
      }

      // Ahora intentar borrar el entrenador
      await clubsService.eliminarEntrenador(id);

      setSuccessMessage("✅ Entrenador eliminado");
      // refrescar listas relevantes
      await Promise.all([
        fetchEntrenadoresClub(),
        fetchCategories(),
        fetchGroups(),
      ]);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);

      const msg = err?.message || String(err || "");
      if (
        /foreign key|Cannot delete or update a parent row|constraint/i.test(msg)
      ) {
        setSuccessMessage(
          "❌ No se puede eliminar: hay asociaciones (categorías/grupos). Elimina esas asociaciones primero.",
        );
      } else {
        setSuccessMessage("❌ Error eliminando entrenador");
      }

      setTimeout(() => setSuccessMessage(""), 5000);
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
      // Quitar todas las asociaciones de entrenadores en esa categoría
      await clubsService.assignEntrenadoresToCategory(id, []);

      // Luego eliminar la categoría
      await clubsService.deleteCategory(id);

      setSuccessMessage("✅ Categoría eliminada");
      // refrescar categorías y entrenadores en caso de que cambien
      await Promise.all([fetchCategories(), fetchEntrenadoresClub()]);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      const msg = err?.message || String(err || "");
      const associationPattern =
        /foreign key|constraint|asociaci[oó]n|asociaciones|entrenador|deportista|grupo/i;
      if (associationPattern.test(msg)) {
        setSuccessMessage(`❌ No se puede eliminar la categoría: ${msg}`);
      } else {
        setSuccessMessage(`❌ Error eliminando categoría: ${msg}`);
      }
      setTimeout(() => setSuccessMessage(""), 5000);
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
      // Quitar todas las asociaciones de entrenadores en ese grupo
      await clubsService.assignEntrenadoresToGroup(id, []);

      // Luego eliminar el grupo
      await clubsService.deleteGroup(id);

      setSuccessMessage("✅ Grupo eliminado");
      // refrescar grupos y entrenadores en caso de que cambien
      await Promise.all([fetchGroups(), fetchEntrenadoresClub()]);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      const msg = err?.message || String(err || "");
      const associationPattern =
        /foreign key|constraint|asociaci[oó]n|asociaciones|entrenador|deportista|categoria/i;
      if (associationPattern.test(msg)) {
        setSuccessMessage(`❌ No se puede eliminar el grupo: ${msg}`);
      } else {
        setSuccessMessage(`❌ Error eliminando grupo: ${msg}`);
      }
      setTimeout(() => setSuccessMessage(""), 5000);
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

  const totalEntrenadores = entrenadoresClub.length;
  const totalDeportistas = deportistasClub.length;
  const totalCategorias = categories.length;
  const totalGrupos = groups.length;
  const totalSolicitudes = solicitudes.length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
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

        <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
          <aside className="sticky top-6 self-start rounded-[32px] bg-white p-6 shadow-xl">
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-slate-400">
              Navegación
            </p>
            <nav className="space-y-3">
              {sections.map((section) => (
                <button
                  key={section.name}
                  onClick={() => setActiveSection(section.name)}
                  className={`flex w-full items-center gap-3 rounded-3xl border px-4 py-3 text-left text-sm font-medium transition ${
                    activeSection === section.name
                      ? "border-blue-500 bg-blue-600 text-white shadow-md"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span>{section.name}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[32px] bg-white p-5 shadow-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Deportistas
                </p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">
                  {totalDeportistas}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Registrados en tu club
                </p>
              </div>
              <div className="rounded-[32px] bg-white p-5 shadow-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Entrenadores
                </p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">
                  {totalEntrenadores}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Profesionales activos
                </p>
              </div>
              <div className="rounded-[32px] bg-white p-5 shadow-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Categorías
                </p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">
                  {totalCategorias}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Espacios definidos
                </p>
              </div>
              <div className="rounded-[32px] bg-white p-5 shadow-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Grupos
                </p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">
                  {totalGrupos}
                </p>
                <p className="mt-2 text-sm text-slate-500">Equipos activos</p>
              </div>
            </div>

            <section className="rounded-[32px] bg-white p-6 shadow-xl">
              {activeSection === "Información del club" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">
                        Información del club
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Detalles clave del club y datos de contacto.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                          Estado
                        </p>
                        <p className="mt-3 text-lg font-semibold text-slate-900 capitalize">
                          {panelData?.estado || "-"}
                        </p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                          Ciudad
                        </p>
                        <p className="mt-3 text-lg font-semibold text-slate-900">
                          {panelData?.ciudad || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Descripción
                    </p>
                    <p className="mt-3 text-slate-700">
                      {panelData?.descripcion ||
                        "No hay descripción registrada"}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Contacto
                      </p>
                      <p className="mt-2 font-medium text-slate-900">
                        {panelData?.contacto || "-"}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Creado
                      </p>
                      <p className="mt-2 font-medium text-slate-900">
                        {formatDate(
                          panelData?.created_at || panelData?.createdAt,
                        )}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Administrador
                      </p>
                      <p className="mt-2 font-medium text-slate-900">
                        {panelData?.adminNombre || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "Personalización" && (
                <div className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Vista previa
                      </p>
                      <div className="mt-4 space-y-4">
                        {form.logoUrl ? (
                          <img
                            src={form.logoUrl}
                            alt="Logo preview"
                            className="h-20 w-20 rounded-3xl object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-lg font-semibold text-slate-700">
                            Logo
                          </div>
                        )}
                        {form.bannerUrl ? (
                          <img
                            src={form.bannerUrl}
                            alt="Banner preview"
                            className="h-36 w-full rounded-3xl object-cover"
                          />
                        ) : (
                          <div className="flex h-36 items-center justify-center rounded-3xl bg-white text-slate-500">
                            Banner del club
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">
                          Descripción del club
                        </label>
                        <textarea
                          name="descripcion"
                          value={form.descripcion}
                          onChange={handleChange}
                          placeholder="Descripción del club"
                          className="mt-2 h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-slate-700">
                            URL del logo
                          </label>
                          <input
                            name="logoUrl"
                            value={form.logoUrl}
                            onChange={handleChange}
                            placeholder="URL del logo"
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">
                            URL del banner
                          </label>
                          <input
                            name="bannerUrl"
                            value={form.bannerUrl}
                            onChange={handleChange}
                            placeholder="URL del banner"
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">
                            Color primario
                          </p>
                          <div className="mt-3 flex items-center gap-3">
                            <input
                              type="color"
                              name="colorPrimario"
                              value={form.colorPrimario}
                              onChange={handleChange}
                              className="h-12 w-12 rounded-xl border border-slate-200 cursor-pointer"
                            />
                            <span className="text-sm text-slate-700">
                              {form.colorPrimario}
                            </span>
                          </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">
                            Color secundario
                          </p>
                          <div className="mt-3 flex items-center gap-3">
                            <input
                              type="color"
                              name="colorSecundario"
                              value={form.colorSecundario}
                              onChange={handleChange}
                              className="h-12 w-12 rounded-xl border border-slate-200 cursor-pointer"
                            />
                            <span className="text-sm text-slate-700">
                              {form.colorSecundario}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleSave}
                        className="rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
                      >
                        Guardar personalización
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "Categorías" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">
                        Categorías
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Administra categorías y asigna entrenadores a cada una.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <input
                        value={categorySearch}
                        onChange={handleCategorySearch}
                        placeholder="Buscar categoría..."
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-auto"
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
                        className="rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
                      >
                        Nuevo
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                    {categoriesLoading ? (
                      <div className="p-6 text-slate-500">
                        Cargando categorías...
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="p-6 text-slate-500">
                        No hay categorías registradas.
                      </div>
                    ) : (
                      <table className="min-w-full text-left text-sm text-slate-700">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="px-4 py-4">Nombre</th>
                            <th className="px-4 py-4">Entrenadores</th>
                            <th className="px-4 py-4">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {categories.map((cat) => (
                            <tr key={cat.id}>
                              <td className="px-4 py-4">{cat.nombre}</td>
                              <td className="px-4 py-4">
                                {(cat.entrenadores || [])
                                  .map(
                                    (e) =>
                                      `${e.nombre || e.firstName || ""} ${e.apellido || e.lastName || ""}`,
                                  )
                                  .join(", ")}
                              </td>
                              <td className="px-4 py-4">
                                <button
                                  onClick={() => handleEditCategory(cat)}
                                  className="mr-2 rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      {editingCategory ? "Editar categoría" : "Nueva categoría"}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">
                          Nombre
                        </label>
                        <input
                          name="nombre"
                          value={categoryForm.nombre}
                          onChange={handleCategoryChange}
                          className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">
                          Descripción
                        </label>
                        <textarea
                          name="descripcion"
                          value={categoryForm.descripcion}
                          onChange={handleCategoryChange}
                          className="mt-2 h-24 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Asignar entrenadores
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {entrenadoresLoading ? (
                          <p className="text-slate-500">Cargando...</p>
                        ) : (
                          entrenadoresClub.map((ent) => (
                            <label
                              key={ent.entrenadorId}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                            >
                              <input
                                type="checkbox"
                                checked={(
                                  categoryForm.entrenadorIds || []
                                ).includes(ent.entrenadorId)}
                                onChange={() =>
                                  toggleCategoryEntrenador(ent.entrenadorId)
                                }
                                className="h-4 w-4 rounded border-slate-300"
                              />
                              <span>
                                {ent.nombre} {ent.apellido}
                              </span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={handleCategorySave}
                        className="rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
                      >
                        Guardar categoría
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
                        className="rounded-3xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "Grupos" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">
                        Grupos
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Organiza equipos y asigna entrenadores según objetivos.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <input
                        value={groupSearch}
                        onChange={handleGroupSearch}
                        placeholder="Buscar grupo..."
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-auto"
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
                        className="rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
                      >
                        Nuevo
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                    {groupsLoading ? (
                      <div className="p-6 text-slate-500">
                        Cargando grupos...
                      </div>
                    ) : groups.length === 0 ? (
                      <div className="p-6 text-slate-500">
                        No hay grupos registrados.
                      </div>
                    ) : (
                      <table className="min-w-full text-left text-sm text-slate-700">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="px-4 py-4">Nombre</th>
                            <th className="px-4 py-4">Entrenadores</th>
                            <th className="px-4 py-4">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {groups.map((g) => (
                            <tr key={g.id}>
                              <td className="px-4 py-4">{g.nombre}</td>
                              <td className="px-4 py-4">
                                {(g.entrenadores || [])
                                  .map(
                                    (e) =>
                                      `${e.nombre || e.firstName || ""} ${e.apellido || e.lastName || ""}`,
                                  )
                                  .join(", ")}
                              </td>
                              <td className="px-4 py-4">
                                <button
                                  onClick={() => handleEditGroup(g)}
                                  className="mr-2 rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteGroup(g.id)}
                                  className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      {editingGroup ? "Editar grupo" : "Nuevo grupo"}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">
                          Nombre
                        </label>
                        <input
                          name="nombre"
                          value={groupForm.nombre}
                          onChange={handleGroupChange}
                          className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">
                          Descripción
                        </label>
                        <textarea
                          name="descripcion"
                          value={groupForm.descripcion}
                          onChange={handleGroupChange}
                          className="mt-2 h-24 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Asignar entrenadores
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {entrenadoresLoading ? (
                          <p className="text-slate-500">Cargando...</p>
                        ) : (
                          entrenadoresClub.map((ent) => (
                            <label
                              key={ent.entrenadorId}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                            >
                              <input
                                type="checkbox"
                                checked={(
                                  groupForm.entrenadorIds || []
                                ).includes(ent.entrenadorId)}
                                onChange={() =>
                                  toggleGroupEntrenador(ent.entrenadorId)
                                }
                                className="h-4 w-4 rounded border-slate-300"
                              />
                              <span>
                                {ent.nombre} {ent.apellido}
                              </span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={handleGroupSave}
                        className="rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
                      >
                        Guardar grupo
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
                        className="rounded-3xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "Entrenadores" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">
                        Entrenadores
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Mira el equipo técnico y administra sus permisos.
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                    {entrenadoresLoading ? (
                      <div className="p-6 text-slate-500">
                        Cargando entrenadores...
                      </div>
                    ) : entrenadoresClub.length === 0 ? (
                      <div className="p-6 text-slate-500">
                        No hay entrenadores registrados.
                      </div>
                    ) : (
                      <table className="min-w-full text-left text-sm text-slate-700">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="px-4 py-4">Nombre</th>
                            <th className="px-4 py-4">Email</th>
                            <th className="px-4 py-4">Experiencia</th>
                            <th className="px-4 py-4">Especialidad</th>
                            <th className="px-4 py-4">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {entrenadoresClub.map((entrenador) => (
                            <tr key={entrenador.entrenadorId}>
                              <td className="px-4 py-4">
                                {entrenador.nombre} {entrenador.apellido}
                              </td>
                              <td className="px-4 py-4">{entrenador.email}</td>
                              <td className="px-4 py-4">
                                {entrenador.experiencia || "-"}
                              </td>
                              <td className="px-4 py-4">
                                {entrenador.especialidad || "-"}
                              </td>
                              <td className="px-4 py-4">
                                <button
                                  onClick={() =>
                                    confirmEliminar(
                                      "entrenador",
                                      entrenador.entrenadorId,
                                      `${entrenador.nombre} ${entrenador.apellido}`,
                                    )
                                  }
                                  className="rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {activeSection === "Deportistas" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">
                        Deportistas
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Revisa los miembros activos y gestiona las bajas.
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                    {deportistasLoading ? (
                      <div className="p-6 text-slate-500">
                        Cargando deportistas...
                      </div>
                    ) : deportistasClub.length === 0 ? (
                      <div className="p-6 text-slate-500">
                        No hay deportistas registrados.
                      </div>
                    ) : (
                      <table className="min-w-full text-left text-sm text-slate-700">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="px-4 py-4">Nombre</th>
                            <th className="px-4 py-4">Email</th>
                            <th className="px-4 py-4">Peso</th>
                            <th className="px-4 py-4">Estatura</th>
                            <th className="px-4 py-4">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {deportistasClub.map((deportista) => (
                            <tr key={deportista.deportistaId}>
                              <td className="px-4 py-4">
                                {deportista.nombre} {deportista.apellido}
                              </td>
                              <td className="px-4 py-4">{deportista.email}</td>
                              <td className="px-4 py-4">
                                {deportista.peso ?? "-"}
                              </td>
                              <td className="px-4 py-4">
                                {deportista.estatura
                                  ? `${deportista.estatura} cm`
                                  : "-"}
                              </td>
                              <td className="px-4 py-4">
                                <button
                                  onClick={() =>
                                    confirmEliminar(
                                      "deportista",
                                      deportista.deportistaId,
                                      `${deportista.nombre} ${deportista.apellido}`,
                                    )
                                  }
                                  className="rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {activeSection === "Solicitudes" && (
                <div className="space-y-8">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">
                        Solicitudes
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Revisa y responde solicitudes pendientes de entrenadores
                        y deportistas.
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                      {totalSolicitudes} pendientes
                    </span>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Entrenadores
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
                          No hay solicitudes de entrenadores.
                        </p>
                      )}
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Deportistas
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
                          No hay solicitudes de deportistas.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "Invitar" && (
                <InvitarSection
                  onSuccess={(msg) => {
                    setSuccessMessage(msg);
                    setTimeout(() => setSuccessMessage(""), 3000);
                  }}
                />
              )}

              {activeSection === "Analítica" && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                  <p className="text-lg font-semibold text-slate-900">
                    Analítica
                  </p>
                  <p className="mt-3 text-sm">
                    En esta sección encontrarás datos clave de rendimiento del
                    club.
                  </p>
                </div>
              )}
            </section>
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
