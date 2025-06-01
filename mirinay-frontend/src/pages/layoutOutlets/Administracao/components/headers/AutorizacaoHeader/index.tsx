import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de grupos
 * @constructor
 */
export default function AutorizacaoHeader() {
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={4}>
                ID
            </HeaderPiece>
            <HeaderPiece size={4}>
                Nome
            </HeaderPiece>
            <HeaderPiece size={4}>
                Descrição
            </HeaderPiece>
        </TableHeader>
    );
}
