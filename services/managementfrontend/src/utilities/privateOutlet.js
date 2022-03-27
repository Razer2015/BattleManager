import { useQuery } from "@apollo/client";
import { Spin } from "antd";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GET_ME } from "../graphql/queries";
import { deleteTokens, getTokens, saveTokens } from "./tokens";

const useAuth = () => {
    const { loading, error, data } = useQuery(GET_ME, {
        fetchPolicy: 'network-only',
        pollInterval: 10 * 1000,
    });

    if (!loading && data?.me?.isLoggedIn) {
        saveTokens(data?.me);
    }

    return { loading, isAuth: data?.me?.isLoggedIn };
};

export function PrivateOutlet() {
    const location = useLocation();
    const { loading, isAuth } = useAuth();

    if (loading) {
        return <Spin />
    }

    return isAuth ? (
        <Outlet />
    ) : (
        <Navigate to="/login" replace state={{ from: location }} />
    );
}
