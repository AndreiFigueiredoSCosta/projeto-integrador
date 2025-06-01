import './style.css';

import {Header} from "../../components/page/Header";
import Sidebar from "../../components/page/Sidebar";
import {Outlet} from "react-router-dom";
import ToastContainer from "../../components/misc/ToastContainer";

/**
 * Layout principal da aplicação.
 * @constructor
 */
export default function Main () {
    return (
        <div id="body">
            <Header/>
            <div className="wrapper">
                <Sidebar/>
                <div className="outlet">
                    <Outlet/>
                    <ToastContainer/>
                </div>
            </div>
        </div>
    );
}
