import {TableHeader} from "../../../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho do dropdown de similares de um produto de uma clonagem
 * @constructor
 */
export default function CotacaoRevisaoProdutoHeader(){
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={3}>
                Nome do produto
            </HeaderPiece>
            <HeaderPiece size={2}>
                Grupo/Subgrupo
            </HeaderPiece>
            <HeaderPiece size={2}>
                Quantidade
            </HeaderPiece>
            <HeaderPiece size={4} />
            <HeaderPiece size={1} />
        </TableHeader>
    );
}
