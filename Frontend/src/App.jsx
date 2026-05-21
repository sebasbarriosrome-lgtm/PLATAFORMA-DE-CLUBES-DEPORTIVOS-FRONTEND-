import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CrearClub from "./pages/CrearClub";
import Clubs from "./pages/Directorio";
import UserProfile from "./pages/UserProfile";
import VistaClub from "./pages/VistaClub";
import PanelClub from "./pages/PanelClub";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/MainLanding";


function App() {
  return (
    <BrowserRouter>
      <Routes>
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
