import GrupoResponseData from "../../../../../../models/grupo/response/GrupoResponseData.ts";
import {memo, useEffect} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import GrupoRow from "../../../components/rows/GrupoRow";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import GrupoHeader from "../../../components/headers/GrupoHeader";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import useSearch from "../../../../../../hooks/useSearch.ts";

interface GrupoTableProps {
    handleInsert: (info: GrupoResponseData) => void;
}

/**
 * Tabela de exibição de grupos/subgrupos
 */
const GrupoTable = memo( function GrupoTable ({handleInsert} : GrupoTableProps) {
    const { currentView, refresh } = useView();
    currentView.endpoint = useEndpoint().grupo().informacoes().todos;

    const { currentEndpoint } = useSearch();

    const { toggleRequest, data, isLoading, error, isError } = useFetch<GrupoResponseData>(currentEndpoint);

    // Primeira ativação da request para a API quando o componente é carregado (busca de dados inicial)
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh]);

    const contentFunction =
        (dados: GrupoResponseData, index: number) => {
        return (
            <GrupoRow handleInsert={handleInsert} stripped={index % 2 == 1} data={dados}/>
        );
    }

    const content = useTableContent<GrupoResponseData>({
        isLoading,
        error,
        isError,
        data: data as GrupoResponseData[],
        errorMessage: "Erro ao carregar grupos",
        contentFunction: contentFunction,
        beforeContent: () => <GrupoHeader />,
        currentView
    });

    return (
        <TableContainer barContent={
            <TopBarContent
                hasSearch={true}
                hasPagination={true}
            />
        }>
            {content}
        </TableContainer>)
});

export default GrupoTable;
