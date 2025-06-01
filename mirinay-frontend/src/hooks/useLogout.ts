import { useNavigate } from 'react-router-dom';


export default function useLogout(){

    const navigate = useNavigate();

    function clearCookie(name: string) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict`;
    }

    function logout() {

        clearCookie('access_token');
        clearCookie('access_token_expiration');

        navigate('/login');
    }
    return logout;
}
