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
import Stock from './stock';
import Statistique from './statistique';
import Rapport from './rapport';
import Parametre from './parametre';
import Message from './message';
import AuthGuard from '@/helpers/auth-guard';
import MedecinLayout from './layout';
import { useDecodedToken } from '@/contexts/decoded-token-context';



export default function MedecinRouter() {
  const { decodedToken } = useDecodedToken();
  const role = (decodedToken?.role || '').replace(/^ROLE_/, '').toUpperCase();
  const isIcp = role === 'ICP';
  const isInfirmier = role === 'INFIRMIER';

  return (
    <AuthGuard>
      <Routes>
          {/* Routes publiques */}
          <Route element={<MedecinLayout />}>
              {/* <Route index element={<Navigate to="/accueil" replace />} /> */}
              <Route path="accueil" element={<Dashboard />} />
              {!isIcp && <Route path="patients" element={<Patient />} />}
              {!isIcp && <Route path="patient-details/:id" element={<PatientDetails />} />}
              {!isIcp && <Route path="prediction-risque" element={<PredictionRisque />} />}
              {!isIcp && <Route path="enfants" element={<Enfant />} />}
              {!isIcp && <Route path="vaccinations" element={<Vaccination />} />}
              {!isInfirmier && <Route path="vaccins" element={<Vaccin />} />}
              {!isIcp && <Route path="rendez-vous" element={<RendezVous />} />}
              {!isIcp && <Route path="calendrier" element={<Calendrier />} />}
              {!isIcp && !isInfirmier && <Route path="stocks" element={<Stock />} />}
              {!isInfirmier && <Route path="statistiques" element={<Statistique />} />}
              {!isIcp && !isInfirmier && <Route path="rapports" element={<Rapport />} />}
              {!isIcp && !isInfirmier && <Route path="parametres" element={<Parametre />} />}
              {!isIcp && !isInfirmier && <Route path="messages" element={<Message />} />}

              {/* Redirection par défaut */}
              <Route path="*" element={<Navigate to="/medecin/accueil" replace />} />

          </Route>
      </Routes>
    </AuthGuard>
  );
}