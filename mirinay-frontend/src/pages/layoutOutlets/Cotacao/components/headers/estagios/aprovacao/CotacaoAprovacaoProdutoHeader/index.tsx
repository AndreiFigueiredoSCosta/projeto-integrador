import {TableHeader} from "../../../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de clonagem
 * @constructor
 */
export default function CotacaoAprovacaoProdutoHeader() {
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={3}>
                Produto
            </HeaderPiece>
            <HeaderPiece size={2}>
                Marca (Referência)
            </HeaderPiece>
            <HeaderPiece size={7}>
            </HeaderPiece>
        </TableHeader>
    );
}
