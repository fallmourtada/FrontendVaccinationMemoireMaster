import { useNavigate } from "react-router-dom";


export function useRoleRedirect() {
  const navigate = useNavigate();

  return (role: string) => {
    const normalizedRole = (role || "").replace(/^ROLE_/, "").toUpperCase();

    if (normalizedRole === "ICP") {
      navigate("/admin/localites", { replace: true });
    } else if (normalizedRole === "INFIRMIER") {
      navigate("/admin/localites", { replace: true });
    } else if (normalizedRole === "SAGE_FEMME") {
      navigate("/medecin/accueil", { replace: true });
    } else if (normalizedRole === "ADMIN") {
      navigate("/admin/localites", { replace: true });
    } 
    else {
      navigate("/", { replace: true });
    }
  };
}