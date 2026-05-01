// Importa los estilos globales de la aplicación
import "./App.css";

// Importa componentes de React Router para manejar rutas y navegación
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Importa las páginas del proyecto
import Login from "./pages/Login";
import Register from "./pages/Register";
import CrearClub from "./pages/CrearClub";
import Clubs from "./pages/Clubs";

// Componente principal de la página de inicio
function LandingPage() {
  // Renderizado del componente
  return (
    // Contenedor principal de pantalla completa
    <div className="relative min-h-screen bg-slate-950 text-white">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1728&q=80')] bg-cover bg-center filter brightness-75"
        aria-hidden="true"
      />

      {/* Capa oscura sobre la imagen */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/95"
        aria-hidden="true"
      />

      {/* Contenido principal */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* ---------------- HEADER ---------------- */}

        {/* Encabezado principal */}
        <header className="container mx-auto flex items-center justify-between px-6 py-4 sm:px-8">
          {/* Logo y nombre */}
          <div className="flex items-center gap-2">
            {/* Icono del logo */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 text-sm font-extrabold text-slate-900">
              CZ
            </div>

            {/* Nombre de la plataforma */}
            <span className="text-xl font-black tracking-tight">ClubZone</span>
          </div>

          {/* Menú de navegación escritorio */}
          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-100 md:flex">
            {/* Enlace a funciones */}
            <a href="#features" className="hover:text-white transition">
              Funciones
            </a>

            {/* Enlace a sección próximamente */}
            <a href="#testimonials" className="hover:text-white transition">
              Próximamente
            </a>

            {/* Enlace a registro */}
            <Link
              to="/register"
              state={{ from: "landing" }}
              className="hover:text-white transition"
            >
              Registrarse
            </Link>

            {/* Enlace a login */}
            <Link
              to="/login"
              state={{ from: "landing" }}
              className="hover:text-white transition"
            >
              Iniciar sesión
            </Link>

            {/* Enlace para crear club */}
            <Link
              to="/crear-club"
              state={{ from: "landing" }}
              className="rounded-lg border border-emerald-400 px-4 py-2 text-emerald-100 hover:bg-emerald-400 hover:text-slate-950 transition"
            >
              Crear mi club
            </Link>
          </nav>

          {/* Botón menú móvil */}
          <button className="md:hidden rounded-lg border border-emerald-400 px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-400 hover:text-slate-950 transition">
            Menú
          </button>
        </header>

        {/* ---------------- HERO ---------------- */}

        {/* Sección principal */}
        <main className="container mx-auto flex flex-1 flex-col justify-center px-6 py-16 sm:px-8 md:py-24">
          {/* Contenedor centrado */}
          <div className="mx-auto max-w-3xl text-center">
            {/* Etiqueta superior */}
            <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-200">
              Software para clubes deportivos
            </span>

            {/* Título principal */}
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              {/* Texto principal */}
              Gestiona tu club deportivo {/* Texto resaltado */}
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
                de forma integral
              </span>
            </h1>

            {/* Botones principales */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {/* Botón registro */}
              <a
                href="/register"
                className="rounded-xl bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400"
              >
                Comenzar gratis
              </a>

              {/* Botón explorar clubes */}
              <a
                href="/clubs"
                className="rounded-xl border border-white/30 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explorar clubes
              </a>
            </div>

            {/* Estadísticas o indicadores */}
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {/* Indicador 1 */}
              <div className="rounded-xl bg-slate-900/50 px-4 py-3 text-left">
                {/* Texto pequeño */}
                <p className="text-xs uppercase tracking-widest text-emerald-300">
                  +coming soon
                </p>

                {/* Texto principal */}
                <p className="text-2xl font-bold">Crecimiento rápido</p>
              </div>

              {/* Indicador 2 */}
              <div className="rounded-xl bg-slate-900/50 px-4 py-3 text-left">
                {/* Texto pequeño */}
                <p className="text-xs uppercase tracking-widest text-emerald-300">
                  99.9% uptime
                </p>

                {/* Texto principal */}
                <p className="text-2xl font-bold">Disponibilidad total</p>
              </div>
            </div>
          </div>
        </main>

        {/* ---------------- FEATURES ---------------- */}

        {/* Sección de funcionalidades */}
        <section id="features" className="container mx-auto px-6 py-16 sm:px-8">
          {/* Contenedor */}
          <div className="mx-auto max-w-6xl">
            {/* Título */}
            <h2 className="text-center text-3xl font-extrabold text-white sm:text-4xl">
              Lo que incluye
            </h2>

            {/* Descripción */}
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-300 sm:text-base">
              Todo lo que tu club necesita para operar con eficiencia:
              asistencia, entrenamiento y análisis en un solo lugar.
            </p>

            {/* Tarjetas */}
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {/* Tarjeta 1 */}
              <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-slate-800/80">
                {/* Ícono */}
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                  🏟
                </div>

                {/* Título */}
                <h3 className="mb-2 text-lg font-bold">Gestión de clubes</h3>

                {/* Descripción */}
                <p className="text-sm text-slate-300">
                  Crea y administra categorías y horarios.
                </p>
              </article>

              {/* Tarjeta 2 */}
              <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-slate-800/80">
                {/* Ícono */}
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                  📊
                </div>

                {/* Título */}
                <h3 className="mb-2 text-lg font-bold">
                  Análisis en tiempo real
                </h3>

                {/* Descripción */}
                <p className="text-sm text-slate-300">
                  Asistencia y estadísticas de desempeño por atleta y categoría.
                </p>
              </article>

              {/* Tarjeta 3 */}
              <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-slate-800/80">
                {/* Ícono */}
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                  🎨
                </div>

                {/* Título */}
                <h3 className="mb-2 text-lg font-bold">
                  Experiencia visual moderna
                </h3>

                {/* Descripción */}
                <p className="text-sm text-slate-300">
                  Diseño moderno y responsivo para una mejor experiencia de
                  usuario.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ---------------- PROXIMAMENTE ---------------- */}

        {/* Sección de próximos lanzamientos */}
        <section
          id="testimonials"
          className="container mx-auto px-6 py-16 sm:px-8"
        >
          {/* Contenedor */}
          <div className="mx-auto max-w-6xl">
            {/* Título */}
            <h2 className="text-center text-3xl font-extrabold text-white sm:text-4xl">
              Próximamente
            </h2>

            {/* Texto descriptivo */}
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-300 sm:text-base">
              Estamos en fase de lanzamiento inicial con pilotos selectos y
              mejoras continuas. Únete ahora y sé parte del primer grupo que
              pruebe la plataforma antes de la apertura general.
            </p>

            {/* Tarjetas */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {/* Tarjeta Early Access */}
              <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                {/* Título */}
                <h3 className="text-lg font-bold text-emerald-200">
                  Programa Early Access
                </h3>

                {/* Descripción */}
                <p className="mt-2 text-sm text-slate-300">
                  Participa como usuario preferente y explora las herramientas
                  más importantes desde el primer día.
                </p>
              </article>

              {/* Tarjeta roadmap */}
              <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                {/* Título */}
                <h3 className="text-lg font-bold text-emerald-200">
                  Aporte al roadmap
                </h3>

                {/* Descripción */}
                <p className="mt-2 text-sm text-slate-300">
                  Colabora en la definición de futuras funciones para
                  entrenadores y gestores deportivos.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ---------------- FOOTER ---------------- */}

        {/* Pie de página */}
        <footer className="border-t border-white/10 bg-slate-950/80 px-6 py-7 text-center text-sm text-slate-400 sm:px-8">
          {/* Texto del footer */}© {new Date().getFullYear()} ClubDeportivo.
          Soluciones de gestión para el deporte.
          {/* Separador */}
          <span className="mx-2">•</span>
          {/* Enlace privacidad */}
          <a href="#" className="text-emerald-300 hover:text-emerald-200">
            Privacidad
          </a>
          {/* Separador */}
          <span className="mx-2">•</span>
          {/* Enlace términos */}
          <a href="#" className="text-emerald-300 hover:text-emerald-200">
            Términos
          </a>
        </footer>
      </div>
    </div>
  );
}

// Componente principal App
function App() {
  // Configuración de rutas
  return (
    <BrowserRouter>
      {/* Contenedor de rutas */}
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<LandingPage />} />

        {/* Ruta login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta registro */}
        <Route path="/register" element={<Register />} />

        {/* Ruta crear club */}
        <Route path="/crear-club" element={<CrearClub />} />

        {/* Ruta explorar clubes */}
        <Route path="/clubs" element={<Clubs />} />
      </Routes>
    </BrowserRouter>
  );
}

// Exporta el componente App
export default App;
