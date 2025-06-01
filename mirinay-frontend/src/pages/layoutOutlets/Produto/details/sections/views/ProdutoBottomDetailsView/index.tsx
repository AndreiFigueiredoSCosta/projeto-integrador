import ViewContainer from "../../../../../../../components/view/ViewContainer";
import {ReactNode, useEffect, useState} from "react";
import useView from "../../../../../../../hooks/useView.ts";
import ProdutoSimilarDetailsTable from "../../tables/ProdutoSimilarDetailsTable";
import ProdutoSimilarSubmitForm from "../../forms/ProdutoSimilarSubmitForm";
import ProdutoComponenteDetailsTable from "../../tables/ProdutoComponenteDetailsTable";
import ProdutoComponenteSubmitForm from "../../forms/ProdutoComponenteSubmitForm";
import ProdutoConjuntoDetailsTable from "../../tables/ProdutoConjuntoDetailsTable";
import ProdutoConjuntoSubmitForm from "../../forms/ProdutoConjuntoSubmitForm";

/**
 * View do rodapé dos detalhes de grupo (gerencia a troca de views, se houver)
 * @constructor
 */
export default function ProdutoBottomDetailsView(){
    const context = useView();
    const [ viewContent, setViewContent ] = useState<ReactNode>(null);

    // Gerencia qual view será renderizada de acordo com o título da view atual
    useEffect(() => {
            let content: ReactNode;
            switch (context.currentView.title){
                case "Similares":
                    content = (
                        <>
                            <ProdutoSimilarDetailsTable />
                            <ProdutoSimilarSubmitForm />
                        </>
                    );
                    break;
                case "Componentes":
                    content = (
                        <>
                            <ProdutoComponenteDetailsTable />
                            <ProdutoComponenteSubmitForm />
                        </>
                    );
                    break;
                case "Conjuntos":
                    content = (
                        <>
                            <ProdutoConjuntoDetailsTable />
                            <ProdutoConjuntoSubmitForm />
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
