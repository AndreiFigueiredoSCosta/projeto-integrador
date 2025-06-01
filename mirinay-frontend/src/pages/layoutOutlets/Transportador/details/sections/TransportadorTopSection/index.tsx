import ViewManager from "../../../../../../components/view/ViewManager";
import {useEffect} from "react";
import useView from "../../../../../../hooks/useView.ts";

import ViewProperties, {defaultViewProperties} from "../../../../../../models/view/ViewProperties.ts";
import TransportadorTopDetailsView from "../views/TransportadorTopDetailsView";

/**
 * Seção superior dos detalhes de grupo (Responsável por inicializar propriedades de view)
 * @constructor
 */
export default function TransportadorTopSection(){
    const context = useView();

    // Adiciona a view de informações ao contexto de views
    useEffect(() => {
        if (!context.currentView.title){
            const dataView = {
                ...defaultViewProperties,
                title: "Informações"
            } as ViewProperties;

            context.addView(dataView);
            context.setCurrentView(dataView);
        }
    }, [context]);

    return (
        <div style={{height: "fit-content"}}>
            <ViewManager hasSubmitContainer={false} size={"small"}/>
            <TransportadorTopDetailsView/>
        </div>
    );
}
