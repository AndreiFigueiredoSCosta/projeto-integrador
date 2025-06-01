import {memo, useEffect} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import useSearch from "../../../../../../hooks/useSearch.ts";
import FornecedorHeader from "../../../components/headers/FornecedorHeader";
import FornecedorRow from "../../../components/rows/FornecedorRow";
import FornecedorResponseData from "../../../../../../models/fornecedor/response/FornecedorResponseData.ts";

interface ProdutoSimilarProps {
    handleInsert: (info: FornecedorResponseData) => void;
}

/**
 * Tabela de exibição de produtos/similares
 */
const FornecedorTable = memo( function FornecedorTable ({handleInsert} : ProdutoSimilarProps) {
    const { currentView, refresh } = useView();
    currentView.endpoint = useEndpoint().fornecedor().informacoes().todos;

    const { currentEndpoint } = useSearch();
    const { toggleRequest, error, isError, data, isLoading } = useFetch<FornecedorResponseData>(currentEndpoint);

    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh]);

    const contentFunction = (dados: FornecedorResponseData, index: number) => {
        return (
            <FornecedorRow handleInsert={handleInsert} stripped={index % 2 == 1} data={dados}/>
        );
    }

    const content = useTableContent<FornecedorResponseData>({
        isLoading,
        error,
        isError,
        data:data as FornecedorResponseData[],
        errorMessage: "Erro ao carregar fornecedores!",
        contentFunction: contentFunction,
        currentView: currentView,
        beforeContent: () => <FornecedorHeader />,
    });

    return (
        <TableContainer barContent={
            <TopBarContent hasSearch={true} hasPagination={true} />}
        >
            {content}
        </TableContainer>)
});

export default FornecedorTable;
