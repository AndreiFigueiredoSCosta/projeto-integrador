import {memo, ReactNode, useEffect, useState} from "react";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import KanbanContainer from "../../../../../../components/kanban/KanbanContainer";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useView from "../../../../../../hooks/useView.ts";
import {useErrorHandling} from "../../../../../../hooks/useErrorHandling.ts";
import randomKey from "../../../../../../utils/randomKey.ts";
import {UnificacaoCol} from "../../../components/UnificacaoCol";
import {UnificacaoResponseData} from "../../../../../../models/unificacao/UnificacaoResponseData.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import useSearch from "../../../../../../hooks/useSearch.ts";

type UnificacaoKanbanProps = {
    handleSelect: (data: UnificacaoResponseData) => void,
}

/**
 * Tabela de exibição de itens de requisição com destino de estoque para unificação.
 */
const UnificacaoKanban = memo(function UnificacaoKanban({handleSelect}: UnificacaoKanbanProps) {
    const {refresh, currentView} = useView();
    currentView.endpoint = `${useEndpoint().unificacao().todos}`;

    const { currentEndpoint } = useSearch();

    const [content, setContent] = useState<ReactNode>();
    const {data, isLoading, isError, error, toggleRequest} = useFetch<UnificacaoResponseData>(currentEndpoint);

    useEffect(() => {
        toggleRequest();
    }, [refresh, toggleRequest]);

    useEffect(() => {
        if (data) {
            insertGrupoCols();
        }
    }, [data]);

    const getGrupos = (dados: UnificacaoResponseData[]): string[] => {
        let grupos: string[] = [];
        dados.map((dado) => {
            if (!grupos.includes(dado.grupo)) {
                grupos.push(dado.grupo);
            }
        });
        return grupos;
    }

    const insertGrupoCols = () => {
        const grupos = getGrupos(data as UnificacaoResponseData[]);
        const cols = grupos.map((grupo) => {
            return (
                <UnificacaoCol
                    key={randomKey()}
                    grupo={grupo}
                    data={data as UnificacaoResponseData[]}
                    isLoading={isLoading}
                    handleSelect={handleSelect}
                />
            );
        });
        setContent(cols);
    }

    useErrorHandling(isError, error, "Erro ao carregar itens para unificar!");

    return (
        <TableContainer barContent={
            <TopBarContent
                hasSearch={true}
                hasPagination={false}
            />}>

            <KanbanContainer>
                {content}
            </KanbanContainer>
        </TableContainer>)
});

export default UnificacaoKanban;
