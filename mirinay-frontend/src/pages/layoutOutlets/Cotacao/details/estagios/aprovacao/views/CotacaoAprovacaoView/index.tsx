import {ReactNode, useEffect, useState} from "react";
import useView from "../../../../../../../../hooks/useView.ts";
import ViewContainer from "../../../../../../../../components/view/ViewContainer";
import CotacaoAprovacaoTable from "../../tables/CotacaoAprovacaoTable";

/**
 * View do rodapé dos detalhes de grupo (gerencia a troca de views, se houver)
 * @constructor
 */
export default function CotacaoAprovacaoView(){
    const context = useView();
    const [ viewContent, setViewContent ] = useState<ReactNode>(null);

    // Gerencia qual view será renderizada de acordo com o título da view atual
    useEffect(() => {
            let content: ReactNode;
            switch (context.currentView.title){
                case "Produtos":
                    content = (
                        <>
                            <CotacaoAprovacaoTable />
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
