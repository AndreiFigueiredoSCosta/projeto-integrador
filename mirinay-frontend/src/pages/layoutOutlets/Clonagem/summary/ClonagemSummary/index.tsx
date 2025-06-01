import ViewManager from "../../../../../components/view/ViewManager";
import {useEffect} from "react";
import useView from "../../../../../hooks/useView.ts";
import ViewProperties, {defaultViewProperties} from "../../../../../models/view/ViewProperties.ts";
import ClonagemView from "../views/ClonagemView";
import SummaryContainer from "../../../../../components/table/SummaryContainer";
import useSearch from "../../../../../hooks/useSearch.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";

/**
 * Gerencia a view de Clonagens
 * @constructor
 */
export default function ClonagemSummary(){
    const {setCurrentView, addView, currentView} = useView();
    const { addSearchView } = useSearch();

    // Hook usado para setar as propriedades iniciais das views
    useEffect(() => {
        if (!currentView.title) {
            const clonagemView = {
                ...defaultViewProperties,
                title: "clonagem"
            } as ViewProperties;

            addView(clonagemView);

            addSearchView("Nome da clonagem", useEndpoint().clonagem().search().nome);

            setCurrentView(clonagemView);
        }
    }, [currentView, addView, setCurrentView]);

    return (
        <SummaryContainer title={"Clonagem"}>
            <ViewManager hasSubmitContainer={true} size={"large"}/>
            <ClonagemView />
        </SummaryContainer>
    );
}
