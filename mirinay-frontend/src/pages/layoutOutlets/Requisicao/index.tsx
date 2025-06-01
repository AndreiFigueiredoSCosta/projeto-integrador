import {Route, Routes} from "react-router-dom";
import ViewProvider from "../../../contexts/view/ViewProvider";
import RequisicaoSummary from "./summary/RequisicaoSummary";
import SearchProvider from "../../../contexts/search/SearchProvider";
import RequisicaoDetails from "./details/RequisicaoDetails";
import RequisicaoConstrucaoBottomSection from "./details/estagios/construcao/RequisicaoConstrucaoBottomSection";
import RequisicaoCotacaoBottomSection from "./details/estagios/cotacao/RequisicaoCotacaoBottomSection";
import RequisicaoAprovacaoBottomSection from "./details/estagios/aprovacao/RequisicaoAprovacaoBottomSection";
import RequisicaoPedidoBottomSection from "./details/estagios/pedido/RequisicaoPedidoBottomSection";
import RequisicaoConcluidoBottomSection from "./details/estagios/concluido/RequisicaoConcluidoBottomSection";
import EstagioEnum from "../../../enums/EstagioEnum.ts";

export default function Requisicao(){

    return (
            <ViewProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="/" element={<RequisicaoSummary />} />
                        <Route
                            path="/detalhes/construcao/:requisicaoId"
                            element={
                            <RequisicaoDetails
                                outlet={<RequisicaoConstrucaoBottomSection/>}
                                estagio={EstagioEnum.CONSTRUCAO}

                            />}
                        />
                        <Route
                            path="/detalhes/cotacao/:requisicaoId"
                            element={
                            <RequisicaoDetails
                                outlet={<RequisicaoCotacaoBottomSection/>}
                                estagio={EstagioEnum.COTACAO}
                            />}
                        />
                        <Route
                            path="/detalhes/aprovacao/:requisicaoId"
                            element={
                            <RequisicaoDetails
                                outlet={<RequisicaoAprovacaoBottomSection/>}
                                estagio={EstagioEnum.VALIDACAO}
                            />}
                        />
                        <Route
                            path="/detalhes/pedido/:requisicaoId"
                            element={
                            <RequisicaoDetails
                                outlet={<RequisicaoPedidoBottomSection/>}
                                estagio={EstagioEnum.PEDIDO}
                            />}
                        />
                        <Route
                            path="/detalhes/concluido/:requisicaoId"
                            element={
                            <RequisicaoDetails
                                outlet={<RequisicaoConcluidoBottomSection/>}
                                estagio={EstagioEnum.CONCLUIDO}
                            />}
                        />
                    </Routes>
                </SearchProvider>
            </ViewProvider>
    );
}
