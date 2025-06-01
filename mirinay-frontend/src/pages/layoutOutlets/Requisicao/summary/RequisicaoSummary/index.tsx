import ViewManager from "../../../../../components/view/ViewManager";
import {useEffect} from "react";
import useView from "../../../../../hooks/useView.ts";
import ViewProperties, {defaultViewProperties} from "../../../../../models/view/ViewProperties.ts";
import RequisicaoView from "../views/RequisicaoView";
import SummaryContainer from "../../../../../components/table/SummaryContainer";

/**
 * Gerencia a view de Requisição
 * @constructor
 */
export default function RequisicaoSummary(){
    const {setCurrentView, addView, currentView} = useView();

    // Hook usado para setar as propriedades iniciais das views
    useEffect(() => {
        if (!currentView.title) {
            const pendenteView = {
                ...defaultViewProperties,
                title: "pendentes"
            } as ViewProperties;

            const concluidoView = {
                ...defaultViewProperties,
                title: "concluidos"
            }

            addView(pendenteView);
            addView(concluidoView);
            setCurrentView(pendenteView);
        }
    }, [currentView, addView, setCurrentView]);

    return (
        <SummaryContainer title={"Requisição"}>
                <ViewManager hasSubmitContainer={currentView.title == "pendentes"} size={"large"}/>
                <RequisicaoView />
        </SummaryContainer>
    );
}
