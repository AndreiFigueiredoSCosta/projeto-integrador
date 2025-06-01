import ViewManager from "../../../../../../components/view/ViewManager";
import {useEffect} from "react";
import useView from "../../../../../../hooks/useView.ts";

import ViewProperties, {defaultViewProperties} from "../../../../../../models/view/ViewProperties.ts";
import ProdutoBottomDetailsView from "../views/ProdutoBottomDetailsView";

/**
 * Seção inferior dos detalhes de grupo (Responsável por inicializar propriedades de view)
 * @constructor
 */
export default function ProdutoBottomSections(){
    const context = useView();

    // Adiciona as views de subgrupos ao contexto de views
    useEffect(() => {
        if (!context.currentView.title){
            const similarView = {
                ...defaultViewProperties,
                title: "Similares"
            } as ViewProperties

            const conjuntoView = {
                ...defaultViewProperties,
                title: "Conjuntos"
            }

            const componenteView = {
                ...defaultViewProperties,
                title: "Componentes"
            }

            context.addView(similarView);
            context.addView(conjuntoView);
            context.addView(componenteView);
            context.setCurrentView(similarView);
        }

    }, [context]);

    return (
        <div className={"grupo-bottom-section"}>
            <ViewManager hasSubmitContainer={true} size={"small"} submitBtnText={"inserir"} />
            <ProdutoBottomDetailsView/>
        </div>
    );
}
