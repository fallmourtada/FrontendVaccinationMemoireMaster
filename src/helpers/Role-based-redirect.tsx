import { useNavigate } from "react-router-dom";


export function useRoleRedirect() {
  const navigate = useNavigate();

  return (role: string) => {
    if (["ROLE_ICP", "ROLE_SAGE_FEMME", "ROLE_INFIRMIER"].includes(role || "")) {
      navigate("/medecin/dashboard", { replace: true });
    } else if (role === "ROLE_ADMIN") {
      navigate("/admin/localites", { replace: true });
    } 
    // else if (role === "ROLE_PARENT") {
    //   navigate("/parent", { replace: true });
    // } 
    else {
      navigate("/", { replace: true });
    }
  };
}