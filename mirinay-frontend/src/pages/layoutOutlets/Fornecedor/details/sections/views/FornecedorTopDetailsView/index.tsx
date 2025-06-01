import ViewContainer from "../../../../../../../components/view/ViewContainer";
import useView from "../../../../../../../hooks/useView.ts";
import {ReactNode, useEffect, useState} from "react";
import FornecedorDetailsDataTable from "../../tables/FornecedorDetailsDataTable";

/**
 * View do topo dos detalhes de grupo (gerencia a troca de views, se houver)
 * @constructor
 */
export default function FornecedorTopDetailsView(){
    const context = useView();
    const [ viewContent, setViewContent ] = useState<ReactNode>(null);

    // Gerencia qual view será renderizada de acordo com o título da view atual
    useEffect(() => {
            switch (context.currentView.title){
                case "Informacões":
                    setViewContent(
                        <>
                            <FornecedorDetailsDataTable />
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
