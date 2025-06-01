import ViewContainer from "../../../../../../components/view/ViewContainer";
import useView from "../../../../../../hooks/useView.ts";
import {P} from "../../../../../../components/text/P";
import CotacaoKanban from "../../tables/CotacaoKanban";
// import CotacaoConcluidoTable from "../../tables/CotacaoConcluidoTable";
// import SearchProvider from "../../../../../../contexts/search/SearchProvider";

/**
 * Gerencia a comunicação entre os componentes da view de Cotacao
 * @constructor
 */
export default function CotacaoView(){
    const {currentView} = useView();

    switch (currentView.title) {
        case "pendentes":
            return (
                <ViewContainer>
                    <CotacaoKanban />
                </ViewContainer>
            );
        default:
            return (
                <P>ERRO! VIEW NÃO ENCONTRADA</P>
            );
    }
}
