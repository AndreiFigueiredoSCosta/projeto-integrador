import ViewContainer from "../../../../../../components/view/ViewContainer";
import RequisicaoKanban from "../../tables/RequisicaoKanban";
import RequisicaoSubmitForm from "../../forms/RequisicaoSubmitForm";
import RequisicaoConcluidoTable from "../../tables/RequisicaoConcluidoTable";
import useView from "../../../../../../hooks/useView.ts";
import {P} from "../../../../../../components/text/P";
import SearchProvider from "../../../../../../contexts/search/SearchProvider";

/**
 * Gerencia a comunicação entre os componentes da view de Requisição
 * @constructor
 */
export default function RequisicaoView(){
    const {currentView} = useView();

    switch (currentView.title) {
        case "pendentes":
            return (
                <ViewContainer>
                    <RequisicaoKanban />
                    <RequisicaoSubmitForm />
                </ViewContainer>
            );
        case "concluidos":
            return (
                <ViewContainer>
                   <SearchProvider>
                        <RequisicaoConcluidoTable />
                    </SearchProvider>
                </ViewContainer>
            );
        default:
            return (
                <P>ERRO! VIEW NÃO ENCONTRADA</P>
            );
    }
}
