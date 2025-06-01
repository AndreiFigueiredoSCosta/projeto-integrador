import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de marcas
 * @constructor
 */
export default function MarcaHeader() {
    return (
        <TableHeader>
            <HeaderPiece size={10}>
                Nome
            </HeaderPiece>
            <HeaderPiece size={2}>
            </HeaderPiece>
        </TableHeader>
    );
}
