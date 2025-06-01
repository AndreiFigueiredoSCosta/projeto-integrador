import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import ListaPedidosResponseData from "../../../../../../models/pedidos/ListaPedidosResponseData.ts";
import { StageBadge } from "../../../../../../components/misc/badges/default/StageBadge";
import { Checkbox } from "../../../../../../components/form/misc/Checkbox";
import DataTableCell from "../../../../../../components/dataTable/DataTableCell";
import DataTableRow from "../../../../../../components/dataTable/DataTableRow";
import formatToReais from "../../../../../../utils/formatToReais.ts";

interface PedidosRowProps {
    data: ListaPedidosResponseData;
    stripped: boolean;
    handleSelect: (data: ListaPedidosResponseData) => void;
    selectedItens?: number[];
}

/**
 * Linha de exibição de listagem de pedidos
 * @constructor
 */
export default function ListaPedidosRow({ data, stripped, handleSelect, selectedItens } : PedidosRowProps) {
    const dropdownContent = (
        <div
            style={{
                backgroundColor: "var(--branco)",
            }}
        >
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
        </div>
    )

    return (
        <TableRow stripped={stripped}
                  dropdown={true}
                  content={dropdownContent}
                  >
            <RowPiece size={1}>
                <Checkbox size="medium" checked={selectedItens?.includes(data.cotacaoId)}
                          onClick={()=>handleSelect(data)}/>
            </RowPiece>
            <RowPiece size={4}>
                {data.nomeProduto}
            </RowPiece>
            <RowPiece size={4}>
                {data.quantidade}
            </RowPiece>
            <RowPiece size={4}>
                {data.requisicaoId}
            </RowPiece>
            <RowPiece size={4}>
                {data.unidade}
            </RowPiece>
            <RowPiece size={4}>
                {<StageBadge variant="green" outline={true}>{data.destino}</StageBadge>}
            </RowPiece>
        </TableRow>
    );
}
