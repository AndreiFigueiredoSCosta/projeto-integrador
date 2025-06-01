import {Route, Routes} from "react-router-dom";
import ViewProvider from "../../../contexts/view/ViewProvider";
import SearchProvider from "../../../contexts/search/SearchProvider";
import FornecedorDetails from "./details/FornecedorDetails";
import FornecedorSummary from "./summary/FornecedorSummary";

export default function Fornecedor(){

    return (
            <ViewProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="/" element={<FornecedorSummary />} />
                         <Route path={`detalhes/:fornecedorId`} element={<FornecedorDetails />} />
                    </Routes>
                </SearchProvider>
            </ViewProvider>
    );
}

