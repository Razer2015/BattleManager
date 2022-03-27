import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getTokens } from "./tokens";

const useAuth = () => {
    const tokens = getTokens();
    return tokens;
};

export function PrivateOutlet() {
    const location = useLocation();
    const isAuth = useAuth();
    return isAuth ? (
        <Outlet />
    ) : (
        <Navigate to="/login" replace state={{ from: location }} />
    );
}
