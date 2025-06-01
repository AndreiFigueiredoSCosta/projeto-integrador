import { memo, useEffect } from "react";
import { TableContainer } from "../../../../../../components/table/TableContainer";
import KanbanCol from "../../../../../../components/kanban/KanbanCol";
import KanbanContainer from "../../../../../../components/kanban/KanbanContainer";
import EstagioEnum from "../../../../../../enums/EstagioEnum.ts";
import useKanbanColContentFilter from "../../../../../../hooks/useKanbanColContentFilter.tsx";
import { useFetch } from "../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useView from "../../../../../../hooks/useView.ts";
import { useErrorHandling } from "../../../../../../hooks/useErrorHandling.ts";
import CotacaoKanbanItem from "../../../components/rows/CotacaoKanbanItem";
import CotacaoResponseData from "../../../../../../models/cotacao/CotacaoResponseData.ts";
import useSearch from "../../../../../../hooks/useSearch.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent";

/**
 * Tabela de exibição de cotações
 */
const CotacaoKanban = memo( function CotacaoKanban () {
    const { refresh, currentView } = useView();
    currentView.endpoint = useEndpoint().cotacao().GET().todos;
    const { currentEndpoint } = useSearch();
    const { data, isLoading, isError, error, toggleRequest } = useFetch<CotacaoResponseData>(currentEndpoint);

    useEffect(() => {
        toggleRequest();
    }, [refresh, toggleRequest]);

    const revisaoContent = useKanbanColContentFilter<CotacaoResponseData>({
        isLoading: isLoading,
        data: data as CotacaoResponseData[],
        contentFunction: (data) => {
            return (
                <CotacaoKanbanItem
                    data={data}
                    redirectTo={`/detalhes/revisao/${data.requisicaoId}`}
                />
            );
        },
        filterHeader: "estagio",
        filterValue: EstagioEnum.REVISAO
    });

    const cotacaoContent = useKanbanColContentFilter<CotacaoResponseData>({
        isLoading: isLoading,
        data: data as CotacaoResponseData[],
        contentFunction: (data) => {
            return (
                <CotacaoKanbanItem
                    data={data}
                    redirectTo={`/detalhes/cotacao/${data.requisicaoId}`}
                />
            );
        },
        filterHeader: "estagio",
        filterValue: EstagioEnum.COTACAO
    });

    const aprovacaoContent = useKanbanColContentFilter<CotacaoResponseData>({
        isLoading: isLoading,
        data: data as CotacaoResponseData[],
        contentFunction: (data) => {
            return (
                <CotacaoKanbanItem
                    data={data}
                    redirectTo={`/detalhes/aprovacao/${data.requisicaoId}`}
                />
            );
        },
        filterHeader: "estagio",
        filterValue: EstagioEnum.APROVACAO
    });

    useErrorHandling(isError, error, "Erro ao carregar cotações");

    return (
        <TableContainer barContent={
            <TopBarContent
                hasPagination={false}
                hasSearch={true}
            />}
        >
            <KanbanContainer>
                <KanbanCol title={"Revisão"} color={"alt-green"}>
                    {revisaoContent}
                </KanbanCol>
                <KanbanCol title={"Cotação"} color={"black"}>
                    {cotacaoContent}
                </KanbanCol>
                <KanbanCol title={"Aprovação"} color={"red"}>
                    {aprovacaoContent}
                </KanbanCol>
            </KanbanContainer>
        </TableContainer>)
});

export default CotacaoKanban;
