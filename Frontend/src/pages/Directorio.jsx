import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { clubsService } from "../services/clubs.service";

const stateClasses = {
  activo: "text-emerald-700 bg-emerald-100",
  pendiente: "text-amber-700 bg-amber-100",
  inactivo: "text-red-700 bg-red-100",
  suspendido: "text-red-700 bg-red-100",
};

export default function Directorio() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [cityFilter, setCityFilter] = useState("Todas las ciudades");
  const [stateFilter, setStateFilter] = useState("Todos los estados");

  // LLAMADA AL BACKEND
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const data = await clubsService.getAll();
        setClubs(data);
      } catch (error) {
        console.error("Error cargando clubs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // FILTROS DINÁMICOS
  const cities = useMemo(() => {
    return ["Todas las ciudades", ...new Set(clubs.map((c) => c.ciudad))];
  }, [clubs]);

  const states = useMemo(() => {
    return ["Todos los estados", ...new Set(clubs.map((c) => c.estado))];
  }, [clubs]);

  const clubsFiltered = useMemo(() => {
    return clubs.filter((club) => {
      const matchesSearch =
        searchText.trim() === "" ||
        [club.nombre, club.descripcion, club.ciudad]
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase());

      const matchesCity =
        cityFilter === "Todas las ciudades" || club.ciudad === cityFilter;

      const matchesState =
        stateFilter === "Todos los estados" || club.estado === stateFilter;

      return matchesSearch && matchesCity && matchesState;
    });
  }, [clubs, searchText, cityFilter, stateFilter]);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Cargando clubes...</p>
      </div>
    );
  }

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
            <Link to="/crear-club" className="hover:text-slate-900">
              Crear club
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        {/* FILTROS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-4xl font-extrabold">Directorio de clubes</h1>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
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
        <section>
          {clubsFiltered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {clubsFiltered.map((club) => (
                <article
                  key={club.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={club.bannerUrl || "https://via.placeholder.com/400"}
                    className="h-44 w-full object-cover"
                    alt={club.nombre}
                  />

                  <div className="p-5">
                    <div className="flex justify-between">
                      <h2 className="font-bold text-lg">{club.nombre}</h2>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          stateClasses[club.estado]
                        }`}
                      >
                        {club.estado}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {club.descripcion}
                    </p>

                    <div className="mt-3 text-xs text-slate-500">
                      📍 {club.ciudad}
                    </div>

                    <Link
                      to={`/template/${club.slug}`}
                      className="mt-4 block w-full rounded-xl bg-blue-600 py-2 text-center text-white hover:bg-blue-700 transition"
                    >
                      Ver club
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
              <p className="text-lg font-semibold">No hay clubes disponibles</p>
              <p className="mt-2 text-slate-600">Sé el primero en crear uno</p>

              <Link
                to="/crear-club"
                className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                Crear club
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
