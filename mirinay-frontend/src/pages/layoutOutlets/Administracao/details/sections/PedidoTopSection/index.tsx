import ViewManager from "../../../../../../components/view/ViewManager";
import {useEffect} from "react";
import useView from "../../../../../../hooks/useView.ts";
import PedidoTopDetailsView from "../views/PedidoTopDetailsView/index.tsx";
import { NfeEnum } from "../../../../../../enums/NfeEnum.ts";
import "./style.css";
import ViewProperties, {defaultViewProperties} from "../../../../../../models/view/ViewProperties.ts";

/**
 * Seção superior dos detalhes de grupo (Responsável por inicializar propriedades de view)
 * @constructor
 */

interface PedidoTopSectionProps {
    setDataNfeEnum: (data: NfeEnum) => void;
}

export default function PedidoTopSection({ setDataNfeEnum }: PedidoTopSectionProps) {
    const context = useView();

    // Adiciona a view de informações ao contexto de views
    useEffect(() => {
        if (!context.currentView.title){
            const pedidoDataView = {
                ...defaultViewProperties,
                title: "Informações"
            } as ViewProperties;


            context.addView(pedidoDataView);
            context.setCurrentView(pedidoDataView);
        }
    }, [context]);

    return (
        <div className={"grupo-top-section"}>
            <ViewManager hasSubmitContainer={false} size={"small"}/>
            <PedidoTopDetailsView setDataNfeEnum={setDataNfeEnum}/>
        </div>
    );
}
