import {Route, Routes} from "react-router-dom";
import ViewProvider from "../../../contexts/view/ViewProvider";
import AdministracaoSummary from "./summary/AdministracaoSummary";
import SearchProvider from "../../../contexts/search/SearchProvider";

export default function Administracao(){

    return (
            <ViewProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="/" element={<AdministracaoSummary />} />
                        {/*<Route path={`/:pedidoId`} element={<PedidoDetails />} />*/}
                    </Routes>
                </SearchProvider>
            </ViewProvider>
    );
}
