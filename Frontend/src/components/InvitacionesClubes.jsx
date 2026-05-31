export default function InvitacionesClubes({
  invitaciones = [],
  loading = false,
  onAccept = () => {},
  onReject = () => {},
}) {
  const hasInvitaciones = invitaciones.length > 0;

  return (
    <section className="bg-white rounded-[28px] shadow p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Invitaciones recibidas
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Aquí verás las invitaciones que te envían los clubes deportivos.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Cargando invitaciones...</div>
      ) : hasInvitaciones ? (
        <div className="space-y-4">
          {invitaciones.map((item) => {
            const fecha = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Fecha de invitación";

            const estado = item.estado || item.status || "pendiente";
            const mensaje =
              item.mensaje ||
              `Has sido invitado por el club ${item.clubName || "este club"}`;

            return (
              <div
                key={item.id ?? item._id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.clubName || "Club deportivo"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Invitación recibida el {fecha}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {estado}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-3xl bg-white p-4 text-sm text-slate-500 shadow-sm">
                    <p className="font-semibold text-slate-900">Mensaje</p>
                    <p className="mt-2 text-sm text-slate-500">{mensaje}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        label: "Rol solicitado",
                        value: item.rol || "No especificado",
                      },
                      { label: "Estado", value: estado },
                      { label: "Tipo", value: "Invitación" },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="rounded-3xl border border-slate-200 bg-white p-4 text-sm shadow-sm"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                          {label}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {estado.toLowerCase() === "pendiente" && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => onReject(item.id)}
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                      >
                        Rechazar
                      </button>
                      <button
                        type="button"
                        onClick={() => onAccept(item)}
                        className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                      >
                        Aceptar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          No tienes invitaciones por el momento.
        </div>
      )}
    </section>
  );
}
