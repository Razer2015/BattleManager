import { useLazyQuery, useMutation } from "@apollo/client";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LOGIN, LOGOUT } from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";
import { notificationWithIcon } from "../utilities/notification";

export const defaultUserProfile = { userId: "", email: "", name: "", roles: [] };

export const AuthContext = createContext({});

export default function Auth({ children }) {
    const [userProfile, setUserProfile] = useState(defaultUserProfile);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [checkIsAuthenticated] = useLazyQuery(GET_ME, {
        fetchPolicy: 'network-only',
        pollInterval: 10 * 1000,
        onCompleted: (data) => {
            setUserProfile(data.me);
            setIsAuthenticated(data?.me?.signedIn);
            setIsLoading(false);

            if (isAuthenticated) {
                if (location.state?.from) {
                    navigate(location.state.from);
                }
                else {
                    navigate('/');
                }
            }
        },
        onError: (error) => {
            setUserProfile(defaultUserProfile);
            setIsLoading(false);
        },
    });
    const [authLogin] = useMutation(LOGIN, {
        onCompleted: (data) => setIsAuthenticated(true),
        onError: (error) => {
            notificationWithIcon('error', error.message);
            setIsAuthenticated(false);
        },
    });
    const [authLogout] = useMutation(LOGOUT, {
        onCompleted: (data) => {
            setIsAuthenticated(false);
            setIsLoading(true);
        },
        onError: (error) => {
            notificationWithIcon('error', error.message);
            setIsAuthenticated(false);
            setIsLoading(true);
        },
    });

    useEffect(() => {
        checkAuth()
    }, [isAuthenticated])

    const checkAuth = () => checkIsAuthenticated()
    const login = credentials => authLogin({ variables: credentials })
    const logout = () => authLogout()

    // const signUp = credentials => authSignUp(credentials)
    //     .then((data) => setAuthState(data))
    //     .catch(error => {
    //         alert(error)
    //         setAuthState(defaultAuthState)
    //     })

    return (
        <AuthContext.Provider value={{ userProfile, isAuthenticated, isLoading, login, logout/*, signUp*/ }}>
            {children}
        </AuthContext.Provider>
    )
}
