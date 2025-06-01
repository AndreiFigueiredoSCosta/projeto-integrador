import ListaPedidosResponseData from "../../../../../../models/pedidos/ListaPedidosResponseData.ts";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import { StageBadge } from "../../../../../../components/misc/badges/default/StageBadge";
import DataTableRow from "../../../../../../components/dataTable/DataTableRow";
import DataTableCell from "../../../../../../components/dataTable/DataTableCell";
import formatToReais from "../../../../../../utils/formatToReais.ts";

interface EfetuadosRowProps {
    data: ListaPedidosResponseData;
    stripped: boolean;
    pedidoId: number;
}

/**
 * Linha de exibição de produtos dos detalhes de um pedido
 * @constructor
 */
export default function ProdutosDetailsRow({ data, stripped } : EfetuadosRowProps){
    const dropdownContent = (
        <DataTableRow size={1}>
            <DataTableCell title="Valor Unitário">
                {formatToReais(data.valorUnitario)}
            </DataTableCell>
            <DataTableCell title="Valor Total">
                {formatToReais(data.valorUnitario * data.quantidade)}
            </DataTableCell>
            <DataTableCell title="Grupo/Subgrupo">
                {data.grupo} / {data.subgrupo}
            </DataTableCell>
        </DataTableRow>
    )

    return (
        <TableRow stripped={stripped}
        dropdown={true}
        content={dropdownContent}>
            <RowPiece size={1}>
                {data.itemId} - {data.nomeProduto}
            </RowPiece>
            <RowPiece size={1}>
                {data.quantidade}
            </RowPiece>
            <RowPiece size={1}>
                {data.requisicaoId}
            </RowPiece>
            <RowPiece size={1}>
                {data.unidade}
            </RowPiece>
            <RowPiece size={1}>
                <StageBadge variant="green" outline={true}>
                    {data.destino}
                </StageBadge>
            </RowPiece>
        </TableRow>
    );
}
