import {TableHeader} from "../../../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho do dropdown de similares de um produto de uma clonagem
 * @constructor
 */
export default function CotacaoCotacaoProdutoHeader(){
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={4}>
                Nome do produto
            </HeaderPiece>
            <HeaderPiece size={2}>
                Marca (referência)
            </HeaderPiece>
            <HeaderPiece size={5}/>
            <HeaderPiece size={2}/>
        </TableHeader>
    );
}
