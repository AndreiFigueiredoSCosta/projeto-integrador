import {ReactNode, useEffect, useState} from "react";
import useView from "../../../../../../../../hooks/useView.ts";
import ViewContainer from "../../../../../../../../components/view/ViewContainer";
import RequisicaoPedidoTable from "../../tables/RequisicaoPedidoTable";

/**
 * View do rodapé dos detalhes de grupo (gerencia a troca de views, se houver)
 * @constructor
 */
export default function RequisicaoPedidoView(){
    const context = useView();
    const [ viewContent, setViewContent ] = useState<ReactNode>(null);

    // Gerencia qual view será renderizada de acordo com o título da view atual
    useEffect(() => {
            let content: ReactNode;
            switch (context.currentView.title){
                case "Produtos":
                    content = (
                        <>
                            <RequisicaoPedidoTable />
                        </>
                    );
                    break;
                default:
                    content = null;
            }

            setViewContent(content)
    }, [context.currentView.title]);

    return (
        <ViewContainer>
            {
                viewContent
            }
        </ViewContainer>
    );
}
