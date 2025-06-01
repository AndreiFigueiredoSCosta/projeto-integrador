import {memo, useEffect} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import useSearch from "../../../../../../hooks/useSearch.ts";
import TransportadorHeader from "../../../components/headers/TransportadorHeader";
import TransportadorRow from "../../../components/rows/TransportadorRow";
import TransportadorResponseData from "../../../../../../models/transportador/response/TransportadorResponseData.ts";

interface ProdutoSimilarProps {
    handleInsert: (info: TransportadorResponseData) => void;
}

/**
 * Tabela de exibição de produtos/similares
 */
const TransportadorTable = memo( function TransportadorTable ({handleInsert} : ProdutoSimilarProps) {
    const { currentView, refresh } = useView();
    const { currentEndpoint } = useSearch();
    currentView.endpoint = useEndpoint().transportador().informacoes().todos;
    const { toggleRequest, error, isError, data, isLoading } = useFetch<TransportadorResponseData>(currentEndpoint);

    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh]);

    const contentFunction = (dados: TransportadorResponseData, index: number) => {
        return (
            <TransportadorRow handleInsert={handleInsert} stripped={index % 2 == 1} data={dados}/>
        );
    }

    const content = useTableContent<TransportadorResponseData>({
        isLoading,
        error,
        isError,
        data:data as TransportadorResponseData[],
        errorMessage: "Erro ao carregar transportadores",
        contentFunction: contentFunction,
        currentView: currentView,
        beforeContent: () => <TransportadorHeader />,
    });

    return (
        <TableContainer barContent={
            <TopBarContent
                hasSearch={true}
                hasPagination={true}
            />}
        >
            {content}
        </TableContainer>)
});

export default TransportadorTable;
