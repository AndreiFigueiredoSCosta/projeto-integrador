import {Route, Routes} from "react-router-dom";
import ViewProvider from "../../../contexts/view/ViewProvider";
import UnificacaoSummary from "./summary/UnificacaoSummary";
import SearchProvider from "../../../contexts/search/SearchProvider";

export default function Unificacao(){

    return (
            <ViewProvider>
                <SearchProvider>
                        <Routes>
                            <Route path="/" element={<UnificacaoSummary />} />
                            {/*<Route path={`detalhes/:itemId`} element={<UnificacaoDetails />} />*/}
                        </Routes>
                </SearchProvider>
            </ViewProvider>
    );
}
