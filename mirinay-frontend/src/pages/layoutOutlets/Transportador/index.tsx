import {Route, Routes} from "react-router-dom";
import ViewProvider from "../../../contexts/view/ViewProvider";
import SearchProvider from "../../../contexts/search/SearchProvider";
import TransportadorDetails from "./details/TransportadorDetails";
import TransportadorSummary from "./summary/TransportadorSummary";

export default function Transportador(){

    return (
            <ViewProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="/" element={<TransportadorSummary />} />
                         <Route path={`detalhes/:transportadorId`} element={<TransportadorDetails />} />
                    </Routes>
                </SearchProvider>
            </ViewProvider>
    );
}

