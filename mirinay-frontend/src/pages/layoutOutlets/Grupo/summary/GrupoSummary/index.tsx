import ViewManager from "../../../../../components/view/ViewManager";
import GrupoView from "../views/GrupoView";
import {useEffect} from "react";
import useView from "../../../../../hooks/useView.ts";
import ViewProperties, {defaultViewProperties} from "../../../../../models/view/ViewProperties.ts";
import SummaryContainer from "../../../../../components/table/SummaryContainer";
import useSearch from "../../../../../hooks/useSearch.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";

/**
 * Gerencia a view de Grupo
 * @constructor
 */
export default function GrupoSummary(){
    const {setCurrentView, addView, currentView} = useView();
    const { addSearchView } = useSearch();

    // Hook usado para setar as propriedades iniciais das views
    useEffect(() => {
        if (!currentView.title) {
            const grupoView = {
                ...defaultViewProperties,
                title: "Grupo"
            } as ViewProperties;

            addView(grupoView);

            addSearchView("Código do Grupo", useEndpoint().grupo().search().id);
            addSearchView("Nome do Grupo", useEndpoint().grupo().search().nome);
            addSearchView("Código do Subrupo", useEndpoint().grupo().search().subgrupo().id);
            addSearchView("Nome do Subrupo", useEndpoint().grupo().search().subgrupo().nome);

            return setCurrentView(grupoView);
        }
    }, [currentView, addView, setCurrentView]);

    return (
        <SummaryContainer title={"Grupo"}>
            <ViewManager hasSubmitContainer={true} size={"large"}/>
            <GrupoView />
        </SummaryContainer>
    );
}
