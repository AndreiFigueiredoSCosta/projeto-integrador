import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de grupos
 * @constructor
 */
export default function ClienteDetalhadoHeader() {
    return (
        <TableHeader >
            <HeaderPiece size={1}>
                Nome
            </HeaderPiece>
            <HeaderPiece size={1}>
                CPF
            </HeaderPiece>
            <HeaderPiece size={1}>
                Data de nascimento
            </HeaderPiece>
            <HeaderPiece size={1}>
                E-mail
            </HeaderPiece>
            <HeaderPiece size={1}>
                Telefone
            </HeaderPiece>
        </TableHeader>
    );
}
