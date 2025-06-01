import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de grupos
 * @constructor
 */
export default function PedidosHeader() {
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={4}>
                Fornecedor
            </HeaderPiece>
            <HeaderPiece size={4}>
                Valor Total
            </HeaderPiece>
            <HeaderPiece size={4}>
                Pedido Mínimo %
            </HeaderPiece>
            <HeaderPiece size={4}>
                Observação
            </HeaderPiece>
        </TableHeader>
    );
}
