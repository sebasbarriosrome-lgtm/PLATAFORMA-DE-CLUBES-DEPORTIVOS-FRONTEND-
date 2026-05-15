import { Link, useLocation } from "react-router-dom";

export default function VistaClub() {
  const location = useLocation();
  const club = location.state?.club || {};
  const categories = club.categories || [];
  const coaches = club.coaches || [];
  const schedule = club.schedule || [];
  const social = club.social || [];
  const initials = club.name
    ? club.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CD";
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link
            to="/"
            className="flex items-center gap-3 text-lg font-black text-blue-600"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
              CD
            </div>
            ClubDeportivo
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link to="/clubs" className="hover:text-slate-900 transition">
              Explorar clubes
            </Link>
            <Link to="/login" className="hover:text-slate-900 transition">
              Iniciar sesión
            </Link>
            <Link
              to="/crear-club"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200/50 transition hover:bg-blue-700"
            >
              Crear mi club
            </Link>
          </nav>
        </div>
      </header>

      <main className="space-y-10 pb-16">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 px-4 py-10 sm:py-14">
          <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 rounded-full bg-blue-100/80 blur-3xl" />
          <div className="pointer-events-none absolute right-0 bottom-0 h-56 w-56 rounded-full bg-slate-200/80 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-xl backdrop-blur-sm sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-3xl font-bold text-blue-700">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-blue-600">
                        Club deportivo
                      </p>
                      <h1 className="mt-2 text-4xl font-extrabold text-slate-900 sm:text-5xl">
                        {club.name || "Club deportivo"}
                      </h1>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                        Ciudad
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {club.location || "-"}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                        Deporte
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {club.sport || "-"}
                      </p>
                    </div>
                  </div>

                  <p className="max-w-2xl text-base leading-7 text-slate-600">
                    {club.tagline || "Descripción del club no disponible."}
                  </p>
                </div>

                <div className="rounded-[1.75rem] bg-blue-700 p-8 text-white shadow-xl">
                  <p className="text-sm uppercase tracking-[0.25em] text-blue-200/80">
                    Estado del club
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl">
                      🏃
                    </span>
                    <div>
                      <p className="text-sm text-blue-100">Equipo</p>
                      <p className="mt-1 text-2xl font-semibold">
                        Entrenadores expertos
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="rounded-3xl bg-white/10 p-4">
                      <p className="text-sm text-blue-100/90">
                        Solicita inscripción
                      </p>
                      <p className="mt-1 text-lg font-semibold">Únete hoy</p>
                    </div>
                    <div className="rounded-3xl bg-white/10 p-4">
                      <p className="text-sm text-blue-100/90">
                        Clases semanales
                      </p>
                      <p className="mt-1 text-lg font-semibold">4 sesiones</p>
                    </div>
                  </div>

                  <button className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
                    Solicitar inscripción
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Información
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {club.tagline || "Descripción del club no disponible."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    Dirección
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {club.address || "-"}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    Teléfono
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {club.phone || "-"}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    Email
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {club.email || "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-blue-600 p-5 text-white">
                <p className="text-sm uppercase tracking-[0.25em] text-blue-100/80">
                  Redes sociales
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {social.length > 0 ? (
                    social.map((network) => (
                      <span
                        key={network}
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm"
                      >
                        {network}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-slate-500">
                      Sin redes sociales
                    </span>
                  )}
                </div>
              </div>
            </aside>

            <div className="space-y-8">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                      Sobre nosotros
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                      Somos un club con trayectoria
                    </h2>
                  </div>
                  <div className="rounded-3xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                    Compromiso deportivo
                  </div>
                </div>
                <p className="mt-6 text-slate-600 leading-7">
                  {club.description ||
                    "Trabajamos con atletas jóvenes para impulsar su desarrollo físico y técnico a través de entrenamiento personalizado."}
                </p>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">
                  Categorías
                </h2>
                <div className="mt-6 space-y-4">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <div
                        key={category.name}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                              {category.name}
                            </p>
                            <p className="mt-1 text-lg font-semibold text-slate-900">
                              Edad {category.age}
                            </p>
                          </div>
                          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                            Coach {category.coach}
                          </span>
                        </div>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {category.schedule?.map((entry) => (
                            <div
                              key={entry}
                              className="rounded-2xl bg-white p-3 text-sm text-slate-600 shadow-sm"
                            >
                              {entry}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-500">
                      No hay categorías disponibles.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                      Nuestros entrenadores
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                      Equipo técnico
                    </h2>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {coaches.length > 0 ? (
                    coaches.map((coach) => (
                      <div
                        key={coach.name}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                            {coach.name
                              ?.split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {coach.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {coach.specialty}
                            </p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-600">
                          Nivel {coach.level}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-500">
                      No hay entrenadores disponibles.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                      Horarios de entrenamiento
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                      Semana
                    </h2>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {schedule.length > 0 ? (
                    schedule.map((entry) => (
                      <div
                        key={`${entry.day}-${entry.time}`}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {entry.day}
                          </p>
                          <p className="text-sm text-slate-500">
                            {entry.category}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                          {entry.time}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-500">
                      No hay horarios disponibles.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
