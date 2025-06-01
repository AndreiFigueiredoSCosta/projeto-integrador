import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de produtos
 * @constructor
 */
export default function TransportadorFilialDetailsHeader() {
    return (
        <TableHeader>
            <HeaderPiece size={2}>
                Apelido
            </HeaderPiece>
            <HeaderPiece size={2}>
                CNPJ
            </HeaderPiece>
            <HeaderPiece size={2}>
                Email
            </HeaderPiece>
            <HeaderPiece size={2}>
                Telefone/Celular
            </HeaderPiece>
            <HeaderPiece size={2}>
            </HeaderPiece>
            <HeaderPiece size={2}>
            </HeaderPiece>
        </TableHeader>
    );
}
