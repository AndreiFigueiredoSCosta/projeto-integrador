import {memo, useEffect, useState} from "react";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import KanbanCol from "../../../../../../components/kanban/KanbanCol";
import KanbanContainer from "../../../../../../components/kanban/KanbanContainer";
import RequisicaoKanbanContentBar from "../../../components/RequisicaoKanbanBarContent";
import RequisicaoResponseData from "../../../../../../models/requisicao/RequisicaoResponseData.ts";
import EstagioEnum from "../../../../../../enums/EstagioEnum.ts";
import DestinoEnum from "../../../../../../enums/DestinoEnum.ts";
import RequisicaoKanbanItem from "../../../components/rows/RequisicaoKanbanItem";
import useKanbanColContentFilter from "../../../../../../hooks/useKanbanColContentFilter.tsx";
import { useFetch } from "../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useView from "../../../../../../hooks/useView.ts";
import {useErrorHandling} from "../../../../../../hooks/useErrorHandling.ts";
import {Item, StageHeader} from "../../../../../../components/StageHeader";
import {Clock} from "../../../../../../assets/stage/Clock";
import {Warning} from "../../../../../../assets/stage/Warning";
import {Success} from "../../../../../../assets/stage/Success";
import useSearch from "../../../../../../hooks/useSearch.ts";

/**
 * Tabela de exibição de requisiçoes em formato de kanban
 */
const RequisicaoKanban = memo( function RequisicaoKanban () {
    const [ destino, setDestino ] = useState<string>("VENDA");
    const { refresh, currentView } = useView();
    currentView.endpoint = useEndpoint().requisicao().informacoes().todos

    const { currentEndpoint, addSearchView } = useSearch();

    useEffect(() => {
        addSearchView("Código da requisição", useEndpoint().requisicao().search().pendente().id);
        addSearchView("Nome da requisição", useEndpoint().requisicao().search().pendente().nome);
    }, []);

    const [ cotacaoEstagio, setCotacaoEstagio ] = useState<EstagioEnum>(EstagioEnum.REVISAO);
    const [ cotacaoHeaderContentItems, setCotacaoHeaderContentItems ] = useState<Item[]>();
    const { data, isLoading, isError, error, toggleRequest } = useFetch<RequisicaoResponseData>(`${currentEndpoint}&destino=${destino}`);

    useEffect(() => {
        toggleRequest();
    }, [refresh, toggleRequest]);

    useEffect(() => {
        if (destino === DestinoEnum.VENDA) {
            setCotacaoHeaderContentItems([
                {
                    text: "Revisando",
                    color: "alt-green",
                    icon: <Clock />,
                    onChange: () => {
                        setCotacaoEstagio(EstagioEnum.REVISAO);
                    }
                },
                {
                    text: "Cotando",
                    color: "yellow",
                    icon: <Warning />,
                    onChange: () => {
                        setCotacaoEstagio(EstagioEnum.COTACAO);
                    }
                }
            ]);
        } else {
            setCotacaoHeaderContentItems([
                {
                    text: "Revisando",
                    color: "alt-green",
                    icon: <Clock />,
                    onChange: () => {
                        setCotacaoEstagio(EstagioEnum.REVISAO);
                    }
                },
                {
                    text: "Cotando",
                    color: "yellow",
                    icon: <Warning />,
                    onChange: () => {
                        setCotacaoEstagio(EstagioEnum.COTACAO);
                    }
                },
                {
                    text: "Aprovando",
                    color: "red",
                    icon: <Success/>,
                    onChange: () => {
                        setCotacaoEstagio(EstagioEnum.VALIDACAO);
                    }
                }]);
        }
    }, [destino]);

    const construcaoContent = useKanbanColContentFilter<RequisicaoResponseData>({
        isLoading: isLoading,
        data: data as RequisicaoResponseData[],
        contentFunction: (data) => {
            return (
                <RequisicaoKanbanItem
                    data={data}
                    redirectTo={`/requisicao/detalhes/construcao/${data.requisicaoId}`}
                />
            );
        },
        filterHeader: "estagioEnum",
        filterValue: EstagioEnum.CONSTRUCAO
    });

    const cotacaoContent = useKanbanColContentFilter<RequisicaoResponseData>({
        isLoading: isLoading,
        data: data as RequisicaoResponseData[],
        contentFunction: (data) => {
            return (
                <RequisicaoKanbanItem
                    data={data}
                    redirectTo={`/requisicao/detalhes/cotacao/${data.requisicaoId}`}
                />
            );
        },
        filterHeader: "estagioEnum",
        filterValue: cotacaoEstagio
    });

    const aprovacaoContent = useKanbanColContentFilter<RequisicaoResponseData>({
        isLoading: isLoading,
        data: data as RequisicaoResponseData[],
        contentFunction: (data) => {
            return (
                <RequisicaoKanbanItem
                    data={data}
                    redirectTo={`/requisicao/detalhes/aprovacao/${data.requisicaoId}`}
                />
            );
        },
        filterHeader: "estagioEnum",
        filterValue: EstagioEnum.VALIDACAO
    });

    const pedidoContent = useKanbanColContentFilter<RequisicaoResponseData>({
        isLoading: isLoading,
        data: data as RequisicaoResponseData[],
        contentFunction: (data) => {
            return (
                <RequisicaoKanbanItem
                    data={data}
                    redirectTo={`/requisicao/detalhes/pedido/${data.requisicaoId}`}
                />
            );
        },
        filterHeader: "estagioEnum",
        filterValue: EstagioEnum.PEDIDO
    });

    const cotacaoHeaderContent = (
        <StageHeader items={cotacaoHeaderContentItems}/>
    );

    useErrorHandling(isError, error, "Erro ao carregar requisições");

    return (
        <TableContainer barContent={<RequisicaoKanbanContentBar destino={destino} setDestino={setDestino}/>}>
            <KanbanContainer>
                <KanbanCol title={"Construção"} color={"alt-green"}>
                    {construcaoContent}
                </KanbanCol>
                <KanbanCol title={"Cotação"} color={"black"} headerContent={cotacaoHeaderContent}>
                    {cotacaoContent}
                </KanbanCol>
                {
                    !(destino === DestinoEnum.ESTOQUE) &&
                    <KanbanCol title={"Aprovação"} color={"red"}>
                        {aprovacaoContent}
                    </KanbanCol>
                }
                <KanbanCol title={"Pedido"} color={"green"}>
                    {pedidoContent}
                </KanbanCol>
            </KanbanContainer>
        </TableContainer>)
});

export default RequisicaoKanban;
