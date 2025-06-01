import {Route, Routes} from "react-router-dom";
import ViewProvider from "../../../contexts/view/ViewProvider";
import SearchProvider from "../../../contexts/search/SearchProvider";
import ClientesSummary from "./summary/ClientesSummary";

export default function Clientes(){

    return (
            <ViewProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="/" element={<ClientesSummary />} />
                    </Routes>
                </SearchProvider>
            </ViewProvider>
    );
}
