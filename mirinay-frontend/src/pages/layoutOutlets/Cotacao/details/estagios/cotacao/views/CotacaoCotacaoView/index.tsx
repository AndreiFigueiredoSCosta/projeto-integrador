import {ReactNode, useEffect, useState} from "react";
import useView from "../../../../../../../../hooks/useView.ts";
import ViewContainer from "../../../../../../../../components/view/ViewContainer";
import CotacaoCotacaoProdutoTable from "../../tables/CotacaoCotacaoProdutoTable";
import CotacaoCotacaoFornecedorTable from "../../tables/CotacaoCotacaoFornecedorTable";
import CotacaoCotacaoForm from "../../forms/CotacaoCotacaoForm";
import CotacaoCotacaoCotacaoResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoCotacaoResponseData.ts";
import CotacaoCotacaoFornecedorItemResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoFornecedorItemResponseData.ts";
import CotacaoCotacaoItemResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoItemResponseData.ts";

/**
 * View do rodapé dos detalhes de grupo (gerencia a troca de views, se houver)
 * @constructor
 */
export default function CotacaoCotacaoView(){
    const context = useView();
    const [ viewContent, setViewContent ] = useState<ReactNode>(null);
    const [ cotacao, setCotacao ] = useState<CotacaoCotacaoCotacaoResponseData | CotacaoCotacaoFornecedorItemResponseData | undefined>(undefined);
    const [ item, setItem ] = useState< CotacaoCotacaoItemResponseData | undefined>(undefined);

    // Gerencia qual view será renderizada de acordo com o título da view atual
    useEffect(() => {
            let content: ReactNode;
            switch (context.currentView.title){
                case "Produtos":
                    content = (
                        <CotacaoCotacaoProdutoTable
                            setCotacao={setCotacao}
                            setItem={setItem}
                        />
                    );
                    break;
                case "Fornecedores":
                    content = (
                        <CotacaoCotacaoFornecedorTable
                            setSelected={setCotacao}
                        />
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
            <CotacaoCotacaoForm
                cotacao={cotacao}
                item={item}
            />
        </ViewContainer>
    );
}
