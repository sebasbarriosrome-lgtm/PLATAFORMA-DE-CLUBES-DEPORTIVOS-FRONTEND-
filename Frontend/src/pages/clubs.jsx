import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CLUBS_SEED = [
  {
    id: 1,
    name: "Club Atlético Velocidad",
    city: "Madrid",
    sport: "Atletismo",
    state: "Activo",
    staff: 2,
    categories: ["Iniciación", "Juvenil"],
    description:
      "Club de atletismo enfocado en formación deportiva integral desde categorías infantiles hasta alta competencia.",
    image:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
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

const stateClasses = {
  Activo: "text-emerald-700 bg-emerald-100",
  Pendiente: "text-amber-700 bg-amber-100",
  Cerrado: "text-red-700 bg-red-100",
};

export default function Clubs() {
  const [searchText, setSearchText] = useState("");
  const [cityFilter, setCityFilter] = useState("Todas las ciudades");
  const [sportFilter, setSportFilter] = useState("Todos los deportes");
  const [stateFilter, setStateFilter] = useState("Todos los estados");

  const cities = useMemo(
    () => ["Todas las ciudades", ...new Set(CLUBS_SEED.map((c) => c.city))],
    [],
  );
  const sports = useMemo(
    () => ["Todos los deportes", ...new Set(CLUBS_SEED.map((c) => c.sport))],
    [],
  );
  const states = useMemo(
    () => ["Todos los estados", ...new Set(CLUBS_SEED.map((c) => c.state))],
    [],
  );

  const clubsFiltered = useMemo(() => {
    return CLUBS_SEED.filter((club) => {
      const matchesSearch =
        searchText.trim() === "" ||
        [club.name, club.description, club.sport, club.city]
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase());

      const matchesCity =
        cityFilter === "Todas las ciudades" || club.city === cityFilter;
      const matchesSport =
        sportFilter === "Todos los deportes" || club.sport === sportFilter;
      const matchesState =
        stateFilter === "Todos los estados" || club.state === stateFilter;

      return matchesSearch && matchesCity && matchesSport && matchesState;
    });
  }, [searchText, cityFilter, sportFilter, stateFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-black text-emerald-300"
          >
            <div className="h-9 w-9 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-black">
              CZ
            </div>
            ClubZone
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
            <Link className="hover:text-white" to="/clubs">
              Explorar clubes
            </Link>
            <Link
              className="hover:text-white"
              to="/crear-club"
              state={{ from: "clubs" }}
            >
              Crear mi club
            </Link>
            <Link
              className="hover:text-white"
              to="/register"
              state={{ from: "clubs" }}
            >
              Registrarse
            </Link>
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

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Directorio de clubes
          </h1>
          <p className="mt-2 text-slate-300">
            Descubre clubes deportivos, explora sus categorías y solicita tu
            inscripción.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <input
              placeholder="Buscar por nombre o categoría..."
              className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
            />

            <select className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30">
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>

            <select className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30">
              {sports.map((sport) => (
                <option key={sport}>{sport}</option>
              ))}
            </select>

            <select className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30">
              {states.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </section>

        {clubsFiltered.length === 0 ? (
          <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-300">
            No se encontraron clubes con los filtros seleccionados.
          </section>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {clubsFiltered.map((club) => (
              <article
                key={club.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/30"
              >
                <div className="relative h-48 overflow-hidden bg-slate-800">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
                    {club.sport}
                  </span>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-white">
                      {club.name}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${stateClasses[club.state]}`}
                    >
                      {club.state}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300">{club.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                      {club.city}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                      {club.categories.join(" • ")}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                      {club.staff} entrenadores
                    </span>
                  </div>

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
