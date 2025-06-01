import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de grupos
 * @constructor
 */
export default function GrupoHeader() {
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={4}>
                Nome
            </HeaderPiece>
            <HeaderPiece size={8}>
                Descrição
            </HeaderPiece>
        </TableHeader>
    );
}
