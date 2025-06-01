import {Route, Routes} from "react-router-dom";
import ViewProvider from "../../../contexts/view/ViewProvider";
import ProdutoSummary from "./summary/ProdutoSummary";
import ProdutoDetails from "./details/ProdutoDetails";
import SearchProvider from "../../../contexts/search/SearchProvider";

export default function Produto(){

    return (
            <ViewProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="/" element={<ProdutoSummary />} />
                         <Route path={`detalhes/:produtoId`} element={<ProdutoDetails />} />
                    </Routes>
                </SearchProvider>
            </ViewProvider>
    );
}

