import ViewManager from "../../../../../components/view/ViewManager";
import {useEffect} from "react";
import useView from "../../../../../hooks/useView.ts";
import ViewProperties, {defaultViewProperties} from "../../../../../models/view/ViewProperties.ts";
import SummaryContainer from "../../../../../components/table/SummaryContainer";
import useSearch from "../../../../../hooks/useSearch.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import MargemView from "../views/MargemView";

/**
 * Gerencia a view de Grupo
 * @constructor
 */
export default function MargemSummary(){
    const {setCurrentView, addView, currentView} = useView();
    const { addSearchView } = useSearch();

    // Hook usado para setar as propriedades iniciais das views
    useEffect(() => {
        if (!currentView.title) {
            const view = {
                ...defaultViewProperties,
                title: "Margem"
            } as ViewProperties;

            addView(view);

            addSearchView("Nome da Margem", useEndpoint().margem().GET().SEARCH().nome);

            return setCurrentView(view);
        }
    }, [currentView, addView, setCurrentView]);

    return (
        <SummaryContainer title={"Margem"}>
            <ViewManager hasSubmitContainer={true} size={"large"}/>
            <MargemView />
        </SummaryContainer>
    );
}
