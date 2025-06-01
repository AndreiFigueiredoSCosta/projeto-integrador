import ViewManager from "../../../../../../components/view/ViewManager";
import {useEffect} from "react";
import useView from "../../../../../../hooks/useView.ts";

import "./style.css";
import GrupoBottomDetailsView from "../views/GrupoBottomDetailsView";
import ViewProperties, {defaultViewProperties} from "../../../../../../models/view/ViewProperties.ts";

/**
 * Seção inferior dos detalhes de grupo (Responsável por inicializar propriedades de view)
 * @constructor
 */
export default function GrupoBottomSection(){
    const context = useView();

    // Adiciona as views de subgrupos ao contexto de views
    useEffect(() => {
        if (!context.currentView.title){
            const subgrupoView = {
                ...defaultViewProperties,
                title: "Subgrupos"
            } as ViewProperties

            context.addView(subgrupoView);
            context.setCurrentView(subgrupoView);
        }

    }, [context]);

    return (
        <div className={"grupo-bottom-section"}>
            <ViewManager hasSubmitContainer={true} size={"small"} submitBtnText={"inserir"} />
            <GrupoBottomDetailsView/>
        </div>
    );
}
