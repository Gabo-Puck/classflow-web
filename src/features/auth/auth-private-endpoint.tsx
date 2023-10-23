import { useAuth } from "./auth-context";
import PermissionDenied from "./auth-permisson-denied";

interface PrivateEndpointProps extends React.PropsWithChildren {
    role: string
}
export function PrivateEndpoint({ role, children }: PrivateEndpointProps) {
    const userData = useAuth();
    if (userData?.role !== role) {
        return <PermissionDenied />
    }
    return children

}