import {Route, Routes} from "react-router-dom";
import ViewProvider from "../../../contexts/view/ViewProvider";
import SearchProvider from "../../../contexts/search/SearchProvider";
import OrcamentosSummary from "./summary/OrcamentosSummary";

export default function Orcamentos(){

    return (
            <ViewProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="/" element={<OrcamentosSummary/>} />
                    </Routes>
                </SearchProvider>
            </ViewProvider>
    );
}
