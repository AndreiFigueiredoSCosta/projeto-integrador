import {TableHeader} from "../../../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de clonagem
 * @constructor
 */
export default function RequisicaoAprovacaoHeader() {
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={5}>
                Produto
            </HeaderPiece>
            <HeaderPiece size={4}>
                Marca (Referência)
            </HeaderPiece>
            <HeaderPiece size={3}>
            </HeaderPiece>
        </TableHeader>
    );
}
