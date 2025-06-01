import ViewManager from "../../../../../../components/view/ViewManager";
import {useEffect} from "react";
import useView from "../../../../../../hooks/useView.ts";

import "./style.css";
import PedidoBottomDetailsView from "../views/PedidoBottomDetailsView/index.tsx";
import ViewProperties, {defaultViewProperties} from "../../../../../../models/view/ViewProperties.ts";

/**
 * Seção inferior dos detalhes de grupo (Responsável por inicializar propriedades de view)
 * @constructor
 */
export default function PedidoBottomSection(){
    const context = useView();

    // Adiciona as views de pedidos ao contexto de views
    useEffect(() => {
        if (!context.currentView.title){
            const pedidosView = {
                ...defaultViewProperties,
                title: "Produtos",

            } as ViewProperties

            context.addView(pedidosView);
            context.setCurrentView(pedidosView);
        }

    }, [context]);

    return (
        <div className={"grupo-bottom-section"}>
            <ViewManager hasSubmitContainer={false} size={"small"} submitBtnText={"inserir"} />
            <PedidoBottomDetailsView/>
        </div>
    );
}
