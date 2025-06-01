import Cookies from "js-cookie";

/**
 * Hook usado para acessar o token nos cookies.
 */
export const useAccessToken = () => {
    return Cookies.get('access_token');
};
