import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de grupos
 * @constructor
 */
export default function ClientesHeader() {
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={1}>
                Número
            </HeaderPiece>
            <HeaderPiece size={1}>
                Nome
            </HeaderPiece>
            <HeaderPiece size={1}>
                CPF
            </HeaderPiece>
            <HeaderPiece size={1}/>
            {/*<HeaderPiece size={2}/>*/}
        </TableHeader>
    );
}
