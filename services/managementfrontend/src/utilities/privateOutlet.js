import { Spin } from "antd";
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../components/authComponent";

export function PrivateOutlet() {
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    const location = useLocation();

    return !isLoading
        ?
        (
            isAuthenticated ? (
                <Outlet />
            ) : (
                <Navigate to="/login" replace state={{ from: location }} />
            )
        )
        :
        <Spin />
        ;
}
