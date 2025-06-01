import {useContext} from "react";
import AuthContext from "../contexts/auth/AuthContext";

/**
 * Hook usado para acessar dados do usuário autenticado.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
