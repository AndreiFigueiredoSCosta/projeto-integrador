import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de grupos
 * @constructor
 */
export default function MargemHeader() {
    return (
        <TableHeader>
            <HeaderPiece size={6}>
                Nome
            </HeaderPiece>
            <HeaderPiece size={4}>
                Porcentagem
            </HeaderPiece>
            {/*<HeaderPiece size={2}/>*/}
        </TableHeader>
    );
}
