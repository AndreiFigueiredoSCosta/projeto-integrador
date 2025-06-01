import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de produtos
 * @constructor
 */
export default function TransportadorHeader() {
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece>
                Nome do Transportador
            </HeaderPiece>
        </TableHeader>
    );
}
