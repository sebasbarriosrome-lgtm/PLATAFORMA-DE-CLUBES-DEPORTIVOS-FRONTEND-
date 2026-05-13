import { Link } from "react-router-dom";

export default function ClubCard({ club }) {
  const getStateBadgeColor = (state) => {
    const colors = {
      activo: "text-emerald-700 bg-emerald-100",
      pendiente: "text-amber-700 bg-amber-100",
      inactivo: "text-red-700 bg-red-100",
      suspendido: "text-red-700 bg-red-100",
    };
    return colors[state?.toLowerCase()] || "text-slate-700 bg-slate-100";
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      {/* Banner/Imagen */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-200">
        {club.banner_url ? (
          <img
            src={club.banner_url}
            alt={club.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <span className="text-4xl">🏟</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="space-y-4 p-5">
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{club.nombre}</h3>
            <p className="text-sm text-slate-600">{club.ciudad}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${getStateBadgeColor(club.estado)}`}
          >
            {club.estado?.charAt(0).toUpperCase() + club.estado?.slice(1)}
          </span>
        </div>

        {/* Descripción */}
        <p className="text-sm text-slate-600 line-clamp-2">
          {club.descripcion}
        </p>

        {/* Metadata */}
        <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
          {club.ciudad && (
            <p className="flex items-center gap-2">
              <span>📍</span>
              <span>{club.ciudad}</span>
            </p>
          )}
          {club.contacto && (
            <p className="flex items-center gap-2">
              <span>📞</span>
              <span>{club.contacto}</span>
            </p>
          )}
        </div>

        {/* Botón */}
        <Link
          to={`/template/${club.slug}`}
          className="block w-full rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Ver club
        </Link>
      </div>
    </article>
  );
}
