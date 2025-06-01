import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de produtos
 * @constructor
 */
export default function ProdutoSimilarDetailsHeader() {
    return (
        <TableHeader>
            <HeaderPiece size={3}>
                Referência
            </HeaderPiece>
            <HeaderPiece size={3}>
                Marca
            </HeaderPiece>
            <HeaderPiece size={4}>
                Observação
            </HeaderPiece>
            <HeaderPiece size={2}>
            </HeaderPiece>
        </TableHeader>
    );
}
