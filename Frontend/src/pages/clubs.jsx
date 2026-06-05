// Importa hooks de React y el componente Link para navegación entre rutas
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Datos iniciales de los clubes deportivos
const CLUBS_SEED = [
  {
    // Identificador único del club
    id: 1,

    // Nombre del club
    name: "Club Atlético Velocidad",

    // Ciudad donde se encuentra el club
    city: "Madrid",

    // Deporte principal del club
    sport: "Atletismo",

    // Estado actual del club
    state: "Activo",

    // Número de entrenadores
    staff: 2,

    // Categorías disponibles
    categories: ["Iniciación", "Juvenil"],

    // Descripción del club
    description:
      "Club de atletismo enfocado en formación deportiva integral desde categorías infantiles hasta alta competencia.",

    // Imagen representativa del club
    image:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",

    // Color de acento personalizado
    accent: "#10B981",
  },
  {
    id: 2,
    name: "Escuela Deportiva Fuerza",
    city: "Barcelona",
    sport: "Multideporte",
    state: "Pendiente",
    staff: 1,
    categories: ["Pre-infantil"],
    description:
      "Escuela multidisciplinar con enfoque en desarrollo físico y técnico para jóvenes deportistas.",
    image:
      "https://images.unsplash.com/photo-1517964603305-10c63ac54f2b?auto=format&fit=crop&w=1200&q=80",
    accent: "#047857",
  },
  {
    id: 3,
    name: "Club Natación Aqua",
    city: "Valencia",
    sport: "Natación",
    state: "Activo",
    staff: 1,
    categories: ["Alevín"],
    description:
      "Club de natación con programas desde iniciación hasta competición federada.",
    image:
      "https://images.unsplash.com/photo-1526401485004-2f6c7d6ac327?auto=format&fit=crop&w=1200&q=80",
    accent: "#0EA5E9",
  },
  {
    id: 4,
    name: "Fútbol Club Aurora",
    city: "Sevilla",
    sport: "Fútbol",
    state: "Cerrado",
    staff: 3,
    categories: ["Infantil", "Cadete"],
    description:
      "Club tradicional que busca consolidar el talento local con metodología moderna.",
    image:
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80",
    accent: "#F43F5E",
  },
];

// Clases CSS según el estado del club
const stateClasses = {
  // Estilo para clubes activos
  Activo: "text-emerald-700 bg-emerald-100",

  // Estilo para clubes pendientes
  Pendiente: "text-amber-700 bg-amber-100",

  // Estilo para clubes cerrados
  Cerrado: "text-red-700 bg-red-100",
};

// Componente principal Clubs
export default function Clubs() {
  // Estado para el texto de búsqueda
  const [searchText, setSearchText] = useState("");

  // Estado para filtrar por ciudad
  const [cityFilter, setCityFilter] = useState("Todas las ciudades");

  // Estado para filtrar por deporte
  const [sportFilter, setSportFilter] = useState("Todos los deportes");

  // Estado para filtrar por estado
  const [stateFilter, setStateFilter] = useState("Todos los estados");

  // Obtiene lista única de ciudades
  const cities = useMemo(
    () => ["Todas las ciudades", ...new Set(CLUBS_SEED.map((c) => c.city))],
    [],
  );

  // Obtiene lista única de deportes
  const sports = useMemo(
    () => ["Todos los deportes", ...new Set(CLUBS_SEED.map((c) => c.sport))],
    [],
  );

  // Obtiene lista única de estados
  const states = useMemo(
    () => ["Todos los estados", ...new Set(CLUBS_SEED.map((c) => c.state))],
    [],
  );

  // Filtra los clubes según los filtros seleccionados
  const clubsFiltered = useMemo(() => {
    return CLUBS_SEED.filter((club) => {
      // Verifica coincidencia con búsqueda
      const matchesSearch =
        searchText.trim() === "" ||
        [club.name, club.description, club.sport, club.city]
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase());

      // Verifica coincidencia con ciudad
      const matchesCity =
        cityFilter === "Todas las ciudades" || club.city === cityFilter;

      // Verifica coincidencia con deporte
      const matchesSport =
        sportFilter === "Todos los deportes" || club.sport === sportFilter;

      // Verifica coincidencia con estado
      const matchesState =
        stateFilter === "Todos los estados" || club.state === stateFilter;

      // Retorna solo los clubes que cumplan todos los filtros
      return matchesSearch && matchesCity && matchesSport && matchesState;
    });
  }, [searchText, cityFilter, sportFilter, stateFilter]);

  // Renderizado del componente
  return (
    // Contenedor principal
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Encabezado fijo */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        {/* Contenedor interno del header */}
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Logo y enlace principal */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-black text-emerald-300"
          >
            {/* Ícono/logo */}
            <div className="h-9 w-9 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-black">
              CZ
            </div>
            {/* Nombre del sitio */}
            ClubZone
          </Link>

          {/* Menú de navegación */}
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
            {/* Enlace a explorar clubes */}
            <Link className="hover:text-white" to="/clubs">
              Explorar clubes
            </Link>

            {/* Enlace para crear club */}
            <Link
              className="hover:text-white"
              to="/crear-club"
              state={{ from: "clubs" }}
            >
              Crear mi club
            </Link>

            {/* Enlace de registro */}
            <Link
              className="hover:text-white"
              to="/register"
              state={{ from: "clubs" }}
            >
              Registrarse
            </Link>

            {/* Enlace de inicio de sesión */}
            <Link
              className="hover:text-white"
              to="/login"
              state={{ from: "clubs" }}
            >
              Iniciar sesión
            </Link>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        {/* Sección superior con filtros */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
          {/* Título principal */}
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Directorio de clubes
          </h1>

          {/* Descripción */}
          <p className="mt-2 text-slate-300">
            Descubre clubes deportivos, explora sus categorías y solicita tu
            inscripción.
          </p>

          {/* Contenedor de filtros */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {/* Campo de búsqueda */}
            <input
              placeholder="Buscar por nombre o categoría..."
              className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
            />

            {/* Selector de ciudades */}
            <select className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30">
              {/* Renderiza ciudades */}
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>

            {/* Selector de deportes */}
            <select className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30">
              {/* Renderiza deportes */}
              {sports.map((sport) => (
                <option key={sport}>{sport}</option>
              ))}
            </select>

            {/* Selector de estados */}
            <select className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30">
              {/* Renderiza estados */}
              {states.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Verifica si hay clubes filtrados */}
        {clubsFiltered.length === 0 ? (
          // Mensaje cuando no hay resultados
          <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-300">
            No se encontraron clubes con los filtros seleccionados.
          </section>
        ) : (
          // Grid de clubes
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Recorre clubes filtrados */}
            {clubsFiltered.map((club) => (
              // Tarjeta individual del club
              <article
                key={club.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/30"
              >
                {/* Imagen principal */}
                <div className="relative h-48 overflow-hidden bg-slate-800">
                  {/* Imagen del club */}
                  <img
                    src={club.image}
                    alt={club.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Etiqueta del deporte */}
                  <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
                    {club.sport}
                  </span>
                </div>

                {/* Información del club */}
                <div className="p-5">
                  {/* Nombre y estado */}
                  <div className="mb-3 flex items-center justify-between gap-3">
                    {/* Nombre del club */}
                    <h2 className="text-xl font-bold text-white">
                      {club.name}
                    </h2>

                    {/* Estado del club */}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${stateClasses[club.state]}`}
                    >
                      {club.state}
                    </span>
                  </div>

                  {/* Descripción */}
                  <p className="text-sm text-slate-300">{club.description}</p>

                  {/* Etiquetas adicionales */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {/* Ciudad */}
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                      {club.city}
                    </span>

                    {/* Categorías */}
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                      {club.categories.join(" • ")}
                    </span>

                    {/* Número de entrenadores */}
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                      {club.staff} entrenadores
                    </span>
                  </div>

                  {/* Botón para ver detalles */}
                  <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-center text-sm font-semibold text-slate-950 transition hover:opacity-95">
                    Ver club
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
