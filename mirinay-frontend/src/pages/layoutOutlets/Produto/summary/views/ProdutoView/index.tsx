import ProdutoTable from "../../tables/ProdutoTable/index.tsx";
import ProdutoSimilarSubmitForm from "../../forms/ProdutoSimilarSubmitForm/index.tsx";
import {useCallback, useState} from "react";
import ProdutoResponseData  from "../../../../../../models/produto/response/ProdutoResponseData.ts";
import useView from "../../../../../../hooks/useView.ts";
import ViewContainer from "../../../../../../components/view/ViewContainer";

/**
 * Gerencia a comunicação entre os componentes da view de produto
 * @constructor
 */
export default function ProdutoView(){
    const [ produto, setProduto ] = useState<ProdutoResponseData>();
    const context = useView();

    // handleInsert function
    const handleInsert = useCallback((info: ProdutoResponseData) => {
        if (info) {
            setTimeout(() => setProduto(info), 0);
        }

        // usa o setIsModalVisible para abrir o modal de forma que não atualize o estado da tabela de produto
        context.setIsSubmitContainerVisible((prevState) => {
            if (!prevState) {
                return true;
            }
            else{
                return prevState;
            }
        })
    }, [context]);

    return (
        <ViewContainer>
            <ProdutoTable handleInsert={handleInsert}/>
            <ProdutoSimilarSubmitForm produto={produto}/>
        </ViewContainer>
    );
}
