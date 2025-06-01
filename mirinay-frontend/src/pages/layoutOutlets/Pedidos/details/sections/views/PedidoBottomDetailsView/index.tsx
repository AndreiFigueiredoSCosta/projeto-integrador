import ViewContainer from "../../../../../../../components/view/ViewContainer/index.tsx";
import {ReactNode, useEffect, useState} from "react";
import useView from "../../../../../../../hooks/useView.ts";
import ConcluidosDetailsTable from "../../tables/ConcluidoDetailsTable/index.tsx";
/**
 * View do rodapé dos detalhes de grupo (gerencia a troca de views, se houver)
 * @constructor
 */
export default function PedidoBottomDetailsView(){
    const context = useView();
    const [ viewContent, setViewContent ] = useState<ReactNode>(null);

    // Gerencia qual view será renderizada de acordo com o título da view atual
    useEffect(() => {
            let content: ReactNode;
            switch (context.currentView.title){
                case "Produtos":
                    content = (
                        <>
                            <ConcluidosDetailsTable />
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
