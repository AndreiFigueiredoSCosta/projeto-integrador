import ViewContainer from "../../../../../../../components/view/ViewContainer";
import useView from "../../../../../../../hooks/useView.ts";
import {ReactNode, useEffect, useState} from "react";
import ProdutoDetailsDataTable from "../../tables/ProdutoDetailsDataTable";

/**
 * View do topo dos detalhes de grupo (gerencia a troca de views, se houver)
 * @constructor
 */
export default function ProdutoTopDetailsView(){
    const context = useView();
    const [ viewContent, setViewContent ] = useState<ReactNode>(null);

    // Gerencia qual view será renderizada de acordo com o título da view atual
    useEffect(() => {
            switch (context.currentView.title){
                case "Informações":
                    setViewContent(
                        <>
                            <ProdutoDetailsDataTable />
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
