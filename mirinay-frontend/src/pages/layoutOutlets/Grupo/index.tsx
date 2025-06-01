import {Route, Routes} from "react-router-dom";
import GrupoDetails from "./details/GrupoDetails";
import ViewProvider from "../../../contexts/view/ViewProvider";
import GrupoSummary from "./summary/GrupoSummary";
import SearchProvider from "../../../contexts/search/SearchProvider";

export default function Grupo(){

    return (
            <ViewProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="/" element={<GrupoSummary />} />
                        <Route path={`detalhes/:grupoId`} element={<GrupoDetails />} />
                    </Routes>
                </SearchProvider>
            </ViewProvider>
    );
}
