import {memo, ReactNode, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import GrupoProdRow from "../../../components/rows/GrupoProdRow/index.tsx";
import GrupoResponseData from "../../../../../../models/grupo/response/GrupoResponseData.ts";
import useView from "../../../../../../hooks/useView.ts";
import ProdutoResponseData from "../../../../../../models/produto/response/ProdutoResponseData.ts";
import useSearch from "../../../../../../hooks/useSearch.ts";
import ProdutoGrupoHeader from "../../../components/headers/ProdutoGrupoHeader";
import ProdutoRow from "../../../components/rows/ProdutoRow";
import ProdutoHeader from "../../../components/headers/ProdutoHeader";
import ViewProperties from "../../../../../../models/view/ViewProperties.ts";

interface ProdutoSimilarProps {
    handleInsert: (info: ProdutoResponseData) => void;
}

/**
 * Tabela de exibição de produtos/similares
 */
const ProdutoTable = memo( function ProdutoSimilar ({handleInsert} : ProdutoSimilarProps) {
    const { currentView, refresh } = useView();
    currentView.endpoint = useEndpoint().grupo().informacoes().todos;

    const { currentEndpoint, isSearching, currentSearchView } = useSearch();

    const { toggleRequest, error, isError, data, isLoading } = useFetch(currentEndpoint);
    const [ tableContent, setTableContent ] = useState<ReactNode>(null);

    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh]);

    const produtoFunction = (dados: ProdutoResponseData, index: number) => {
        return (
            <ProdutoRow handleInsert={handleInsert} stripped={index % 2 == 1} data={dados} />
        );
    }

    const grupoFunction = (dados: GrupoResponseData, index: number) => {
        return (
            <GrupoProdRow handleInsert={handleInsert} stripped={index % 2 == 1} data={dados as GrupoResponseData} />
        );
    }

    const produtoContent = useTableContent({
            isLoading,
            error,
            isError,
            data: isSearching ?  data as ProdutoResponseData[] : null,
            errorMessage: "Erro ao carregar produtos",
            contentFunction: produtoFunction,
            currentView: currentSearchView as unknown as ViewProperties,
            beforeContent: () =>  <ProdutoHeader/>,
        });

    const grupoContent = useTableContent({
            isLoading,
            error,
            isError,
            data: !isSearching ?  data as GrupoResponseData[] : null,
            errorMessage: "Erro ao carregar grupos",
            contentFunction: grupoFunction,
            currentView: currentView,
            beforeContent: () => <ProdutoGrupoHeader />,
        });

    useEffect(() => {
        if (isSearching) {
            setTableContent(produtoContent);
        }
        else {
            setTableContent(grupoContent);
        }
    }, [isSearching, produtoContent, grupoContent]);

    return (
        <TableContainer barContent={
            <TopBarContent
                hasPagination={true}
                hasSearch={true}
            />}
        >
            {tableContent}
        </TableContainer>)
});

export default ProdutoTable;
