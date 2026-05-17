import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CrearClub from "./pages/CrearClub";
import Clubs from "./pages/Directorio";
import UserProfile from "./pages/UserProfile";
import VistaClub from "./pages/VistaClub";
import PanelClub from "./pages/PanelClub";
import ProtectedRoute from "./components/ProtectedRoute";

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white text-slate-900">
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/80"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute right-10 top-20 h-36 w-36 rounded-full bg-blue-100/60 blur-2xl" />
      <div className="pointer-events-none absolute left-8 bottom-16 h-44 w-44 rounded-full bg-blue-100/50 blur-2xl" />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* ---------------- HEADER ---------------- */}
        <header className="container mx-auto flex items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-400 text-sm font-extrabold text-slate-900">
              CZ
            </div>
            <span className="text-xl font-black tracking-tight">ClubZone</span>
          </div>

          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex">
            <a href="#features" className="hover:text-slate-900 transition">
              Funciones
            </a>
            <a href="#testimonials" className="hover:text-slate-900 transition">
              Próximamente
            </a>

            <Link
              to="/register"
              state={{ from: "landing" }}
              className="hover:text-slate-900 transition"
            >
              Registrarse
            </Link>

            <Link
              to="/login"
              state={{ from: "landing" }}
              className="hover:text-slate-900 transition"
            >
              Iniciar sesión
            </Link>

            <Link
              to="/crear-club"
              state={{ from: "landing" }}
              className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              Crear mi club
            </Link>
          </nav>

          <button className="md:hidden rounded-lg border border-blue-600 px-3 py-2 text-sm text-blue-600 hover:bg-blue-600 hover:text-white transition">
            Menú
          </button>
        </header>

        {/* ---------------- HERO ---------------- */}
        <main className="container mx-auto flex flex-1 flex-col justify-center px-6 py-12 sm:px-8 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
              Software para clubes deportivos
            </span>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Gestiona tu club deportivo{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                de forma integral
              </span>
            </h1>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="/register"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200/40 transition hover:from-blue-700 hover:to-blue-800"
              >
                Comenzar gratis
              </a>

              <a
                href="/clubs"
                className="rounded-xl border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Explorar clubes
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white/90 px-4 py-3 text-left shadow-sm shadow-slate-200/50">
                <p className="text-xs uppercase tracking-widest text-blue-600">
                  Todo en uno
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Planificación, cuotas y miembros
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white/90 px-4 py-3 text-left shadow-sm shadow-slate-200/50">
                <p className="text-xs uppercase tracking-widest text-blue-600">
                  Rápido
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Configura tu espacio en minutos
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white/90 px-4 py-3 text-left shadow-sm shadow-slate-200/50">
                <p className="text-xs uppercase tracking-widest text-blue-600">
                  Seguro
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Datos protegidos siempre
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white/60 px-4 py-3 text-left border border-slate-200">
                <p className="text-xs uppercase tracking-widest text-blue-600">
                  +coming soon
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  Crecimiento rápido
                </p>
              </div>

              <div className="rounded-xl bg-white/60 px-4 py-3 text-left border border-slate-200">
                <p className="text-xs uppercase tracking-widest text-blue-600">
                  99.9% uptime
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  Disponibilidad total
                </p>
              </div>
            </div>
          </div>
        </main>

        <section id="features" className="container mx-auto px-6 py-12 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Lo que incluye
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600 sm:text-base">
              Todo lo que tu club necesita para operar con eficiencia:
              asistencia, entrenamiento y análisis en un solo lugar.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {/* Tarjeta 1 */}
              <article className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  🏟
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  Gestión de clubes
                </h3>
                <p className="text-sm text-slate-600">
                  Crea y administra categorías y horarios.
                </p>
              </article>

              {/* Tarjeta 2 */}
              <article className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  📊
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  Análisis en tiempo real
                </h3>
                <p className="text-sm text-slate-600">
                  Asistencia y estadísticas de desempeño por atleta y categoría.
                </p>
              </article>

              {/* Tarjeta 3 */}
              <article className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  🎨
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  Experiencia visual moderna
                </h3>
                <p className="text-sm text-slate-600">
                  Diseño moderno y responsivo para una mejor experiencia de
                  usuario.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ---------------- PROXIMAMENTE ---------------- */}
        <section
          id="testimonials"
          className="container mx-auto px-6 py-12 sm:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Próximamente
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600 sm:text-base">
              Estamos en fase de lanzamiento inicial con pilotos selectos y
              mejoras continuas. Únete ahora y sé parte del primer grupo que
              pruebe la plataforma antes de la apertura general.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-blue-600">
                  Programa Early Access
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Participa como usuario preferente y explora las herramientas
                  más importantes desde el primer día.
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-blue-600">
                  Aporte al roadmap
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Colabora en la definición de futuras funciones para
                  entrenadores y gestores deportivos.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ---------------- FOOTER ---------------- */}
        <footer className="border-t border-slate-200 bg-slate-50 px-6 py-7 text-center text-sm text-slate-600 sm:px-8">
          © {new Date().getFullYear()} ClubDeportivo. Soluciones de gestión para
          el deporte.
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 PUBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/clubs" element={<Clubs />} />

        {/* ✅ SOLO ESTA */}
        <Route path="/clubs/:id" element={<VistaClub />} />

        {/* 🔐 PROTEGIDAS */}
        <Route
          path="/crear-club"
          element={
            <ProtectedRoute>
              <CrearClub />
            </ProtectedRoute>
          }
        />

        <Route
          path="/panel-club"
          element={
            <ProtectedRoute>
              <PanelClub />
            </ProtectedRoute>
          }
        />

        <Route
          path="/UserProfile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* EVITA PANTALLA BLANCA */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
