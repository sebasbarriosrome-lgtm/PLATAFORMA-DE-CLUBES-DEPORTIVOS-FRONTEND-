const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let nextId = 1;
const horarios = [];

const groups = [
  { id: 1, nombre: "Equipo A", categoria: "Sub-18" },
  { id: 2, nombre: "Equipo B", categoria: "Adultos" },
];

const categories = [
  { id: 1, nombre: "Sub-18", descripcion: "Deportistas menores de 18 años" },
  { id: 2, nombre: "Adultos", descripcion: "Deportistas adultos" },
];

const deportistas = [
  { id: 101, nombre: "Ana Pérez", grupoId: 1, categoriaId: 1 },
  { id: 102, nombre: "Luis Gómez", grupoId: 1, categoriaId: 1 },
  { id: 103, nombre: "María Torres", grupoId: 2, categoriaId: 2 },
];

const validDias = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

// Helper to validate horario payload
function validateHorarioPayload(p) {
  if (!p.dia || !validDias.includes(p.dia))
    return { ok: false, message: "dia inválido" };
  if (!p.horaInicio || !p.horaFin)
    return { ok: false, message: "horas inválidas" };
  return { ok: true };
}

// GET all horarios
app.get("/clubs/horarios", (req, res) => {
  res.json(horarios);
});

// GET horarios by slug (optional)
app.get("/clubs/horarios/slug/:slug", (req, res) => {
  // For mock return all
  res.json(horarios);
});

// POST crear horario
app.post("/clubs/horarios", (req, res) => {
  const p = req.body || {};
  const v = validateHorarioPayload(p);
  if (!v.ok) return res.status(400).json({ message: v.message });

  const nuevo = {
    id: nextId++,
    dia: p.dia,
    horaInicio: p.horaInicio,
    horaFin: p.horaFin,
    ubicacion: p.ubicacion || "",
    descripcion: p.descripcion || "",
    grupoId: p.grupoId || null,
    categoria: p.categoria || null,
    activo: true,
    created_at: new Date().toISOString(),
  };
  horarios.push(nuevo);
  res.status(201).json(nuevo);
});

// PUT actualizar horario
app.put("/clubs/horarios/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = horarios.findIndex((h) => h.id === id);
  if (idx === -1)
    return res.status(404).json({ message: "Horario no encontrado" });
  const p = req.body || {};
  const v = validateHorarioPayload(p);
  if (!v.ok) return res.status(400).json({ message: v.message });

  horarios[idx] = {
    ...horarios[idx],
    dia: p.dia,
    horaInicio: p.horaInicio,
    horaFin: p.horaFin,
    ubicacion: p.ubicacion || horarios[idx].ubicacion,
    descripcion: p.descripcion || horarios[idx].descripcion,
    grupoId: p.grupoId !== undefined ? p.grupoId : horarios[idx].grupoId,
    categoria:
      p.categoria !== undefined ? p.categoria : horarios[idx].categoria,
  };
  res.json(horarios[idx]);
});

// GET deportistas
app.get("/clubs/deportistas", (req, res) => {
  res.json(deportistas);
});

// PUT assign deportista to group
app.put("/clubs/deportistas/:id/grupo", (req, res) => {
  const id = Number(req.params.id);
  const deportista = deportistas.find((d) => d.id === id);
  if (!deportista)
    return res.status(404).json({ message: "Deportista no encontrado" });
  deportista.grupoId = req.body.grupoId || null;
  res.json(deportista);
});

// PUT assign deportista to category
app.put("/clubs/deportistas/:id/categoria", (req, res) => {
  const id = Number(req.params.id);
  const deportista = deportistas.find((d) => d.id === id);
  if (!deportista)
    return res.status(404).json({ message: "Deportista no encontrado" });
  deportista.categoriaId = req.body.categoriaId || null;
  res.json(deportista);
});

// GET categories
app.get("/clubs/categories", (req, res) => {
  res.json(categories);
});

// GET groups
app.get("/clubs/groups", (req, res) => {
  res.json(groups);
});

// DELETE horario
app.delete("/clubs/horarios/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = horarios.findIndex((h) => h.id === id);
  if (idx === -1)
    return res.status(404).json({ message: "Horario no encontrado" });
  horarios.splice(idx, 1);
  res.json({ message: "eliminado" });
});

const getGroupDeportistas = (groupId) =>
  deportistas
    .filter((d) => String(d.grupoId) === String(groupId))
    .map(({ id, nombre }) => ({ id, nombre }));

const getPanelGroups = () =>
  groups.map((group) => ({
    ...group,
    deportistas: getGroupDeportistas(group.id),
    sesiones: [],
    horarios: horarios.filter((h) => String(h.grupoId) === String(group.id)),
  }));

// Simple entrenador panel endpoint
app.get("/entrenador/panel", (req, res) => {
  res.json({
    grupos: getPanelGroups(),
    deportistas,
    categorias: categories,
    sesiones: [],
    actividades: [],
    asistencia: [],
    rendimiento: [],
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Mock backend listening on port ${port}`));
