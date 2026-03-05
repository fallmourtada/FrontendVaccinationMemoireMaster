import { ThemeProvider } from "@/components/shared/theme-provider";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRouter from "./pages/admin/admin-router";
import LandingPage from "./pages/landing-page";
import LoginPage from "./pages/login-page";
import { Toaster } from "@/components/ui/sonner";
import { DecodedTokenProvider } from "./contexts/decoded-token-context";
import { UserProvider } from "./contexts/user-context";
import MedecinRouter from "./pages/medecin/medecin-router";
import UserByToken from "./pages/user-by-token";
import PublicCarnetPage from "./pages/public-carnet-page";
import { ModalProvider } from "./components/shared/modal-provider";


function App() {

  return (
    // Le ThemeProvider gère le thème de l'application (clair/sombre)
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ModalProvider>
        <DecodedTokenProvider>
          <UserProvider>
          <Router>
            <Routes>

              {/* Landing page */}
              <Route index element={<LandingPage />} />
              <Route path="/" element={<LandingPage />} />

              {/* Page de connexion */}
              <Route path="/login" element={<LoginPage />} />

              {/* Routes medecin */}
              <Route path="/medecin/*" element={<MedecinRouter />}/>

              {/* Routes admin */}
              <Route path="/admin/*" element={<AdminRouter />} />

              {/* Route pour recuperer un utilisateur par son token */}
              <Route path="/user-by-token/:token" element={<UserByToken />} />

              {/* Route publique — Carnet de vaccination par QR Code (pas d'auth requise) */}
              <Route path="/public-access/:accessToken" element={<PublicCarnetPage />} />

              {/* Redirection par défaut */}
              <Route path="*" element={<LoginPage />} />

            </Routes>

          </Router>

          {/* Toaster pour les notifications */}
          <Toaster 
            // position="top-right"
            richColors
            closeButton
          />
          </UserProvider>
        </DecodedTokenProvider>
      </ModalProvider>
    </ThemeProvider>
  )
}

export default App
