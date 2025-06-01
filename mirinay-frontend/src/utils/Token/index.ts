import {jwtDecode} from "jwt-decode";

export default class Token {
    static getPayload(token: string) {
        try {
            return jwtDecode(token);
        } catch (error) {
            throw new Error('Token inválido: ' + error);
        }
    }
}
