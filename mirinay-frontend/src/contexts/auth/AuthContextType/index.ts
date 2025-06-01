import {LoggedUser} from "../../../models/login/LoggedUser.ts";
import {LoginResponse} from "../../../models/login/LoginResponse.ts";

/**
 * Interface para o contexto de autenticação.
 */
export default interface AuthContextType {
    user: LoggedUser | null;
    setUser: (user: LoggedUser | null) => void;
    login: (responseData: LoginResponse) => void;
    logout: () => void;
}
