import {createContext} from "react";
import AuthContextType from "../AuthContextType";

/**
 * Contexto de autenticação.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default AuthContext;
