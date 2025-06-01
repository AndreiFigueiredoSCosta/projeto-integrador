import {TableHeader} from "../../../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de clonagem
 * @constructor
 */
export default function RequisicaoPedidoHeader() {
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={9}>
                Produto
            </HeaderPiece>
            <HeaderPiece size={3}>
            </HeaderPiece>
        </TableHeader>
    );
}
