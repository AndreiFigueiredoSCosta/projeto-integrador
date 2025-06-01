import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de grupos
 * @constructor
 */
export default function EfetuadosHeader() {
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={1}>
                Código do Pedido
            </HeaderPiece>
            <HeaderPiece size={3}>
                Fornecedor
            </HeaderPiece>
            <HeaderPiece size={2}>
                Valor Total
            </HeaderPiece>
            <HeaderPiece size={3}>
                NFE
            </HeaderPiece>
        </TableHeader>
    );
}
