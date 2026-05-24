import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./dashboard";
import AdminLayout from "./layout";
import UserPage from "./user";
import RolePermissionPage from "./role-permission";
import LocalitePage from "./localite";
import CentrePage from "./centre";
import Rapport from "../medecin/rapport";
import ConfigurationPage from "./configuration";
import MessagePage from "./message";
import CentreVaccinationStatsPage from "./centre-vaccination-stats";
import RapportMensuelInfirmierPage from "./rapport-mensuel-infirmier";
import RapportsDistrictIcpPage from "./rapports-district-icp";
import AuthGuard from "@/helpers/auth-guard";
import { useDecodedToken } from "@/contexts/decoded-token-context";


export default function AdminRouter() {
  const { decodedToken } = useDecodedToken();
  const role = (decodedToken?.role || '').replace(/^ROLE_/, '').toUpperCase();
  const isAdmin = role === 'ADMIN';

  return (
    <AuthGuard>
      <Routes>
        <Route element={<AdminLayout />}>
          {isAdmin ? (
            <>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserPage />} />
              <Route path="roles" element={<RolePermissionPage />} />
              <Route path="localites" element={<LocalitePage />} />
              <Route path="localites/centres/:centreId/statistiques" element={<CentreVaccinationStatsPage />} />
              <Route path="centres" element={<CentrePage />} />
              <Route path="rapports" element={<Rapport />} />
              <Route path="configuration" element={<ConfigurationPage />} />
              <Route path="messages" element={<MessagePage />} />
            </>
          ) : (
            <>
              <Route index element={<Navigate to="/admin/localites" replace />} />
              <Route path="localites" element={<LocalitePage />} />
              <Route path="localites/centres/:centreId/statistiques" element={<CentreVaccinationStatsPage />} />
              <Route path="rapport-mensuel" element={<RapportMensuelInfirmierPage />} />
              <Route path="rapports-district" element={<RapportsDistrictIcpPage />} />
            </>
          )}

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to={isAdmin ? "/admin/dashboard" : "/admin/localites"} replace />} />
          
        </Route>
      </Routes>
    </AuthGuard>
  );
}