import {memo, useCallback, useEffect} from "react";

import DataTableContainer from "../../../../../../../components/dataTable/DataTableContainer/index.tsx";
import DataTableColumn from "../../../../../../../components/dataTable/DataTableColumn/index.tsx";
import DataTableRow from "../../../../../../../components/dataTable/DataTableRow/index.tsx";
import DataTableCell from "../../../../../../../components/dataTable/DataTableCell/index.tsx";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import {useFetch} from "../../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import useDataTableContent from "../../../../../../../hooks/useDataTableContent.tsx";
import useView from "../../../../../../../hooks/useView.ts";
//import ListaPedidosResponseData from "../../../../../../../models/pedidos/ListaPedidosResponseData.ts";
import PedidoDetailsResponseData from "../../../../../../../models/pedidos/PedidoDetailsResponseData.ts";
import NfeEnum from "../../../../../../../enums/NfeEnum.ts";

/**
 * Tabela de detalhes de pedido
 */

interface PedidoDetailsDataTableProps {
    setDataNfeEnum: (data: NfeEnum | undefined) => void;
}

// Dados de teste sem a API.
// const dataTeste: PedidoDetailsResponseData = {
//     codigo: 1,
//     valorTotal: 100,
//     dataPedido: "28/09/2021",
//     prevEntrega: "30/09/2021",
//     unidade: "Unidade 1",
//     condicaoPgto: "2 Vezes",
//     fornecedor: "Fornecedor 1",
//     solicitante: "Solicitante 1",
//     transportadora: "Transportadora 1",
//     frete: "Gratis",
//     nfe: NfeEnum.A_PROCURA
// }

const PedidoDetailsDataTable = memo( function PedidoDetailsDataTable( { setDataNfeEnum }: PedidoDetailsDataTableProps) {
    const pedidoEndpoint = useEndpoint().pedido().GET().concluidos;
    const { refresh } = useView();
    const { globalRefresh } = useDetails();
    const { data, isError, error, toggleRequest, isLoading, isSuccess } = useFetch<PedidoDetailsResponseData>(pedidoEndpoint);
    const dataMapped = data as PedidoDetailsResponseData;
    if (dataMapped?.nfe === true)
        setDataNfeEnum(NfeEnum.ENCONTRADA); // Atualiza o estado global de NfeEnum
    else if (dataMapped?.nfe === false)
    setDataNfeEnum(NfeEnum.A_PROCURA); // Atualiza o estado global de NfeEnum

    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh, globalRefresh]);

    const contentFunction = useCallback(() => {
        const codigo: number = dataMapped?.pedidoId ;
        const valorTotal: number = dataMapped?.valorTotal ?? "Valor não encontrado.";
        const dataPedido: string = dataMapped?.dataCriacao ?? "Data não encontrada.";
        const prevEntrega: string = dataMapped?.dataPrevista ?? "Data não encontrada.";
        const unidade: string = dataMapped?.unidade ?? "Unidade não encontrada.";
        const condicaoPgto: string = dataMapped?.condPgto ?? "Condição de pagamento não encontrada.";
        const fornecedor: string = dataMapped?.fornecedor ?? "Fornecedor não encontrado.";
        const solicitante: string = dataMapped?.solicitante ?? "Solicitante não encontrado.";
        const transportadora: string = dataMapped?.transportador ?? "Transportadora não encontrada.";
        const frete: string = dataMapped?.frete ?? "Frete não encontrado.";

        return (
            <>
                <DataTableColumn size={1}>

                    <DataTableRow size={1} >
                        <DataTableCell title={"Nome"} contentTextSize="small">
                            {codigo}
                        </DataTableCell>
                        <DataTableCell title={"Valor Total"} contentTextSize="small">
                            {valorTotal}
                        </DataTableCell>
                    </DataTableRow>

                    <DataTableRow>
                        <DataTableCell title={"Data do pedido"} contentTextSize={"small"}>
                            {dataPedido}
                        </DataTableCell>
                        <DataTableCell title={"Prev. Entrega"} contentTextSize={"small"}>
                            {prevEntrega}
                        </DataTableCell>
                    </DataTableRow>
                    <DataTableRow>
                        <DataTableCell title={"Unidade"} contentTextSize={"small"}>
                            {unidade}
                        </DataTableCell>
                        <DataTableCell title={"Condição pgto."} contentTextSize={"small"}>
                            {condicaoPgto}
                        </DataTableCell>
                    </DataTableRow>
            </DataTableColumn>
            <DataTableColumn>

                    <DataTableRow>
                        <DataTableCell title={"Fornecedor"} contentTextSize={"small"}>
                            {fornecedor}
                        </DataTableCell>
                        <DataTableCell title={"Solicitante"} contentTextSize={"small"}>
                            {solicitante}
                        </DataTableCell>
                    </DataTableRow>

                    <DataTableRow>
                        <DataTableCell title={"Transportadora"} contentTextSize={"small"}>
                            {transportadora}
                        </DataTableCell>
                        <DataTableCell title={"Frete"} contentTextSize={"small"}>
                            {frete}
                        </DataTableCell>
                    </DataTableRow>

                </DataTableColumn>
            </>
        );
    }, [data]);

    const content = useDataTableContent<PedidoDetailsResponseData>({
        isLoading,
        isError,
        error,
        contentFunction: contentFunction,
        isSuccess,
        data: data as PedidoDetailsResponseData,
        errorMessage: "Erro ao carregar os detalhes do pedido."
    });

    return (
        <DataTableContainer rowsNumber={3}>
            {content}
        </DataTableContainer>
    );
});

export default PedidoDetailsDataTable;
