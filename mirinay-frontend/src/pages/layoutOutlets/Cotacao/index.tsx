import {Route, Routes} from "react-router-dom";
import ViewProvider from "../../../contexts/view/ViewProvider";
import CotacaoSummary from "./summary/CotacaoSummary";
import SearchProvider from "../../../contexts/search/SearchProvider";
import EstagioEnum from "../../../enums/EstagioEnum.ts";
import CotacaoDetails from "./details/CotacaoDetails";
import CotacaoRevisaoBottomSection from "./details/estagios/revisao/CotacaoRevisaoBottomSection";
import CotacaoCotacaoBottomSection from "./details/estagios/cotacao/CotacaoCotacaoBottomSection";
import CotacaoAprovacaoBottomSection from "./details/estagios/aprovacao/CotacaoAprovacaoBottomSection";

export default function Cotacao(){

    return (
            <ViewProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="/" element={<CotacaoSummary />} />
                        <Route
                            path="/detalhes/revisao/:requisicaoId"
                            element={
                            <CotacaoDetails
                                outlet={<CotacaoRevisaoBottomSection/>}
                                estagio={EstagioEnum.REVISAO}

                            />}
                        />
                        <Route
                            path="/detalhes/cotacao/:requisicaoId"
                            element={
                            <CotacaoDetails
                                outlet={<CotacaoCotacaoBottomSection/>}
                                estagio={EstagioEnum.COTACAO}
                            />}
                        />
                        <Route
                            path="/detalhes/aprovacao/:requisicaoId"
                            element={
                            <CotacaoDetails
                                outlet={<CotacaoAprovacaoBottomSection/>}
                                estagio={EstagioEnum.APROVACAO}
                            />}
                        />
                    </Routes>
                </SearchProvider>
            </ViewProvider>
    );
}
