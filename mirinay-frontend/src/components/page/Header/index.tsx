import './style.css'
import logo from '../../../assets/logo.svg'
import {UserMenu} from "../../misc/UserMenu";

/**
 * Cabeçalho padrão das páginas
 */
export function Header() {

    return (
        <header id="header">
            <img src={logo} alt="Logo da Mirinay" />
            <div id="user">
                <UserMenu />
            </div>
        </header>
    );
}
