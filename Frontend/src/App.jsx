import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CrearClub from "./pages/CrearClub";
import Clubs from "./pages/Directorio";
import UserProfile from "./pages/UserProfile";
import VistaClub from "./pages/VistaClub";
import PanelClub from "./pages/PanelClub";
import PanelEntrenador from "./pages/PanelEntrenador";
import PanelDeportista from "./pages/PanelDeportista";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/MainLanding";

function PageTransition({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`min-h-screen transition-all duration-500 ease-out ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        {/* 🔓 PUBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/clubs" element={<Clubs />} />

        <Route path="/clubs/:slug" element={<VistaClub />} />

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
          path="/panel-entrenador"
          element={
            <ProtectedRoute>
              <PanelEntrenador />
            </ProtectedRoute>
          }
        />

        <Route
          path="/panel-deportista"
          element={
            <ProtectedRoute>
              <PanelDeportista />
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
    </PageTransition>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
