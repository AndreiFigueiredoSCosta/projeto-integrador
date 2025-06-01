import {Route, Routes} from "react-router-dom";
import ViewProvider from "../../../contexts/view/ViewProvider";
import PedidoSummary from "./summary/PedidosSummary";
import SearchProvider from "../../../contexts/search/SearchProvider";

export default function Pedido(){

    return (
            <ViewProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="/" element={<PedidoSummary />} />
                        {/*<Route path={`/:pedidoId`} element={<PedidoDetails />} />*/}
                    </Routes>
                </SearchProvider>
            </ViewProvider>
    );
}
