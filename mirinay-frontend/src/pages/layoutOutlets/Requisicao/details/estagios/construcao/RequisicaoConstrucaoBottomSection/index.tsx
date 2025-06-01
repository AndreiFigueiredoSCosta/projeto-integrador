import useView from "../../../../../../../hooks/useView.ts";
import {useEffect} from "react";
import ViewProperties, {defaultViewProperties} from "../../../../../../../models/view/ViewProperties.ts";
import ViewManager from "../../../../../../../components/view/ViewManager";
import RequisicaoConstrucaoView from "../views/RequisicaoConstrucaoView";

/**
 * Seção inferior dos detalhes de grupo (Responsável por inicializar propriedades de view)
 * @constructor
 */
export default function RequisicaoConstrucaoBottomSection(){
    const context = useView();

    // Adiciona as views de subgrupos ao contexto de views
    useEffect(() => {
        if (!context.currentView.title){
            const view = {
                ...defaultViewProperties,
                title: "Produtos"
            } as ViewProperties

            context.addView(view);
            context.setCurrentView(view);
        }

    }, [context]);

    return (
        <div className={"grupo-bottom-section"}>
            <ViewManager hasSubmitContainer={true} size={"small"} submitBtnText={"inserir"} />
            <RequisicaoConstrucaoView/>
        </div>
    );
}
