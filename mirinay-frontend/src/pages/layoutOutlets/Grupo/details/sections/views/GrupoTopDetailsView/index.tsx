import ViewContainer from "../../../../../../../components/view/ViewContainer";
import GrupoDetailsDataTable from "../../tables/GrupoDetailsDataTable";
import useView from "../../../../../../../hooks/useView.ts";
import {ReactNode, useEffect, useState} from "react";

/**
 * View do topo dos detalhes de grupo (gerencia a troca de views, se houver)
 * @constructor
 */
export default function GrupoTopDetailsView(){
    const context = useView();
    const [ viewContent, setViewContent ] = useState<ReactNode>(null);

    // Gerencia qual view será renderizada de acordo com o título da view atual
    useEffect(() => {
            switch (context.currentView.title){
                case "Informações":
                    setViewContent(
                        <>
                            <GrupoDetailsDataTable/>
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
