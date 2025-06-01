import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de Similares
 * @constructor
 */
export default function TransportadorFilialHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={3}>
                Apelido
            </HeaderPiece>
            <HeaderPiece size={3}>
                CNPJ
            </HeaderPiece>
            <HeaderPiece size={3}>
                Email
            </HeaderPiece>
            <HeaderPiece size={3}>
                Telefone/Celular
            </HeaderPiece>
        </TableHeader>
    );
}
