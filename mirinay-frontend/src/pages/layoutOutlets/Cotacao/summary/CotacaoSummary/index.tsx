import ViewManager from "../../../../../components/view/ViewManager";
import {useEffect} from "react";
import useView from "../../../../../hooks/useView.ts";
import ViewProperties, {defaultViewProperties} from "../../../../../models/view/ViewProperties.ts";
import CotacaoView from "../views/CotacaoView";
import SummaryContainer from "../../../../../components/table/SummaryContainer";
import useSearch from "../../../../../hooks/useSearch.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";

/**
 * Gerencia a view de Cotação
 * @constructor
 */
export default function CotacaoSummary(){
    const {setCurrentView, addView, currentView} = useView();
    const { addSearchView } = useSearch();

    // Hook usado para setar as propriedades iniciais das views
    useEffect(() => {
        if (!currentView.title) {
            const pendenteView = {
                ...defaultViewProperties,
                title: "pendentes"
            } as ViewProperties;

            addView(pendenteView);

            addSearchView("Código da requisição", useEndpoint().cotacao().GET().SEARCH().id);
            addSearchView("Nome da requisição", useEndpoint().cotacao().GET().SEARCH().nome);

            setCurrentView(pendenteView);
        }
    }, [currentView, addView, setCurrentView]);

    return (
        <SummaryContainer title={"Cotação"}>
            <ViewManager size={"large"} hasSubmitContainer={false}/>
            <CotacaoView />
        </SummaryContainer>
    );
}
