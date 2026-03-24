
import './App.css'

function App() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1728&q=80')] bg-cover bg-center filter brightness-75"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/95" aria-hidden="true" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="container mx-auto flex items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 text-sm font-extrabold text-slate-900">CZ</div>
            <span className="text-xl font-black tracking-tight">ClubZone</span>
          </div>

          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-100 md:flex">
            <a href="#features" className="hover:text-white transition">Funciones</a>
            <a href="#testimonials" className="hover:text-white transition">Proximamente</a>
            <a href="#" className="rounded-lg border border-emerald-400 px-4 py-2 text-emerald-100 hover:bg-emerald-400 hover:text-slate-950 transition">Crear mi club</a>
            <a href="#features" className="hover:text-white transition">Registrarse</a>
            <a href="#features" className="hover:text-white transition">Iniciar sesion </a>
          </nav>

          <button className="md:hidden rounded-lg border border-emerald-400 px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-400 hover:text-slate-950 transition">Menú</button>
        </header>

        <main className="container mx-auto flex flex-1 flex-col justify-center px-6 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-200">Software para clubes deportivos</span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Gestiona tu club deportivo <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">de forma integral</span>
            </h1>
           

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href="#" className="rounded-xl bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400">Comenzar gratis</a>
              <a href="#features" className="rounded-xl border border-white/30 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Ver funciones</a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-900/50 px-4 py-3 text-left">
                <p className="text-xs uppercase tracking-widest text-emerald-300">+coming soon </p>
                <p className="text-2xl font-bold">Crecimiento rápido</p>
              </div>
              <div className="rounded-xl bg-slate-900/50 px-4 py-3 text-left">
                <p className="text-xs uppercase tracking-widest text-emerald-300">99.9% uptime</p>
                <p className="text-2xl font-bold">Disponibilidad total</p>
              </div>
            </div>
          </div>
        </main>

        <section id="features" className="container mx-auto px-6 py-16 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-extrabold text-white sm:text-4xl">Lo que incluye</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-300 sm:text-base">
              Todo lo que tu club necesita para operar con eficiencia: asistencia, entrenamiento y análisis en un solo lugar.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-slate-800/80">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">🏟</div>
                <h3 className="mb-2 text-lg font-bold">Gestión de clubes</h3>
                <p className="text-sm text-slate-300">Crea y administra categorías y horarios.</p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-slate-800/80">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">📊</div>
                <h3 className="mb-2 text-lg font-bold">Análisis en tiempo real</h3>
                <p className="text-sm text-slate-300">asistencia y estadísticas de desempeño por atleta y categoría.</p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-slate-800/80">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">🎨</div>
                <h3 className="mb-2 text-lg font-bold">Experiencia visual moderna</h3>
                <p className="text-sm text-slate-300">Diseño moderno y responsivo para una mejor experiencia de usuario.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="testimonials" className="container mx-auto px-6 py-16 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-extrabold text-white sm:text-4xl">Próximamente</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-300 sm:text-base">
              Estamos en fase de lanzamiento inicial con pilotos selectos y mejoras continuas. Únete ahora y sé parte del primer grupo que pruebe la plataforma antes de la apertura general.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                <h3 className="text-lg font-bold text-emerald-200">Programa Early Access</h3>
                <p className="mt-2 text-sm text-slate-300">Participa como usuario preferente y explora las herramientas más importantes desde el primer día.</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                <h3 className="text-lg font-bold text-emerald-200">Aporte al roadmap</h3>
                <p className="mt-2 text-sm text-slate-300">Colabora en la definición de futuras funciones para entrenadores y gestores deportivos.</p>
              </article>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-slate-950/80 px-6 py-7 text-center text-sm text-slate-400 sm:px-8">
          © {new Date().getFullYear()} ClubDeportivo. Soluciones de gestión para el deporte. 
          <span className="mx-2">•</span>
          <a href="#" className="text-emerald-300 hover:text-emerald-200">Privacidad</a>
          <span className="mx-2">•</span>
          <a href="#" className="text-emerald-300 hover:text-emerald-200">Términos</a>
        </footer>
      </div>
    </div>
  )
}

export default App
