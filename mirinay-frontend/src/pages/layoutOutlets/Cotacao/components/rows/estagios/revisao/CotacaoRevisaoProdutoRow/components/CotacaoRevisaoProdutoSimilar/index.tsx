import {useParams} from "react-router-dom";
import useEndpoint from "../../../../../../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../../../../../../hooks/useFetch.ts";
import useTableContent from "../../../../../../../../../../hooks/useTableContent.tsx";
import CotacaoRevisaoProdutoSimilarResponseData
    from "../../../../../../../../../../models/cotacao/revisao/response/CotacaoRevisaoProdutoSimilarResponseData.ts";
import CotacaoRevisaoProdutoSimilarHeader from "./components/CotacaoRevisaoProdutoSimilarHeader";
import {useEffect, useState} from "react";
import CotacaoRevisaoProdutoSimilarRow from "./components/CotacaoRevisaoProdutoSimilarRow";
import useDropdown from "../../../../../../../../../../hooks/useDropdown.ts";

interface ClonagemFornecedorRowProps {
    itemId: number
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function CotacaoRevisaoProdutoSimilar({itemId}
                                                         : ClonagemFornecedorRowProps) {
    const id = useParams().requisicaoId as unknown as number;
    const { rowRefresh } = useDropdown();
    const endpoint = useEndpoint().cotacao().GET().detalhes(id).revisao().produto().similaresDeItem(itemId);
    const {data, isLoading, isError, error, toggleRequest} = useFetch<CotacaoRevisaoProdutoSimilarResponseData>(endpoint);
    const [ mappedData, setMappedData ] = useState<CotacaoRevisaoProdutoSimilarResponseData[]>();

    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, rowRefresh]);

    useEffect(() => {
        const mapped = data as CotacaoRevisaoProdutoSimilarResponseData[];
        const selecionado = mapped?.filter((item) => item.selecionado);

        return setMappedData(selecionado?.concat(mapped?.filter((item) => !item.selecionado)));
    }, [data, setMappedData, isLoading]);

    const contentFunction = (dados: CotacaoRevisaoProdutoSimilarResponseData, index: number)=> {
        return (
            <CotacaoRevisaoProdutoSimilarRow
                data={dados}
                stripped={index%2 == 0}
                itemId={itemId}
            />
        );
    }

    const content = useTableContent<CotacaoRevisaoProdutoSimilarResponseData>({
        data: mappedData as CotacaoRevisaoProdutoSimilarResponseData[],
        error,
        isError,
        isLoading,
        beforeContent: () => <CotacaoRevisaoProdutoSimilarHeader />,
        contentFunction,
        limited: false,
        errorMessage: "Erro ao carregar similares!"
    })

    return (
        <>
            {content}
        </>
    );
}
