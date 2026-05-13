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
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 font-black text-blue-600"
          >
            <div className="h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center">
              CZ
            </div>
            ClubZone
          </Link>

          <nav className="flex gap-4 text-sm text-slate-600">
            <Link to="/clubs" className="hover:text-slate-900">
              Explorar
            </Link>
            <Link
              to="/crear-club"
              state={{ from: "clubs" }}
              className="hover:text-slate-900"
            >
              Crear club
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-4xl font-extrabold">Directorio de clubes</h1>
          <p className="mt-2 text-slate-600">
            Encuentra clubes deportivos disponibles.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3"
            >
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3"
            >
              {sports.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3"
            >
              {states.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </section>

        {/* CARDS */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clubsFiltered.map((club) => (
            <article
              key={club.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                src={club.image}
                className="h-44 w-full object-cover"
                alt={club.name}
              />

              <div className="p-5">
                <div className="flex justify-between">
                  <h2 className="font-bold text-lg">{club.name}</h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${stateClasses[club.state]}`}
                  >
                    {club.state}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  {club.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span>{club.city}</span>
                  <span>•</span>
                  <span>{club.categories.join(" / ")}</span>
                  <span>•</span>
                  <span>{club.staff} entrenadores</span>
                </div>

                <button className="mt-4 w-full rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700">
                  Ver club
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
