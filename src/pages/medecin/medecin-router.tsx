import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import Calendrier from './calendrier';
import Patient from './patient';
import PatientDetails from './patient-details';
import PredictionRisque from './prediction-risque';
import Enfant from './enfant';
import Vaccination from './vaccination';
import Vaccin from './vaccin';
import RendezVous from './rendez-vous';
import Centre from './centre';
import Stock from './stock';
import Statistique from './statistique';
import Rapport from './rapport';
import Parametre from './parametre';
import Message from './message';
import AuthGuard from '@/helpers/auth-guard';
import MedecinLayout from './layout';



export default function MedecinRouter() {
  return (
    <AuthGuard>
      <Routes>
          {/* Routes publiques */}
          <Route element={<MedecinLayout />}>
              {/* <Route index element={<Navigate to="/accueil" replace />} /> */}
              <Route path="accueil" element={<Dashboard />} />
              <Route path="patients" element={<Patient />} />
              <Route path="patient-details/:id" element={<PatientDetails />} />
              <Route path="prediction-risque" element={<PredictionRisque />} />
              <Route path="enfants" element={<Enfant />} />
              <Route path="vaccinations" element={<Vaccination />} />
              <Route path="vaccins" element={<Vaccin />} />
              <Route path="rendez-vous" element={<RendezVous />} />
              <Route path="calendrier" element={<Calendrier />} />
              <Route path="centres" element={<Centre />} />
              <Route path="stocks" element={<Stock />} />
              <Route path="statistiques" element={<Statistique />} />
              <Route path="rapports" element={<Rapport />} />
              <Route path="parametres" element={<Parametre />} />
              <Route path="messages" element={<Message />} />

              {/* Redirection par défaut */}
              <Route path="*" element={<Navigate to="/medecin/accueil" replace />} />

          </Route>
      </Routes>
    </AuthGuard>
  );
}