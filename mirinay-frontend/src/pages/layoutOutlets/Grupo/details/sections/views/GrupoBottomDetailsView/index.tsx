import ViewContainer from "../../../../../../../components/view/ViewContainer";
import {ReactNode, useEffect, useState} from "react";
import useView from "../../../../../../../hooks/useView.ts";
import GrupoSubgrupoDetailsTable from "../../tables/GrupoSubgrupoDetailsTable";
import SubgrupoSubmitForm from "../../forms/SubgrupoSubmitForm";

/**
 * View do rodapé dos detalhes de grupo (gerencia a troca de views, se houver)
 * @constructor
 */
export default function GrupoBottomDetailsView(){
    const context = useView();
    const [ viewContent, setViewContent ] = useState<ReactNode>(null);

    // Gerencia qual view será renderizada de acordo com o título da view atual
    useEffect(() => {
            let content: ReactNode;
            switch (context.currentView.title){
                case "Subgrupos":
                    content = (
                        <>
                            <GrupoSubgrupoDetailsTable />
                            <SubgrupoSubmitForm />
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
