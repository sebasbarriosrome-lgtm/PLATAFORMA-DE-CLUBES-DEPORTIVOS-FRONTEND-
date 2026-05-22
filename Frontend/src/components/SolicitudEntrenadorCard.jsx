function CardField({ label, value }) {
  return (
    <div className="bg-slate-50 p-3 rounded-lg">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}

export default function SolicitudEntrenadorCard({ s, onAction }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5 shadow-sm bg-white">
      <div className="flex justify-between mb-3">
        <p className="font-semibold">{s.nombre}</p>
        <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-600">
          {s.estado}
        </span>
      </div>

      <p className="text-sm text-slate-500 mb-3">{s.mensaje}</p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <CardField label="Especialidad" value={s.especialidad} />
        <CardField label="Experiencia" value={s.experiencia} />
        <CardField label="Edad" value={s.edad} />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => onAction(s.id, "rechazado")}
          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
        >
          Rechazar
        </button>

        <button
          onClick={() => onAction(s.id, "aceptado")}
          className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded hover:bg-green-200"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
