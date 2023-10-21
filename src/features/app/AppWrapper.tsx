import { AuthProvider } from "@features/auth/auth-context";
import { Outlet } from "react-router-dom";

export default function AppWrapper({ ...props }) {
    return <AuthProvider>
        <Outlet />
    </AuthProvider>
}