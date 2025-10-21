import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    useEffect(() => {
        const usuarioStorage = localStorage.getItem("usuarioLogado");
        let usuarioObj = null;

        try {
            usuarioObj = JSON.parse(usuarioStorage);
        } catch (e) {
            console.warn("Erro ao fazer parse do localStorage:", e);
        }

        if (usuarioObj?.idUsuario) {
            setIsLoggedIn(true);
            setUsuarioLogado(usuarioObj);
        } else {
            setIsLoggedIn(false);
            setUsuarioLogado(null);
        }
    }, [location.pathname]);

    const logout = () => {
        localStorage.removeItem("usuarioLogado");
        setIsLoggedIn(false);
        setUsuarioLogado(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, usuarioLogado, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
