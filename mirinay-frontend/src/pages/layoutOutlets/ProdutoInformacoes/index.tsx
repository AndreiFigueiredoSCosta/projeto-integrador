import {Route, Routes} from "react-router-dom";
import ViewProvider from "../../../contexts/view/ViewProvider";
import ProdutoInformacoesSummary from "./summary/ProdutoInformacoesSummary";

export default function ProdutoInformacoes(){

    return (
            <ViewProvider>
                <Routes>
                    <Route path="/" element={<ProdutoInformacoesSummary />} />
                </Routes>
            </ViewProvider>
    );
}
