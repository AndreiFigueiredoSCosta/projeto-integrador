import {ReactNode, useEffect, useState} from "react";
import useView from "../../../../../../../../hooks/useView.ts";
import ViewContainer from "../../../../../../../../components/view/ViewContainer";
import CotacaoRevisaoProdutoTable from "../../tables/CotacaoRevisaoProdutoTable";
import CotacaoRevisaoFornecedorTable from "../../tables/CotacaoRevisaoFornecedorTable";
import CotacaoRevisaoFornecedorForm from "../../forms/CotacaoRevisaoFornecedorForm";
import CotacaoRevisaoProdutoForm from "../../forms/CotacaoRevisaoProdutoForm";

/**
 * View do rodapé dos detalhes de grupo (gerencia a troca de views, se houver)
 * @constructor
 */
export default function CotacaoRevisaoView(){
    const context = useView();
    const [ viewContent, setViewContent ] = useState<ReactNode>(null);

    // Gerencia qual view será renderizada de acordo com o título da view atual
    useEffect(() => {
            let content: ReactNode;
            switch (context.currentView.title){
                case "Produtos":
                    content = (
                        <>
                            <CotacaoRevisaoProdutoTable />
                            <CotacaoRevisaoProdutoForm />
                        </>
                    );
                    break;
                case "Fornecedores":
                    content = (
                        <>
                            <CotacaoRevisaoFornecedorTable />
                            <CotacaoRevisaoFornecedorForm />
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
