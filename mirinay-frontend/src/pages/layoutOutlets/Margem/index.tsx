import {Route, Routes} from "react-router-dom";
import ViewProvider from "../../../contexts/view/ViewProvider";
import SearchProvider from "../../../contexts/search/SearchProvider";
import MargemSummary from "./summary/MargemSummary";

export default function Margem(){

    return (
            <ViewProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="/" element={<MargemSummary />} />
                    </Routes>
                </SearchProvider>
            </ViewProvider>
    );
}
