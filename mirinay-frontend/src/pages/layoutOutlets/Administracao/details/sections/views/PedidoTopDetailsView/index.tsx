import ViewContainer from "../../../../../../../components/view/ViewContainer/index.tsx";
import PedidoDetailsDataTable from "../../tables/PedidosDetailsDataTable/index.tsx";
import useView from "../../../../../../../hooks/useView.ts";
import {ReactNode, useEffect, useState} from "react";
import NfeEnum from "../../../../../../../enums/NfeEnum.ts";

/**
 * View do topo dos detalhes de grupo (gerencia a troca de views, se houver)
 * @constructor
 */

interface PedidoTopDetailsViewProps {
    setDataNfeEnum: (data: NfeEnum | undefined) => void;
}

export default function PedidoTopDetailsView({ setDataNfeEnum }: PedidoTopDetailsViewProps) {
    const context = useView();
    const [ viewContent, setViewContent ] = useState<ReactNode>(null);

    // Gerencia qual view será renderizada de acordo com o título da view atual
    useEffect(() => {
            switch (context.currentView.title){
                case "Informações":
                    setViewContent(
                        <>
                            <PedidoDetailsDataTable setDataNfeEnum={setDataNfeEnum}/>
                        </>
                    );
                    break;
                default:
                    setViewContent(null);
            }
    }, [context.currentView.title]);

    return (
        <ViewContainer>
            {viewContent}
        </ViewContainer>
    );
}
