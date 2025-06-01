import ViewManager from "../../../../../../components/view/ViewManager";
import {useEffect} from "react";
import useView from "../../../../../../hooks/useView.ts";
import GrupoTopDetailsView from "../views/GrupoTopDetailsView";

import "./style.css";
import ViewProperties, {defaultViewProperties} from "../../../../../../models/view/ViewProperties.ts";

/**
 * Seção superior dos detalhes de grupo (Responsável por inicializar propriedades de view)
 * @constructor
 */
export default function GrupoTopSection(){
    const context = useView();

    // Adiciona a view de informações ao contexto de views
    useEffect(() => {
        if (!context.currentView.title){
            const grupoDataView = {
                ...defaultViewProperties,
                title: "Informações"
            } as ViewProperties;

            context.addView(grupoDataView);
            context.setCurrentView(grupoDataView);
        }
    }, [context]);

    return (
        <div className={"grupo-top-section"}>
            <ViewManager hasSubmitContainer={false} size={"small"}/>
            <GrupoTopDetailsView/>
        </div>
    );
}
