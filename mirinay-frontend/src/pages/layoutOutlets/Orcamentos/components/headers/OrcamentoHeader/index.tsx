import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de clonagem
 * @constructor
 */
export default function OrcamentoHeader() {
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={1}>
                Número
            </HeaderPiece>
            <HeaderPiece size={1}>
                Vendedor
            </HeaderPiece>
            <HeaderPiece size={1}>
                Cliente
            </HeaderPiece>
            <HeaderPiece size={1}></HeaderPiece>
        </TableHeader>
    );
}
