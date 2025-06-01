import {Route, Routes} from "react-router-dom";
import ViewProvider from "../../../contexts/view/ViewProvider";
import ClonagemSummary from "./summary/ClonagemSummary";
import SearchProvider from "../../../contexts/search/SearchProvider";

export default function Clonagem(){

    return (
            <ViewProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="/" element={<ClonagemSummary />} />
                    </Routes>
                </SearchProvider>
            </ViewProvider>
    );
}
