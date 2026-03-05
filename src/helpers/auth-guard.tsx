import { AuthService } from "@/services/index.service";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";



export default function AuthGuard({ children }: { children: ReactNode }) {
    const isConnected = AuthService.isAuthenticated();
    if (!isConnected) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;

}
