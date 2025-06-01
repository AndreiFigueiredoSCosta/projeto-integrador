import ViewManager from "../../../../../../components/view/ViewManager";
import {useEffect} from "react";
import useView from "../../../../../../hooks/useView.ts";

import "./style.css";
import ViewProperties, {defaultViewProperties} from "../../../../../../models/view/ViewProperties.ts";
import TransportadorBottomDetailsView from "../views/TransportadorBottomDetailsView";

/**
 * Seção inferior dos detalhes de grupo (Responsável por inicializar propriedades de view)
 * @constructor
 */
export default function TransportadorBottomSection(){
    const context = useView();

    // Adiciona as views de subgrupos ao contexto de views
    useEffect(() => {
        if (!context.currentView.title){
            const CNPJsView = {
                ...defaultViewProperties,
                title: "CNPJs"
            } as ViewProperties

            context.addView(CNPJsView);
            context.setCurrentView(CNPJsView);
        }

    }, [context]);

    return (
        <div className={"grupo-bottom-section"}>
            <ViewManager hasSubmitContainer={true} size={"small"} submitBtnText={"inserir"} />
            <TransportadorBottomDetailsView/>
        </div>
    );
}
