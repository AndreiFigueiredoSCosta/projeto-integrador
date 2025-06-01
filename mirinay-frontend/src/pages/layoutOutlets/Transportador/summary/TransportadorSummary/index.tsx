import ViewManager from "../../../../../components/view/ViewManager";
import {useEffect, useState} from "react";
import useView from "../../../../../hooks/useView.ts";
import ViewProperties, {defaultViewProperties} from "../../../../../models/view/ViewProperties.ts";
import TransportadorView from "../views/TransportadorView/index.tsx";
import SummaryContainer from "../../../../../components/table/SummaryContainer";
import useSearch from "../../../../../hooks/useSearch.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";

/**
 * Gerencia a view de Produto
 * @constructor
 */
export default function TransportadorSummary(){
    const { setCurrentView, addView } = useView();
    const [ hasLoaded, setHasLoaded ]  = useState<boolean>(false);
    const { addSearchView } = useSearch();

    // Hook usado para setar as propriedades iniciais das views
    useEffect(() => {
        if (!hasLoaded) {
            const view = defaultViewProperties as ViewProperties;

            view.title = "Transportador";

            addView(view);

            addSearchView("Código do transportador", useEndpoint().transportador().search().id);
            addSearchView("Nome do transportador", useEndpoint().transportador().search().nome);

            setCurrentView(view);
            setHasLoaded(true); //usado para impedir um looping infinito
        }
    }, [addView, hasLoaded, setCurrentView]);

    return (
        <SummaryContainer title={"Transportador"}>
            <ViewManager hasSubmitContainer={true} size={"large"}/>
            <TransportadorView/>
        </SummaryContainer>
    );
}
