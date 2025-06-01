import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de unidades
 * @constructor
 */
export default function UnidadeHeader() {
    return (
        <TableHeader>
            <HeaderPiece size={1}>
                Sigla
            </HeaderPiece>
            <HeaderPiece size={9}>
                Nome
            </HeaderPiece>
            <HeaderPiece size={2}>
            </HeaderPiece>
        </TableHeader>
    );
}
