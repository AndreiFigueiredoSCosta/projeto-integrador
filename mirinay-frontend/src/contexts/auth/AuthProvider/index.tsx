import { useNavigate } from "react-router-dom";
import {ReactNode, useCallback, useEffect, useState} from "react";
import Cookies from "js-cookie";

import AuthContext from "../AuthContext";
import { LoggedUser } from "../../../models/login/LoggedUser";
import Token from "../../../utils/Token";
import { LoginResponse } from "../../../models/login/LoginResponse";

/**
 * Provedor de contexto para autenticação.
 * @param children
 * @constructor
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<LoggedUser | null>(null);
    const navigate = useNavigate();





    /**
     * Função para realizar o login do usuário.
     * @param responseData - resposta da requisição de login
     */
    const login = (responseData: LoginResponse): void => {
        if (responseData) {
            const decodedToken = Token.getPayload(responseData.token);
            const expirationTime = responseData.expiresIn / (24 * 60 * 60); //Conversão para dias

            //Salvando o token no cookie
            Cookies.set('access_token', responseData.token, {
                expires: expirationTime,
                secure: true,
                sameSite: 'strict'
            });

            //Salvando o tempo de expiração token no cookie
            Cookies.set('access_token_expiration', new Date(Date.now() + responseData.expiresIn).toString(), {
                expires: expirationTime,
                secure: true,
                sameSite: 'strict'
            });

            setupTokenExpiration(responseData.expiresIn);

            setUser(decodedToken as LoggedUser);

            navigate('/home');
        } else {
            throw new Error('Dados inválidos');
        }
    };

    /**
     * Função para realizar o logout do usuário.
     */
    const logout = useCallback(function logout() {
        setUser(null);
        Cookies.remove('access_token');
        navigate('/');
    }, [navigate]);

    // função para configurar o tempo de expiração do token
    const setupTokenExpiration = useCallback( function setupTokenExpiration(exp: number) {
        if (exp > 0) {
            setTimeout(() => {
                logout();
            }, exp);
        } else {
            logout();
        }
    }, [logout]);

    // hook para manter o usuário logado ao atualizar a página
    useEffect(() => {
        const token = Cookies.get('access_token');
        const expirationDate = Cookies.get('access_token_expiration');

        if (token && expirationDate) {
            const decodedToken = Token.getPayload(token);
            setUser(decodedToken as LoggedUser);
            setupTokenExpiration(Date.parse(expirationDate as string) - Date.now());
        }
        else {
           setUser(null);
           navigate('/');
        }
    }, [navigate, setupTokenExpiration]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
