const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let nextId = 1;
const horarios = [];

const validDias = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];

// Helper to validate horario payload
function validateHorarioPayload(p) {
  if (!p.dia || !validDias.includes(p.dia)) return { ok: false, message: 'dia inválido' };
  if (!p.horaInicio || !p.horaFin) return { ok: false, message: 'horas inválidas' };
  return { ok: true };
}

// GET all horarios
app.get('/clubs/horarios', (req, res) => {
  res.json(horarios);
});

// GET horarios by slug (optional)
app.get('/clubs/horarios/slug/:slug', (req, res) => {
  // For mock return all
  res.json(horarios);
});

// POST crear horario
app.post('/clubs/horarios', (req, res) => {
  const p = req.body || {};
  const v = validateHorarioPayload(p);
  if (!v.ok) return res.status(400).json({ message: v.message });

  const nuevo = {
    id: nextId++,
    dia: p.dia,
    horaInicio: p.horaInicio,
    horaFin: p.horaFin,
    ubicacion: p.ubicacion || '',
    descripcion: p.descripcion || '',
    grupoId: p.grupoId || null,
    categoria: p.categoria || null,
    activo: true,
    created_at: new Date().toISOString(),
  };
  horarios.push(nuevo);
  res.status(201).json(nuevo);
});

// PUT actualizar horario
app.put('/clubs/horarios/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = horarios.findIndex(h => h.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Horario no encontrado' });
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
    categoria: p.categoria !== undefined ? p.categoria : horarios[idx].categoria,
  };
  res.json(horarios[idx]);
});

// DELETE horario
app.delete('/clubs/horarios/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = horarios.findIndex(h => h.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Horario no encontrado' });
  horarios.splice(idx, 1);
  res.json({ message: 'eliminado' });
});

// Simple entrenador panel endpoint
app.get('/entrenador/panel', (req, res) => {
  // Return mock groups, sesiones, horarios, actividades, asistencia, rendimiento
  const grupos = [
    {
      id: 1,
      nombre: 'Equipo A',
      categoria: 'Sub-18',
      deportistas: [
        { id: 101, nombre: 'Ana Pérez' },
        { id: 102, nombre: 'Luis Gómez' },
      ],
      sesiones: [],
      horarios: horarios.filter(h => h.grupoId === 1),
    },
  ];

  res.json({
    grupos,
    sesiones: [],
    actividades: [],
    asistencia: [],
    rendimiento: [],
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Mock backend listening on port ${port}`));
