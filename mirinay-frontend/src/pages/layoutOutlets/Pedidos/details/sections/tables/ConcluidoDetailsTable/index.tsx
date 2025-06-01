import {TableContainer} from "../../../../../../../components/table/TableContainer/index.tsx";
import {useFetch} from "../../../../../../../hooks/useFetch.ts";
import {useCallback, useEffect, useState} from "react";
import randomKey from "../../../../../../../utils/randomKey.ts";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import {useParams} from "react-router-dom";
import PedidosDetailsHeader from "../../../../components/headers/PedidosDetailsHeader/index.tsx";
import useTableContent from "../../../../../../../hooks/useTableContent.tsx";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../hooks/useView.ts";
//import EfetuadosResponseData from "../../../../../../../models/pedidos/EfetuadosResponseData.ts";
import ListaPedidosResponseData from "../../../../../../../models/pedidos/ListaPedidosResponseData.ts";
//import { destinoEnum } from "../../../../../../../models/pedidos/DestinoEnum.ts";
import ProdutosDetailsRow from "../../../../components/rows/ProdutosDetailsRow/index.tsx";

/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */

//Dados para teste sem a API
// const dataTeste: ListaPedidosResponseData[] = [
//     {
//         itemId: 1001,
//         referencia: "Referência 1",
//         nomeProduto: "Produto 1",
//         requisicaoId: 1,
//         unidade: "Unidade 1",
//         destino: destinoEnum.ESTOQUE,
//         valorUnitario: 1,
//         quantidade: 10,
//         grupo: "Grupo 1",
//         subgrupo: "SubGrupo 1"
//     },
//     {
//         itemId: 1002,
//         referencia: "Referência 2",
//         nomeProduto: "Produto 2",
//         requisicaoId: 2,
//         unidade: "Unidade 2",
//         destino: destinoEnum.VENDA,
//         valorUnitario: 2,
//         quantidade: 20,
//         grupo: "Grupo 2",
//         subgrupo: "SubGrupo 2"
//     },
//     {
//         itemId: 1003,
//         referencia: "Referência 3",
//         nomeProduto: "Produto 3",
//         requisicaoId: 3,
//         unidade: "Unidade 3",
//         destino: destinoEnum.ESTOQUE,
//         valorUnitario: 3,
//         quantidade: 30,
//         grupo: "Grupo 3",
//         subgrupo: "SubGrupo 3"
//     }
// ];

export default function EfetuadosDetailsTable() {
    const pedidoId = useParams().pedidoId as unknown as number;
    const { globalRefresh, refreshDetails } = useDetails();
    const { refresh, refreshView, currentView } = useView();
    const itensEndpoint = useEndpoint().pedidos(pedidoId).efetuadosItens;
    currentView.currentEndpoint = `${itensEndpoint}?page=0&size=16`;
    const { toggleRequest, data, isLoading, error, isError } = useFetch<ListaPedidosResponseData>(currentView.currentEndpoint);
    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: ListaPedidosResponseData, index: number) => {
        return (
            <ProdutosDetailsRow
                stripped={index % 2 == 1}
                pedidoId={pedidoId}
                data={dados}/>
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<ListaPedidosResponseData>({
        isLoading,
        error,
        isError,
        data: data as ListaPedidosResponseData[],
        errorMessage: "Erro ao carregar Itens pedidos",
        contentFunction: contentFunction,
        beforeContent: () => <PedidosDetailsHeader key={randomKey()}/>
    });

    return (
        <>
            <TableContainer size={"small"}>
                {content}
            </TableContainer>
        </>
    );
}
